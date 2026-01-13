import { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  type DialogProps,
} from "../atoms";
import { ConfirmDialog } from "./ConfirmDialog.molecule";
import { GeneralSettingsTab } from "./GeneralSettingsTab.molecule";
import { ConfigurationTab } from "./ConfigurationTab.molecule";
import { useRepositorySettings } from "../../hooks/useRepositorySettings.hook";
import { useRepositoryConfig } from "../../hooks/useRepositoryConfig.hook";
import { cn } from "../../libs/cn.lib";

export interface RepositorySettingsDialogProps extends Omit<DialogProps, "children"> {
  repository: {
    id: string;
    name: string;
    path: string;
    branchFrom?: string;
    defaultRemote?: string;
    saveConfigToRepo?: boolean;
  };
  onSettingsChange?: (
    id: string,
    updates: { branchFrom?: string; defaultRemote?: string; saveConfigToRepo?: boolean }
  ) => void;
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
  const [saveToRepo, setSaveToRepo] = useState(repository.saveConfigToRepo ?? true);

  const {
    branches,
    remotes,
    workspacesPath,
    isLoading: isLoadingSettings,
    error: settingsError,
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

  const {
    config,
    isLoading: isLoadingConfig,
    error: configError,
    isDirty,
    isSaving,
    isValid,
    save,
    setConfig,
    setIsValid,
  } = useRepositoryConfig({
    repositoryId: repository.id,
    repositoryPath: repository.path,
    open: open ?? false,
    saveToRepo,
  });

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

  const handleSaveToRepoChange = useCallback(
    (value: boolean) => {
      setSaveToRepo(value);
      onSettingsChange?.(repository.id, { saveConfigToRepo: value });
    },
    [onSettingsChange, repository.id]
  );

  const handleRemoveConfirm = useCallback(() => {
    setShowRemoveConfirm(false);
    onOpenChange?.(false);
    onRemove?.();
  }, [onOpenChange, onRemove]);

  const handleSave = useCallback(() => {
    void save();
  }, [save]);

  const isLoading = isLoadingSettings || isLoadingConfig;
  const error = settingsError || configError;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} {...props}>
      <DialogContent className={cn("max-w-3xl h-[600px] flex flex-col", className)} showCloseButton>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{repository.name}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center text-sm text-text-secondary">Loading settings...</div>
        ) : error && !configError ? (
          <div className="py-8 text-center text-sm text-status-error">{error}</div>
        ) : (
          <Tabs defaultValue="general" className="w-full flex-1 flex flex-col min-h-0">
            <TabsList className="w-full flex-shrink-0">
              <TabsTrigger value="general" className="flex-1">
                General
              </TabsTrigger>
              <TabsTrigger value="configuration" className="flex-1">
                Configuration
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="flex-1 overflow-y-auto">
              <GeneralSettingsTab
                repositoryPath={repository.path}
                workspacesPath={workspacesPath}
                branches={branches}
                remotes={remotes}
                selectedBranch={selectedBranch}
                selectedRemote={selectedRemote}
                onBranchChange={handleBranchChange}
                onRemoteChange={handleRemoteChange}
                onRemoveClick={onRemove ? (): void => setShowRemoveConfirm(true) : undefined}
              />
            </TabsContent>

            <TabsContent value="configuration" className="flex-1 overflow-y-auto">
              <ConfigurationTab
                config={config}
                isDirty={isDirty}
                isSaving={isSaving}
                isValid={isValid}
                error={configError}
                saveToRepo={saveToRepo}
                onConfigChange={setConfig}
                onValidationChange={setIsValid}
                onSaveToRepoChange={handleSaveToRepoChange}
                onSave={handleSave}
              />
            </TabsContent>
          </Tabs>
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
