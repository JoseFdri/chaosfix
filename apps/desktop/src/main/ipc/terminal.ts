import { ipcMain, type BrowserWindow } from "electron";
import {
  PTYManager,
  TERMINAL_IPC_CHANNELS,
  type PTYCreateOptions,
} from "@chaosfix/terminal-bridge";

export interface TerminalIPCDependencies {
  getMainWindow: () => BrowserWindow | null;
  ptyManager: PTYManager;
}

export function setupTerminalIPC(deps: TerminalIPCDependencies): void {
  const { getMainWindow, ptyManager } = deps;

  ipcMain.handle(TERMINAL_IPC_CHANNELS.CREATE, (_event, options: PTYCreateOptions) => {
    const pty = ptyManager.create(options);

    pty.onData((data) => {
      getMainWindow()?.webContents.send(TERMINAL_IPC_CHANNELS.DATA, {
        id: pty.id,
        data,
      });
    });

    pty.onExit((exitCode, signal) => {
      getMainWindow()?.webContents.send(TERMINAL_IPC_CHANNELS.EXIT, {
        id: pty.id,
        exitCode,
        signal,
      });
    });

    return { id: pty.id, pid: pty.pid };
  });

  ipcMain.handle(
    TERMINAL_IPC_CHANNELS.WRITE,
    (_event, { id, data }: { id: string; data: string }) => {
      return ptyManager.write(id, data);
    }
  );

  ipcMain.handle(
    TERMINAL_IPC_CHANNELS.RESIZE,
    (_event, { id, cols, rows }: { id: string; cols: number; rows: number }) => {
      return ptyManager.resize(id, cols, rows);
    }
  );

  ipcMain.handle(TERMINAL_IPC_CHANNELS.DESTROY, (_event, { id }: { id: string }) => {
    return ptyManager.destroy(id);
  });
}
