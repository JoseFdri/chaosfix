import type { Result } from "@chaosfix/core";

import type { WorktreeInfo } from "./worktree.types";

export interface BranchInfo {
  name: string;
  current: boolean;
  commit: string;
  tracking?: string;
}

export interface RepositoryInfo {
  path: string;
  name: string;
  defaultBranch: string;
  currentBranch: string;
  remotes: string[];
  worktrees: WorktreeInfo[];
}

export class GitError extends Error {
  constructor(
    message: string,
    public readonly command?: string,
    public readonly exitCode?: number
  ) {
    super(message);
    this.name = "GitError";
  }
}

export type GitResult<T> = Result<T, GitError>;
