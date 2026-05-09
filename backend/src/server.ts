// ─────────────────────────────────────────────────────────────────────────────
// server.ts
//
// Entry point. Starts the HTTP server.
// Kept minimal — all app logic lives in app.ts.
// ─────────────────────────────────────────────────────────────────────────────

import 'dotenv/config';
import { createApp } from './app';

const PORT = parseInt(process.env.PORT ?? '3001', 10);
const CONFIG_PATH = process.env.CONFIG_PATH; // optional override

const app = createApp(CONFIG_PATH);

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health\n`);
});
