import { app, type BrowserWindow } from "electron";
import { PTYManager } from "@chaosfix/terminal-bridge";
import { createMainWindow } from "./window";
import { setupAllIPC } from "./ipc";
import { setupAppLifecycle } from "./app-lifecycle";
import { externalAppDetector } from "./services/external-app-detector.service";

let mainWindow: BrowserWindow | null = null;
const ptyManager = new PTYManager();

function createWindow(): void {
  mainWindow = createMainWindow();
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  createWindow();

  await externalAppDetector.detectInstalledApps();

  setupAllIPC({
    getMainWindow: () => mainWindow,
    ptyManager,
  });

  setupAppLifecycle({
    ptyManager,
    createWindow,
  });
});
