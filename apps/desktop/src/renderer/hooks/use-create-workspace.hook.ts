import { useState, useCallback } from "react";

import type { WorkspaceWithTerminals } from "../contexts/app-context";
import { WORKSPACE_ERRORS, DEFAULT_WORKSPACE_STATUS } from "../../constants/workspace.constants";

/**
 * Pending repository information stored when dialog is opened.
 */
interface PendingRepository {
  id: string;
  name: string;
  path: string;
}

/**
 * Options for the useCreateWorkspace hook.
 */
export interface UseCreateWorkspaceOptions {
  /** Action to add a workspace to state */
  addWorkspace: (workspace: WorkspaceWithTerminals) => void;
  /** Optional callback when workspace creation fails */
  onError?: (error: Error) => void;
  /** Optional callback when workspace is successfully created */
  onSuccess?: (workspace: WorkspaceWithTerminals) => void;
}

/**
 * Return type for the useCreateWorkspace hook.
 */
export interface UseCreateWorkspaceReturn {
  /** Whether the dialog is currently open */
  isDialogOpen: boolean;
  /** Opens the dialog with repository context */
  openDialog: (repoId: string, repoName: string, repoPath: string) => void;
  /** Closes the dialog and resets state */
  closeDialog: () => void;
  /** Whether a workspace creation is in progress */
  isLoading: boolean;
  /** Current error message, if any */
  error: string | null;
  /** Handles form submission with workspace name */
  handleSubmit: (workspaceName: string) => Promise<void>;
  /** Current pending repository info (for display purposes) */
  pendingRepository: PendingRepository | null;
}

/**
 * Hook for managing workspace creation dialog state and orchestrating
 * the workspace creation flow.
 *
 * Handles:
 * - Dialog open/close state
 * - Storing pending repository info
 * - Workspace name validation
 * - Calling workspace creation IPC
 * - Creating workspace entity and adding to state
 * - Loading and error state management
 */
export function useCreateWorkspace({
  addWorkspace,
  onError,
  onSuccess,
}: UseCreateWorkspaceOptions): UseCreateWorkspaceReturn {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingRepository, setPendingRepository] = useState<PendingRepository | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openDialog = useCallback((repoId: string, repoName: string, repoPath: string): void => {
    setPendingRepository({ id: repoId, name: repoName, path: repoPath });
    setError(null);
    setIsDialogOpen(true);
  }, []);

  const closeDialog = useCallback((): void => {
    setIsDialogOpen(false);
    setPendingRepository(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const handleSubmit = useCallback(
    async (workspaceName: string): Promise<void> => {
      // Validate workspace name
      const trimmedName = workspaceName.trim();
      if (!trimmedName) {
        setError(WORKSPACE_ERRORS.WORKSPACE_NAME_REQUIRED);
        return;
      }

      if (!pendingRepository) {
        setError(WORKSPACE_ERRORS.NO_REPOSITORY_SELECTED);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Call IPC to create the worktree
        const result = await window.workspace.create({
          repositoryPath: pendingRepository.path,
          repositoryName: pendingRepository.name,
          workspaceName: trimmedName,
        });

        // Create the workspace entity
        const now = new Date();
        const workspace: WorkspaceWithTerminals = {
          id: crypto.randomUUID(),
          name: trimmedName,
          repositoryId: pendingRepository.id,
          worktreePath: result.worktreePath,
          branchName: result.branch,
          status: DEFAULT_WORKSPACE_STATUS,
          terminals: [],
          activeTerminalId: null,
          createdAt: now,
          updatedAt: now,
        };

        // Add to state
        addWorkspace(workspace);

        // Notify success
        onSuccess?.(workspace);

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
    [pendingRepository, addWorkspace, onSuccess, onError, closeDialog]
  );

  return {
    isDialogOpen,
    openDialog,
    closeDialog,
    isLoading,
    error,
    handleSubmit,
    pendingRepository,
  };
}
