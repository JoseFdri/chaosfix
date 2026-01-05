import type { ProjectConfig } from "@chaosfix/config";

/**
 * Source of the loaded configuration
 */
export type ConfigSource = "repo" | "app" | "default";

/**
 * Options for loading repository configuration
 */
export interface LoadConfigOptions {
  repositoryId: string;
  repositoryPath: string;
}

/**
 * Result from loading repository configuration
 */
export interface LoadConfigResult {
  config: ProjectConfig;
  source: ConfigSource;
}

/**
 * Options for saving repository configuration
 */
export interface SaveConfigOptions {
  repositoryId: string;
  repositoryPath: string;
  config: ProjectConfig;
  /** Whether to save to repository (true) or app storage only (false). Defaults to true. */
  saveToRepo?: boolean;
}

/**
 * Result from saving repository configuration
 */
export interface SaveConfigResult {
  success: boolean;
  location: ConfigSource;
  error?: string;
}

/**
 * Repository Config API exposed to renderer process
 */
export interface RepositoryConfigAPI {
  load: (options: LoadConfigOptions) => Promise<LoadConfigResult>;
  save: (options: SaveConfigOptions) => Promise<SaveConfigResult>;
}
