// ─────────────────────────────────────────────────────────────────────────────
// app.ts
//
// Express application factory.
// This is where the system "wires up":
//   1. Load config from disk
//   2. Normalize it into AppConfig
//   3. Create a single shared DataStore
//   4. For every entity → create a Router → mount it at /api/:entityName
//   5. Attach middleware
//
// Separated from server.ts so the app can be imported and tested without
// starting an HTTP server.
// ─────────────────────────────────────────────────────────────────────────────

import express, { Request, Response } from 'express';
import { loadConfig } from './config/loader';
import { normalizeConfig } from './config/normalizer';
import { PrismaStore } from './db/prismaStore';
import { createEntityRouter } from './api/routeFactory';
import { createAuthRouter } from './api/authRoutes';
import { errorHandler } from './middleware/errorHandler';

export function createApp(configPath?: string) {
  // ── 1. Load & normalize config ────────────────────────────────────────────
  const rawConfig = loadConfig(configPath);
  const appConfig = normalizeConfig(rawConfig);

  // ── 2. Initialize shared data store ──────────────────────────────────────
  const store = new PrismaStore();

  // ── 3. Create Express app ─────────────────────────────────────────────────
  const app = express();
  app.use(express.json());

  // ── 3.5 Mount Auth Route ─────────────────────────────────────────────────
  app.use('/api/auth', createAuthRouter());

  // ── 4. Health check endpoint ──────────────────────────────────────────────
  app.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      entities: Array.from(appConfig.entities.keys()),
      timestamp: new Date().toISOString(),
    });
  });

  // ── 5. Dynamically mount entity routes ────────────────────────────────────
  if (appConfig.entities.size === 0) {
    console.warn('[App] No entities found in config — no CRUD routes will be mounted.');
  }

  for (const [entityName, entitySchema] of appConfig.entities) {
    const router = createEntityRouter(entitySchema, store);
    const mountPath = `/api/${entityName}`;
    app.use(mountPath, router);
    console.log(`[App] Mounted CRUD routes for "${entityName}" → ${mountPath}`);
  }

  // ── 6. 404 handler for unknown routes ─────────────────────────────────────
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Route ${req.method} ${req.path} does not exist.`,
      hint: 'Check GET /health for a list of registered entities.',
    });
  });

  // ── 7. Global error handler (must be last) ────────────────────────────────
  app.use(errorHandler);

  return app;
}
