import { ipcMain, dialog, type BrowserWindow } from "electron";
import * as path from "path";
import { DIALOG_IPC_CHANNELS } from "@chaosfix/core";

export interface DialogIPCDependencies {
  getMainWindow: () => BrowserWindow | null;
}

export function setupDialogIPC(deps: DialogIPCDependencies): void {
  const { getMainWindow } = deps;

  ipcMain.handle(DIALOG_IPC_CHANNELS.SELECT_DIRECTORY, async () => {
    const mainWindow = getMainWindow();
    if (!mainWindow) {
      return null;
    }

    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory", "createDirectory"],
      title: "Select Repository Directory",
    });

    const selectedPath = result.filePaths[0];
    if (result.canceled || !selectedPath) {
      return null;
    }

    const name = path.basename(selectedPath);

    return { path: selectedPath, name };
  });
}
