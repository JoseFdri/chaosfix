import { useCallback } from "react";
import { Button, JsonEditor, Switch } from "../atoms";
import { cn } from "../../libs/cn.lib";
import type { ConfigSource } from "../../hooks/useRepositoryConfig.hook";

export interface ConfigurationTabProps {
  config: string;
  source: ConfigSource;
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

const SOURCE_LABELS: Record<ConfigSource, string> = {
  repo: "Repository",
  app: "Application",
  default: "Default",
};

const SOURCE_DESCRIPTIONS: Record<ConfigSource, string> = {
  repo: "Loaded from .chaosfix.json in repository root",
  app: "Loaded from application settings for this repository",
  default: "Using default configuration",
};

export function ConfigurationTab({
  config,
  source,
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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary">Configuration Source</span>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                {
                  "bg-green-500/20 text-green-400": source === "repo",
                  "bg-blue-500/20 text-blue-400": source === "app",
                  "bg-gray-500/20 text-gray-400": source === "default",
                }
              )}
            >
              {SOURCE_LABELS[source]}
            </span>
          </div>
          <p className="text-xs text-text-secondary">{SOURCE_DESCRIPTIONS[source]}</p>
        </div>
      </div>

      <div className="border-t border-border-subtle my-1" />

      <div className="flex items-center justify-between py-2">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-text-primary">Save to repository</span>
          <p className="text-xs text-text-secondary">
            {saveToRepo
              ? "Config will be saved as .chaosfix.json in repository root"
              : "Config will be saved in ChaosFix only (not committed)"}
          </p>
        </div>
        <Switch checked={saveToRepo} onCheckedChange={onSaveToRepoChange} />
      </div>

      <div className="border-t border-border-subtle my-1" />

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-text-primary">Project Configuration</span>
        <p className="text-xs text-text-secondary">Edit the JSON configuration below.</p>
        <JsonEditor
          value={config}
          onChange={onConfigChange}
          onValidationChange={handleValidationChange}
          height="240px"
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-500/10 border border-red-500/20 px-3 py-2">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-text-secondary">
          {isDirty ? "You have unsaved changes" : "No changes to save"}
        </p>
        <Button size="sm" onClick={handleSaveClick} disabled={!canSave}>
          {isSaving ? "Saving..." : "Save Configuration"}
        </Button>
      </div>
    </div>
  );
}

ConfigurationTab.displayName = "ConfigurationTab";
