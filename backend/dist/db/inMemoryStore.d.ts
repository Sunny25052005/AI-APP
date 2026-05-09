import { EntitySchema } from '../config/schema';
/** A stored record — has system fields plus whatever the entity defines. */
export interface StoredRecord {
    id: string;
    createdAt: string;
    updatedAt: string;
    [field: string]: unknown;
}
/** Result wrapper for operations that may not find a record. */
export type StoreResult<T> = {
    ok: true;
    data: T;
} | {
    ok: false;
    error: string;
};
/**
 * The DataStore contract.
 * Any storage backend (Postgres, Redis, SQLite, etc.) must implement this.
 */
export interface DataStore {
    create(entity: EntitySchema, data: Record<string, unknown>): StoreResult<StoredRecord>;
    findAll(entity: EntitySchema): StoreResult<StoredRecord[]>;
    findById(entity: EntitySchema, id: string): StoreResult<StoredRecord>;
    update(entity: EntitySchema, id: string, data: Record<string, unknown>): StoreResult<StoredRecord>;
    remove(entity: EntitySchema, id: string): StoreResult<{
        id: string;
    }>;
}
export declare class InMemoryStore implements DataStore {
    private store;
    /** Get (or lazily create) the collection for an entity. */
    private collection;
    /**
     * Last-resort field filter.
     * Validation in routeFactory rejects unknown fields BEFORE data reaches here.
     * This method is a defensive safety net only — it strips any field not in the
     * schema silently, protecting data integrity in case the store is used directly.
     * It does NOT throw — throwing is the validator's responsibility.
     */
    private sanitize;
    /** Create a new record. */
    create(entity: EntitySchema, data: Record<string, unknown>): StoreResult<StoredRecord>;
    /** Return all records for an entity. */
    findAll(entity: EntitySchema): StoreResult<StoredRecord[]>;
    /** Return a single record by id. */
    findById(entity: EntitySchema, id: string): StoreResult<StoredRecord>;
    /** Replace the data fields on an existing record (id/createdAt preserved). */
    update(entity: EntitySchema, id: string, data: Record<string, unknown>): StoreResult<StoredRecord>;
    /** Delete a record by id. */
    remove(entity: EntitySchema, id: string): StoreResult<{
        id: string;
    }>;
}
//# sourceMappingURL=inMemoryStore.d.ts.map