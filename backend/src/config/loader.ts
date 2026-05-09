// ─────────────────────────────────────────────────────────────────────────────
// config/loader.ts
//
// Responsibility: read a JSON file from disk, parse it, return RawConfig.
// Does NOT validate — that's the normalizer's job.
//
// Design decisions:
//   - Accepts a configPath param so it's testable without touching the FS.
//   - Throws descriptive errors (not generic ones) so callers know what broke.
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'fs';
import path from 'path';
import { RawConfig } from './schema';

const DEFAULT_CONFIG_PATH = path.resolve(
  __dirname,
  '../../configs/app.config.json'
);

/**
 * Loads and parses the application config JSON file.
 *
 * @param configPath - Absolute or relative path to the config file.
 *                     Defaults to `configs/app.config.json`.
 * @returns Parsed RawConfig object.
 * @throws Error if the file doesn't exist or contains invalid JSON.
 */
export function loadConfig(configPath: string = DEFAULT_CONFIG_PATH): RawConfig {
  const resolvedPath = path.resolve(configPath);

  // ── 1. File existence check ──────────────────────────────────────────────
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(
      `[ConfigLoader] Config file not found at: ${resolvedPath}\n` +
        `  Make sure the file exists and the path is correct.`
    );
  }

  // ── 2. Read file ─────────────────────────────────────────────────────────
  let raw: string;
  try {
    raw = fs.readFileSync(resolvedPath, 'utf-8');
  } catch (err) {
    throw new Error(
      `[ConfigLoader] Failed to read config file at: ${resolvedPath}\n` +
        `  Reason: ${(err as Error).message}`
    );
  }

  // ── 3. Parse JSON ─────────────────────────────────────────────────────────
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(
      `[ConfigLoader] Config file contains invalid JSON at: ${resolvedPath}\n` +
        `  Tip: Use a JSON validator (e.g. jsonlint.com) to find the syntax error.`
    );
  }

  // ── 4. Top-level must be an object, not an array/null ─────────────────────
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error(
      `[ConfigLoader] Config root must be a JSON object (got ${Array.isArray(parsed) ? 'array' : typeof parsed}).`
    );
  }

  console.log(`[ConfigLoader] Loaded config from: ${resolvedPath}`);

  // ── 5. Sanity check: Ensure entities exist (Snippet 3 implementation) ─────
  if (!parsed.entities || Object.keys(parsed.entities).length === 0) {
    console.warn("⚠️ No entities found in config. API will have no dynamic routes.");
  }

  return parsed as RawConfig;
}
