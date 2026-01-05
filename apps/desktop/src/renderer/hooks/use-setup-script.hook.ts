import { useState, useCallback } from "react";

import type { WorkspaceStatus } from "@chaosfix/core";

/**
 * Options for the useSetupScript hook.
 */
export interface UseSetupScriptOptions {
  /** Action to update workspace status */
  updateWorkspaceStatus: (workspaceId: string, status: WorkspaceStatus) => void;
  /** Optional callback when setup fails */
  onError?: (workspaceId: string, error: string) => void;
  /** Optional callback when setup succeeds */
  onSuccess?: (workspaceId: string) => void;
}

/**
 * Return type for the useSetupScript hook.
 */
export interface UseSetupScriptReturn {
  /** Runs the setup script for a workspace */
  runSetup: (workspaceId: string, worktreePath: string, repositoryPath: string) => Promise<void>;
  /** Whether a setup script is currently running */
  isRunning: boolean;
  /** Current error message, if any */
  error: string | null;
}

/**
 * Hook for running setup scripts when creating workspaces.
 *
 * Handles:
 * - Loading repository configuration
 * - Checking for setupScript in workspaceDefaults
 * - Updating workspace status during setup
 * - Running the setup script via IPC
 * - Error handling and status updates
 */
export function useSetupScript({
  updateWorkspaceStatus,
  onError,
  onSuccess,
}: UseSetupScriptOptions): UseSetupScriptReturn {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSetup = useCallback(
    async (workspaceId: string, worktreePath: string, repositoryPath: string): Promise<void> => {
      setError(null);

      try {
        // Load repository configuration
        const configResult = await window.repositoryConfig.load({
          repositoryId: workspaceId,
          repositoryPath,
        });

        const setupScript = configResult.config.workspaceDefaults?.setupScript;

        // If no setup script configured, return early (no-op)
        if (!setupScript) {
          return;
        }

        // Set status to setting_up and mark as running
        setIsRunning(true);
        updateWorkspaceStatus(workspaceId, "setting_up");

        // Run the setup script
        const result = await window.setupScript.run({
          script: setupScript,
          cwd: worktreePath,
          env: configResult.config.workspaceDefaults?.env,
        });

        if (result.success) {
          updateWorkspaceStatus(workspaceId, "active");
          onSuccess?.(workspaceId);
        } else {
          const errorMessage = result.error || "Setup script failed";
          updateWorkspaceStatus(workspaceId, "error");
          setError(errorMessage);
          onError?.(workspaceId, errorMessage);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        updateWorkspaceStatus(workspaceId, "error");
        setError(errorMessage);
        onError?.(workspaceId, errorMessage);
      } finally {
        setIsRunning(false);
      }
    },
    [updateWorkspaceStatus, onError, onSuccess]
  );

  return {
    runSetup,
    isRunning,
    error,
  };
}
