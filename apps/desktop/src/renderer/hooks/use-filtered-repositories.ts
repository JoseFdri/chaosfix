import { useMemo } from "react";
import type { Repository } from "@chaosfix/core";
import type { WorkspaceWithTerminals } from "../contexts/slices/workspaces.slice";

export interface UseFilteredRepositoriesOptions {
  repositories: Repository[];
  searchQuery: string;
  workspaces?: WorkspaceWithTerminals[];
}

export function useFilteredRepositories({
  repositories,
  searchQuery,
  workspaces = [],
}: UseFilteredRepositoriesOptions): Repository[] {
  return useMemo(() => {
    if (!searchQuery.trim()) {
      return repositories;
    }

    const normalizedQuery = searchQuery.toLowerCase();

    return repositories.filter((repo) => {
      // Match by repository name
      if (repo.name.toLowerCase().includes(normalizedQuery)) {
        return true;
      }

      // Match by repository path
      if (repo.path.toLowerCase().includes(normalizedQuery)) {
        return true;
      }

      // Match by workspace name (any workspace belonging to this repository)
      const hasMatchingWorkspace = workspaces.some(
        (workspace) =>
          workspace.repositoryId === repo.id &&
          workspace.name.toLowerCase().includes(normalizedQuery)
      );

      return hasMatchingWorkspace;
    });
  }, [repositories, searchQuery, workspaces]);
}
