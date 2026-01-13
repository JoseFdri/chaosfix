import { useCallback } from "react";

/**
 * Options for the useAppHandlers hook.
 */
export interface UseAppHandlersOptions {
  /** Callback when "New workspace" is clicked, receives repo info */
  onNewWorkspace?: (repoId: string, repoName: string, repoPath: string) => void;
  /** Callback when "Clone from URL" is clicked */
  onCloneFromUrl?: () => void;
}

export interface UseAppHandlersReturn {
  handleNewWorkspace: (repoId: string, repoName: string, repoPath: string) => void;
  handleCloneFromUrl: () => void;
}

export function useAppHandlers(options: UseAppHandlersOptions = {}): UseAppHandlersReturn {
  const { onNewWorkspace, onCloneFromUrl } = options;

  const handleNewWorkspace = useCallback(
    (repoId: string, repoName: string, repoPath: string): void => {
      onNewWorkspace?.(repoId, repoName, repoPath);
    },
    [onNewWorkspace]
  );

  const handleCloneFromUrl = useCallback((): void => {
    onCloneFromUrl?.();
  }, [onCloneFromUrl]);

  return {
    handleNewWorkspace,
    handleCloneFromUrl,
  };
}
