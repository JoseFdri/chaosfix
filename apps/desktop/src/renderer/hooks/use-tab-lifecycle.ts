import { useEffect, useRef } from "react";
import type { WorkspaceWithTabs } from "../contexts/slices/workspaces.slice";

export interface UseTabLifecycleOptions {
  /** All workspaces to monitor for tab changes */
  workspaces: WorkspaceWithTabs[];
}

/**
 * Gets all terminal IDs from all tabs in all workspaces.
 * Used to track which terminals exist for cleanup purposes.
 */
function getAllTerminalIdsFromWorkspaces(workspaces: WorkspaceWithTabs[]): Set<string> {
  const ids = new Set<string>();
  for (const workspace of workspaces) {
    for (const tab of workspace.tabs) {
      for (const terminal of tab.terminals) {
        ids.add(terminal.id);
      }
    }
  }
  return ids;
}

/**
 * Gets a map of tab IDs to their terminal IDs for tracking.
 */
function getTabTerminalsMap(workspaces: WorkspaceWithTabs[]): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const workspace of workspaces) {
    for (const tab of workspace.tabs) {
      map.set(
        tab.id,
        tab.terminals.map((t) => t.id)
      );
    }
  }
  return map;
}

/**
 * Hook for managing tab lifecycle and PTY cleanup.
 *
 * When a tab is removed, this hook ensures all PTYs for terminals
 * in that tab are destroyed. This prevents resource leaks.
 *
 * Note: PTYs are NOT destroyed when switching tabs (hidden tabs keep PTYs alive).
 * Only when a tab is CLOSED do we clean up the PTYs.
 */
export function useTabLifecycle({ workspaces }: UseTabLifecycleOptions): void {
  // Track previous terminal IDs to detect removals
  const previousTerminalIdsRef = useRef<Set<string>>(new Set());
  // Track previous tabs to detect tab removals
  const previousTabsRef = useRef<Map<string, string[]>>(new Map());

  useEffect(() => {
    const currentTerminalIds = getAllTerminalIdsFromWorkspaces(workspaces);
    const previousTerminalIds = previousTerminalIdsRef.current;

    // Find terminals that were removed (exist in previous but not in current)
    const removedTerminalIds: string[] = [];
    for (const prevId of previousTerminalIds) {
      if (!currentTerminalIds.has(prevId)) {
        removedTerminalIds.push(prevId);
      }
    }

    // Destroy PTYs for removed terminals
    if (removedTerminalIds.length > 0) {
      // Fire-and-forget PTY destruction (non-blocking)
      for (const terminalId of removedTerminalIds) {
        window.terminal.destroy(terminalId).catch(() => {
          // Ignore errors - PTY might already be destroyed
        });
      }
    }

    // Update refs for next comparison
    previousTerminalIdsRef.current = currentTerminalIds;
    previousTabsRef.current = getTabTerminalsMap(workspaces);
  }, [workspaces]);
}
