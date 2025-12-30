import type { IpcRendererEvent } from "electron";

import type { AppState } from "@chaosfix/config";

/**
 * Options for creating a new PTY instance
 */
export interface PTYCreateOptions {
  id: string;
  cwd: string;
  env?: Record<string, string>;
  shell?: string;
  cols?: number;
  rows?: number;
}

/**
 * Result from creating a PTY instance
 */
export interface PTYCreateResult {
  id: string;
  pid: number;
}

/**
 * Data event payload from PTY
 */
export interface PTYDataEvent {
  id: string;
  data: string;
}

/**
 * Exit event payload from PTY
 */
export interface PTYExitEvent {
  id: string;
  exitCode: number;
  signal?: number;
}

/**
 * Result from directory selection dialog
 */
export interface DirectorySelectResult {
  path: string;
  name: string;
}

/**
 * Terminal API exposed to renderer process
 */
export interface TerminalAPI {
  create: (options: PTYCreateOptions) => Promise<PTYCreateResult>;
  write: (id: string, data: string) => Promise<boolean>;
  resize: (id: string, cols: number, rows: number) => Promise<boolean>;
  destroy: (id: string) => Promise<boolean>;
  onData: (callback: (data: PTYDataEvent) => void) => () => void;
  onExit: (callback: (data: PTYExitEvent) => void) => () => void;
}

/**
 * Dialog API exposed to renderer process
 */
export interface DialogAPI {
  selectDirectory: () => Promise<DirectorySelectResult | null>;
}

/**
 * State API exposed to renderer process
 */
export interface StateAPI {
  load: () => Promise<AppState | null>;
  save: (state: AppState) => Promise<boolean>;
}

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

/**
 * Handler type for IPC renderer events
 */
export type IpcEventHandler<T> = (event: IpcRendererEvent, data: T) => void;

/**
 * Global window type declarations for exposed APIs
 */
declare global {
  interface Window {
    terminal: TerminalAPI;
    dialog: DialogAPI;
    state: StateAPI;
    workspace: WorkspaceAPI;
  }
}
