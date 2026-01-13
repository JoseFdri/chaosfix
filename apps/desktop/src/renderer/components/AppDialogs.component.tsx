import { type FC, type ReactNode } from "react";
import { InputDialog, ConfirmDialog, RepositorySettingsDialog, CloneDialog } from "@chaosfix/ui";
import type { Repository } from "@chaosfix/core";
import type { CloneProgress } from "../../types";
import type { CloneData } from "../hooks/useCloneRepository.hook";
import { WORKSPACE_DIALOG, REMOVE_WORKSPACE_DIALOG } from "../../constants";

/**
 * Props for create workspace dialog state.
 */
interface CreateWorkspaceDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  pendingRepositoryName: string | null;
  defaultWorkspaceName: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (workspaceName: string) => Promise<void>;
  onCancel: () => void;
}

/**
 * Props for remove workspace dialog state.
 */
interface RemoveWorkspaceDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

/**
 * Props for repository settings dialog state.
 */
interface RepositorySettingsDialogState {
  activeRepoId: string | null;
  activeRepo: Repository | null;
  onOpenChange: (open: boolean) => void;
  onSettingsChange: (
    id: string,
    updates: { branchFrom?: string; defaultRemote?: string; saveConfigToRepo?: boolean }
  ) => void;
  onRemove: () => void;
}

/**
 * Props for clone dialog state.
 */
interface CloneDialogState {
  isOpen: boolean;
  isCloning: boolean;
  progress: CloneProgress | null;
  onOpenChange: (open: boolean) => void;
  onClone: (data: CloneData) => Promise<void>;
  onSelectDirectory: () => Promise<string | null>;
}

/**
 * Props for the AppDialogs component.
 * All dialog states and handlers are passed as props - state management stays in hooks.
 */
export interface AppDialogsProps {
  createWorkspace: CreateWorkspaceDialogProps;
  removeWorkspace: RemoveWorkspaceDialogProps;
  repositorySettings: RepositorySettingsDialogState;
  clone: CloneDialogState;
}

/**
 * Renders the create workspace input dialog.
 */
function CreateWorkspaceDialog({
  isOpen,
  isLoading,
  pendingRepositoryName,
  defaultWorkspaceName,
  onOpenChange,
  onSubmit,
  onCancel,
}: CreateWorkspaceDialogProps): ReactNode {
  return (
    <InputDialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          onCancel();
        }
        onOpenChange(open);
      }}
      title={`${WORKSPACE_DIALOG.TITLE_PREFIX} ${pendingRepositoryName ?? WORKSPACE_DIALOG.TITLE_FALLBACK}`}
      description={WORKSPACE_DIALOG.DESCRIPTION}
      inputLabel={WORKSPACE_DIALOG.INPUT_LABEL}
      inputPlaceholder={WORKSPACE_DIALOG.INPUT_PLACEHOLDER}
      inputDefaultValue={defaultWorkspaceName}
      submitLabel={WORKSPACE_DIALOG.SUBMIT_LABEL}
      cancelLabel={WORKSPACE_DIALOG.CANCEL_LABEL}
      isLoading={isLoading}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
}

/**
 * Renders the remove workspace confirmation dialog.
 */
function RemoveWorkspaceDialog({
  isOpen,
  isLoading,
  onOpenChange,
  onConfirm,
  onCancel,
}: RemoveWorkspaceDialogProps): ReactNode {
  return (
    <ConfirmDialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          onCancel();
        }
        onOpenChange(open);
      }}
      title={REMOVE_WORKSPACE_DIALOG.TITLE}
      description={REMOVE_WORKSPACE_DIALOG.DESCRIPTION}
      confirmLabel={REMOVE_WORKSPACE_DIALOG.CONFIRM_LABEL}
      cancelLabel={REMOVE_WORKSPACE_DIALOG.CANCEL_LABEL}
      isLoading={isLoading}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}

/**
 * Renders the repository settings dialog.
 */
function RepositorySettingsDialogWrapper({
  activeRepoId,
  activeRepo,
  onOpenChange,
  onSettingsChange,
  onRemove,
}: RepositorySettingsDialogState): ReactNode {
  if (!activeRepo) {
    return null;
  }

  return (
    <RepositorySettingsDialog
      open={activeRepoId !== null}
      onOpenChange={(open: boolean) => {
        if (!open) {
          onOpenChange(false);
        }
      }}
      repository={{
        id: activeRepo.id,
        name: activeRepo.name,
        path: activeRepo.path,
        branchFrom: activeRepo.branchFrom,
        defaultRemote: activeRepo.defaultRemote,
        saveConfigToRepo: activeRepo.saveConfigToRepo,
      }}
      onSettingsChange={onSettingsChange}
      onRemove={onRemove}
    />
  );
}

/**
 * Renders the clone repository dialog.
 */
function CloneRepositoryDialog({
  isOpen,
  isCloning,
  progress,
  onOpenChange,
  onClone,
  onSelectDirectory,
}: CloneDialogState): ReactNode {
  return (
    <CloneDialog
      open={isOpen}
      onOpenChange={onOpenChange}
      onClone={onClone}
      onSelectDirectory={onSelectDirectory}
      progress={progress}
      isCloning={isCloning}
    />
  );
}

/**
 * AppDialogs renders all application dialogs as a single component.
 *
 * This component is purely presentational - all dialog state and handlers
 * are passed as props from hooks in the parent component.
 *
 * Dialogs included:
 * - InputDialog for workspace creation
 * - ConfirmDialog for workspace removal
 * - RepositorySettingsDialog for repository settings
 * - CloneDialog for cloning repositories
 */
export const AppDialogs: FC<AppDialogsProps> = ({
  createWorkspace,
  removeWorkspace,
  repositorySettings,
  clone,
}) => {
  return (
    <>
      <CreateWorkspaceDialog {...createWorkspace} />
      <RemoveWorkspaceDialog {...removeWorkspace} />
      <RepositorySettingsDialogWrapper {...repositorySettings} />
      <CloneRepositoryDialog {...clone} />
    </>
  );
};
