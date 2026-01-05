import { useCallback } from "react";
import { Button, JsonEditor, Switch } from "../atoms";

export interface ConfigurationTabProps {
  config: string;
  isDirty: boolean;
  isSaving: boolean;
  isValid: boolean;
  error: string | null;
  saveToRepo: boolean;
  onConfigChange: (config: string) => void;
  onValidationChange: (isValid: boolean) => void;
  onSaveToRepoChange: (saveToRepo: boolean) => void;
  onSave: () => void;
}

export function ConfigurationTab({
  config,
  isDirty,
  isSaving,
  isValid,
  error,
  saveToRepo,
  onConfigChange,
  onValidationChange,
  onSaveToRepoChange,
  onSave,
}: ConfigurationTabProps): React.JSX.Element {
  const handleValidationChange = useCallback(
    (errors: string[]) => {
      onValidationChange(errors.length === 0);
    },
    [onValidationChange]
  );

  const handleSaveClick = useCallback(() => {
    onSave();
  }, [onSave]);

  const canSave = isDirty && isValid && !isSaving;

  return (
    <div className="bg-surface-subtle/50 rounded-lg border border-border-subtle p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-text-primary">Configuration Editor</span>
          <p className="text-xs text-text-secondary">Edit the JSON configuration below.</p>
        </div>

        <JsonEditor
          value={config}
          onChange={onConfigChange}
          onValidationChange={handleValidationChange}
          height="240px"
        />

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-text-primary">Save location</span>
            <p className="text-xs text-text-secondary">
              {saveToRepo
                ? "Repository — saves as .chaosfix.json"
                : "App storage — not committed to git"}
            </p>
          </div>
          <Switch checked={saveToRepo} onCheckedChange={onSaveToRepoChange} />
        </div>

        {error && (
          <div className="rounded-md bg-red-500/10 border border-red-500/20 px-3 py-2">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs text-text-secondary">
            {isDirty ? "You have unsaved changes" : "No changes to save"}
          </p>
          <Button size="sm" onClick={handleSaveClick} disabled={!canSave}>
            {isSaving ? "Saving..." : "Save Configuration"}
          </Button>
        </div>
      </div>
    </div>
  );
}

ConfigurationTab.displayName = "ConfigurationTab";
