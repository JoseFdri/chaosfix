import { useMemo, useCallback } from "react";
import type { Tab } from "@chaosfix/ui";
import type { TerminalSession } from "@chaosfix/core";
import {
  getAllTerminalIds,
  type WorkspaceWithTerminals,
} from "../contexts/slices/workspaces.slice";
import {
  DEFAULT_TERMINAL_LABEL,
  INITIAL_TERMINAL_PID,
  DEFAULT_TERMINAL_STATUS,
} from "../../constants";

export interface UseWorkspaceTabsOptions {
  activeWorkspace: WorkspaceWithTerminals | undefined;
  onAddTerminal?: (workspaceId: string, terminal: TerminalSession) => void;
  onRemoveTerminal?: (workspaceId: string, terminalId: string) => void;
  onSetActiveTerminal?: (workspaceId: string, terminalId: string | null) => void;
  onRenameTerminal?: (workspaceId: string, terminalId: string, title: string) => void;
}

export interface UseWorkspaceTabsReturn {
  tabs: Tab[];
  activeTabId: string | null;
  handleTabSelect: (tabId: string) => void;
  handleTabClose: (tabId: string) => void;
  handleTabRename: (tabId: string, newLabel: string) => void;
  handleNewTab: () => void;
}

export function useWorkspaceTabs({
  activeWorkspace,
  onAddTerminal,
  onRemoveTerminal,
  onSetActiveTerminal,
  onRenameTerminal,
}: UseWorkspaceTabsOptions): UseWorkspaceTabsReturn {
  const tabs = useMemo<Tab[]>(() => {
    if (!activeWorkspace) {
      return [];
    }

    // When there's a split layout, show only one tab for all terminals in the split
    // This prevents a new tab from appearing when splitting a terminal
    if (activeWorkspace.splitLayout) {
      const splitTerminalIds = getAllTerminalIds(activeWorkspace.splitLayout);
      const tabRootId = splitTerminalIds[0];
      const tabRootTerminal = activeWorkspace.terminals.find((t) => t.id === tabRootId);

      if (tabRootTerminal) {
        return [
          {
            id: tabRootTerminal.id,
            label: tabRootTerminal.title || DEFAULT_TERMINAL_LABEL,
            closable: true,
          },
        ];
      }
    }

    // No split layout - show all terminals as tabs
    return activeWorkspace.terminals.map((t) => ({
      id: t.id,
      label: t.title || DEFAULT_TERMINAL_LABEL,
      closable: true,
    }));
  }, [activeWorkspace]);

  const activeTabId = activeWorkspace?.activeTerminalId ?? null;

  const handleTabSelect = useCallback(
    (tabId: string): void => {
      if (!activeWorkspace || !onSetActiveTerminal) {
        return;
      }
      onSetActiveTerminal(activeWorkspace.id, tabId);
    },
    [activeWorkspace, onSetActiveTerminal]
  );

  const handleTabClose = useCallback(
    (tabId: string): void => {
      if (!activeWorkspace || !onRemoveTerminal) {
        return;
      }
      onRemoveTerminal(activeWorkspace.id, tabId);
    },
    [activeWorkspace, onRemoveTerminal]
  );

  const handleTabRename = useCallback(
    (tabId: string, newLabel: string): void => {
      if (!activeWorkspace || !onRenameTerminal) {
        return;
      }
      onRenameTerminal(activeWorkspace.id, tabId, newLabel);
    },
    [activeWorkspace, onRenameTerminal]
  );

  const handleNewTab = useCallback((): void => {
    if (!activeWorkspace || !onAddTerminal) {
      return;
    }

    const terminal: TerminalSession = {
      id: `${activeWorkspace.id}-${Date.now()}`,
      workspaceId: activeWorkspace.id,
      pid: INITIAL_TERMINAL_PID,
      title: DEFAULT_TERMINAL_LABEL,
      status: DEFAULT_TERMINAL_STATUS,
      createdAt: new Date(),
    };

    onAddTerminal(activeWorkspace.id, terminal);
  }, [activeWorkspace, onAddTerminal]);

  return {
    tabs,
    activeTabId,
    handleTabSelect,
    handleTabClose,
    handleTabRename,
    handleNewTab,
  };
}
