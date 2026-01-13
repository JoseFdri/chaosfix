import { useCallback } from "react";
import type { Repository } from "@chaosfix/core";

export interface UseRepositoryActionsOptions {
  repositories: Repository[];
  addRepository: (repo: Repository) => void;
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

      // Step 4: Generate repository ID and add repository
      const repositoryId = crypto.randomUUID();
      addRepository({
        id: repositoryId,
        name: result.name,
        path: result.path,
        defaultBranch: validation.defaultBranch ?? "main",
        workspaces: [],
        createdAt: new Date(),
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      onError?.(err);
    }
  }, [repositories, addRepository, onError, onRepositoryExists, onValidationError]);

  return { handleAddRepository };
}
