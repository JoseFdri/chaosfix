import type { Result } from "@chaosfix/core";

export interface WorktreeInfo {
  path: string;
  branch: string;
  commit: string;
  isMain: boolean;
  isBare: boolean;
}

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

export interface WorktreeCreateOptions {
  repositoryPath: string;
  worktreePath: string;
  branchName: string;
  baseBranch?: string;
  createBranch?: boolean;
}

export interface WorktreeRemoveOptions {
  repositoryPath: string;
  worktreePath: string;
  force?: boolean;
}

export type GitResult<T> = Result<T, GitError>;

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
