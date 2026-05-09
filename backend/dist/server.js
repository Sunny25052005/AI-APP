"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// server.ts
//
// Entry point. Starts the HTTP server.
// Kept minimal — all app logic lives in app.ts.
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const PORT = parseInt(process.env.PORT ?? '3001', 10);
const CONFIG_PATH = process.env.CONFIG_PATH; // optional override
const app = (0, app_1.createApp)(CONFIG_PATH);
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/health\n`);
});
//# sourceMappingURL=server.js.map