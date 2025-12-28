import { app, type BrowserWindow } from "electron";
import { PTYManager } from "@chaosfix/terminal-bridge";
import { createMainWindow } from "./window";
import { setupAllIPC } from "./ipc";
import { setupAppLifecycle } from "./app-lifecycle";

let mainWindow: BrowserWindow | null = null;
const ptyManager = new PTYManager();

function createWindow(): void {
  mainWindow = createMainWindow();
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  setupAllIPC({
    getMainWindow: () => mainWindow,
    ptyManager,
  });

  setupAppLifecycle({
    ptyManager,
    createWindow,
  });
});
