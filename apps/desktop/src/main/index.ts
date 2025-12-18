import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import { PTYManager } from "@chaosfix/terminal-bridge";
import { TERMINAL_IPC_CHANNELS } from "@chaosfix/terminal-bridge";
import type { PTYCreateOptions } from "@chaosfix/terminal-bridge";

const isDev = process.env.NODE_ENV === "development";

let mainWindow: BrowserWindow | null = null;
const ptyManager = new PTYManager();

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 15, y: 15 },
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Terminal IPC handlers
function setupTerminalIPC(): void {
  ipcMain.handle(TERMINAL_IPC_CHANNELS.CREATE, (_event, options: PTYCreateOptions) => {
    const pty = ptyManager.create(options);

    // Forward terminal data to renderer
    pty.onData((data) => {
      mainWindow?.webContents.send(TERMINAL_IPC_CHANNELS.DATA, {
        id: pty.id,
        data,
      });
    });

    // Forward exit events to renderer
    pty.onExit((exitCode, signal) => {
      mainWindow?.webContents.send(TERMINAL_IPC_CHANNELS.EXIT, {
        id: pty.id,
        exitCode,
        signal,
      });
    });

    return { id: pty.id, pid: pty.pid };
  });

  ipcMain.handle(TERMINAL_IPC_CHANNELS.WRITE, (_event, { id, data }: { id: string; data: string }) => {
    return ptyManager.write(id, data);
  });

  ipcMain.handle(TERMINAL_IPC_CHANNELS.RESIZE, (_event, { id, cols, rows }: { id: string; cols: number; rows: number }) => {
    return ptyManager.resize(id, cols, rows);
  });

  ipcMain.handle(TERMINAL_IPC_CHANNELS.DESTROY, (_event, { id }: { id: string }) => {
    return ptyManager.destroy(id);
  });
}

app.whenReady().then(() => {
  setupTerminalIPC();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
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
