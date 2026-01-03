export const TERMINAL_IPC_CHANNELS = {
  CREATE: "terminal:create",
  DESTROY: "terminal:destroy",
  WRITE: "terminal:write",
  RESIZE: "terminal:resize",
  DATA: "terminal:data",
  EXIT: "terminal:exit",
  TITLE: "terminal:title",
} as const;

export type TerminalIPCChannel = (typeof TERMINAL_IPC_CHANNELS)[keyof typeof TERMINAL_IPC_CHANNELS];

export const DIALOG_IPC_CHANNELS = {
  SELECT_DIRECTORY: "dialog:select-directory",
} as const;

export type DialogIPCChannel = (typeof DIALOG_IPC_CHANNELS)[keyof typeof DIALOG_IPC_CHANNELS];

export const STATE_IPC_CHANNELS = {
  LOAD: "state:load",
  SAVE: "state:save",
} as const;

export type StateIPCChannel = (typeof STATE_IPC_CHANNELS)[keyof typeof STATE_IPC_CHANNELS];

export const WORKSPACE_IPC_CHANNELS = {
  CREATE: "workspace:create",
  VALIDATE_REPO: "workspace:validate-repo",
  REMOVE: "workspace:remove",
  CHECK_STATUS: "workspace:check-status",
} as const;

export type WorkspaceIPCChannel =
  (typeof WORKSPACE_IPC_CHANNELS)[keyof typeof WORKSPACE_IPC_CHANNELS];

export const REPOSITORY_IPC_CHANNELS = {
  GET_BRANCHES: "repository:get-branches",
  GET_REMOTES: "repository:get-remotes",
  GET_WORKSPACES_PATH: "repository:get-workspaces-path",
} as const;

export type RepositoryIPCChannel =
  (typeof REPOSITORY_IPC_CHANNELS)[keyof typeof REPOSITORY_IPC_CHANNELS];
