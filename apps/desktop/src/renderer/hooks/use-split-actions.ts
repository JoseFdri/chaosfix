import { useCallback } from "react";
import type { TerminalSession, SplitDirection, Tab } from "@chaosfix/core";
import type { WorkspaceWithTabs } from "../contexts/slices/workspaces.slice";
import {
  DEFAULT_TERMINAL_LABEL,
  INITIAL_TERMINAL_PID,
  DEFAULT_TERMINAL_STATUS,
} from "../../constants";

export interface UseSplitActionsOptions {
  /** The active workspace to operate on */
  activeWorkspace: WorkspaceWithTabs | undefined;
  /** Callback to split the current terminal within a tab */
  onSplitTerminalInTab?: (
    workspaceId: string,
    tabId: string,
    direction: SplitDirection,
    newTerminal: TerminalSession
  ) => void;
  /** Callback to resize panes within a tab */
  onResizePanesInTab?: (
    workspaceId: string,
    tabId: string,
    splitId: string,
    sizes: number[]
  ) => void;
  /** Callback to set focused pane within a tab */
  onSetFocusedTerminalInTab?: (
    workspaceId: string,
    tabId: string,
    terminalId: string | null
  ) => void;
  /** Callback to remove a terminal from a tab (closes pane in split) */
  onRemoveTerminalFromTab?: (workspaceId: string, tabId: string, terminalId: string) => void;
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
  /** Whether split is available (has an active tab with terminals) */
  canSplit: boolean;
  /** The currently active tab (if any) */
  activeTab: Tab | undefined;
}

/**
 * Hook providing split-related action handlers for the active workspace.
 * All split operations are now tab-scoped in the tab-centric model.
 */
export function useSplitActions({
  activeWorkspace,
  onSplitTerminalInTab,
  onResizePanesInTab,
  onSetFocusedTerminalInTab,
  onRemoveTerminalFromTab,
}: UseSplitActionsOptions): UseSplitActionsReturn {
  // Get the active tab from the workspace
  const activeTab = activeWorkspace?.tabs.find((t) => t.id === activeWorkspace.activeTabId);

  // Can split if there's an active tab with at least one terminal
  const canSplit = Boolean(activeTab && activeTab.terminals.length > 0);

  const handleSplit = useCallback(
    (direction: SplitDirection): void => {
      if (!activeWorkspace || !activeTab || !onSplitTerminalInTab) {
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

      onSplitTerminalInTab(activeWorkspace.id, activeTab.id, direction, newTerminal);
    },
    [activeWorkspace, activeTab, onSplitTerminalInTab]
  );

  const workspaceId = activeWorkspace?.id;
  const tabId = activeTab?.id;

  const handleResizePanes = useCallback(
    (splitId: string, sizes: number[]): void => {
      if (!workspaceId || !tabId || !onResizePanesInTab) {
        return;
      }
      onResizePanesInTab(workspaceId, tabId, splitId, sizes);
    },
    [workspaceId, tabId, onResizePanesInTab]
  );

  const handlePaneClick = useCallback(
    (terminalId: string): void => {
      if (!workspaceId || !tabId || !onSetFocusedTerminalInTab) {
        return;
      }
      onSetFocusedTerminalInTab(workspaceId, tabId, terminalId);
    },
    [workspaceId, tabId, onSetFocusedTerminalInTab]
  );

  const handleClosePane = useCallback(
    (terminalId: string): void => {
      if (!workspaceId || !tabId || !onRemoveTerminalFromTab) {
        return;
      }
      onRemoveTerminalFromTab(workspaceId, tabId, terminalId);
    },
    [workspaceId, tabId, onRemoveTerminalFromTab]
  );

  return {
    handleSplit,
    handleResizePanes,
    handlePaneClick,
    handleClosePane,
    canSplit,
    activeTab,
  };
}
