import { contextBridge, ipcRenderer } from "electron";
import { TERMINAL_IPC_CHANNELS, DIALOG_IPC_CHANNELS } from "@chaosfix/core";

interface PTYCreateOptions {
  id: string;
  cwd: string;
  env?: Record<string, string>;
  shell?: string;
  cols?: number;
  rows?: number;
}

// Terminal API exposed to renderer
const terminalAPI = {
  create: (options: PTYCreateOptions): Promise<{ id: string; pid: number }> => {
    return ipcRenderer.invoke(TERMINAL_IPC_CHANNELS.CREATE, options);
  },

  write: (id: string, data: string): Promise<boolean> => {
    return ipcRenderer.invoke(TERMINAL_IPC_CHANNELS.WRITE, { id, data });
  },

  resize: (id: string, cols: number, rows: number): Promise<boolean> => {
    return ipcRenderer.invoke(TERMINAL_IPC_CHANNELS.RESIZE, { id, cols, rows });
  },

  destroy: (id: string): Promise<boolean> => {
    return ipcRenderer.invoke(TERMINAL_IPC_CHANNELS.DESTROY, { id });
  },

  onData: (callback: (data: { id: string; data: string }) => void): () => void => {
    const handler = (_event: Electron.IpcRendererEvent, data: { id: string; data: string }) => {
      callback(data);
    };
    ipcRenderer.on(TERMINAL_IPC_CHANNELS.DATA, handler);
    return () => {
      ipcRenderer.removeListener(TERMINAL_IPC_CHANNELS.DATA, handler);
    };
  },

  onExit: (callback: (data: { id: string; exitCode: number; signal?: number }) => void): () => void => {
    const handler = (_event: Electron.IpcRendererEvent, data: { id: string; exitCode: number; signal?: number }) => {
      callback(data);
    };
    ipcRenderer.on(TERMINAL_IPC_CHANNELS.EXIT, handler);
    return () => {
      ipcRenderer.removeListener(TERMINAL_IPC_CHANNELS.EXIT, handler);
    };
  },
};

// Dialog API exposed to renderer
const dialogAPI = {
  selectDirectory: (): Promise<{ path: string; name: string } | null> => {
    return ipcRenderer.invoke(DIALOG_IPC_CHANNELS.SELECT_DIRECTORY);
  },
};

// Expose APIs to renderer
contextBridge.exposeInMainWorld("terminal", terminalAPI);
contextBridge.exposeInMainWorld("dialog", dialogAPI);

// Type declarations for the exposed APIs
declare global {
  interface Window {
    terminal: typeof terminalAPI;
    dialog: typeof dialogAPI;
  }
}
