import { useCallback } from "react";

/**
 * Options for the useAppHandlers hook.
 */
export interface UseAppHandlersOptions {
  /** Callback when "New workspace" is clicked, receives repo info */
  onNewWorkspace?: (repoId: string, repoName: string, repoPath: string) => void;
}

export interface UseAppHandlersReturn {
  handleNewWorkspace: (repoId: string, repoName: string, repoPath: string) => void;
  handleCloneFromUrl: () => void;
  handleQuickStart: () => void;
}

export function useAppHandlers(options: UseAppHandlersOptions = {}): UseAppHandlersReturn {
  const { onNewWorkspace } = options;

  const handleNewWorkspace = useCallback(
    (repoId: string, repoName: string, repoPath: string): void => {
      onNewWorkspace?.(repoId, repoName, repoPath);
    },
    [onNewWorkspace]
  );

  const handleCloneFromUrl = useCallback((): void => {
    // TODO: Implement clone from URL
  }, []);

  const handleQuickStart = useCallback((): void => {
    // TODO: Implement quick start
  }, []);

  return {
    handleNewWorkspace,
    handleCloneFromUrl,
    handleQuickStart,
  };
}
