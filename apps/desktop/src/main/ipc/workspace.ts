import { ipcMain, type BrowserWindow } from "electron";
import * as os from "os";
import * as path from "path";
import { WORKSPACE_IPC_CHANNELS } from "@chaosfix/core";
import { GitService, WorktreeManager } from "@chaosfix/workspace-manager";

import type {
  ValidateRepoResult,
  CreateWorkspaceOptions,
  CreateWorkspaceResult,
  RemoveWorkspaceOptions,
  RemoveWorkspaceResult,
} from "../../types/workspace.types";
import {
  PATH_SEGMENT_REGEX,
  MAX_NAME_LENGTH,
  WORKSPACE_BASE_DIR,
  WORKSPACE_SUBDIR,
  WORKSPACE_ERRORS,
} from "../../constants/workspace.constants";

export interface WorkspaceIPCDependencies {
  getMainWindow: () => BrowserWindow | null;
}

function isValidPathSegment(name: string): boolean {
  return PATH_SEGMENT_REGEX.test(name) && name.length > 0 && name.length <= MAX_NAME_LENGTH;
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
      const { repositoryPath, repositoryName, workspaceName } = options;

      if (!isValidPathSegment(repositoryName)) {
        throw new Error(WORKSPACE_ERRORS.INVALID_REPOSITORY_NAME);
      }

      if (!isValidPathSegment(workspaceName)) {
        throw new Error(WORKSPACE_ERRORS.INVALID_WORKSPACE_NAME);
      }

      const homeDir = os.homedir();
      const worktreePath = path.join(
        homeDir,
        WORKSPACE_BASE_DIR,
        WORKSPACE_SUBDIR,
        repositoryName,
        workspaceName
      );

      const worktreeManager = new WorktreeManager(repositoryPath);
      const result = await worktreeManager.create({
        repositoryPath,
        worktreePath,
        branchName: workspaceName,
        createBranch: true,
      });

      if (!result.success) {
        throw new Error(result.error.message);
      }

      return {
        worktreePath: result.data.path,
        branch: result.data.branch,
      };
    }
  );

  ipcMain.handle(
    WORKSPACE_IPC_CHANNELS.REMOVE,
    async (_event, options: RemoveWorkspaceOptions): Promise<RemoveWorkspaceResult> => {
      const { repositoryPath, worktreePath, branchName, force = false } = options;

      try {
        const worktreeManager = new WorktreeManager(repositoryPath);
        const result = await worktreeManager.remove({
          repositoryPath,
          worktreePath,
          branchName,
          force,
        });

        if (!result.success) {
          return {
            success: false,
            error: result.error.message,
          };
        }

        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to remove workspace",
        };
      }
    }
  );
}
