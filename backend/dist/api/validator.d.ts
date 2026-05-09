import { EntitySchema } from '../config/schema';
export interface FieldError {
    field: string;
    message: string;
}
export type ValidationResult = {
    valid: true;
} | {
    valid: false;
    errors: FieldError[];
};
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
export declare function validateBody(entity: EntitySchema, body: Record<string, unknown>, options?: {
    partial?: boolean;
}): ValidationResult;
//# sourceMappingURL=validator.d.ts.map