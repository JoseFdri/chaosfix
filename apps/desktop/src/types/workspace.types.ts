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
  repoPath: string;
  branch: string;
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
