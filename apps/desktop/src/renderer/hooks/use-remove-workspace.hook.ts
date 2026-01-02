import { useState, useCallback } from "react";

import type { WorkspaceWithTerminals } from "../contexts/app-context";

/**
 * Status details from checking workspace for uncommitted changes.
 */
export interface StatusDetails {
  modified: string[];
  staged: string[];
  untracked: string[];
}

/**
 * Pending workspace information stored when dialog is opened.
 */
interface PendingWorkspaceInfo {
  workspace: WorkspaceWithTerminals;
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
  /** Opens the dialog with workspace context and checks status */
  openDialog: (workspace: WorkspaceWithTerminals, repositoryPath: string) => void;
  /** Closes the dialog and resets state */
  closeDialog: () => void;
  /** Whether a workspace removal is in progress */
  isLoading: boolean;
  /** Whether we are checking workspace status */
  isCheckingStatus: boolean;
  /** Whether the workspace has uncommitted changes */
  hasUncommittedChanges: boolean;
  /** Details about modified/staged/untracked files */
  statusDetails: StatusDetails | null;
  /** Handles confirmation with optional force flag */
  handleConfirm: (force?: boolean) => Promise<void>;
  /** Current pending workspace info */
  pendingWorkspace: WorkspaceWithTerminals | null;
  /** Current error message, if any */
  error: string | null;
}

/**
 * Hook for managing workspace removal dialog state and orchestrating
 * the workspace removal flow.
 *
 * Handles:
 * - Dialog open/close state
 * - Checking workspace status on open
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
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [hasUncommittedChanges, setHasUncommittedChanges] = useState(false);
  const [statusDetails, setStatusDetails] = useState<StatusDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openDialog = useCallback(
    (workspace: WorkspaceWithTerminals, repositoryPath: string): void => {
      setPendingInfo({ workspace, repositoryPath });
      setError(null);
      setHasUncommittedChanges(false);
      setStatusDetails(null);
      setIsDialogOpen(true);
      setIsCheckingStatus(true);

      // Check workspace status asynchronously
      window.workspace
        .checkStatus({ repositoryPath: workspace.worktreePath })
        .then((result) => {
          setHasUncommittedChanges(result.hasUncommittedChanges);
          setStatusDetails({
            modified: result.modified,
            staged: result.staged,
            untracked: result.untracked,
          });
        })
        .catch((err) => {
          const errorMessage = err instanceof Error ? err.message : String(err);
          setError(`Failed to check workspace status: ${errorMessage}`);
        })
        .finally(() => {
          setIsCheckingStatus(false);
        });
    },
    []
  );

  const closeDialog = useCallback((): void => {
    setIsDialogOpen(false);
    setPendingInfo(null);
    setError(null);
    setIsLoading(false);
    setIsCheckingStatus(false);
    setHasUncommittedChanges(false);
    setStatusDetails(null);
  }, []);

  const handleConfirm = useCallback(
    async (force?: boolean): Promise<void> => {
      if (!pendingInfo) {
        setError("No workspace selected for removal");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // First destroy all terminals for the workspace
        const { workspace, repositoryPath } = pendingInfo;
        const terminalDestroyPromises = workspace.terminals.map((terminal) =>
          window.terminal.destroy(terminal.id)
        );
        await Promise.all(terminalDestroyPromises);

        // Then remove the worktree
        const result = await window.workspace.remove({
          repositoryPath,
          worktreePath: workspace.worktreePath,
          force,
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
    },
    [pendingInfo, removeWorkspace, onSuccess, onError, closeDialog]
  );

  return {
    isDialogOpen,
    openDialog,
    closeDialog,
    isLoading,
    isCheckingStatus,
    hasUncommittedChanges,
    statusDetails,
    handleConfirm,
    pendingWorkspace: pendingInfo?.workspace ?? null,
    error,
  };
}
