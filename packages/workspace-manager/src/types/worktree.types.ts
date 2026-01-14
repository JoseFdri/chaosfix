export interface WorktreeInfo {
  path: string;
  branch: string;
  commit: string;
  isMain: boolean;
  isBare: boolean;
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
  branchName?: string;
  force?: boolean;
}
