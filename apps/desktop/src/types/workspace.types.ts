/**
 * Result from validating a repository
 */
export interface ValidateRepoResult {
  isValid: boolean;
  defaultBranch?: string;
  error?: string;
}

/**
 * Options for creating a new workspace
 */
export interface CreateWorkspaceOptions {
  /** Path to the main git repository */
  repositoryPath: string;
  /** Name of the repository (used for path construction) */
  repositoryName: string;
  /** Name of the workspace/worktree (also used as branch name) */
  workspaceName: string;
}

/**
 * Result from creating a workspace
 */
export interface CreateWorkspaceResult {
  worktreePath: string;
  branch: string;
}

/**
 * Workspace API exposed to renderer process
 */
export interface WorkspaceAPI {
  validateRepository: (path: string) => Promise<ValidateRepoResult>;
  create: (options: CreateWorkspaceOptions) => Promise<CreateWorkspaceResult>;
}
