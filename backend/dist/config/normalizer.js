"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// config/normalizer.ts
//
// Responsibility: transform a loose RawConfig into a strict AppConfig.
//
// Handles ALL edge cases so the rest of the system can trust the data:
//   ✓ Missing `entities` key          → empty entities map + warning
//   ✓ Null/undefined entity value     → skipped with warning
//   ✓ Fields as string[]  (shorthand) → converted to FieldSchema[]
//   ✓ Fields as object[]  (full-form) → defaults filled in
//   ✓ Unknown field types             → falls back to 'string' + warning
//   ✓ Missing `name` on full-form     → field skipped with warning
//   ✓ Extra keys in config            → silently ignored
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeConfig = normalizeConfig;
const VALID_TYPES = ['string', 'number', 'boolean', 'date'];
/** Coerce an unknown type string to a valid FieldType (fallback: 'string') */
function resolveType(raw, context) {
    if (!raw)
        return 'string';
    const lower = raw.toLowerCase();
    if (VALID_TYPES.includes(lower))
        return lower;
    console.warn(`[Normalizer] Unknown field type "${raw}" on ${context} — defaulting to "string".`);
    return 'string';
}
/**
 * Normalize a single RawField into a guaranteed-complete FieldSchema.
 * Returns null if the field is unrecoverable (e.g. missing name).
 */
function normalizeField(raw, entityName) {
    // ── Shorthand: "fieldName" ──────────────────────────────────────────────
    if (typeof raw === 'string') {
        const name = raw.trim();
        if (!name) {
            console.warn(`[Normalizer] Empty field name in entity "${entityName}" — skipping.`);
            return null;
        }
        return { name, type: 'string', required: true };
    }
    // ── Full-form: { name, type?, required? } ───────────────────────────────
    if (typeof raw === 'object' && raw !== null) {
        const name = typeof raw.name === 'string' ? raw.name.trim() : '';
        if (!name) {
            console.warn(`[Normalizer] Field in entity "${entityName}" is missing a "name" property — skipping.`);
            return null;
        }
        return {
            name,
            type: resolveType(raw.type, `${entityName}.${name}`),
            // Default required=true for shorthand, but full-form defaults to false
            // if not specified (more permissive for optional fields)
            required: typeof raw.required === 'boolean' ? raw.required : false,
        };
    }
    console.warn(`[Normalizer] Unexpected field value in entity "${entityName}": ${JSON.stringify(raw)} — skipping.`);
    return null;
}
/**
 * Normalize a single entity entry from raw config.
 */
function normalizeEntity(name, raw) {
    if (raw === null || raw === undefined) {
        console.warn(`[Normalizer] Entity "${name}" has a null/undefined value — skipping.`);
        return null;
    }
    if (typeof raw !== 'object' || Array.isArray(raw)) {
        console.warn(`[Normalizer] Entity "${name}" must be an object — skipping.`);
        return null;
    }
    const rawFields = Array.isArray(raw.fields) ? raw.fields : [];
    if (!Array.isArray(raw.fields)) {
        console.warn(`[Normalizer] Entity "${name}" is missing a "fields" array — creating entity with zero fields.`);
    }
    const fields = rawFields
        .map((f) => normalizeField(f, name))
        .filter((f) => f !== null);
    return { name, fields };
}
/**
 * Main entry point.
 * Converts a loose RawConfig into a fully-typed, trusted AppConfig.
 */
function normalizeConfig(raw) {
    const entities = new Map();
    if (!raw.entities || typeof raw.entities !== 'object') {
        console.warn('[Normalizer] Config is missing "entities" key — no routes will be generated.');
        return { entities };
    }
    for (const [entityName, rawEntity] of Object.entries(raw.entities)) {
        const normalizedName = entityName.trim().toLowerCase();
        if (!normalizedName) {
            console.warn(`[Normalizer] Encountered an empty entity key — skipping.`);
            continue;
        }
        const entity = normalizeEntity(normalizedName, rawEntity);
        if (entity) {
            entities.set(normalizedName, entity);
            console.log(`[Normalizer] Registered entity "${normalizedName}" with ${entity.fields.length} field(s): ` +
                `[${entity.fields.map((f) => `${f.name}:${f.type}`).join(', ')}]`);
        }
    }
    return { entities };
}
//# sourceMappingURL=normalizer.js.map