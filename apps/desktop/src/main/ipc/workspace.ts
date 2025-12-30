import { ipcMain, type BrowserWindow } from "electron";
import { WORKSPACE_IPC_CHANNELS } from "@chaosfix/core";
import { GitService } from "@chaosfix/workspace-manager";

export interface WorkspaceIPCDependencies {
  getMainWindow: () => BrowserWindow | null;
}

interface ValidateRepoResult {
  isValid: boolean;
  defaultBranch?: string;
  error?: string;
}

interface CreateWorkspaceOptions {
  repoPath: string;
  branch: string;
}

interface CreateWorkspaceResult {
  worktreePath: string;
  branch: string;
}

export function setupWorkspaceIPC(_deps: WorkspaceIPCDependencies): void {
  ipcMain.handle(
    WORKSPACE_IPC_CHANNELS.VALIDATE_REPO,
    async (_event, repoPath: string): Promise<ValidateRepoResult> => {
      const gitService = new GitService(repoPath);

      const isValid = await gitService.isRepository();
      if (!isValid) {
        return {
          isValid: false,
          error: "The selected directory is not a valid Git repository",
        };
      }

      const repoInfoResult = await gitService.getRepositoryInfo();
      if (!repoInfoResult.success) {
        return {
          isValid: false,
          error: repoInfoResult.error.message,
        };
      }

      return {
        isValid: true,
        defaultBranch: repoInfoResult.data.defaultBranch,
      };
    }
  );

  ipcMain.handle(
    WORKSPACE_IPC_CHANNELS.CREATE,
    async (_event, options: CreateWorkspaceOptions): Promise<CreateWorkspaceResult> => {
      // For now, just return the repo path as worktree path
      // Full worktree support comes in a later phase
      return {
        worktreePath: options.repoPath,
        branch: options.branch,
      };
    }
  );
}
