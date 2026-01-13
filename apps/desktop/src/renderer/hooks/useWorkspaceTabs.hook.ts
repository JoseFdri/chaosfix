import { useMemo, useCallback } from "react";
import type { Tab as UITab } from "@chaosfix/ui";
import type { Tab, TerminalSession } from "@chaosfix/core";
import type { WorkspaceWithTabs } from "../contexts/slices/workspaces.slice";
import {
  DEFAULT_TERMINAL_LABEL,
  INITIAL_TERMINAL_PID,
  DEFAULT_TERMINAL_STATUS,
} from "../../constants";

export interface UseWorkspaceTabsOptions {
  activeWorkspace: WorkspaceWithTabs | undefined;
  /** Callback to add a new tab to the workspace */
  onAddTab?: (workspaceId: string, tab: Tab) => void;
  /** Callback to remove a tab from the workspace */
  onRemoveTab?: (workspaceId: string, tabId: string) => void;
  /** Callback to set the active tab */
  onSetActiveTab?: (workspaceId: string, tabId: string) => void;
  /** Callback to update a tab's label */
  onUpdateTabLabel?: (workspaceId: string, tabId: string, label: string) => void;
}

export interface UseWorkspaceTabsReturn {
  tabs: UITab[];
  activeTabId: string | null;
  handleTabSelect: (tabId: string) => void;
  handleTabClose: (tabId: string) => void;
  handleTabRename: (tabId: string, newLabel: string) => void;
  handleNewTab: () => void;
}

/**
 * Hook for managing workspace tabs.
 * In the tab-centric model, tabs come directly from workspace.tabs.
 * Each tab owns its terminals and split layout independently.
 */
export function useWorkspaceTabs({
  activeWorkspace,
  onAddTab,
  onRemoveTab,
  onSetActiveTab,
  onUpdateTabLabel,
}: UseWorkspaceTabsOptions): UseWorkspaceTabsReturn {
  // Convert workspace tabs to UI tabs
  const tabs = useMemo<UITab[]>(() => {
    if (!activeWorkspace) {
      return [];
    }

    // Tabs come directly from workspace.tabs - no complex derivation needed
    return activeWorkspace.tabs.map((tab) => ({
      id: tab.id,
      label: tab.label || DEFAULT_TERMINAL_LABEL,
      closable: true,
      // Optional: show split indicator if tab has split layout
      // icon: tab.splitLayout ? "split-icon" : undefined,
    }));
  }, [activeWorkspace]);

  const activeTabId = activeWorkspace?.activeTabId ?? null;

  const handleTabSelect = useCallback(
    (tabId: string): void => {
      if (!activeWorkspace || !onSetActiveTab) {
        return;
      }
      onSetActiveTab(activeWorkspace.id, tabId);
    },
    [activeWorkspace, onSetActiveTab]
  );

  const handleTabClose = useCallback(
    (tabId: string): void => {
      if (!activeWorkspace || !onRemoveTab) {
        return;
      }
      onRemoveTab(activeWorkspace.id, tabId);
    },
    [activeWorkspace, onRemoveTab]
  );

  const handleTabRename = useCallback(
    (tabId: string, newLabel: string): void => {
      if (!activeWorkspace || !onUpdateTabLabel) {
        return;
      }
      onUpdateTabLabel(activeWorkspace.id, tabId, newLabel);
    },
    [activeWorkspace, onUpdateTabLabel]
  );

  const handleNewTab = useCallback((): void => {
    if (!activeWorkspace || !onAddTab) {
      return;
    }

    // Create a new terminal for the new tab
    const terminal: TerminalSession = {
      id: `${activeWorkspace.id}-${Date.now()}`,
      workspaceId: activeWorkspace.id,
      pid: INITIAL_TERMINAL_PID,
      title: DEFAULT_TERMINAL_LABEL,
      status: DEFAULT_TERMINAL_STATUS,
      createdAt: new Date(),
    };

    // Create a new tab containing the terminal
    const newTab: Tab = {
      id: `${activeWorkspace.id}-tab-${Date.now()}`,
      label: DEFAULT_TERMINAL_LABEL,
      terminals: [terminal],
      splitLayout: null,
      focusedTerminalId: terminal.id,
      createdAt: Date.now(),
    };

    onAddTab(activeWorkspace.id, newTab);
  }, [activeWorkspace, onAddTab]);

  return {
    tabs,
    activeTabId,
    handleTabSelect,
    handleTabClose,
    handleTabRename,
    handleNewTab,
  };
}
