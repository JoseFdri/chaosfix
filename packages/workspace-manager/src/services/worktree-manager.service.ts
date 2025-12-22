import simpleGit, { SimpleGit } from "simple-git";
import * as path from "path";
import * as fs from "fs/promises";
import { ok, err, createWorkspaceBranchName } from "@chaosfix/core";

import type { GitResult } from "../types/git.types";
import type {
  WorktreeInfo,
  WorktreeCreateOptions,
  WorktreeRemoveOptions,
} from "../types/worktree.types";
import { GitError } from "../types/git.types";
import { parseWorktreeOutput } from "../libs/worktree-parser.lib";

const WORKTREES_DIR = ".chaosfix-worktrees";

/**
 * WorktreeManager handles git worktree operations for workspace isolation
 */
export class WorktreeManager {
  private git: SimpleGit;
  private repoPath: string;
  private worktreesDir: string;

  constructor(repoPath: string) {
    this.repoPath = repoPath;
    this.git = simpleGit(repoPath);
    this.worktreesDir = path.join(path.dirname(repoPath), WORKTREES_DIR, path.basename(repoPath));
  }

  /**
   * Initialize the worktrees directory
   */
  async initialize(): Promise<GitResult<void>> {
    try {
      await fs.mkdir(this.worktreesDir, { recursive: true });
      return ok(undefined);
    } catch (error) {
      return err(new GitError(`Failed to initialize worktrees directory: ${error}`));
    }
  }

  /**
   * Create a new worktree for a workspace
   */
  async create(options: WorktreeCreateOptions): Promise<GitResult<WorktreeInfo>> {
    const { branchName, baseBranch, createBranch = true } = options;

    try {
      // Ensure worktrees directory exists
      await this.initialize();

      const worktreePath = path.join(this.worktreesDir, branchName.replace(/\//g, "-"));

      // Check if worktree already exists
      const exists = await this.exists(worktreePath);
      if (exists) {
        return err(new GitError(`Worktree already exists at ${worktreePath}`));
      }

      // Create the worktree
      if (createBranch) {
        const base = baseBranch || "HEAD";
        await this.git.raw(["worktree", "add", "-b", branchName, worktreePath, base]);
      } else {
        await this.git.raw(["worktree", "add", worktreePath, branchName]);
      }

      // Get commit hash
      const worktreeGit = simpleGit(worktreePath);
      const log = await worktreeGit.log(["-1"]);
      const commit = log.latest?.hash || "";

      return ok({
        path: worktreePath,
        branch: branchName,
        commit,
        isMain: false,
        isBare: false,
      });
    } catch (error) {
      return err(new GitError(`Failed to create worktree: ${error}`));
    }
  }

  /**
   * Remove a worktree
   */
  async remove(options: WorktreeRemoveOptions): Promise<GitResult<void>> {
    const { worktreePath, force = false } = options;

    try {
      const args = ["worktree", "remove"];
      if (force) {
        args.push("--force");
      }
      args.push(worktreePath);

      await this.git.raw(args);
      return ok(undefined);
    } catch (error) {
      return err(new GitError(`Failed to remove worktree: ${error}`));
    }
  }

  /**
   * List all worktrees
   */
  async list(): Promise<GitResult<WorktreeInfo[]>> {
    try {
      const result = await this.git.raw(["worktree", "list", "--porcelain"]);
      const worktrees = parseWorktreeOutput(result, this.repoPath);
      return ok(worktrees);
    } catch (error) {
      return err(new GitError(`Failed to list worktrees: ${error}`));
    }
  }

  /**
   * Check if a worktree exists at the given path
   */
  async exists(worktreePath: string): Promise<boolean> {
    try {
      await fs.access(worktreePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Prune stale worktree entries
   */
  async prune(): Promise<GitResult<void>> {
    try {
      await this.git.raw(["worktree", "prune"]);
      return ok(undefined);
    } catch (error) {
      return err(new GitError(`Failed to prune worktrees: ${error}`));
    }
  }

  /**
   * Create a workspace with auto-generated branch name
   */
  async createWorkspace(
    workspaceName: string,
    baseBranch?: string
  ): Promise<GitResult<WorktreeInfo>> {
    const branchName = createWorkspaceBranchName(workspaceName);
    return this.create({
      repositoryPath: this.repoPath,
      worktreePath: path.join(this.worktreesDir, branchName.replace(/\//g, "-")),
      branchName,
      baseBranch,
      createBranch: true,
    });
  }

  /**
   * Get the worktrees directory path
   */
  getWorktreesDir(): string {
    return this.worktreesDir;
  }
}
