import { ipcRenderer } from "electron";
import { AUTO_UPDATER_IPC_CHANNELS } from "@chaosfix/core";

import type { AutoUpdaterAPI, DownloadProgress, IpcEventHandler, UpdateInfo } from "../types";

/**
 * Creates the auto-updater API object for renderer process communication
 */
export function createAutoUpdaterAPI(): AutoUpdaterAPI {
  return {
    checkForUpdates: (): Promise<void> => {
      return ipcRenderer.invoke(AUTO_UPDATER_IPC_CHANNELS.CHECK_FOR_UPDATES);
    },

    downloadUpdate: (): Promise<void> => {
      return ipcRenderer.invoke(AUTO_UPDATER_IPC_CHANNELS.DOWNLOAD_UPDATE);
    },

    installUpdate: (): Promise<void> => {
      return ipcRenderer.invoke(AUTO_UPDATER_IPC_CHANNELS.INSTALL_UPDATE);
    },

    onUpdateAvailable: (callback: (info: UpdateInfo) => void): (() => void) => {
      const handler: IpcEventHandler<UpdateInfo> = (_event, data) => {
        callback(data);
      };
      ipcRenderer.on(AUTO_UPDATER_IPC_CHANNELS.UPDATE_AVAILABLE, handler);
      return () => {
        ipcRenderer.removeListener(AUTO_UPDATER_IPC_CHANNELS.UPDATE_AVAILABLE, handler);
      };
    },

    onUpdateNotAvailable: (callback: () => void): (() => void) => {
      const handler: IpcEventHandler<undefined> = () => {
        callback();
      };
      ipcRenderer.on(AUTO_UPDATER_IPC_CHANNELS.UPDATE_NOT_AVAILABLE, handler);
      return () => {
        ipcRenderer.removeListener(AUTO_UPDATER_IPC_CHANNELS.UPDATE_NOT_AVAILABLE, handler);
      };
    },

    onDownloadProgress: (callback: (progress: DownloadProgress) => void): (() => void) => {
      const handler: IpcEventHandler<DownloadProgress> = (_event, data) => {
        callback(data);
      };
      ipcRenderer.on(AUTO_UPDATER_IPC_CHANNELS.DOWNLOAD_PROGRESS, handler);
      return () => {
        ipcRenderer.removeListener(AUTO_UPDATER_IPC_CHANNELS.DOWNLOAD_PROGRESS, handler);
      };
    },

    onUpdateDownloaded: (callback: () => void): (() => void) => {
      const handler: IpcEventHandler<undefined> = () => {
        callback();
      };
      ipcRenderer.on(AUTO_UPDATER_IPC_CHANNELS.UPDATE_DOWNLOADED, handler);
      return () => {
        ipcRenderer.removeListener(AUTO_UPDATER_IPC_CHANNELS.UPDATE_DOWNLOADED, handler);
      };
    },

    onError: (callback: (error: string) => void): (() => void) => {
      const handler: IpcEventHandler<string> = (_event, data) => {
        callback(data);
      };
      ipcRenderer.on(AUTO_UPDATER_IPC_CHANNELS.UPDATE_ERROR, handler);
      return () => {
        ipcRenderer.removeListener(AUTO_UPDATER_IPC_CHANNELS.UPDATE_ERROR, handler);
      };
    },
  };
}
