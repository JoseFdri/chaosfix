import { useState, useCallback } from "react";

import type { WorkspaceWithTabs } from "../contexts/app-context";

/**
 * Pending workspace information stored when dialog is opened.
 */
interface PendingWorkspaceInfo {
  workspace: WorkspaceWithTabs;
  repositoryPath: string;
}

/**
 * Options for the useRemoveWorkspace hook.
 */
export interface UseRemoveWorkspaceOptions {
  /** Action to remove a workspace from state */
  removeWorkspace: (workspaceId: string) => void;
  /** Optional callback when workspace removal fails */
  onError?: (error: Error) => void;
  /** Optional callback when workspace is successfully removed */
  onSuccess?: () => void;
}

/**
 * Return type for the useRemoveWorkspace hook.
 */
export interface UseRemoveWorkspaceReturn {
  /** Whether the dialog is currently open */
  isDialogOpen: boolean;
  /** Opens the dialog with workspace context */
  openDialog: (workspace: WorkspaceWithTabs, repositoryPath: string) => void;
  /** Closes the dialog and resets state */
  closeDialog: () => void;
  /** Whether a workspace removal is in progress */
  isLoading: boolean;
  /** Handles confirmation of workspace removal */
  handleConfirm: () => Promise<void>;
  /** Current pending workspace info */
  pendingWorkspace: WorkspaceWithTabs | null;
  /** Current error message, if any */
  error: string | null;
}

/**
 * Hook for managing workspace removal dialog state and orchestrating
 * the workspace removal flow.
 *
 * Handles:
 * - Dialog open/close state
 * - Storing pending workspace info
 * - Destroying all terminals for the workspace
 * - Calling workspace removal IPC
 * - Removing workspace from state
 * - Loading and error state management
 */
export function useRemoveWorkspace({
  removeWorkspace,
  onError,
  onSuccess,
}: UseRemoveWorkspaceOptions): UseRemoveWorkspaceReturn {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingInfo, setPendingInfo] = useState<PendingWorkspaceInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openDialog = useCallback((workspace: WorkspaceWithTabs, repositoryPath: string): void => {
    setPendingInfo({ workspace, repositoryPath });
    setError(null);
    setIsDialogOpen(true);
  }, []);

  const closeDialog = useCallback((): void => {
    setIsDialogOpen(false);
    setPendingInfo(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const handleConfirm = useCallback(async (): Promise<void> => {
    if (!pendingInfo) {
      setError("No workspace selected for removal");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First destroy all terminals for the workspace (from all tabs)
      const { workspace, repositoryPath } = pendingInfo;
      const terminalDestroyPromises = workspace.tabs.flatMap((tab) =>
        tab.terminals.map((terminal) => window.terminal.destroy(terminal.id))
      );
      await Promise.all(terminalDestroyPromises);

      // Then remove the worktree and branch with force flag to skip uncommitted changes check
      const result = await window.workspace.remove({
        repositoryPath,
        worktreePath: workspace.worktreePath,
        branchName: workspace.branchName,
        force: true,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to remove workspace");
      }

      // Update state
      removeWorkspace(workspace.id);

      // Notify success
      onSuccess?.();

      // Close dialog on success
      closeDialog();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  }, [pendingInfo, removeWorkspace, onSuccess, onError, closeDialog]);

  return {
    isDialogOpen,
    openDialog,
    closeDialog,
    isLoading,
    handleConfirm,
    pendingWorkspace: pendingInfo?.workspace ?? null,
    error,
  };
}
