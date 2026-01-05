/**
 * Options for running a setup script
 */
export interface SetupScriptOptions {
  /** The script content to execute */
  script: string;
  /** The working directory to run the script in */
  cwd: string;
  /** Optional environment variables to pass to the script */
  env?: Record<string, string>;
}

/**
 * Result of running a setup script
 */
export interface SetupScriptResult {
  /** Whether the script executed successfully */
  success: boolean;
  /** Error message if the script failed */
  error?: string;
  /** Standard output from the script */
  stdout?: string;
  /** Standard error output from the script */
  stderr?: string;
}

/**
 * Setup script API exposed to renderer process
 */
export interface SetupScriptAPI {
  run: (options: SetupScriptOptions) => Promise<SetupScriptResult>;
}
