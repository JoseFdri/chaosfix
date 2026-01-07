import simpleGit, { SimpleGit } from "simple-git";
import { ok, err } from "@chaosfix/core";

import type {
  GitResult,
  BranchInfo,
  RepositoryInfo,
  CloneProgress,
  CloneData,
} from "../types/git.types";
import type { WorktreeInfo } from "../types/worktree.types";
import { GitError } from "../types/git.types";
import { parseWorktreeOutput } from "../libs/worktree-parser.lib";

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

/**
 * GitService provides high-level git operations
 */
export class GitService {
  private git: SimpleGit;
  private repoPath: string;

  constructor(repoPath: string) {
    this.repoPath = repoPath;
    this.git = simpleGit(repoPath);
  }

  /**
   * Clone a repository from a URL to a destination path
   * This is a static method since the repository doesn't exist yet
   */
  static async clone(
    url: string,
    destinationPath: string,
    onProgress?: (progress: CloneProgress) => void
  ): Promise<GitResult<CloneData>> {
    try {
      const git = simpleGit({
        progress({ stage, progress, processed, total }) {
          if (onProgress) {
            onProgress({
              stage: stage || "unknown",
              progress: progress || 0,
              processed: processed || 0,
              total: total || 0,
            });
          }
        },
      });

      await git.clone(url, destinationPath, ["--progress"]);

      const repoName = extractRepoNameFromUrl(url);

      // Create a GitService instance to get the default branch
      const gitService = new GitService(destinationPath);
      const branchResult = await gitService.getBranches();

      let defaultBranch = "main";
      if (branchResult.success) {
        const mainBranch = branchResult.data.find((b) => b.name === "main" || b.name === "master");
        if (mainBranch) {
          defaultBranch = mainBranch.name;
        } else if (branchResult.data.length > 0) {
          const currentBranch = branchResult.data.find((b) => b.current);
          if (currentBranch) {
            defaultBranch = currentBranch.name;
          } else {
            const firstBranch = branchResult.data[0];
            if (firstBranch) {
              defaultBranch = firstBranch.name;
            }
          }
        }
      }

      return ok({
        path: destinationPath,
        repoName,
        defaultBranch,
      });
    } catch (error) {
      return err(new GitError(`Failed to clone repository: ${error}`));
    }
  }

  /**
   * Check if the path is a valid git repository
   */
  async isRepository(): Promise<boolean> {
    try {
      await this.git.revparse(["--git-dir"]);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get repository information
   */
  async getRepositoryInfo(): Promise<GitResult<RepositoryInfo>> {
    try {
      const [branchSummary, remoteSummary, worktrees] = await Promise.all([
        this.git.branch(),
        this.git.getRemotes(true),
        this.listWorktrees(),
      ]);

      const name = this.repoPath.split("/").pop() || "unknown";
      const defaultBranch = branchSummary.all.includes("main") ? "main" : "master";

      return ok({
        path: this.repoPath,
        name,
        defaultBranch,
        currentBranch: branchSummary.current,
        remotes: remoteSummary.map((r) => r.name),
        worktrees: worktrees.success ? worktrees.data : [],
      });
    } catch (error) {
      return err(new GitError(`Failed to get repository info: ${error}`));
    }
  }

  /**
   * Get list of branches
   */
  async getBranches(): Promise<GitResult<BranchInfo[]>> {
    try {
      const branchSummary = await this.git.branch(["-a", "-v"]);
      const branches: BranchInfo[] = [];

      for (const [name, data] of Object.entries(branchSummary.branches)) {
        branches.push({
          name,
          current: data.current,
          commit: data.commit,
          tracking: data.label.includes("[") ? data.label.match(/\[(.*?)\]/)?.[1] : undefined,
        });
      }

      return ok(branches);
    } catch (error) {
      return err(new GitError(`Failed to get branches: ${error}`));
    }
  }

  /**
   * Create a new branch
   */
  async createBranch(branchName: string, baseBranch?: string): Promise<GitResult<void>> {
    try {
      if (baseBranch) {
        await this.git.checkoutBranch(branchName, baseBranch);
      } else {
        await this.git.checkoutLocalBranch(branchName);
      }
      return ok(undefined);
    } catch (error) {
      return err(new GitError(`Failed to create branch: ${error}`));
    }
  }

  /**
   * Delete a branch
   */
  async deleteBranch(branchName: string, force = false): Promise<GitResult<void>> {
    try {
      await this.git.deleteLocalBranch(branchName, force);
      return ok(undefined);
    } catch (error) {
      return err(new GitError(`Failed to delete branch: ${error}`));
    }
  }

  /**
   * Get current branch name
   */
  async getCurrentBranch(): Promise<GitResult<string>> {
    try {
      const branchSummary = await this.git.branch();
      return ok(branchSummary.current);
    } catch (error) {
      return err(new GitError(`Failed to get current branch: ${error}`));
    }
  }

  /**
   * List all worktrees
   */
  async listWorktrees(): Promise<GitResult<WorktreeInfo[]>> {
    try {
      const result = await this.git.raw(["worktree", "list", "--porcelain"]);
      const worktrees = parseWorktreeOutput(result, this.repoPath);
      return ok(worktrees);
    } catch (error) {
      return err(new GitError(`Failed to list worktrees: ${error}`));
    }
  }

  /**
   * Get the status of the repository
   */
  async getStatus(): Promise<
    GitResult<{ modified: string[]; staged: string[]; untracked: string[] }>
  > {
    try {
      const status = await this.git.status();
      return ok({
        modified: status.modified,
        staged: status.staged,
        untracked: status.not_added,
      });
    } catch (error) {
      return err(new GitError(`Failed to get status: ${error}`));
    }
  }
}
