// ─────────────────────────────────────────────────────────────────────────────
// middleware/errorHandler.ts  (v2 — improved)
//
// Global error handler for Express.
// Must have 4 parameters — Express identifies error handlers by arity.
//
// V2 changes:
//   - Structured ApiError with optional `details` (field-level errors)
//   - Consistent JSON shape: { error, message, details?, requestId?, stack? }
//   - requestId echoed back from X-Request-ID header when present
//   - Cleaner logging with method + path context
// ─────────────────────────────────────────────────────────────────────────────

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
  details?: FieldError[]; // field-level errors from validator
}

/**
 * Factory to create a typed ApiError with optional status and details.
 * Usage: next(createError(422, 'Unprocessable', fieldErrors))
 */
export function createError(
  status: number,
  message: string,
  details?: FieldError[]
): ApiError {
  const err = new Error(message) as ApiError;
  err.status = status;
  if (details) err.details = details;
  return err;
}

// ─────────────────────────────────────────────────────────────────────────────

export function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const isDev = process.env.NODE_ENV !== 'production';

  // Resolve HTTP status
  const status = err.status ?? err.statusCode ?? 500;
  const isServerError = status >= 500;

  // Build consistent response body
  const body: Record<string, unknown> = {
    error: isServerError ? 'Internal Server Error' : 'Request Error',
    message: err.message || 'An unexpected error occurred.',
  };

  // Echo back request ID if the client sent one (useful for distributed tracing)
  const requestId = req.headers['x-request-id'];
  if (requestId) body.requestId = requestId;

  // Include field-level details when present (from validator)
  if (err.details && err.details.length > 0) {
    body.details = err.details;
  }

  // Stack trace in development only
  if (isDev && err.stack) {
    body.stack = err.stack.split('\n');
  }

  // Structured log: include method + path for context
  const logLevel = isServerError ? 'ERROR' : 'WARN';
  console[isServerError ? 'error' : 'warn'](
    `[ErrorHandler] [${logLevel}] ${status} ${req.method} ${req.path} — ${err.message}`
  );

  res.status(status).json(body);
}
