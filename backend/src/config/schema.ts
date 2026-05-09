// ─────────────────────────────────────────────────────────────────────────────
// config/schema.ts
//
// TypeScript types that flow through the entire system.
// Two distinct layers:
//   RawConfig  → what we read from JSON  (loose, partial, user-defined)
//   AppConfig  → what the system uses    (validated, normalized, complete)
// ─────────────────────────────────────────────────────────────────────────────

/** Supported primitive field types */
export type FieldType = 'string' | 'number' | 'boolean' | 'date';

/**
 * A fully-resolved field descriptor.
 * Every field in the running system is guaranteed to have all these properties.
 */
export interface FieldSchema {
  name: string;
  type: FieldType;
  required: boolean;
}

/**
 * A fully-resolved entity descriptor.
 */
export interface EntitySchema {
  name: string;          // entity key (e.g. "users")
  fields: FieldSchema[];
}

/**
 * The canonical config the rest of the system consumes.
 */
export interface AppConfig {
  entities: Map<string, EntitySchema>;
}

// ─── Raw (pre-validation) shapes ─────────────────────────────────────────────

/**
 * A field as it may appear in the JSON:
 *   - shorthand  → just a field name string: "email"
 *   - full-form  → object: { name, type?, required? }
 */
export type RawField =
  | string
  | { name: string; type?: string; required?: boolean };

/** A single entity block in the raw config */
export interface RawEntity {
  fields?: RawField[];
  [key: string]: unknown; // extra keys are silently ignored
}

/** The top-level JSON structure we accept */
export interface RawConfig {
  entities?: Record<string, RawEntity | null | undefined>;
  [key: string]: unknown; // extra top-level keys are silently ignored
}
