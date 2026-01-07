import { forwardRef, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Input,
  Button,
  type DialogProps,
} from "../atoms";
import { cn } from "../../libs/cn.lib";
import {
  useCloneDialog,
  type CloneProgress,
  type CloneDialogData,
} from "../../hooks/useCloneDialog.hook";
import { FolderIcon } from "../../icons";

export interface CloneDialogProps extends Omit<DialogProps, "children"> {
  onClone: (data: CloneDialogData) => Promise<void>;
  onSelectDirectory?: () => Promise<string | null>;
  progress?: CloneProgress | null;
  isCloning?: boolean;
  className?: string;
}

export const CloneDialog = forwardRef<HTMLInputElement, CloneDialogProps>(
  (
    {
      onClone,
      onSelectDirectory,
      progress: externalProgress,
      isCloning: externalIsCloning,
      className,
      open,
      onOpenChange,
      ...props
    },
    ref
  ) => {
    const {
      url,
      destinationPath,
      setDestinationPath,
      error,
      progress: internalProgress,
      isCloning: internalIsCloning,
      handleSubmit,
      handleUrlChange,
      handleDestinationChange,
      handleOpenChange,
      setProgress,
      setIsCloning,
    } = useCloneDialog({ open, onOpenChange });

    const handleBrowseDirectory = useCallback(async () => {
      if (!onSelectDirectory) {
        return;
      }
      const selectedPath = await onSelectDirectory();
      if (selectedPath) {
        setDestinationPath(selectedPath);
      }
    }, [onSelectDirectory, setDestinationPath]);

    // Use external progress/isCloning if provided, otherwise use internal state
    const progress = externalProgress !== undefined ? externalProgress : internalProgress;
    const isCloning = externalIsCloning !== undefined ? externalIsCloning : internalIsCloning;

    // Sync external state changes to internal state
    useMemo(() => {
      if (externalProgress !== undefined) {
        setProgress(externalProgress);
      }
    }, [externalProgress, setProgress]);

    useMemo(() => {
      if (externalIsCloning !== undefined) {
        setIsCloning(externalIsCloning);
      }
    }, [externalIsCloning, setIsCloning]);

    const onSubmit = useMemo(() => handleSubmit(onClone), [handleSubmit, onClone]);

    const handleDialogOpenChange = useCallback(
      (isOpen: boolean) => {
        if (!isCloning) {
          handleOpenChange(isOpen);
        }
      },
      [isCloning, handleOpenChange]
    );

    const isSubmitDisabled = isCloning || !url.trim();

    return (
      <Dialog open={open} onOpenChange={handleDialogOpenChange} {...props}>
        <DialogContent
          className={cn(className)}
          showCloseButton={!isCloning}
          onPointerDownOutside={(e) => {
            if (isCloning) {
              e.preventDefault();
            }
          }}
          onEscapeKeyDown={(e) => {
            if (isCloning) {
              e.preventDefault();
            }
          }}
        >
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle>Clone Repository</DialogTitle>
              <DialogDescription>Enter the repository URL to clone</DialogDescription>
            </DialogHeader>

            <Input
              ref={ref}
              label="Repository URL"
              placeholder="https://github.com/user/repo.git"
              value={url}
              onChange={handleUrlChange}
              error={error}
              disabled={isCloning}
              autoFocus
            />

            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Destination Directory
                <span className="ml-1 text-text-muted">(optional)</span>
              </label>
              <div className="flex gap-2">
                <div className="min-w-0 flex-1">
                  <Input
                    placeholder="Default: ~/.chaosfix/repos"
                    value={destinationPath}
                    onChange={handleDestinationChange}
                    disabled={isCloning}
                  />
                </div>
                {onSelectDirectory && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleBrowseDirectory}
                    disabled={isCloning}
                    className="shrink-0"
                  >
                    <FolderIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {isCloning && progress && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">{progress.stage}</span>
                  <span className="text-text-muted">{Math.round(progress.progress)}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-secondary">
                  <div
                    className="h-full bg-brand-primary transition-all duration-300 ease-out"
                    style={{ width: `${progress.progress}%` }}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleDialogOpenChange(false)}
                disabled={isCloning}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitDisabled}>
                {isCloning ? "Cloning..." : "Clone"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
);

CloneDialog.displayName = "CloneDialog";
