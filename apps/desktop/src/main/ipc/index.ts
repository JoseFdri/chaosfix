import type { BrowserWindow } from "electron";
import type { PTYManager } from "@chaosfix/terminal-bridge";
import { setupTerminalIPC } from "./terminal";
import { setupDialogIPC } from "./dialog";

export interface IPCDependencies {
  getMainWindow: () => BrowserWindow | null;
  ptyManager: PTYManager;
}

export function setupAllIPC(deps: IPCDependencies): void {
  setupTerminalIPC({
    getMainWindow: deps.getMainWindow,
    ptyManager: deps.ptyManager,
  });

  setupDialogIPC({
    getMainWindow: deps.getMainWindow,
  });
}

export { setupTerminalIPC } from "./terminal";
export { setupDialogIPC } from "./dialog";
