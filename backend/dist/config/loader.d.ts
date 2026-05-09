import { RawConfig } from './schema';
/**
 * Loads and parses the application config JSON file.
 *
 * @param configPath - Absolute or relative path to the config file.
 *                     Defaults to `configs/app.config.json`.
 * @returns Parsed RawConfig object.
 * @throws Error if the file doesn't exist or contains invalid JSON.
 */
export declare function loadConfig(configPath?: string): RawConfig;
//# sourceMappingURL=loader.d.ts.map