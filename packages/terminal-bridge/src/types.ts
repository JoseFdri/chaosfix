// Terminal bridge types
export interface PTYCreateOptions {
  id: string;
  cwd: string;
  env?: Record<string, string>;
  shell?: string;
  cols?: number;
  rows?: number;
}

export interface PTYInstance {
  id: string;
  pid: number;
  write: (data: string) => void;
  resize: (cols: number, rows: number) => void;
  kill: () => void;
  onData: (callback: (data: string) => void) => void;
  onExit: (callback: (exitCode: number, signal?: number) => void) => void;
}

export interface TerminalOptions {
  fontFamily?: string;
  fontSize?: number;
  lineHeight?: number;
  cursorStyle?: "block" | "underline" | "bar";
  cursorBlink?: boolean;
  scrollback?: number;
  theme?: TerminalTheme;
}

export interface TerminalTheme {
  foreground?: string;
  background?: string;
  cursor?: string;
  cursorAccent?: string;
  selectionBackground?: string;
  selectionForeground?: string;
  black?: string;
  red?: string;
  green?: string;
  yellow?: string;
  blue?: string;
  magenta?: string;
  cyan?: string;
  white?: string;
  brightBlack?: string;
  brightRed?: string;
  brightGreen?: string;
  brightYellow?: string;
  brightBlue?: string;
  brightMagenta?: string;
  brightCyan?: string;
  brightWhite?: string;
}

// IPC channel names for terminal communication
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
