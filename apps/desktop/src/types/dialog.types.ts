/**
 * Result from directory selection dialog
 */
export interface DirectorySelectResult {
  path: string;
  name: string;
}

/**
 * Dialog API exposed to renderer process
 */
export interface DialogAPI {
  selectDirectory: () => Promise<DirectorySelectResult | null>;
}
