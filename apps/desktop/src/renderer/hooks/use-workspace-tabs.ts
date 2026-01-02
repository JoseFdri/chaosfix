import { useMemo, useCallback } from "react";
import type { Tab } from "@chaosfix/ui";
import type { WorkspaceWithTerminals } from "../contexts/slices/workspaces.slice";
import { DEFAULT_TERMINAL_LABEL } from "../../constants";

export interface UseWorkspaceTabsOptions {
  activeWorkspace: WorkspaceWithTerminals | undefined;
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
    // TODO: Implement new tab
  }, []);

  return {
    tabs,
    activeTabId,
    handleTabSelect,
    handleTabClose,
    handleNewTab,
  };
}
