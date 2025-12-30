import { useCallback } from "react";
import type { Repository } from "@chaosfix/core";
import type { WorkspaceWithTerminals } from "../contexts/app-context";

export interface UseRepositoryActionsOptions {
  repositories: Repository[];
  addRepository: (repo: Repository) => void;
  addWorkspace: (workspace: WorkspaceWithTerminals) => void;
  onError?: (error: Error) => void;
  onRepositoryExists?: (repo: Repository) => void;
  onValidationError?: (error: string) => void;
}

export interface UseRepositoryActionsReturn {
  handleAddRepository: () => Promise<void>;
}

export function useRepositoryActions({
  repositories,
  addRepository,
  addWorkspace,
  onError,
  onRepositoryExists,
  onValidationError,
}: UseRepositoryActionsOptions): UseRepositoryActionsReturn {
  const handleAddRepository = useCallback(async (): Promise<void> => {
    try {
      // Step 1: Select directory
      const result = await window.dialog.selectDirectory();
      if (!result) {
        return;
      }

      // Step 2: Check for duplicates
      const existingRepo = repositories.find((r) => r.path === result.path);
      if (existingRepo) {
        onRepositoryExists?.(existingRepo);
        return;
      }

      // Step 3: Validate git repository
      const validation = await window.workspace.validateRepository(result.path);
      if (!validation.isValid) {
        onValidationError?.(validation.error ?? "Not a valid git repository");
        return;
      }

      // Step 4: Create workspace via IPC
      const workspaceResult = await window.workspace.create({
        repoPath: result.path,
        branch: validation.defaultBranch ?? "main",
      });

      // Step 5: Generate IDs
      const repositoryId = crypto.randomUUID();
      const workspaceId = crypto.randomUUID();

      // Step 6: Add repository with workspace ID reference
      addRepository({
        id: repositoryId,
        name: result.name,
        path: result.path,
        defaultBranch: validation.defaultBranch ?? "main",
        workspaces: [workspaceId],
        createdAt: new Date(),
      });

      // Step 7: Add workspace with details
      const now = new Date();
      addWorkspace({
        id: workspaceId,
        repositoryId,
        name: workspaceResult.branch,
        branchName: workspaceResult.branch,
        worktreePath: workspaceResult.worktreePath,
        status: "idle",
        terminals: [],
        activeTerminalId: null,
        createdAt: now,
        updatedAt: now,
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      onError?.(err);
    }
  }, [repositories, addRepository, addWorkspace, onError, onRepositoryExists, onValidationError]);

  return { handleAddRepository };
}
