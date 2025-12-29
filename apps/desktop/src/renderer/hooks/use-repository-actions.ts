import { useCallback } from "react";
import type { Repository } from "@chaosfix/core";
import { DEFAULT_BRANCH } from "@chaosfix/config";

export interface UseRepositoryActionsOptions {
  repositories: Repository[];
  addRepository: (repo: Repository) => void;
  onError?: (error: Error) => void;
  onRepositoryExists?: (repo: Repository) => void;
}

export interface UseRepositoryActionsReturn {
  handleAddRepository: () => Promise<void>;
}

export function useRepositoryActions({
  repositories,
  addRepository,
  onError,
  onRepositoryExists,
}: UseRepositoryActionsOptions): UseRepositoryActionsReturn {
  const handleAddRepository = useCallback(async (): Promise<void> => {
    try {
      const result = await window.dialog.selectDirectory();
      if (!result) {
        return;
      }

      const existingRepo = repositories.find((r) => r.path === result.path);
      if (existingRepo) {
        onRepositoryExists?.(existingRepo);
        return;
      }

      addRepository({
        id: crypto.randomUUID(),
        name: result.name,
        path: result.path,
        defaultBranch: DEFAULT_BRANCH,
        workspaces: [],
        createdAt: new Date(),
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error("Failed to add repository:", err);
      onError?.(err);
    }
  }, [repositories, addRepository, onError, onRepositoryExists]);

  return { handleAddRepository };
}
