/**
 * IPC channel definitions for Electron main/renderer communication.
 * These constants define the contract between processes.
 */

export const TERMINAL_IPC_CHANNELS = {
  CREATE: "terminal:create",
  DESTROY: "terminal:destroy",
  WRITE: "terminal:write",
  RESIZE: "terminal:resize",
  DATA: "terminal:data",
  EXIT: "terminal:exit",
  TITLE: "terminal:title",
} as const;

export type TerminalIPCChannel =
  (typeof TERMINAL_IPC_CHANNELS)[keyof typeof TERMINAL_IPC_CHANNELS];

export const DIALOG_IPC_CHANNELS = {
  SELECT_DIRECTORY: "dialog:select-directory",
} as const;

export type DialogIPCChannel =
  (typeof DIALOG_IPC_CHANNELS)[keyof typeof DIALOG_IPC_CHANNELS];
