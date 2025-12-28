import { BrowserWindow } from "electron";
import * as path from "path";

const isDev = process.env.NODE_ENV === "development";

export interface WindowConfig {
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
}

const DEFAULT_CONFIG: Required<WindowConfig> = {
  width: 1400,
  height: 900,
  minWidth: 800,
  minHeight: 600,
};

export function createMainWindow(config: WindowConfig = {}): BrowserWindow {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  const window = new BrowserWindow({
    width: mergedConfig.width,
    height: mergedConfig.height,
    minWidth: mergedConfig.minWidth,
    minHeight: mergedConfig.minHeight,
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
    window.loadURL("http://localhost:5173");
    window.webContents.openDevTools();
  } else {
    window.loadFile(path.join(__dirname, "../renderer/index.html"));
  }

  return window;
}
