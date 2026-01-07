import { useState, useCallback, useEffect, useRef, type FormEvent, type ChangeEvent } from "react";
import { isValidGitUrl } from "../libs/url-validation.lib";

export interface CloneProgress {
  stage: string;
  progress: number;
}

export interface UseCloneDialogOptions {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface UseCloneDialogReturn {
  url: string;
  setUrl: (value: string) => void;
  error: string | undefined;
  progress: CloneProgress | null;
  isCloning: boolean;
  handleSubmit: (onClone: (url: string) => Promise<void>) => (e: FormEvent) => Promise<void>;
  handleUrlChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleOpenChange: (isOpen: boolean) => void;
  setProgress: (progress: CloneProgress | null) => void;
  setIsCloning: (value: boolean) => void;
  reset: () => void;
}

export const useCloneDialog = ({
  open = false,
  onOpenChange,
}: UseCloneDialogOptions): UseCloneDialogReturn => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [progress, setProgress] = useState<CloneProgress | null>(null);
  const [isCloning, setIsCloning] = useState(false);
  const wasOpen = useRef(open);

  const reset = useCallback(() => {
    setUrl("");
    setError(undefined);
    setProgress(null);
    setIsCloning(false);
  }, []);

  // Reset state when dialog opens
  useEffect(() => {
    if (open && !wasOpen.current) {
      reset();
    }
    wasOpen.current = open;
  }, [open, reset]);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen && !isCloning) {
        reset();
      }
      onOpenChange?.(isOpen);
    },
    [isCloning, onOpenChange, reset]
  );

  const handleUrlChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setUrl(e.target.value);
      if (error) {
        setError(undefined);
      }
    },
    [error]
  );

  const handleSubmit = useCallback(
    (onClone: (url: string) => Promise<void>): ((e: FormEvent) => Promise<void>) =>
      async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        if (isCloning) {
          return;
        }

        const trimmedUrl = url.trim();

        if (!trimmedUrl) {
          setError("Please enter a repository URL");
          return;
        }

        if (!isValidGitUrl(trimmedUrl)) {
          setError("Please enter a valid git URL (HTTPS or SSH format)");
          return;
        }

        setError(undefined);
        await onClone(trimmedUrl);
      },
    [url, isCloning]
  );

  return {
    url,
    setUrl,
    error,
    progress,
    isCloning,
    handleSubmit,
    handleUrlChange,
    handleOpenChange,
    setProgress,
    setIsCloning,
    reset,
  };
};
