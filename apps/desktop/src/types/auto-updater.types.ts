/**
 * Information about an available update
 */
export interface UpdateInfo {
  /** The version of the available update */
  version: string;
  /** The release date of the update */
  releaseDate?: string;
  /** Release notes for the update */
  releaseNotes?: string;
}

/**
 * Progress information during update download
 */
export interface DownloadProgress {
  /** Download progress percentage (0-100) */
  percent: number;
  /** Download speed in bytes per second */
  bytesPerSecond: number;
  /** Total size in bytes */
  total: number;
  /** Bytes transferred so far */
  transferred: number;
}

/**
 * Auto-updater API exposed to renderer process
 */
export interface AutoUpdaterAPI {
  /** Check for available updates */
  checkForUpdates: () => Promise<void>;
  /** Download the available update */
  downloadUpdate: () => Promise<void>;
  /** Install the downloaded update and restart the app */
  installUpdate: () => Promise<void>;
  /** Register a listener for update available events */
  onUpdateAvailable: (callback: (info: UpdateInfo) => void) => () => void;
  /** Register a listener for no update available events */
  onUpdateNotAvailable: (callback: () => void) => () => void;
  /** Register a listener for download progress events */
  onDownloadProgress: (callback: (progress: DownloadProgress) => void) => () => void;
  /** Register a listener for update downloaded events */
  onUpdateDownloaded: (callback: () => void) => () => void;
  /** Register a listener for update error events */
  onError: (callback: (error: string) => void) => () => void;
}
