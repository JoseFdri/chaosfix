import { useMemo, useCallback } from "react";
import { CollapsiblePath, Select, type SelectOption } from "../atoms";
import { TrashIcon } from "../../icons";

export interface GeneralSettingsTabProps {
  repositoryPath: string;
  workspacesPath: string;
  branches: string[];
  remotes: string[];
  selectedBranch: string;
  selectedRemote: string;
  onBranchChange: (branch: string) => void;
  onRemoteChange: (remote: string) => void;
  onRemoveClick?: () => void;
}

export function GeneralSettingsTab({
  repositoryPath,
  workspacesPath,
  branches,
  remotes,
  selectedBranch,
  selectedRemote,
  onBranchChange,
  onRemoteChange,
  onRemoveClick,
}: GeneralSettingsTabProps): React.JSX.Element {
  const branchOptions: SelectOption[] = useMemo(
    () => branches.map((branch) => ({ value: branch, label: branch })),
    [branches]
  );

  const remoteOptions: SelectOption[] = useMemo(
    () => remotes.map((remote) => ({ value: remote, label: remote })),
    [remotes]
  );

  const handleRemoveClick = useCallback(() => {
    onRemoveClick?.();
  }, [onRemoveClick]);

  return (
    <div className="flex flex-col gap-4">
      <CollapsiblePath label="Root path:" path={repositoryPath} maxWidth={300} />

      <CollapsiblePath label="Workspaces:" path={workspacesPath} maxWidth={300} />

      <div className="border-t border-border-subtle my-2" />

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-text-primary">Branch new workspaces from</span>
        <p className="text-xs text-text-secondary">
          New workspaces will be created from this branch.
        </p>
        <Select
          value={selectedBranch}
          onValueChange={onBranchChange}
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
          onValueChange={onRemoteChange}
          options={remoteOptions}
          placeholder="Select remote..."
          disabled={remoteOptions.length === 0}
        />
      </div>

      {onRemoveClick && (
        <>
          <div className="border-t border-border-subtle my-2" />
          <div className="flex justify-start">
            <button
              type="button"
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 transition-colors"
              onClick={handleRemoveClick}
            >
              <TrashIcon className="w-4 h-4" />
              Remove
            </button>
          </div>
        </>
      )}
    </div>
  );
}

GeneralSettingsTab.displayName = "GeneralSettingsTab";
