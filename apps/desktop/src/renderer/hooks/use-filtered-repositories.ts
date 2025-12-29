import { useMemo } from "react";
import type { Repository } from "@chaosfix/core";

export interface UseFilteredRepositoriesOptions {
  repositories: Repository[];
  searchQuery: string;
}

export function useFilteredRepositories({
  repositories,
  searchQuery,
}: UseFilteredRepositoriesOptions): Repository[] {
  return useMemo(() => {
    if (!searchQuery.trim()) {
      return repositories;
    }

    const normalizedQuery = searchQuery.toLowerCase();
    return repositories.filter((repo) => repo.name.toLowerCase().includes(normalizedQuery));
  }, [repositories, searchQuery]);
}
