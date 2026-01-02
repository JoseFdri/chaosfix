import { useEffect, useRef, useCallback } from "react";
import { createTerminal, type TerminalController } from "@chaosfix/terminal-bridge/renderer";
import { useResizeObserver } from "@chaosfix/ui";
import { DEFAULT_CWD } from "../../constants";

export interface UseTerminalOptions {
  terminalId: string;
  cwd?: string;
}

export interface UseTerminalReturn {
  containerRef: (node: HTMLDivElement | null) => void;
}

export function useTerminal({ terminalId, cwd }: UseTerminalOptions): UseTerminalReturn {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const terminalRef = useRef<TerminalController | null>(null);
  const ptyIdRef = useRef<string | null>(null);
  const [resizeRef, size] = useResizeObserver<HTMLDivElement>();

  const initTerminal = useCallback(async () => {
    if (!containerRef.current || terminalRef.current) {
      return;
    }

    const terminal = createTerminal(containerRef.current);
    terminalRef.current = terminal;

    const pty = await window.terminal.create({
      id: terminalId,
      cwd: cwd || DEFAULT_CWD,
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

    const unsubscribeData = window.terminal.onData((event) => {
      if (event.id === ptyIdRef.current && terminalRef.current) {
        terminalRef.current.write(event.data);
      }
    });

    const unsubscribeExit = window.terminal.onExit((event) => {
      if (event.id === ptyIdRef.current) {
        terminalRef.current?.write(`\r\n[Process exited with code ${event.exitCode}]\r\n`);
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
  }, [terminalId, cwd]);

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
    if (terminalRef.current && size) {
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
