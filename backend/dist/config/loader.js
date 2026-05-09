"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DEFAULT_CONFIG_PATH = path_1.default.resolve(__dirname, '../../configs/app.config.json');
/**
 * Loads and parses the application config JSON file.
 *
 * @param configPath - Absolute or relative path to the config file.
 *                     Defaults to `configs/app.config.json`.
 * @returns Parsed RawConfig object.
 * @throws Error if the file doesn't exist or contains invalid JSON.
 */
function loadConfig(configPath = DEFAULT_CONFIG_PATH) {
    const resolvedPath = path_1.default.resolve(configPath);
    // ── 1. File existence check ──────────────────────────────────────────────
    if (!fs_1.default.existsSync(resolvedPath)) {
        throw new Error(`[ConfigLoader] Config file not found at: ${resolvedPath}\n` +
            `  Make sure the file exists and the path is correct.`);
    }
    // ── 2. Read file ─────────────────────────────────────────────────────────
    let raw;
    try {
        raw = fs_1.default.readFileSync(resolvedPath, 'utf-8');
    }
    catch (err) {
        throw new Error(`[ConfigLoader] Failed to read config file at: ${resolvedPath}\n` +
            `  Reason: ${err.message}`);
    }
    // ── 3. Parse JSON ─────────────────────────────────────────────────────────
    let parsed;
    try {
        parsed = JSON.parse(raw);
    }
    catch {
        throw new Error(`[ConfigLoader] Config file contains invalid JSON at: ${resolvedPath}\n` +
            `  Tip: Use a JSON validator (e.g. jsonlint.com) to find the syntax error.`);
    }
    // ── 4. Top-level must be an object, not an array/null ─────────────────────
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new Error(`[ConfigLoader] Config root must be a JSON object (got ${Array.isArray(parsed) ? 'array' : typeof parsed}).`);
    }
    console.log(`[ConfigLoader] Loaded config from: ${resolvedPath}`);
    return parsed;
}
//# sourceMappingURL=loader.js.map