import type { IpcRendererEvent } from "electron";

/**
 * Options for cloning a Git repository
 */
export interface CloneOptions {
  /** The URL of the repository to clone */
  url: string;
  /** The destination path where the repository will be cloned (optional - uses app default if not provided) */
  destinationPath?: string;
}

/**
 * Progress information during a clone operation
 */
export interface CloneProgress {
  /** Current stage of the clone operation (e.g., "Receiving objects", "Resolving deltas") */
  stage: string;
  /** Overall progress percentage (0-100) */
  progress: number;
  /** Number of objects/items processed */
  processed: number;
  /** Total number of objects/items to process */
  total: number;
}

/**
 * Result from a clone operation
 */
export interface CloneResult {
  /** Whether the clone operation succeeded */
  success: boolean;
  /** Path to the cloned repository */
  path: string;
  /** Name of the repository (derived from URL) */
  repoName: string;
  /** Default branch of the cloned repository */
  defaultBranch: string;
  /** Error message if the clone failed */
  error?: string;
}

/**
 * Git API exposed to renderer process
 */
export interface GitAPI {
  /** Clone a repository from a URL */
  clone: (options: CloneOptions) => Promise<CloneResult>;
  /** Register a listener for clone progress events */
  onCloneProgress: (
    callback: (event: IpcRendererEvent, progress: CloneProgress) => void
  ) => () => void;
}
