import { useMemo, useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  CollapsiblePath,
  Select,
  type DialogProps,
  type SelectOption,
} from "../atoms";
import { ConfirmDialog } from "./ConfirmDialog.molecule";
import { useRepositorySettings } from "../../hooks/useRepositorySettings.hook";
import { cn } from "../../libs/cn.lib";
import { TrashIcon } from "../../icons";

export interface RepositorySettingsDialogProps extends Omit<DialogProps, "children"> {
  repository: {
    id: string;
    name: string;
    path: string;
    branchFrom?: string;
    defaultRemote?: string;
  };
  onSettingsChange?: (id: string, updates: { branchFrom?: string; defaultRemote?: string }) => void;
  onRemove?: () => void;
  className?: string;
}

export const RepositorySettingsDialog = ({
  repository,
  onSettingsChange,
  onRemove,
  className,
  open,
  onOpenChange,
  ...props
}: RepositorySettingsDialogProps): React.JSX.Element => {
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const {
    branches,
    remotes,
    workspacesPath,
    isLoading,
    error,
    selectedBranch,
    setSelectedBranch,
    selectedRemote,
    setSelectedRemote,
  } = useRepositorySettings({
    repositoryPath: repository.path,
    repositoryName: repository.name,
    initialBranch: repository.branchFrom,
    initialRemote: repository.defaultRemote,
  });

  const branchOptions: SelectOption[] = useMemo(
    () => branches.map((branch: string) => ({ value: branch, label: branch })),
    [branches]
  );

  const remoteOptions: SelectOption[] = useMemo(
    () => remotes.map((remote: string) => ({ value: remote, label: remote })),
    [remotes]
  );

  const handleBranchChange = useCallback(
    (value: string) => {
      setSelectedBranch(value);
      onSettingsChange?.(repository.id, { branchFrom: value });
    },
    [setSelectedBranch, onSettingsChange, repository.id]
  );

  const handleRemoteChange = useCallback(
    (value: string) => {
      setSelectedRemote(value);
      onSettingsChange?.(repository.id, { defaultRemote: value });
    },
    [setSelectedRemote, onSettingsChange, repository.id]
  );

  const handleRemoveConfirm = useCallback(() => {
    setShowRemoveConfirm(false);
    onOpenChange?.(false);
    onRemove?.();
  }, [onOpenChange, onRemove]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} {...props}>
      <DialogContent className={cn("max-w-md", className)} showCloseButton>
        <DialogHeader>
          <DialogTitle>{repository.name}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center text-sm text-text-secondary">Loading settings...</div>
        ) : error ? (
          <div className="py-8 text-center text-sm text-status-error">{error}</div>
        ) : (
          <div className="flex flex-col gap-4 pt-2">
            <CollapsiblePath label="Root path:" path={repository.path} />

            <CollapsiblePath label="Workspaces:" path={workspacesPath} />

            <div className="border-t border-border-subtle my-2" />

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-text-primary">
                Branch new workspaces from
              </span>
              <p className="text-xs text-text-secondary">
                New workspaces will be created from this branch.
              </p>
              <Select
                value={selectedBranch}
                onValueChange={handleBranchChange}
                options={branchOptions}
                placeholder="Select branch..."
                disabled={branchOptions.length === 0}
              />
            </div>

            <div className="border-t border-border-subtle my-2" />

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-text-primary">Remote origin</span>
              <p className="text-xs text-text-secondary">
                The default remote for pushing and pulling changes.
              </p>
              <Select
                value={selectedRemote}
                onValueChange={handleRemoteChange}
                options={remoteOptions}
                placeholder="Select remote..."
                disabled={remoteOptions.length === 0}
              />
            </div>

            {onRemove && (
              <>
                <div className="border-t border-border-subtle my-2" />
                <div className="flex justify-start">
                  <button
                    type="button"
                    className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 transition-colors"
                    onClick={() => setShowRemoveConfirm(true)}
                  >
                    <TrashIcon className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>

      <ConfirmDialog
        open={showRemoveConfirm}
        onOpenChange={setShowRemoveConfirm}
        title="Remove repository?"
        description="This will remove the repository from ChaosFix. Your files and git history will not be deleted."
        variant="destructive"
        confirmLabel="Remove"
        onConfirm={handleRemoveConfirm}
      />
    </Dialog>
  );
};

RepositorySettingsDialog.displayName = "RepositorySettingsDialog";
