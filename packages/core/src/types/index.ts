// Workspace Types
export interface Workspace {
  id: string;
  name: string;
  repositoryId: string;
  worktreePath: string;
  branchName: string;
  createdAt: Date;
  updatedAt: Date;
  status: WorkspaceStatus;
}

export type WorkspaceStatus = "active" | "idle" | "error" | "archived";

// Repository Types
export interface Repository {
  id: string;
  name: string;
  path: string;
  defaultBranch: string;
  workspaces: string[]; // Workspace IDs
  createdAt: Date;
}

// Terminal Session Types
export interface TerminalSession {
  id: string;
  workspaceId: string;
  pid: number;
  title: string;
  status: TerminalSessionStatus;
  createdAt: Date;
}

export type TerminalSessionStatus = "running" | "idle" | "closed" | "error";

// Result Type for error handling
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };
