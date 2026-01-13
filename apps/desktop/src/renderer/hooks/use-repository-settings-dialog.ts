import { useState, useCallback, useMemo } from "react";

import type { Repository } from "@chaosfix/core";

/**
 * Repository settings updates structure.
 */
interface RepositorySettingsUpdates {
  branchFrom?: string;
  defaultRemote?: string;
  saveConfigToRepo?: boolean;
}

/**
 * Options for the useRepositorySettingsDialog hook.
 */
export interface UseRepositorySettingsDialogOptions {
  /** All repositories to find the active one */
  repositories: Repository[];
  /** Action to update a repository */
  updateRepository: (id: string, updates: RepositorySettingsUpdates) => void;
  /** Action to remove a repository */
  removeRepository: (id: string) => void;
}

/**
 * Return type for the useRepositorySettingsDialog hook.
 */
export interface UseRepositorySettingsDialogReturn {
  /** ID of the repository whose settings dialog is open, or null if closed */
  activeSettingsRepoId: string | null;
  /** The full repository object for the active settings dialog, or null if closed */
  activeSettingsRepo: Repository | null;
  /** Opens the settings dialog for a specific repository */
  openSettingsDialog: (repositoryId: string) => void;
  /** Closes the settings dialog */
  closeSettingsDialog: () => void;
  /** Handles repository settings change from the dialog */
  handleRepositorySettingsChange: (id: string, updates: RepositorySettingsUpdates) => void;
  /** Handles repository removal - closes dialog first, then removes */
  handleRepositoryRemove: () => void;
}

/**
 * Hook for managing repository settings dialog state and operations.
 *
 * Handles:
 * - Dialog open/close state
 * - Finding the active repository from ID
 * - Propagating settings changes to repository actions
 * - Repository removal with dialog closure
 */
export function useRepositorySettingsDialog({
  repositories,
  updateRepository,
  removeRepository,
}: UseRepositorySettingsDialogOptions): UseRepositorySettingsDialogReturn {
  const [activeSettingsRepoId, setActiveSettingsRepoId] = useState<string | null>(null);

  const activeSettingsRepo = useMemo(() => {
    if (!activeSettingsRepoId) {
      return null;
    }
    return repositories.find((r) => r.id === activeSettingsRepoId) ?? null;
  }, [activeSettingsRepoId, repositories]);

  const openSettingsDialog = useCallback((repositoryId: string): void => {
    setActiveSettingsRepoId(repositoryId);
  }, []);

  const closeSettingsDialog = useCallback((): void => {
    setActiveSettingsRepoId(null);
  }, []);

  const handleRepositorySettingsChange = useCallback(
    (id: string, updates: RepositorySettingsUpdates): void => {
      updateRepository(id, updates);
    },
    [updateRepository]
  );

  const handleRepositoryRemove = useCallback((): void => {
    if (!activeSettingsRepoId) {
      return;
    }
    // Close the dialog first
    setActiveSettingsRepoId(null);
    // Remove the repository (cascades to remove workspaces in state via wrapReducer)
    removeRepository(activeSettingsRepoId);
  }, [activeSettingsRepoId, removeRepository]);

  return {
    activeSettingsRepoId,
    activeSettingsRepo,
    openSettingsDialog,
    closeSettingsDialog,
    handleRepositorySettingsChange,
    handleRepositoryRemove,
  };
}
