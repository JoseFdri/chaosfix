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

export interface WorkspaceCreateOptions {
  name: string;
  repositoryId: string;
  branchName?: string;
  baseBranch?: string;
  setupScript?: string;
}

// Repository Types
export interface Repository {
  id: string;
  name: string;
  path: string;
  defaultBranch: string;
  workspaces: string[]; // Workspace IDs
  createdAt: Date;
}

export interface RepositoryAddOptions {
  path: string;
  name?: string;
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

export interface TerminalSessionCreateOptions {
  workspaceId: string;
  title?: string;
  cwd?: string;
  env?: Record<string, string>;
  shell?: string;
}

// Application State
export interface AppState {
  repositories: Repository[];
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  activeTerminalId: string | null;
}

// IPC Message Types
export interface IPCMessage<T = unknown> {
  channel: string;
  payload: T;
  timestamp: number;
}

export interface IPCResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Result Type for error handling
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };
