export const TERMINAL_IPC_CHANNELS = {
  CREATE: "terminal:create",
  DESTROY: "terminal:destroy",
  WRITE: "terminal:write",
  RESIZE: "terminal:resize",
  DATA: "terminal:data",
  EXIT: "terminal:exit",
  TITLE: "terminal:title",
} as const;

export type TerminalIPCChannel = (typeof TERMINAL_IPC_CHANNELS)[keyof typeof TERMINAL_IPC_CHANNELS];
