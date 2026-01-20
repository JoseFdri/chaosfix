import { useEffect, useCallback, useRef } from "react";

import { useApp } from "../contexts/app-context";

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

/**
 * Return type for the useAutoUpdater hook.
 */
export interface UseAutoUpdaterReturn {
  /** Current update status */
  status: "idle" | "checking" | "available" | "downloading" | "ready" | "error";
  /** Info about available update */
  updateInfo: { version: string; releaseNotes?: string } | null;
  /** Download progress */
  downloadProgress: { percent: number; bytesPerSecond: number } | null;
  /** Error message if status is error */
  error: string | null;
  /** Manually check for updates */
  checkForUpdates: () => Promise<void>;
  /** Download the available update */
  downloadUpdate: () => Promise<void>;
  /** Install and restart the app */
  installUpdate: () => Promise<void>;
  /** Dismiss the update notification */
  dismiss: () => void;
}

/**
 * Hook for managing auto-update functionality.
 *
 * Handles:
 * - Subscribing to auto-updater IPC events
 * - Updating state based on events
 * - Auto-checking for updates on mount (if enabled and 24h passed)
 * - Providing actions for manual control
 */
export function useAutoUpdater(): UseAutoUpdaterReturn {
  const { state, updates } = useApp();
  const hasCheckedRef = useRef(false);

  // Access update state
  const { status, updateInfo, downloadProgress, error } = state.updates;

  // Actions
  const checkForUpdates = useCallback(async () => {
    updates.setChecking();
    try {
      await window.autoUpdater.checkForUpdates();
    } catch (err) {
      updates.setError(err instanceof Error ? err.message : "Failed to check for updates");
    }
  }, [updates]);

  const downloadUpdate = useCallback(async () => {
    updates.setDownloading();
    try {
      await window.autoUpdater.downloadUpdate();
    } catch (err) {
      updates.setError(err instanceof Error ? err.message : "Failed to download update");
    }
  }, [updates]);

  const installUpdate = useCallback(async () => {
    try {
      await window.autoUpdater.installUpdate();
    } catch (err) {
      updates.setError(err instanceof Error ? err.message : "Failed to install update");
    }
  }, [updates]);

  const dismiss = useCallback(() => {
    // TODO: In a future enhancement, save dismissedVersion to preferences
    // For now, just reset the state
    updates.reset();
  }, [updates]);

  // Subscribe to IPC events
  useEffect(() => {
    const cleanupFns: (() => void)[] = [];

    cleanupFns.push(
      window.autoUpdater.onUpdateAvailable((info) => {
        updates.setAvailable({
          version: info.version,
          releaseNotes: info.releaseNotes,
        });
      })
    );

    cleanupFns.push(
      window.autoUpdater.onUpdateNotAvailable(() => {
        updates.setNotAvailable();
      })
    );

    cleanupFns.push(
      window.autoUpdater.onDownloadProgress((progress) => {
        updates.setProgress({
          percent: progress.percent,
          bytesPerSecond: progress.bytesPerSecond,
        });
      })
    );

    cleanupFns.push(
      window.autoUpdater.onUpdateDownloaded(() => {
        updates.setReady();
      })
    );

    cleanupFns.push(
      window.autoUpdater.onError((errorMessage) => {
        updates.setError(errorMessage);
      })
    );

    return (): void => {
      cleanupFns.forEach((cleanup) => cleanup());
    };
  }, [updates]);

  // Auto-check on mount if enabled and 24h has passed
  useEffect(() => {
    // Only check once per mount
    if (hasCheckedRef.current) {
      return;
    }

    // Get preferences from persisted state (loaded via usePersistence)
    // For now, always auto-check since preferences.updates isn't in slice state yet
    const autoCheck = true;
    const lastCheckTimestamp: number | null = null;

    if (!autoCheck) {
      return;
    }

    const now = Date.now();
    const shouldCheck = !lastCheckTimestamp || now - lastCheckTimestamp >= TWENTY_FOUR_HOURS_MS;

    if (shouldCheck) {
      hasCheckedRef.current = true;
      // Small delay to let the app initialize
      const timer = setTimeout(() => {
        void checkForUpdates();
      }, 2000);

      return (): void => {
        clearTimeout(timer);
      };
    }
  }, [checkForUpdates]);

  return {
    status,
    updateInfo,
    downloadProgress,
    error,
    checkForUpdates,
    downloadUpdate,
    installUpdate,
    dismiss,
  };
}
