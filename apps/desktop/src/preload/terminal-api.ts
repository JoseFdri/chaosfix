import { ipcRenderer } from "electron";
import { TERMINAL_IPC_CHANNELS } from "@chaosfix/core";

import type {
  PTYCreateOptions,
  PTYCreateResult,
  PTYDataEvent,
  PTYExitEvent,
  TerminalAPI,
  IpcEventHandler,
} from "./types";

/**
 * Creates the terminal API object for renderer process communication
 */
export function createTerminalAPI(): TerminalAPI {
  return {
    create: (options: PTYCreateOptions): Promise<PTYCreateResult> => {
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

    onData: (callback: (data: PTYDataEvent) => void): (() => void) => {
      const handler: IpcEventHandler<PTYDataEvent> = (_event, data) => {
        callback(data);
      };
      ipcRenderer.on(TERMINAL_IPC_CHANNELS.DATA, handler);
      return () => {
        ipcRenderer.removeListener(TERMINAL_IPC_CHANNELS.DATA, handler);
      };
    },

    onExit: (callback: (data: PTYExitEvent) => void): (() => void) => {
      const handler: IpcEventHandler<PTYExitEvent> = (_event, data) => {
        callback(data);
      };
      ipcRenderer.on(TERMINAL_IPC_CHANNELS.EXIT, handler);
      return () => {
        ipcRenderer.removeListener(TERMINAL_IPC_CHANNELS.EXIT, handler);
      };
    },
  };
}
