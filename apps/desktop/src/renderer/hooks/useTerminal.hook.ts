import { useEffect, useRef, useCallback } from "react";
import { createTerminal, type TerminalController } from "@chaosfix/terminal-bridge/renderer";
import { useResizeObserver } from "@chaosfix/ui";
import { DEFAULT_CWD } from "../../constants";

export interface UseTerminalOptions {
  terminalId: string;
  cwd?: string;
  /** Called when the terminal process exits */
  onExit?: (terminalId: string, exitCode: number) => void;
}

export interface UseTerminalReturn {
  containerRef: (node: HTMLDivElement | null) => void;
}

export function useTerminal({ terminalId, cwd, onExit }: UseTerminalOptions): UseTerminalReturn {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const terminalRef = useRef<TerminalController | null>(null);
  const ptyIdRef = useRef<string | null>(null);
  const onExitRef = useRef(onExit);
  const [resizeRef, size] = useResizeObserver<HTMLDivElement>();

  // Store terminalId and cwd in refs to prevent effect re-runs on prop changes
  // These values should be stable for the lifetime of the terminal
  const terminalIdRef = useRef(terminalId);
  const cwdRef = useRef(cwd);

  // Keep onExit ref up to date
  useEffect(() => {
    onExitRef.current = onExit;
  }, [onExit]);

  const initTerminal = useCallback(async () => {
    if (!containerRef.current || terminalRef.current) {
      return;
    }

    const terminal = createTerminal(containerRef.current);
    terminalRef.current = terminal;

    const pty = await window.terminal.create({
      id: terminalIdRef.current,
      cwd: cwdRef.current || DEFAULT_CWD,
    });
    ptyIdRef.current = pty.id;

    terminal.onData((data) => {
      if (ptyIdRef.current) {
        window.terminal.write(ptyIdRef.current, data);
      }
    });

    terminal.onResize((cols, rows) => {
      if (ptyIdRef.current) {
        window.terminal.resize(ptyIdRef.current, cols, rows);
      }
    });

    // Sync PTY with terminal's initial dimensions after fit
    // The terminal was already fit in createTerminal(), but the PTY was created
    // with default 80x24. We need to explicitly sync the dimensions.
    const cols = terminal.terminal.cols;
    const rows = terminal.terminal.rows;
    if (cols > 0 && rows > 0) {
      window.terminal.resize(pty.id, cols, rows);
    }

    const unsubscribeData = window.terminal.onData((event) => {
      if (event.id === ptyIdRef.current && terminalRef.current) {
        terminalRef.current.write(event.data);
      }
    });

    const unsubscribeExit = window.terminal.onExit((event) => {
      if (event.id === ptyIdRef.current) {
        terminalRef.current?.write(`\r\n[Process exited with code ${event.exitCode}]\r\n`);
        // Notify parent that terminal process has exited
        onExitRef.current?.(terminalIdRef.current, event.exitCode);
      }
    });

    terminal.focus();

    return (): void => {
      unsubscribeData();
      unsubscribeExit();
      if (ptyIdRef.current) {
        window.terminal.destroy(ptyIdRef.current);
      }
      terminal.dispose();
    };
    // Empty deps: Using refs for terminalId and cwd so this callback is stable
    // across re-renders. This prevents the effect from re-running and
    // destroying/recreating terminals when parent components re-render.
  }, []);

  useEffect(() => {
    let isMounted = true;
    let cleanup: (() => void) | undefined;

    initTerminal().then((cleanupFn) => {
      if (isMounted) {
        cleanup = cleanupFn;
      } else {
        cleanupFn?.();
      }
    });

    return (): void => {
      isMounted = false;
      cleanup?.();
      terminalRef.current = null;
      ptyIdRef.current = null;
    };
  }, [initTerminal]);

  useEffect(() => {
    // Skip fit when terminal is hidden (0 dimensions) to avoid unnecessary PTY resize
    if (terminalRef.current && size && size.width > 0 && size.height > 0) {
      terminalRef.current.fit();
    }
  }, [size]);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      resizeRef(node);
    },
    [resizeRef]
  );

  return { containerRef: setRefs };
}
