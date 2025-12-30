import { ipcRenderer } from "electron";
import { DIALOG_IPC_CHANNELS } from "@chaosfix/core";

import type { DialogAPI, DirectorySelectResult } from "../types";

/**
 * Creates the dialog API object for renderer process communication
 */
export function createDialogAPI(): DialogAPI {
  return {
    selectDirectory: (): Promise<DirectorySelectResult | null> => {
      return ipcRenderer.invoke(DIALOG_IPC_CHANNELS.SELECT_DIRECTORY);
    },
  };
}
