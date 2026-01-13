import { app, type BrowserWindow } from "electron";
import { PTYManager } from "@chaosfix/terminal-bridge";
import { createMainWindow } from "./window";
import { externalAppDetectorService } from "./services/ExternalAppDetector.service";
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

app.whenReady().then(async () => {
  createWindow();

  await externalAppDetectorService.detectInstalledApps();

  setupAllIPC({
    getMainWindow: () => mainWindow,
    ptyManager,
  });

  setupAppLifecycle({
    ptyManager,
    createWindow,
  });
});
