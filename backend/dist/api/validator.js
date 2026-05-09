"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// api/validator.ts
//
// Config-driven request body validator.
//
// Responsibilities (all derived from EntitySchema — zero hardcoding):
//   1. Reject unknown fields  (fields not declared in schema → 400)
//   2. Check required fields  (missing required fields → 400)
//   3. Validate field types   (wrong JS type for declared type → 400)
//
// Returns a structured ValidationResult so callers get field-level detail,
// not just a single error string.
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
// ─── Type checking ─────────────────────────────────────────────────────────────
/**
 * Returns true if the JS value is compatible with the declared FieldType.
 *
 * Rules:
 *   string  → must be typeof 'string'
 *   number  → must be typeof 'number' (NaN is rejected)
 *   boolean → must be typeof 'boolean'
 *   date    → must be a string parseable as a valid ISO date
 */
function isTypeCompatible(value, type) {
    switch (type) {
        case 'string':
            return typeof value === 'string';
        case 'number':
            return typeof value === 'number' && !Number.isNaN(value);
        case 'boolean':
            return typeof value === 'boolean';
        case 'date': {
            if (typeof value !== 'string')
                return false;
            const d = new Date(value);
            return !Number.isNaN(d.getTime());
        }
        default:
            return true; // unknown future types: pass through
    }
}
/**
 * Human-readable expected type hint for error messages.
 */
function typeHint(type) {
    switch (type) {
        case 'string': return 'a string';
        case 'number': return 'a number';
        case 'boolean': return 'true or false';
        case 'date': return 'an ISO 8601 date string (e.g. "2024-01-15")';
        default: return `a ${type}`;
    }
}
// ─── Main validator ────────────────────────────────────────────────────────────
/**
 * Validates a request body against an EntitySchema.
 *
 * Collects ALL errors before returning so the client gets a complete picture
 * in one response, not one-error-at-a-time.
 *
 * @param entity  - Normalized EntitySchema from AppConfig
 * @param body    - Parsed request body (req.body)
 * @param options - Validation options
 *   - partial: if true, skips required-field check (used for PATCH)
 */
function validateBody(entity, body, options = {}) {
    const errors = [];
    const knownFields = new Set(entity.fields.map((f) => f.name));
    // ── Rule 1: Reject unknown fields ─────────────────────────────────────────
    // Any key in the body that isn't declared in the schema is rejected.
    // This prevents clients from silently ignoring typos or injecting hidden fields.
    for (const key of Object.keys(body)) {
        if (!knownFields.has(key)) {
            errors.push({
                field: key,
                message: `"${key}" is not a recognized field for entity "${entity.name}". ` +
                    `Allowed fields: [${[...knownFields].join(', ')}].`,
            });
        }
    }
    // ── Rule 2 & 3: Per-field checks ───────────────────────────────────────────
    for (const field of entity.fields) {
        const value = body[field.name];
        const isPresent = field.name in body && value !== null && value !== undefined;
        // Required check (skip in partial/PATCH mode)
        if (!options.partial && field.required && !isPresent) {
            errors.push({
                field: field.name,
                message: `"${field.name}" is required.`,
            });
            continue; // no point type-checking an absent value
        }
        // Type check (only if value is actually present)
        if (isPresent && !isTypeCompatible(value, field.type)) {
            errors.push({
                field: field.name,
                message: `"${field.name}" must be ${typeHint(field.type)}, ` +
                    `but received ${typeof value} (${JSON.stringify(value)}).`,
            });
        }
    }
    if (errors.length > 0) {
        return { valid: false, errors };
    }
    return { valid: true };
}
//# sourceMappingURL=validator.js.map