import { Request, Response, NextFunction } from 'express';
/** Field-level error detail (matches FieldError from validator.ts) */
export interface FieldError {
    field: string;
    message: string;
}
/**
 * Extended Error type the rest of the system can throw/pass to next().
 * All fields beyond `message` are optional — use what makes sense per error.
 */
export interface ApiError extends Error {
    status?: number;
    statusCode?: number;
    details?: FieldError[];
}
/**
 * Factory to create a typed ApiError with optional status and details.
 * Usage: next(createError(422, 'Unprocessable', fieldErrors))
 */
export declare function createError(status: number, message: string, details?: FieldError[]): ApiError;
export declare function errorHandler(err: ApiError, req: Request, res: Response, _next: NextFunction): void;
//# sourceMappingURL=errorHandler.d.ts.map