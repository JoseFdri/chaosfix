import { type FC, useEffect, useRef, useCallback } from "react";
import { createTerminal, type TerminalController } from "@chaosfix/terminal-bridge/renderer";
import { useResizeObserver } from "@chaosfix/ui";

interface TerminalViewProps {
  workspaceId: string;
}

export const TerminalView: FC<TerminalViewProps> = ({ workspaceId }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const terminalRef = useRef<TerminalController | null>(null);
  const ptyIdRef = useRef<string | null>(null);
  const [resizeRef, size] = useResizeObserver<HTMLDivElement>();

  // Initialize terminal
  const initTerminal = useCallback(async () => {
    if (!containerRef.current || terminalRef.current) {
      return;
    }

    // Create terminal in renderer
    const terminal = createTerminal(containerRef.current);
    terminalRef.current = terminal;

    // Create PTY in main process
    const pty = await window.terminal.create({
      id: `${workspaceId}-${Date.now()}`,
      cwd: process.env.HOME || "/",
    });
    ptyIdRef.current = pty.id;

    // Connect terminal input to PTY
    terminal.onData((data) => {
      if (ptyIdRef.current) {
        window.terminal.write(ptyIdRef.current, data);
      }
    });

    // Handle terminal resize
    terminal.onResize((cols, rows) => {
      if (ptyIdRef.current) {
        window.terminal.resize(ptyIdRef.current, cols, rows);
      }
    });

    // Listen for PTY output
    const unsubscribeData = window.terminal.onData((event) => {
      if (event.id === ptyIdRef.current && terminalRef.current) {
        terminalRef.current.write(event.data);
      }
    });

    // Listen for PTY exit
    const unsubscribeExit = window.terminal.onExit((event) => {
      if (event.id === ptyIdRef.current) {
        terminalRef.current?.write(`\r\n[Process exited with code ${event.exitCode}]\r\n`);
      }
    });

    terminal.focus();

    // Return cleanup function
    return (): void => {
      unsubscribeData();
      unsubscribeExit();
      if (ptyIdRef.current) {
        window.terminal.destroy(ptyIdRef.current);
      }
      terminal.dispose();
    };
  }, [workspaceId]);

  // Initialize on mount
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    initTerminal().then((cleanupFn) => {
      cleanup = cleanupFn;
    });

    return (): void => {
      cleanup?.();
      terminalRef.current = null;
      ptyIdRef.current = null;
    };
  }, [initTerminal]);

  // Handle resize
  useEffect(() => {
    if (terminalRef.current && size) {
      terminalRef.current.fit();
    }
  }, [size]);

  // Combine refs
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      resizeRef(node);
    },
    [resizeRef]
  );

  return <div ref={setRefs} className="terminal-container w-full h-full" />;
};
