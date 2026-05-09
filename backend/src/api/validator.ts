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

import { EntitySchema, FieldSchema, FieldType } from '../config/schema';

// ─── Result types ──────────────────────────────────────────────────────────────

export interface FieldError {
  field: string;
  message: string;
}

export type ValidationResult =
  | { valid: true }
  | { valid: false; errors: FieldError[] };

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
function isTypeCompatible(value: unknown, type: FieldType): boolean {
  switch (type) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number' && !Number.isNaN(value);
    case 'boolean':
      return typeof value === 'boolean';
    case 'date': {
      if (typeof value !== 'string') return false;
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
function typeHint(type: FieldType): string {
  switch (type) {
    case 'string':  return 'a string';
    case 'number':  return 'a number';
    case 'boolean': return 'true or false';
    case 'date':    return 'an ISO 8601 date string (e.g. "2024-01-15")';
    default:        return `a ${type}`;
  }
}

// ─── Main validator ────────────────────────────────────────────────────────────

/**
 * Normalizes a payload by ensuring all defined fields exist.
 * If a field is missing in the body, it's set to null.
 * (Snippet 1 implementation)
 */
export function normalizePayload(
  entity: EntitySchema,
  body: Record<string, unknown>
): Record<string, unknown> {
  const normalized: Record<string, unknown> = {};
  
  for (const field of entity.fields) {
    if (!(field.name in body)) {
      normalized[field.name] = null; // fallback
    } else {
      normalized[field.name] = body[field.name];
    }
  }
  
  return normalized;
}

/**
 * Validates a request body against an EntitySchema.
 */
export function validateBody(
  entity: EntitySchema,
  body: Record<string, unknown>,
  options: { partial?: boolean } = {}
): ValidationResult {
  const errors: FieldError[] = [];
  const knownFields = new Set(entity.fields.map((f: FieldSchema) => f.name));

  // ── Rule 1: Reject unknown fields (Snippet 2 implementation) ────────────────
  for (const key of Object.keys(body)) {
    if (!knownFields.has(key)) {
      errors.push({
        field: key,
        message: `Invalid field: ${key}`, // Precise error format from user snippet
      });
    }
  }

  // ── Rule 2 & 3: Per-field checks ───────────────────────────────────────────
  for (const field of entity.fields) {
    const value = body[field.name];
    const isPresent = field.name in body && value !== null && value !== undefined;

    if (!options.partial && field.required && !isPresent) {
      errors.push({
        field: field.name,
        message: `"${field.name}" is required.`,
      });
      continue;
    }

    if (isPresent && !isTypeCompatible(value, field.type)) {
      errors.push({
        field: field.name,
        message:
          `"${field.name}" must be ${typeHint(field.type)}, ` +
          `but received ${typeof value}.`,
      });
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }
  return { valid: true };
}
