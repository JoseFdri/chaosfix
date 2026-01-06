import { ipcRenderer } from "electron";
import { EXTERNAL_APPS_IPC_CHANNELS } from "@chaosfix/core";

import type { ExternalApp, ExternalAppId } from "@chaosfix/core";
import type { ExternalAppsAPI, OpenInExternalAppResult } from "../types";

/**
 * Creates the external apps API object for renderer process communication
 */
export function createExternalAppsAPI(): ExternalAppsAPI {
  return {
    list: (): Promise<ExternalApp[]> => {
      return ipcRenderer.invoke(EXTERNAL_APPS_IPC_CHANNELS.LIST);
    },
    open: (appId: ExternalAppId, path: string): Promise<OpenInExternalAppResult> => {
      return ipcRenderer.invoke(EXTERNAL_APPS_IPC_CHANNELS.OPEN, { appId, path });
    },
  };
}
