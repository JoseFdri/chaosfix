import { ipcRenderer } from "electron";
import { STATE_IPC_CHANNELS } from "@chaosfix/core";

import type { AppState } from "@chaosfix/config";
import type { StateAPI } from "./types";

/**
 * Creates the state API object for renderer process communication
 */
export function createStateAPI(): StateAPI {
  return {
    load: (): Promise<AppState | null> => {
      return ipcRenderer.invoke(STATE_IPC_CHANNELS.LOAD);
    },

    save: (state: AppState): Promise<boolean> => {
      return ipcRenderer.invoke(STATE_IPC_CHANNELS.SAVE, state);
    },
  };
}
