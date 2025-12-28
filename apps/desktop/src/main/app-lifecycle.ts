import { app, BrowserWindow } from "electron";
import type { PTYManager } from "@chaosfix/terminal-bridge";

export interface AppLifecycleDependencies {
  ptyManager: PTYManager;
  createWindow: () => void;
}

export function setupAppLifecycle(deps: AppLifecycleDependencies): void {
  const { ptyManager, createWindow } = deps;

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on("window-all-closed", () => {
    ptyManager.destroyAll();
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("before-quit", () => {
    ptyManager.destroyAll();
  });
}
