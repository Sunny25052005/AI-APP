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
    name: string;
    fields: FieldSchema[];
}
/**
 * The canonical config the rest of the system consumes.
 */
export interface AppConfig {
    entities: Map<string, EntitySchema>;
}
/**
 * A field as it may appear in the JSON:
 *   - shorthand  → just a field name string: "email"
 *   - full-form  → object: { name, type?, required? }
 */
export type RawField = string | {
    name: string;
    type?: string;
    required?: boolean;
};
/** A single entity block in the raw config */
export interface RawEntity {
    fields?: RawField[];
    [key: string]: unknown;
}
/** The top-level JSON structure we accept */
export interface RawConfig {
    entities?: Record<string, RawEntity | null | undefined>;
    [key: string]: unknown;
}
//# sourceMappingURL=schema.d.ts.map