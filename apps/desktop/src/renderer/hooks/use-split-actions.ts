import { useCallback } from "react";
import type { TerminalSession, SplitDirection } from "@chaosfix/core";
import type { WorkspaceWithTerminals } from "../contexts/slices/workspaces.slice";
import {
  DEFAULT_TERMINAL_LABEL,
  INITIAL_TERMINAL_PID,
  DEFAULT_TERMINAL_STATUS,
} from "../../constants";

export interface UseSplitActionsOptions {
  /** The active workspace to operate on */
  activeWorkspace: WorkspaceWithTerminals | undefined;
  /** Callback to split the current terminal */
  onSplitTerminal?: (
    workspaceId: string,
    direction: SplitDirection,
    newTerminal: TerminalSession
  ) => void;
  /** Callback to resize panes */
  onResizePanes?: (workspaceId: string, splitId: string, sizes: number[]) => void;
  /** Callback to set focused pane */
  onSetFocusedPane?: (workspaceId: string, terminalId: string | null) => void;
  /** Callback to close a pane */
  onClosePane?: (workspaceId: string, terminalId: string) => void;
}

export interface UseSplitActionsReturn {
  /** Handler for split button clicks */
  handleSplit: (direction: SplitDirection) => void;
  /** Handler for pane resize */
  handleResizePanes: (splitId: string, sizes: number[]) => void;
  /** Handler for pane click (focus) */
  handlePaneClick: (terminalId: string) => void;
  /** Handler for closing a pane */
  handleClosePane: (terminalId: string) => void;
  /** Whether split is available (has an active terminal) */
  canSplit: boolean;
}

/**
 * Hook providing split-related action handlers for the active workspace.
 * Encapsulates split terminal operations and pane management.
 */
export function useSplitActions({
  activeWorkspace,
  onSplitTerminal,
  onResizePanes,
  onSetFocusedPane,
  onClosePane,
}: UseSplitActionsOptions): UseSplitActionsReturn {
  const canSplit = Boolean(activeWorkspace?.activeTerminalId);

  const handleSplit = useCallback(
    (direction: SplitDirection): void => {
      if (!activeWorkspace || !onSplitTerminal) {
        return;
      }

      const newTerminal: TerminalSession = {
        id: `${activeWorkspace.id}-${Date.now()}`,
        workspaceId: activeWorkspace.id,
        pid: INITIAL_TERMINAL_PID,
        title: DEFAULT_TERMINAL_LABEL,
        status: DEFAULT_TERMINAL_STATUS,
        createdAt: new Date(),
      };

      onSplitTerminal(activeWorkspace.id, direction, newTerminal);
    },
    [activeWorkspace, onSplitTerminal]
  );

  const handleResizePanes = useCallback(
    (splitId: string, sizes: number[]): void => {
      if (!activeWorkspace || !onResizePanes) {
        return;
      }
      onResizePanes(activeWorkspace.id, splitId, sizes);
    },
    [activeWorkspace, onResizePanes]
  );

  const handlePaneClick = useCallback(
    (terminalId: string): void => {
      if (!activeWorkspace || !onSetFocusedPane) {
        return;
      }
      onSetFocusedPane(activeWorkspace.id, terminalId);
    },
    [activeWorkspace, onSetFocusedPane]
  );

  const handleClosePane = useCallback(
    (terminalId: string): void => {
      if (!activeWorkspace || !onClosePane) {
        return;
      }
      onClosePane(activeWorkspace.id, terminalId);
    },
    [activeWorkspace, onClosePane]
  );

  return {
    handleSplit,
    handleResizePanes,
    handlePaneClick,
    handleClosePane,
    canSplit,
  };
}
