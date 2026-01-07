import { ipcRenderer } from "electron";
import { GIT_IPC_CHANNELS } from "@chaosfix/core";

import type { CloneOptions, CloneProgress, CloneResult, GitAPI, IpcEventHandler } from "../types";

/**
 * Creates the git API object for renderer process communication
 */
export function createGitAPI(): GitAPI {
  return {
    clone: (options: CloneOptions): Promise<CloneResult> => {
      return ipcRenderer.invoke(GIT_IPC_CHANNELS.CLONE, options);
    },

    onCloneProgress: (
      callback: (event: Electron.IpcRendererEvent, progress: CloneProgress) => void
    ): (() => void) => {
      const handler: IpcEventHandler<CloneProgress> = (event, progress) => {
        callback(event, progress);
      };
      ipcRenderer.on(GIT_IPC_CHANNELS.CLONE_PROGRESS, handler);
      return () => {
        ipcRenderer.removeListener(GIT_IPC_CHANNELS.CLONE_PROGRESS, handler);
      };
    },
  };
}
