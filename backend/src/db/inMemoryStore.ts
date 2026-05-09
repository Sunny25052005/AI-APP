// ─────────────────────────────────────────────────────────────────────────────
// db/inMemoryStore.ts
//
// An interface-first, in-memory data store.
//
// Why interface-first?
//   The rest of the system (routeFactory) depends on `DataStore`, not on
//   `InMemoryStore`. To swap in PostgreSQL, write a `PostgresStore` that
//   implements `DataStore` and pass it to the route factory instead — zero
//   other changes required.
//
// Structure:
//   Map<entityName, Map<recordId, record>>
// ─────────────────────────────────────────────────────────────────────────────

import { v4 as uuidv4 } from 'uuid';
import { EntitySchema } from '../config/schema';

/** A stored record — has system fields plus whatever the entity defines. */
export interface StoredRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  [field: string]: unknown;
}

/** Result wrapper for operations that may not find a record. */
export type StoreResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

/**
 * The DataStore contract.
 * Any storage backend (Postgres, Redis, SQLite, etc.) must implement this.
 */
export interface DataStore {
  create(entity: EntitySchema, data: Record<string, unknown>): Promise<StoreResult<StoredRecord>>;
  findAll(entity: EntitySchema): Promise<StoreResult<StoredRecord[]>>;
  findById(entity: EntitySchema, id: string): Promise<StoreResult<StoredRecord>>;
  update(entity: EntitySchema, id: string, data: Record<string, unknown>): Promise<StoreResult<StoredRecord>>;
  remove(entity: EntitySchema, id: string): Promise<StoreResult<{ id: string }>>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Implementation: in-memory store
// ─────────────────────────────────────────────────────────────────────────────

export class InMemoryStore implements DataStore {
  // Map<entityName → Map<recordId → record>>
  private store = new Map<string, Map<string, StoredRecord>>();

  /** Get (or lazily create) the collection for an entity. */
  private collection(entityName: string): Map<string, StoredRecord> {
    if (!this.store.has(entityName)) {
      this.store.set(entityName, new Map());
    }
    return this.store.get(entityName)!;
  }

  /**
   * Last-resort field filter.
   * Validation in routeFactory rejects unknown fields BEFORE data reaches here.
   * This method is a defensive safety net only — it strips any field not in the
   * schema silently, protecting data integrity in case the store is used directly.
   * It does NOT throw — throwing is the validator's responsibility.
   */
  private sanitize(
    entity: EntitySchema,
    data: Record<string, unknown>
  ): Record<string, unknown> {
    const allowedFields = new Set([...entity.fields.map((f) => f.name), '_ownerId']);
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (allowedFields.has(key)) {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  /** Create a new record. */
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
    return { ok: true, data: record };
  }

  /** Return all records for an entity. */
  async findAll(entity: EntitySchema): Promise<StoreResult<StoredRecord[]>> {
    const col = this.collection(entity.name);
    return { ok: true, data: Array.from(col.values()) };
  }

  /** Return a single record by id. */
  async findById(entity: EntitySchema, id: string): Promise<StoreResult<StoredRecord>> {
    const col = this.collection(entity.name);
    const record = col.get(id);
    if (!record) {
      return { ok: false, error: `${entity.name} with id "${id}" not found.` };
    }
    return { ok: true, data: record };
  }

  /** Replace the data fields on an existing record (id/createdAt preserved). */
  async update(
    entity: EntitySchema,
    id: string,
    data: Record<string, unknown>
  ): Promise<StoreResult<StoredRecord>> {
    const col = this.collection(entity.name);
    const existing = col.get(id);
    if (!existing) {
      return { ok: false, error: `${entity.name} with id "${id}" not found.` };
    }
    const updated: StoredRecord = {
      ...existing,
      ...this.sanitize(entity, data),
      updatedAt: new Date().toISOString(),
    };
    col.set(id, updated);
    return { ok: true, data: updated };
  }

  /** Delete a record by id. */
  async remove(entity: EntitySchema, id: string): Promise<StoreResult<{ id: string }>> {
    const col = this.collection(entity.name);
    if (!col.has(id)) {
      return { ok: false, error: `${entity.name} with id "${id}" not found.` };
    }
    col.delete(id);
    return { ok: true, data: { id } };
  }
}
