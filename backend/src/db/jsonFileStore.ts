import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { DataStore, StoreResult, StoredRecord } from './inMemoryStore';
import { EntitySchema } from '../config/schema';

// ─────────────────────────────────────────────────────────────────────────────
// db/jsonFileStore.ts
//
// MVP Implementation of a JSON-based Document Store.
// It writes data to a local JSON file, preventing data loss on restarts.
//
// In a true production environment, you would swap this for:
// - Postgres with a JSONB column (`id`, `entity_name`, `data` JSONB)
// - MongoDB (Native document storage)
// ─────────────────────────────────────────────────────────────────────────────

export class JsonFileStore implements DataStore {
  private filePath: string;
  // Map<entityName -> Map<recordId -> record>>
  private memoryCache = new Map<string, Map<string, StoredRecord>>();

  constructor(filename = 'database.json') {
    this.filePath = path.join(process.cwd(), 'configs', filename);
    this.loadFromDisk();
  }

  /** Read the file from disk or initialize if missing */
  private loadFromDisk() {
    if (!fs.existsSync(this.filePath)) {
      this.saveToDisk();
      return;
    }
    try {
      const raw = fs.readFileSync(this.filePath, 'utf-8');
      const parsed: Record<string, Record<string, StoredRecord>> = JSON.parse(raw);
      
      for (const [entityName, recordsMap] of Object.entries(parsed)) {
        const map = new Map<string, StoredRecord>(Object.entries(recordsMap));
        this.memoryCache.set(entityName, map);
      }
    } catch (e) {
      console.error('Failed to parse JSON DB, starting fresh:', e);
    }
  }

  /** Write the memory cache back to disk */
  private saveToDisk() {
    const out: Record<string, Record<string, StoredRecord>> = {};
    for (const [entityName, map] of this.memoryCache.entries()) {
      out[entityName] = Object.fromEntries(map);
    }
    fs.writeFileSync(this.filePath, JSON.stringify(out, null, 2), 'utf-8');
  }

  private collection(entityName: string): Map<string, StoredRecord> {
    if (!this.memoryCache.has(entityName)) {
      this.memoryCache.set(entityName, new Map());
    }
    return this.memoryCache.get(entityName)!;
  }

  private sanitize(entity: EntitySchema, data: Record<string, unknown>): Record<string, unknown> {
    const allowedFields = new Set([...entity.fields.map((f) => f.name), '_ownerId']);
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (allowedFields.has(key)) {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  async create(entity: EntitySchema, data: Record<string, unknown>): Promise<StoreResult<StoredRecord>> {
    const col = this.collection(entity.name);
    const now = new Date().toISOString();
    const record: StoredRecord = {
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      ...this.sanitize(entity, data),
    };
    col.set(record.id, record);
    this.saveToDisk();
    return { ok: true, data: record };
  }

  async findAll(entity: EntitySchema): Promise<StoreResult<StoredRecord[]>> {
    const col = this.collection(entity.name);
    return { ok: true, data: Array.from(col.values()) };
  }

  async findById(entity: EntitySchema, id: string): Promise<StoreResult<StoredRecord>> {
    const col = this.collection(entity.name);
    const record = col.get(id);
    if (!record) return { ok: false, error: `${entity.name} with id "${id}" not found.` };
    return { ok: true, data: record };
  }

  async update(entity: EntitySchema, id: string, data: Record<string, unknown>): Promise<StoreResult<StoredRecord>> {
    const col = this.collection(entity.name);
    const existing = col.get(id);
    if (!existing) return { ok: false, error: `${entity.name} with id "${id}" not found.` };
    
    const updated: StoredRecord = {
      ...existing,
      ...this.sanitize(entity, data),
      updatedAt: new Date().toISOString(),
    };
    col.set(id, updated);
    this.saveToDisk();
    return { ok: true, data: updated };
  }

  async remove(entity: EntitySchema, id: string): Promise<StoreResult<{ id: string }>> {
    const col = this.collection(entity.name);
    if (!col.has(id)) return { ok: false, error: `${entity.name} with id "${id}" not found.` };
    col.delete(id);
    this.saveToDisk();
    return { ok: true, data: { id } };
  }
}
