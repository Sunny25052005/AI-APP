"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const loader_1 = require("./config/loader");
const normalizer_1 = require("./config/normalizer");
const jsonFileStore_1 = require("./db/jsonFileStore");
const routeFactory_1 = require("./api/routeFactory");
const authRoutes_1 = require("./api/authRoutes");
const errorHandler_1 = require("./middleware/errorHandler");
function createApp(configPath) {
    // ── 1. Load & normalize config ────────────────────────────────────────────
    const rawConfig = (0, loader_1.loadConfig)(configPath);
    const appConfig = (0, normalizer_1.normalizeConfig)(rawConfig);
    // ── 2. Initialize shared data store ──────────────────────────────────────
    const store = new jsonFileStore_1.JsonFileStore();
    // ── 3. Create Express app ─────────────────────────────────────────────────
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    // ── 3.5 Mount Auth Route ─────────────────────────────────────────────────
    app.use('/api/auth', (0, authRoutes_1.createAuthRouter)(store));
    // ── 4. Health check endpoint ──────────────────────────────────────────────
    app.get('/health', (_req, res) => {
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
        const router = (0, routeFactory_1.createEntityRouter)(entitySchema, store);
        const mountPath = `/api/${entityName}`;
        app.use(mountPath, router);
        console.log(`[App] Mounted CRUD routes for "${entityName}" → ${mountPath}`);
    }
    // ── 6. 404 handler for unknown routes ─────────────────────────────────────
    app.use((req, res) => {
        res.status(404).json({
            error: 'Not Found',
            message: `Route ${req.method} ${req.path} does not exist.`,
            hint: 'Check GET /health for a list of registered entities.',
        });
    });
    // ── 7. Global error handler (must be last) ────────────────────────────────
    app.use(errorHandler_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map