import { useState, useCallback, useEffect } from "react";
import type { CloneResult, CloneProgress } from "../../types";

export interface CloneData {
  url: string;
  destinationPath?: string;
}

export interface UseCloneRepositoryOptions {
  onSuccess: (result: CloneResult) => void;
  onError: (error: string) => void;
}

export interface UseCloneRepositoryReturn {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  progress: CloneProgress | null;
  isCloning: boolean;
  handleClone: (data: CloneData) => Promise<void>;
  handleSelectDirectory: () => Promise<string | null>;
}

export function useCloneRepository({
  onSuccess,
  onError,
}: UseCloneRepositoryOptions): UseCloneRepositoryReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState<CloneProgress | null>(null);
  const [isCloning, setIsCloning] = useState(false);

  // Set up progress listener on mount
  useEffect(() => {
    const cleanup = window.git.onCloneProgress((_event, cloneProgress) => {
      setProgress(cloneProgress);
    });

    return cleanup;
  }, []);

  const handleClone = useCallback(
    async (data: CloneData): Promise<void> => {
      setIsCloning(true);
      setProgress(null);

      try {
        const result = await window.git.clone({
          url: data.url,
          destinationPath: data.destinationPath,
        });

        if (result.success) {
          onSuccess(result);
          setIsOpen(false);
        } else {
          onError(result.error ?? "Clone failed");
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        onError(errorMessage);
      } finally {
        setIsCloning(false);
        setProgress(null);
      }
    },
    [onSuccess, onError]
  );

  const handleSelectDirectory = useCallback(async (): Promise<string | null> => {
    const result = await window.dialog.selectDirectory();
    return result?.path ?? null;
  }, []);

  return {
    isOpen,
    setIsOpen,
    progress,
    isCloning,
    handleClone,
    handleSelectDirectory,
  };
}
