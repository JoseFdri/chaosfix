import { useState, useEffect, useCallback } from "react";

/**
 * Repository API interface for type-safe window access.
 * This mirrors the RepositoryAPI from the desktop app.
 */
interface RepositoryAPI {
  getBranches: (repositoryPath: string) => Promise<{ branches: string[]; currentBranch: string }>;
  getRemotes: (repositoryPath: string) => Promise<{ remotes: string[] }>;
  getWorkspacesPath: (repositoryName: string) => Promise<{ path: string }>;
}

/**
 * Type guard to check if window.repository is available
 */
function hasRepositoryAPI(
  win: Window & typeof globalThis
): win is Window & typeof globalThis & { repository: RepositoryAPI } {
  return (
    "repository" in win &&
    win.repository !== null &&
    typeof win.repository === "object" &&
    "getBranches" in win.repository &&
    "getRemotes" in win.repository &&
    "getWorkspacesPath" in win.repository
  );
}

export interface UseRepositorySettingsOptions {
  repositoryPath: string;
  repositoryName: string;
  initialBranch?: string;
  initialRemote?: string;
}

export interface UseRepositorySettingsReturn {
  // Data
  branches: string[];
  currentBranch: string;
  remotes: string[];
  workspacesPath: string;

  // Loading/Error states
  isLoading: boolean;
  error: string | null;

  // Form state
  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;
  selectedRemote: string;
  setSelectedRemote: (remote: string) => void;

  // Actions
  refetch: () => void;
}

interface RepositoryData {
  branches: string[];
  currentBranch: string;
  remotes: string[];
  workspacesPath: string;
}

const INITIAL_DATA: RepositoryData = {
  branches: [],
  currentBranch: "",
  remotes: [],
  workspacesPath: "",
};

/**
 * Custom hook for managing repository settings data and form state.
 * Fetches branches, remotes, and workspaces path for a repository.
 */
export function useRepositorySettings({
  repositoryPath,
  repositoryName,
  initialBranch = "",
  initialRemote = "",
}: UseRepositorySettingsOptions): UseRepositorySettingsReturn {
  const [data, setData] = useState<RepositoryData>(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state for controlled dropdowns
  const [selectedBranch, setSelectedBranch] = useState(initialBranch);
  const [selectedRemote, setSelectedRemote] = useState(initialRemote);

  const fetchRepositoryData = useCallback(async () => {
    // Check if repository API is available (only in desktop app context)
    if (typeof window === "undefined" || !hasRepositoryAPI(window)) {
      setError("Repository API not available");
      setIsLoading(false);
      return;
    }

    if (!repositoryPath || !repositoryName) {
      setError("Repository path and name are required");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const repositoryAPI = window.repository;

    try {
      const [branchesResult, remotesResult, workspacesPathResult] = await Promise.all([
        repositoryAPI.getBranches(repositoryPath),
        repositoryAPI.getRemotes(repositoryPath),
        repositoryAPI.getWorkspacesPath(repositoryName),
      ]);

      const newData: RepositoryData = {
        branches: branchesResult.branches,
        currentBranch: branchesResult.currentBranch,
        remotes: remotesResult.remotes,
        workspacesPath: workspacesPathResult.path,
      };

      setData(newData);

      // Initialize selected values from fetched data if not already set
      if (!selectedBranch && branchesResult.currentBranch) {
        setSelectedBranch(branchesResult.currentBranch);
      }
      const firstRemote = remotesResult.remotes[0];
      if (!selectedRemote && firstRemote) {
        setSelectedRemote(firstRemote);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch repository data";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [repositoryPath, repositoryName, selectedBranch, selectedRemote]);

  // Fetch data when repository path changes
  useEffect(() => {
    fetchRepositoryData();
  }, [fetchRepositoryData]);

  // Memoized setters for form state
  const handleSetSelectedBranch = useCallback((branch: string) => {
    setSelectedBranch(branch);
  }, []);

  const handleSetSelectedRemote = useCallback((remote: string) => {
    setSelectedRemote(remote);
  }, []);

  return {
    // Data
    branches: data.branches,
    currentBranch: data.currentBranch,
    remotes: data.remotes,
    workspacesPath: data.workspacesPath,

    // Loading/Error states
    isLoading,
    error,

    // Form state
    selectedBranch,
    setSelectedBranch: handleSetSelectedBranch,
    selectedRemote,
    setSelectedRemote: handleSetSelectedRemote,

    // Actions
    refetch: fetchRepositoryData,
  };
}
