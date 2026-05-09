"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryStore = void 0;
const uuid_1 = require("uuid");
// ─────────────────────────────────────────────────────────────────────────────
// Implementation: in-memory store
// ─────────────────────────────────────────────────────────────────────────────
class InMemoryStore {
    constructor() {
        // Map<entityName → Map<recordId → record>>
        this.store = new Map();
    }
    /** Get (or lazily create) the collection for an entity. */
    collection(entityName) {
        if (!this.store.has(entityName)) {
            this.store.set(entityName, new Map());
        }
        return this.store.get(entityName);
    }
    /**
     * Last-resort field filter.
     * Validation in routeFactory rejects unknown fields BEFORE data reaches here.
     * This method is a defensive safety net only — it strips any field not in the
     * schema silently, protecting data integrity in case the store is used directly.
     * It does NOT throw — throwing is the validator's responsibility.
     */
    sanitize(entity, data) {
        const allowedFields = new Set([...entity.fields.map((f) => f.name), '_ownerId']);
        const sanitized = {};
        for (const [key, value] of Object.entries(data)) {
            if (allowedFields.has(key)) {
                sanitized[key] = value;
            }
        }
        return sanitized;
    }
    /** Create a new record. */
    create(entity, data) {
        const col = this.collection(entity.name);
        const now = new Date().toISOString();
        const record = {
            id: (0, uuid_1.v4)(),
            createdAt: now,
            updatedAt: now,
            ...this.sanitize(entity, data),
        };
        col.set(record.id, record);
        return { ok: true, data: record };
    }
    /** Return all records for an entity. */
    findAll(entity) {
        const col = this.collection(entity.name);
        return { ok: true, data: Array.from(col.values()) };
    }
    /** Return a single record by id. */
    findById(entity, id) {
        const col = this.collection(entity.name);
        const record = col.get(id);
        if (!record) {
            return { ok: false, error: `${entity.name} with id "${id}" not found.` };
        }
        return { ok: true, data: record };
    }
    /** Replace the data fields on an existing record (id/createdAt preserved). */
    update(entity, id, data) {
        const col = this.collection(entity.name);
        const existing = col.get(id);
        if (!existing) {
            return { ok: false, error: `${entity.name} with id "${id}" not found.` };
        }
        const updated = {
            ...existing,
            ...this.sanitize(entity, data),
            updatedAt: new Date().toISOString(),
        };
        col.set(id, updated);
        return { ok: true, data: updated };
    }
    /** Delete a record by id. */
    remove(entity, id) {
        const col = this.collection(entity.name);
        if (!col.has(id)) {
            return { ok: false, error: `${entity.name} with id "${id}" not found.` };
        }
        col.delete(id);
        return { ok: true, data: { id } };
    }
}
exports.InMemoryStore = InMemoryStore;
//# sourceMappingURL=inMemoryStore.js.map