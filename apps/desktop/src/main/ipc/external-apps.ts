import { spawn } from "child_process";
import { ipcMain, type BrowserWindow } from "electron";
import {
  EXTERNAL_APPS_IPC_CHANNELS,
  externalAppDetector,
  type ExternalAppId,
} from "@chaosfix/core";

export interface ExternalAppsIPCDependencies {
  getMainWindow: () => BrowserWindow | null;
}

export function setupExternalAppsIPC(_deps: ExternalAppsIPCDependencies): void {
  ipcMain.handle(EXTERNAL_APPS_IPC_CHANNELS.LIST, async () => {
    return externalAppDetector.getInstalledApps();
  });

  ipcMain.handle(
    EXTERNAL_APPS_IPC_CHANNELS.OPEN,
    async (_event, params: { appId: ExternalAppId; path: string }) => {
      const { appId, path } = params;
      const command = externalAppDetector.getOpenCommand(appId, path);

      if (command === null) {
        return { success: false, error: `App "${appId}" is not installed or not recognized` };
      }

      try {
        const child = spawn(command, {
          shell: true,
          detached: true,
          stdio: "ignore",
        });
        child.unref();
        return { success: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error spawning process";
        return { success: false, error: message };
      }
    }
  );
}
