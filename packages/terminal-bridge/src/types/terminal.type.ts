import type { Terminal } from "@xterm/xterm";
import type { FitAddon } from "@xterm/addon-fit";
import type { SearchAddon } from "@xterm/addon-search";

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

export interface TerminalController {
  terminal: Terminal;
  fitAddon: FitAddon;
  searchAddon: SearchAddon;
  write: (data: string) => void;
  fit: () => void;
  focus: () => void;
  blur: () => void;
  clear: () => void;
  dispose: () => void;
  onData: (callback: (data: string) => void) => void;
  onResize: (callback: (cols: number, rows: number) => void) => void;
  onTitleChange: (callback: (title: string) => void) => void;
  search: (term: string) => boolean;
  searchNext: () => boolean;
  searchPrevious: () => boolean;
  clearSearch: () => void;
}
