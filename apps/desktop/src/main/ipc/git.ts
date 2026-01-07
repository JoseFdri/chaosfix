import { ipcMain, type BrowserWindow } from "electron";
import * as fs from "fs/promises";
import * as os from "os";
import * as path from "path";
import { GIT_IPC_CHANNELS } from "@chaosfix/core";
import { GitService, type CloneProgress } from "@chaosfix/workspace-manager";

const REPOS_BASE_DIR = "chaosfix";
const REPOS_SUBDIR = "repos";

export interface GitIPCDependencies {
  getMainWindow: () => BrowserWindow | null;
}

interface CloneRequest {
  url: string;
  destinationPath: string;
}

interface CloneResult {
  success: boolean;
  path: string;
  repoName: string;
  defaultBranch: string;
  error?: string;
}

/**
 * Extract repository name from a git URL (HTTPS or SSH format)
 */
function extractRepoNameFromUrl(url: string): string {
  // Remove trailing .git if present
  const cleanUrl = url.replace(/\.git$/, "");

  // Handle SSH format: git@github.com:user/repo
  const sshMatch = cleanUrl.match(/[:/]([^/]+)$/);
  if (sshMatch && sshMatch[1]) {
    return sshMatch[1];
  }

  // Handle HTTPS format: https://github.com/user/repo
  const httpsMatch = cleanUrl.match(/\/([^/]+)$/);
  if (httpsMatch && httpsMatch[1]) {
    return httpsMatch[1];
  }

  // Fallback: return the last segment
  return cleanUrl.split("/").pop() || "repository";
}

export function setupGitIPC(deps: GitIPCDependencies): void {
  ipcMain.handle(
    GIT_IPC_CHANNELS.CLONE,
    async (_event, request: CloneRequest): Promise<CloneResult> => {
      const { url, destinationPath } = request;

      // Determine the actual destination path
      let finalDestination = destinationPath;

      // If no destination provided, create in default repos directory
      if (!destinationPath) {
        const repoName = extractRepoNameFromUrl(url);
        const homeDir = os.homedir();
        const reposDir = path.join(homeDir, REPOS_BASE_DIR, REPOS_SUBDIR);

        // Create the repos directory if it doesn't exist
        await fs.mkdir(reposDir, { recursive: true });

        finalDestination = path.join(reposDir, repoName);
      }

      // Create progress callback that streams to renderer
      const onProgress = (progress: CloneProgress): void => {
        const mainWindow = deps.getMainWindow();
        if (mainWindow) {
          mainWindow.webContents.send(GIT_IPC_CHANNELS.CLONE_PROGRESS, progress);
        }
      };

      const result = await GitService.clone(url, finalDestination, onProgress);

      if (!result.success) {
        return {
          success: false,
          path: "",
          repoName: "",
          defaultBranch: "",
          error: result.error.message,
        };
      }

      return {
        success: true,
        path: result.data.path,
        repoName: result.data.repoName,
        defaultBranch: result.data.defaultBranch,
      };
    }
  );
}
