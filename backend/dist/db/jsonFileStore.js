"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonFileStore = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
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
class JsonFileStore {
    constructor(filename = 'database.json') {
        // Map<entityName -> Map<recordId -> record>>
        this.memoryCache = new Map();
        this.filePath = path_1.default.join(process.cwd(), 'configs', filename);
        this.loadFromDisk();
    }
    /** Read the file from disk or initialize if missing */
    loadFromDisk() {
        if (!fs_1.default.existsSync(this.filePath)) {
            this.saveToDisk();
            return;
        }
        try {
            const raw = fs_1.default.readFileSync(this.filePath, 'utf-8');
            const parsed = JSON.parse(raw);
            for (const [entityName, recordsMap] of Object.entries(parsed)) {
                const map = new Map(Object.entries(recordsMap));
                this.memoryCache.set(entityName, map);
            }
        }
        catch (e) {
            console.error('Failed to parse JSON DB, starting fresh:', e);
        }
    }
    /** Write the memory cache back to disk */
    saveToDisk() {
        const out = {};
        for (const [entityName, map] of this.memoryCache.entries()) {
            out[entityName] = Object.fromEntries(map);
        }
        fs_1.default.writeFileSync(this.filePath, JSON.stringify(out, null, 2), 'utf-8');
    }
    collection(entityName) {
        if (!this.memoryCache.has(entityName)) {
            this.memoryCache.set(entityName, new Map());
        }
        return this.memoryCache.get(entityName);
    }
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
        this.saveToDisk();
        return { ok: true, data: record };
    }
    findAll(entity) {
        const col = this.collection(entity.name);
        return { ok: true, data: Array.from(col.values()) };
    }
    findById(entity, id) {
        const col = this.collection(entity.name);
        const record = col.get(id);
        if (!record)
            return { ok: false, error: `${entity.name} with id "${id}" not found.` };
        return { ok: true, data: record };
    }
    update(entity, id, data) {
        const col = this.collection(entity.name);
        const existing = col.get(id);
        if (!existing)
            return { ok: false, error: `${entity.name} with id "${id}" not found.` };
        const updated = {
            ...existing,
            ...this.sanitize(entity, data),
            updatedAt: new Date().toISOString(),
        };
        col.set(id, updated);
        this.saveToDisk();
        return { ok: true, data: updated };
    }
    remove(entity, id) {
        const col = this.collection(entity.name);
        if (!col.has(id))
            return { ok: false, error: `${entity.name} with id "${id}" not found.` };
        col.delete(id);
        this.saveToDisk();
        return { ok: true, data: { id } };
    }
}
exports.JsonFileStore = JsonFileStore;
//# sourceMappingURL=jsonFileStore.js.map