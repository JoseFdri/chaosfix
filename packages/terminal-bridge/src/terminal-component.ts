import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { SearchAddon } from "@xterm/addon-search";
import { WebLinksAddon } from "@xterm/addon-web-links";
import type { TerminalOptions, TerminalTheme } from "./types";

const DEFAULT_THEME: TerminalTheme = {
  foreground: "#d4d4d4",
  background: "#1e1e1e",
  cursor: "#d4d4d4",
  cursorAccent: "#1e1e1e",
  selectionBackground: "#264f78",
  black: "#000000",
  red: "#cd3131",
  green: "#0dbc79",
  yellow: "#e5e510",
  blue: "#2472c8",
  magenta: "#bc3fbc",
  cyan: "#11a8cd",
  white: "#e5e5e5",
  brightBlack: "#666666",
  brightRed: "#f14c4c",
  brightGreen: "#23d18b",
  brightYellow: "#f5f543",
  brightBlue: "#3b8eea",
  brightMagenta: "#d670d6",
  brightCyan: "#29b8db",
  brightWhite: "#ffffff",
};

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

/**
 * Create a terminal instance with all necessary addons
 */
export function createTerminal(
  container: HTMLElement,
  options: TerminalOptions = {}
): TerminalController {
  const terminal = new Terminal({
    fontFamily: options.fontFamily || "Menlo, Monaco, monospace",
    fontSize: options.fontSize || 14,
    lineHeight: options.lineHeight || 1.2,
    cursorStyle: options.cursorStyle || "block",
    cursorBlink: options.cursorBlink ?? true,
    scrollback: options.scrollback || 10000,
    theme: options.theme || DEFAULT_THEME,
    allowProposedApi: true,
  });

  const fitAddon = new FitAddon();
  const searchAddon = new SearchAddon();
  const webLinksAddon = new WebLinksAddon();

  terminal.loadAddon(fitAddon);
  terminal.loadAddon(searchAddon);
  terminal.loadAddon(webLinksAddon);

  terminal.open(container);
  fitAddon.fit();

  const dataListeners: ((data: string) => void)[] = [];
  const resizeListeners: ((cols: number, rows: number) => void)[] = [];
  const titleListeners: ((title: string) => void)[] = [];

  // Set up data handler
  terminal.onData((data) => {
    for (const listener of dataListeners) {
      listener(data);
    }
  });

  // Set up resize handler
  terminal.onResize(({ cols, rows }) => {
    for (const listener of resizeListeners) {
      listener(cols, rows);
    }
  });

  // Set up title change handler
  terminal.onTitleChange((title) => {
    for (const listener of titleListeners) {
      listener(title);
    }
  });

  return {
    terminal,
    fitAddon,
    searchAddon,
    write: (data: string) => {
      terminal.write(data);
    },
    fit: () => {
      fitAddon.fit();
    },
    focus: () => {
      terminal.focus();
    },
    blur: () => {
      terminal.blur();
    },
    clear: () => {
      terminal.clear();
    },
    dispose: () => {
      terminal.dispose();
    },
    onData: (callback: (data: string) => void) => {
      dataListeners.push(callback);
    },
    onResize: (callback: (cols: number, rows: number) => void) => {
      resizeListeners.push(callback);
    },
    onTitleChange: (callback: (title: string) => void) => {
      titleListeners.push(callback);
    },
    search: (term: string) => {
      return searchAddon.findNext(term);
    },
    searchNext: () => {
      return searchAddon.findNext("");
    },
    searchPrevious: () => {
      return searchAddon.findPrevious("");
    },
    clearSearch: () => {
      searchAddon.clearDecorations();
    },
  };
}
