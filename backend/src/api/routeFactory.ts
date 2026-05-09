// ─────────────────────────────────────────────────────────────────────────────
// api/routeFactory.ts  (v4 — CSV Importer & Auth)
//
// The heart of the system.
// Given any EntitySchema + DataStore, returns a fully-wired Express Router
// with 5 standard REST endpoints gracefully enforcing JWT Auth headers.
// Now includes a powerful atomic CSV import endpoint for bulk inserts.
// ─────────────────────────────────────────────────────────────────────────────

import { Router, Request, Response, NextFunction } from 'express';
import { EntitySchema } from '../config/schema';
import { DataStore } from '../db/inMemoryStore';
import { validateBody, normalizePayload } from './validator';
import { authMiddleware } from '../middleware/auth';
import multer from 'multer';
import { parse } from 'csv-parse/sync';

const upload = multer({ storage: multer.memoryStorage() });

function assertBodyIsObject(
  body: unknown,
  res: Response
): body is Record<string, unknown> {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    res.status(400).json({
      error: 'Bad Request',
      message: 'Request body must be a JSON object.',
    });
    return false;
  }
  return true;
}

// Ensure CSV string inputs natively map to the TypeScript types configured in the JSON schema
function castRowValues(row: Record<string, string>, entity: EntitySchema) {
   const output: Record<string, any> = {};
   for (const field of entity.fields) {
     if (row[field.name] !== undefined && row[field.name] !== "") {
         let val: any = row[field.name];
         if (field.type === 'number') val = Number(val);
         if (field.type === 'boolean') val = val === 'true' || val === '1';
         output[field.name] = val;
     }
   }
   return output;
}

export function createEntityRouter(
  entity: EntitySchema,
  store: DataStore
): Router {
  const router = Router();

  // ── Rule: Entity Integrity Check (Snippet 4 implementation) ───────────────
  if (!entity || !entity.fields) {
    router.all('*', (_req, res) => {
      res.status(400).json({ error: "Invalid entity" });
    });
    return router;
  }

  // Attach authMiddleware to all routes inside this dynamic router
  router.use(authMiddleware);

  // ── POST /import ────────────────────────────────────────────────────────────
  // Accepts a CSV file via multipart/form-data. Executes fully atomic batch validation.
  router.post('/import', upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
         res.status(400).json({ error: 'Bad Request', message: 'No CSV file uploaded.' });
         return;
      }

      const fileContent = req.file.buffer.toString('utf-8');
      const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      if (!Array.isArray(records) || records.length === 0) {
         res.status(400).json({ error: 'Bad Request', message: 'CSV is empty or invalid.' });
         return;
      }

      const errors: string[] = [];
      const validPayloads: Record<string, any>[] = [];

      // Validate each row atomically
      for (let i = 0; i < records.length; i++) {
        const row = records[i] as Record<string, string>;
        const castedObj = castRowValues(row, entity);

        const validation = validateBody(entity, castedObj);
        if (!validation.valid) {
          errors.push(`Row ${i + 1}: ${validation.errors.join(', ')}`);
        } else {
          castedObj._ownerId = req.user?.id;
          validPayloads.push(castedObj);
        }
      }

      if (errors.length > 0) {
         res.status(400).json({
          error: 'Validation Error',
          message: 'Atomic batch import failed. The entire CSV was rejected due to structural errors. Fix the errors below and try again.',
          details: errors,
        });
        return;
      }

      // Insert all records after complete validation confirmation
      const inserted = [];
      for (const payload of validPayloads) {
        const result = await store.create(entity, payload);
        if (result.ok) inserted.push(result.data);
      }

      res.status(201).json({
        message: `Successfully imported ${inserted.length} records into ${entity.name}.`,
        data: inserted,
      });
    } catch (err) {
      if (err instanceof Error) {
         res.status(400).json({ error: 'Parser Error', message: `CSV formatting issue: ${err.message}` });
      } else {
         next(err);
      }
    }
  });

  // ── GET / ─────────────────────────────────────────────────────────────────
  router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await store.findAll(entity);
      if (!result.ok) return next(new Error(result.error));
      
      const scopedData = result.data.filter((r: any) => r._ownerId === req.user?.id);
      res.json({ entity: entity.name, count: scopedData.length, data: scopedData });
    } catch (err) {
      next(err);
    }
  });

  // ── GET /:id ──────────────────────────────────────────────────────────────
  router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await store.findById(entity, req.params.id);
      if (!result.ok) {
        res.status(404).json({ error: 'Not Found', message: result.error });
        return;
      }
      if ((result.data as any)._ownerId !== req.user?.id) {
        res.status(403).json({ error: 'Forbidden', message: 'You do not own this record' });
        return;
      }
      res.json(result.data);
    } catch (err) {
      next(err);
    }
  });

  // ── POST / ────────────────────────────────────────────────────────────────
  router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!assertBodyIsObject(req.body, res)) return;

      const validation = validateBody(entity, req.body);
      if (!validation.valid) {
        res.status(400).json({
          error: 'Validation Error',
          details: validation.errors,
        });
        return;
      }

      req.body._ownerId = req.user?.id;
      
      // Normalize before saving (Snippet 1 implementation)
      const normalizedBody = normalizePayload(entity, req.body);
      normalizedBody._ownerId = req.user?.id;

      const result = await store.create(entity, normalizedBody);
      if (!result.ok) return next(new Error(result.error));
      res.status(201).json(result.data);
    } catch (err) {
      next(err);
    }
  });

  // ── PUT /:id ──────────────────────────────────────────────────────────────
  router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!assertBodyIsObject(req.body, res)) return;

      const validation = validateBody(entity, req.body);
      if (!validation.valid) {
         res.status(400).json({ error: 'Validation Error', details: validation.errors });
         return;
      }

      const check = await store.findById(entity, req.params.id);
      if (!check.ok) return res.status(404).json({ error: 'Not Found' });
      if ((check.data as any)._ownerId !== req.user?.id) {
         res.status(403).json({ error: 'Forbidden' });
         return;
      }

      req.body._ownerId = req.user?.id;
      
      // Normalize before saving (Snippet 1 implementation)
      const normalizedBody = normalizePayload(entity, req.body);
      normalizedBody._ownerId = req.user?.id;

      const result = await store.update(entity, req.params.id, normalizedBody);
      res.json(result.ok ? result.data : { error: result.error });
    } catch (err) {
      next(err);
    }
  });

  // ── PATCH /:id ────────────────────────────────────────────────────────────
  router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!assertBodyIsObject(req.body, res)) return;

      const validation = validateBody(entity, req.body, { partial: true });
      if (!validation.valid) {
        res.status(400).json({ error: 'Validation Error', details: validation.errors });
        return;
      }

      const check = await store.findById(entity, req.params.id);
      if (!check.ok) return res.status(404).json({ error: 'Not Found' });
      if ((check.data as any)._ownerId !== req.user?.id) {
         res.status(403).json({ error: 'Forbidden' });
         return;
      }

      const result = await store.update(entity, req.params.id, req.body);
      res.json(result.ok ? result.data : { error: result.error });
    } catch (err) {
      next(err);
    }
  });

  // ── DELETE /:id ───────────────────────────────────────────────────────────
  router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const check = await store.findById(entity, req.params.id);
      if (!check.ok) return res.status(404).json({ error: 'Not Found' });
      if ((check.data as any)._ownerId !== req.user?.id) {
         res.status(403).json({ error: 'Forbidden' });
         return;
      }

      const result = await store.remove(entity, req.params.id);
      res.json(result.ok ? { message: 'Deleted', id: result.data.id } : { error: result.error });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
