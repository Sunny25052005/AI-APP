"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// api/routeFactory.ts  (v4 — CSV Importer & Auth)
//
// The heart of the system.
// Given any EntitySchema + DataStore, returns a fully-wired Express Router
// with 5 standard REST endpoints gracefully enforcing JWT Auth headers.
// Now includes a powerful atomic CSV import endpoint for bulk inserts.
// ─────────────────────────────────────────────────────────────────────────────
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEntityRouter = createEntityRouter;
const express_1 = require("express");
const validator_1 = require("./validator");
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("multer"));
const sync_1 = require("csv-parse/sync");
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
function assertBodyIsObject(body, res) {
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
function castRowValues(row, entity) {
    const output = {};
    for (const field of entity.fields) {
        if (row[field.name] !== undefined && row[field.name] !== "") {
            let val = row[field.name];
            if (field.type === 'number')
                val = Number(val);
            if (field.type === 'boolean')
                val = val === 'true' || val === '1';
            output[field.name] = val;
        }
    }
    return output;
}
function createEntityRouter(entity, store) {
    const router = (0, express_1.Router)();
    // Attach authMiddleware to all routes inside this dynamic router
    router.use(auth_1.authMiddleware);
    // ── POST /import ────────────────────────────────────────────────────────────
    // Accepts a CSV file via multipart/form-data. Executes fully atomic batch validation.
    router.post('/import', upload.single('file'), (req, res, next) => {
        try {
            if (!req.file) {
                res.status(400).json({ error: 'Bad Request', message: 'No CSV file uploaded.' });
                return;
            }
            const fileContent = req.file.buffer.toString('utf-8');
            const records = (0, sync_1.parse)(fileContent, {
                columns: true,
                skip_empty_lines: true,
                trim: true,
            });
            if (!Array.isArray(records) || records.length === 0) {
                res.status(400).json({ error: 'Bad Request', message: 'CSV is empty or invalid.' });
                return;
            }
            const errors = [];
            const validPayloads = [];
            // Validate each row atomically
            for (let i = 0; i < records.length; i++) {
                const row = records[i];
                const castedObj = castRowValues(row, entity);
                const validation = (0, validator_1.validateBody)(entity, castedObj);
                if (!validation.valid) {
                    errors.push(`Row ${i + 1}: ${validation.errors.join(', ')}`);
                }
                else {
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
                const result = store.create(entity, payload);
                if (result.ok)
                    inserted.push(result.data);
            }
            res.status(201).json({
                message: `Successfully imported ${inserted.length} records into ${entity.name}.`,
                data: inserted,
            });
        }
        catch (err) {
            if (err instanceof Error) {
                res.status(400).json({ error: 'Parser Error', message: `CSV formatting issue: ${err.message}` });
            }
            else {
                next(err);
            }
        }
    });
    // ── GET / ─────────────────────────────────────────────────────────────────
    router.get('/', (req, res, next) => {
        try {
            const result = store.findAll(entity);
            if (!result.ok)
                return next(new Error(result.error));
            const scopedData = result.data.filter((r) => r._ownerId === req.user?.id);
            res.json({ entity: entity.name, count: scopedData.length, data: scopedData });
        }
        catch (err) {
            next(err);
        }
    });
    // ── GET /:id ──────────────────────────────────────────────────────────────
    router.get('/:id', (req, res, next) => {
        try {
            const result = store.findById(entity, req.params.id);
            if (!result.ok) {
                res.status(404).json({ error: 'Not Found', message: result.error });
                return;
            }
            if (result.data._ownerId !== req.user?.id) {
                res.status(403).json({ error: 'Forbidden', message: 'You do not own this record' });
                return;
            }
            res.json(result.data);
        }
        catch (err) {
            next(err);
        }
    });
    // ── POST / ────────────────────────────────────────────────────────────────
    router.post('/', (req, res, next) => {
        try {
            if (!assertBodyIsObject(req.body, res))
                return;
            const validation = (0, validator_1.validateBody)(entity, req.body);
            if (!validation.valid) {
                res.status(400).json({
                    error: 'Validation Error',
                    details: validation.errors,
                });
                return;
            }
            req.body._ownerId = req.user?.id;
            const result = store.create(entity, req.body);
            if (!result.ok)
                return next(new Error(result.error));
            res.status(201).json(result.data);
        }
        catch (err) {
            next(err);
        }
    });
    // ── PUT /:id ──────────────────────────────────────────────────────────────
    router.put('/:id', (req, res, next) => {
        try {
            if (!assertBodyIsObject(req.body, res))
                return;
            const validation = (0, validator_1.validateBody)(entity, req.body);
            if (!validation.valid) {
                res.status(400).json({ error: 'Validation Error', details: validation.errors });
                return;
            }
            const check = store.findById(entity, req.params.id);
            if (!check.ok)
                return res.status(404).json({ error: 'Not Found' });
            if (check.data._ownerId !== req.user?.id) {
                res.status(403).json({ error: 'Forbidden' });
                return;
            }
            req.body._ownerId = req.user?.id;
            const result = store.update(entity, req.params.id, req.body);
            res.json(result.ok ? result.data : { error: result.error });
        }
        catch (err) {
            next(err);
        }
    });
    // ── PATCH /:id ────────────────────────────────────────────────────────────
    router.patch('/:id', (req, res, next) => {
        try {
            if (!assertBodyIsObject(req.body, res))
                return;
            const validation = (0, validator_1.validateBody)(entity, req.body, { partial: true });
            if (!validation.valid) {
                res.status(400).json({ error: 'Validation Error', details: validation.errors });
                return;
            }
            const check = store.findById(entity, req.params.id);
            if (!check.ok)
                return res.status(404).json({ error: 'Not Found' });
            if (check.data._ownerId !== req.user?.id) {
                res.status(403).json({ error: 'Forbidden' });
                return;
            }
            const result = store.update(entity, req.params.id, req.body);
            res.json(result.ok ? result.data : { error: result.error });
        }
        catch (err) {
            next(err);
        }
    });
    // ── DELETE /:id ───────────────────────────────────────────────────────────
    router.delete('/:id', (req, res, next) => {
        try {
            const check = store.findById(entity, req.params.id);
            if (!check.ok)
                return res.status(404).json({ error: 'Not Found' });
            if (check.data._ownerId !== req.user?.id) {
                res.status(403).json({ error: 'Forbidden' });
                return;
            }
            const result = store.remove(entity, req.params.id);
            res.json(result.ok ? { message: 'Deleted', id: result.data.id } : { error: result.error });
        }
        catch (err) {
            next(err);
        }
    });
    return router;
}
//# sourceMappingURL=routeFactory.js.map