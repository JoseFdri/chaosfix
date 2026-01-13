import { useCallback } from "react";
import type { WorkspaceWithTabs } from "../contexts/slices/workspaces.slice";

export interface UseTerminalExitOptions {
  /** All workspaces to search for the exited terminal */
  workspaces: WorkspaceWithTabs[];
  /** Callback to remove a terminal from a tab */
  onRemoveTerminalFromTab?: (workspaceId: string, tabId: string, terminalId: string) => void;
  /** Callback to remove an entire tab */
  onRemoveTab?: (workspaceId: string, tabId: string) => void;
}

export interface UseTerminalExitReturn {
  /** Handler for terminal process exit events */
  handleTerminalExit: (terminalId: string, exitCode: number) => void;
}

/**
 * Hook for handling terminal process exit events.
 *
 * When a terminal process exits, this hook determines whether to:
 * - Remove just the terminal (if tab has split layout with multiple terminals)
 * - Remove the entire tab (if tab has only one terminal)
 */
export function useTerminalExit({
  workspaces,
  onRemoveTerminalFromTab,
  onRemoveTab,
}: UseTerminalExitOptions): UseTerminalExitReturn {
  const handleTerminalExit = useCallback(
    (terminalId: string, _exitCode: number): void => {
      // Find the workspace and tab containing this terminal
      for (const workspace of workspaces) {
        for (const tab of workspace.tabs) {
          const terminal = tab.terminals.find((t) => t.id === terminalId);
          if (terminal) {
            // If tab has split layout (multiple terminals), remove just this terminal
            // If tab has only one terminal, remove the entire tab
            if (tab.terminals.length > 1) {
              onRemoveTerminalFromTab?.(workspace.id, tab.id, terminalId);
            } else {
              onRemoveTab?.(workspace.id, tab.id);
            }
            return;
          }
        }
      }
    },
    [workspaces, onRemoveTerminalFromTab, onRemoveTab]
  );

  return {
    handleTerminalExit,
  };
}
