import { app, ipcMain, type BrowserWindow } from "electron";
import {
  autoUpdater,
  type UpdateInfo as ElectronUpdateInfo,
  type ProgressInfo,
} from "electron-updater";
import { AUTO_UPDATER_IPC_CHANNELS } from "@chaosfix/core";
import type { UpdateInfo, DownloadProgress } from "../../types/auto-updater.types";

/**
 * Error patterns from electron-updater that should be treated as "no update available"
 * rather than actual errors.
 */
const NON_ERROR_PATTERNS = ["No published versions"] as const;

/**
 * Error patterns from electron-updater that should be silently ignored.
 * These are typically transient network issues during background checks.
 */
const SILENT_ERROR_PATTERNS = ["net::ERR_", "ENOTFOUND", "ETIMEDOUT", "ECONNREFUSED"] as const;

/**
 * Checks if an error message matches any of the given patterns.
 */
function matchesErrorPattern(message: string, patterns: readonly string[]): boolean {
  return patterns.some((pattern) => message.includes(pattern));
}

interface ReleaseNote {
  version?: string;
  note?: string | null;
}

export interface AutoUpdaterIPCDependencies {
  getMainWindow: () => BrowserWindow | null;
}

/**
 * Extracts release notes from electron-updater's UpdateInfo.
 * Release notes can be a string, an array, or undefined.
 */
function extractReleaseNotes(info: ElectronUpdateInfo): string | undefined {
  if (!info.releaseNotes) {
    return undefined;
  }

  if (typeof info.releaseNotes === "string") {
    return info.releaseNotes;
  }

  if (Array.isArray(info.releaseNotes)) {
    return info.releaseNotes.map((note: ReleaseNote) => note.note || "").join("\n\n");
  }

  return undefined;
}

export function setupAutoUpdaterIPC(deps: AutoUpdaterIPCDependencies): void {
  const { getMainWindow } = deps;

  // Configure autoUpdater - user must consent before downloading
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = false;

  // IPC handlers for renderer-initiated actions
  ipcMain.handle(AUTO_UPDATER_IPC_CHANNELS.CHECK_FOR_UPDATES, async () => {
    if (!app.isPackaged) {
      return { success: false, error: "Auto-update is disabled in development mode" };
    }

    try {
      await autoUpdater.checkForUpdates();
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error checking for updates";
      return { success: false, error: message };
    }
  });

  ipcMain.handle(AUTO_UPDATER_IPC_CHANNELS.DOWNLOAD_UPDATE, async () => {
    if (!app.isPackaged) {
      return { success: false, error: "Auto-update is disabled in development mode" };
    }

    try {
      await autoUpdater.downloadUpdate();
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error downloading update";
      return { success: false, error: message };
    }
  });

  ipcMain.handle(AUTO_UPDATER_IPC_CHANNELS.INSTALL_UPDATE, async () => {
    if (!app.isPackaged) {
      return { success: false, error: "Auto-update is disabled in development mode" };
    }

    try {
      autoUpdater.quitAndInstall();
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error installing update";
      return { success: false, error: message };
    }
  });

  // Event forwarding to renderer process
  autoUpdater.on("update-available", (info: ElectronUpdateInfo) => {
    const updateInfo: UpdateInfo = {
      version: info.version,
      releaseDate: info.releaseDate,
      releaseNotes: extractReleaseNotes(info),
    };
    getMainWindow()?.webContents.send(AUTO_UPDATER_IPC_CHANNELS.UPDATE_AVAILABLE, updateInfo);
  });

  autoUpdater.on("update-not-available", () => {
    getMainWindow()?.webContents.send(AUTO_UPDATER_IPC_CHANNELS.UPDATE_NOT_AVAILABLE);
  });

  autoUpdater.on("download-progress", (progress: ProgressInfo) => {
    const downloadProgress: DownloadProgress = {
      percent: progress.percent,
      bytesPerSecond: progress.bytesPerSecond,
      total: progress.total,
      transferred: progress.transferred,
    };
    getMainWindow()?.webContents.send(
      AUTO_UPDATER_IPC_CHANNELS.DOWNLOAD_PROGRESS,
      downloadProgress
    );
  });

  autoUpdater.on("update-downloaded", () => {
    getMainWindow()?.webContents.send(AUTO_UPDATER_IPC_CHANNELS.UPDATE_DOWNLOADED);
  });

  autoUpdater.on("error", (error: Error) => {
    // Treat certain errors as "no update available" - expected for new repos without releases
    if (matchesErrorPattern(error.message, NON_ERROR_PATTERNS)) {
      getMainWindow()?.webContents.send(AUTO_UPDATER_IPC_CHANNELS.UPDATE_NOT_AVAILABLE);
      return;
    }

    // Silently ignore transient network errors during background checks
    if (matchesErrorPattern(error.message, SILENT_ERROR_PATTERNS)) {
      return;
    }

    getMainWindow()?.webContents.send(AUTO_UPDATER_IPC_CHANNELS.UPDATE_ERROR, error.message);
  });
}
