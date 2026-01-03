import { ipcRenderer } from "electron";
import { REPOSITORY_CONFIG_IPC_CHANNELS } from "@chaosfix/core";

import type {
  LoadConfigOptions,
  LoadConfigResult,
  RepositoryConfigAPI,
  SaveConfigOptions,
  SaveConfigResult,
} from "../types";

/**
 * Creates the repository config API object for renderer process communication
 */
export function createRepositoryConfigAPI(): RepositoryConfigAPI {
  return {
    load: (options: LoadConfigOptions): Promise<LoadConfigResult> => {
      return ipcRenderer.invoke(REPOSITORY_CONFIG_IPC_CHANNELS.LOAD, options);
    },

    save: (options: SaveConfigOptions): Promise<SaveConfigResult> => {
      return ipcRenderer.invoke(REPOSITORY_CONFIG_IPC_CHANNELS.SAVE, options);
    },
  };
}
