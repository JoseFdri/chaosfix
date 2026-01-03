/**
 * Result from getting repository branches
 */
export interface GetBranchesResult {
  branches: string[];
  currentBranch: string;
}

/**
 * Result from getting repository remotes
 */
export interface GetRemotesResult {
  remotes: string[];
}

/**
 * Result from getting workspaces path
 */
export interface GetWorkspacesPathResult {
  path: string;
}

/**
 * Repository API exposed to renderer process
 */
export interface RepositoryAPI {
  getBranches: (repositoryPath: string) => Promise<GetBranchesResult>;
  getRemotes: (repositoryPath: string) => Promise<GetRemotesResult>;
  getWorkspacesPath: (repositoryName: string) => Promise<GetWorkspacesPathResult>;
}
