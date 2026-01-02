import { useMemo, useCallback } from "react";
import type { Tab } from "@chaosfix/ui";
import type { TerminalSession } from "@chaosfix/core";
import type { WorkspaceWithTerminals } from "../contexts/slices/workspaces.slice";
import {
  DEFAULT_TERMINAL_LABEL,
  INITIAL_TERMINAL_PID,
  DEFAULT_TERMINAL_STATUS,
} from "../../constants";

export interface UseWorkspaceTabsOptions {
  activeWorkspace: WorkspaceWithTerminals | undefined;
  onAddTerminal?: (workspaceId: string, terminal: TerminalSession) => void;
  onRemoveTerminal?: (workspaceId: string, terminalId: string) => void;
}

export interface UseWorkspaceTabsReturn {
  tabs: Tab[];
  activeTabId: string | null;
  handleTabSelect: (tabId: string) => void;
  handleTabClose: (tabId: string) => void;
  handleNewTab: () => void;
}

export function useWorkspaceTabs({
  activeWorkspace,
  onAddTerminal,
  onRemoveTerminal,
}: UseWorkspaceTabsOptions): UseWorkspaceTabsReturn {
  const tabs = useMemo<Tab[]>(() => {
    if (!activeWorkspace) {
      return [];
    }
    return activeWorkspace.terminals.map((t) => ({
      id: t.id,
      label: t.title || DEFAULT_TERMINAL_LABEL,
      closable: true,
    }));
  }, [activeWorkspace]);

  const activeTabId = activeWorkspace?.activeTerminalId ?? null;

  const handleTabSelect = useCallback((_tabId: string): void => {
    // TODO: Implement tab selection
  }, []);

  const handleTabClose = useCallback(
    (tabId: string): void => {
      if (!activeWorkspace || !onRemoveTerminal) {
        return;
      }
      onRemoveTerminal(activeWorkspace.id, tabId);
    },
    [activeWorkspace, onRemoveTerminal]
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
    handleNewTab,
  };
}
