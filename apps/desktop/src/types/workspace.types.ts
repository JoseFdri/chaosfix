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
 * Options for removing a workspace
 */
export interface RemoveWorkspaceOptions {
  repositoryPath: string;
  worktreePath: string;
  force?: boolean;
}

/**
 * Result from removing a workspace
 */
export interface RemoveWorkspaceResult {
  success: boolean;
  error?: string;
}

/**
 * Options for checking workspace status
 */
export interface CheckWorkspaceStatusOptions {
  repositoryPath: string;
}

/**
 * Result from checking workspace status
 */
export interface CheckWorkspaceStatusResult {
  hasUncommittedChanges: boolean;
  modified: string[];
  staged: string[];
  untracked: string[];
}

/**
 * Workspace API exposed to renderer process
 */
export interface WorkspaceAPI {
  validateRepository: (path: string) => Promise<ValidateRepoResult>;
  create: (options: CreateWorkspaceOptions) => Promise<CreateWorkspaceResult>;
  remove: (options: RemoveWorkspaceOptions) => Promise<RemoveWorkspaceResult>;
  checkStatus: (options: CheckWorkspaceStatusOptions) => Promise<CheckWorkspaceStatusResult>;
}
