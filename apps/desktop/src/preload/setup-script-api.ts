import { ipcRenderer } from "electron";
import { SETUP_SCRIPT_IPC_CHANNELS } from "@chaosfix/core";

import type { SetupScriptAPI, SetupScriptOptions, SetupScriptResult } from "../types";

/**
 * Creates the setup script API object for renderer process communication
 */
export function createSetupScriptAPI(): SetupScriptAPI {
  return {
    run: (options: SetupScriptOptions): Promise<SetupScriptResult> => {
      return ipcRenderer.invoke(SETUP_SCRIPT_IPC_CHANNELS.RUN, options);
    },
  };
}
