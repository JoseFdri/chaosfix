import { ipcMain, type BrowserWindow } from "electron";
import * as os from "os";
import * as path from "path";
import { REPOSITORY_IPC_CHANNELS } from "@chaosfix/core";
import { GitService } from "@chaosfix/workspace-manager";

import type {
  GetBranchesResult,
  GetRemotesResult,
  GetWorkspacesPathResult,
} from "../../types/repository.types";
import { WORKSPACE_BASE_DIR, WORKSPACE_SUBDIR } from "../../constants/workspace.constants";

export interface RepositoryIPCDependencies {
  getMainWindow: () => BrowserWindow | null;
}

export function setupRepositoryIPC(_deps: RepositoryIPCDependencies): void {
  ipcMain.handle(
    REPOSITORY_IPC_CHANNELS.GET_BRANCHES,
    async (_event, repositoryPath: string): Promise<GetBranchesResult> => {
      const gitService = new GitService(repositoryPath);
      const branchesResult = await gitService.getBranches();

      if (!branchesResult.success) {
        throw new Error(branchesResult.error.message);
      }

      const currentBranchResult = await gitService.getCurrentBranch();
      const currentBranch = currentBranchResult.success ? currentBranchResult.data : "";

      return {
        branches: branchesResult.data.map((branch) => branch.name),
        currentBranch,
      };
    }
  );

  ipcMain.handle(
    REPOSITORY_IPC_CHANNELS.GET_REMOTES,
    async (_event, repositoryPath: string): Promise<GetRemotesResult> => {
      const gitService = new GitService(repositoryPath);
      const repoInfoResult = await gitService.getRepositoryInfo();

      if (!repoInfoResult.success) {
        throw new Error(repoInfoResult.error.message);
      }

      return {
        remotes: repoInfoResult.data.remotes,
      };
    }
  );

  ipcMain.handle(
    REPOSITORY_IPC_CHANNELS.GET_WORKSPACES_PATH,
    async (_event, repositoryName: string): Promise<GetWorkspacesPathResult> => {
      const homeDir = os.homedir();
      const workspacesPath = path.join(
        homeDir,
        WORKSPACE_BASE_DIR,
        WORKSPACE_SUBDIR,
        repositoryName
      );

      return {
        path: workspacesPath,
      };
    }
  );
}
