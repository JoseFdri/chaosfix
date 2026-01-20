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

export const REPOSITORY_CONFIG_IPC_CHANNELS = {
  LOAD: "repository-config:load",
  SAVE: "repository-config:save",
} as const;

export type RepositoryConfigIPCChannel =
  (typeof REPOSITORY_CONFIG_IPC_CHANNELS)[keyof typeof REPOSITORY_CONFIG_IPC_CHANNELS];

export const SETUP_SCRIPT_IPC_CHANNELS = {
  RUN: "setup-script:run",
} as const;

export type SetupScriptIPCChannel =
  (typeof SETUP_SCRIPT_IPC_CHANNELS)[keyof typeof SETUP_SCRIPT_IPC_CHANNELS];

export const EXTERNAL_APPS_IPC_CHANNELS = {
  LIST: "external-apps:list",
  OPEN: "external-apps:open",
} as const;

export type ExternalAppsIPCChannel =
  (typeof EXTERNAL_APPS_IPC_CHANNELS)[keyof typeof EXTERNAL_APPS_IPC_CHANNELS];

export const GIT_IPC_CHANNELS = {
  CLONE: "git:clone",
  CLONE_PROGRESS: "git:clone-progress",
} as const;

export type GitIPCChannel = (typeof GIT_IPC_CHANNELS)[keyof typeof GIT_IPC_CHANNELS];

export const AUTO_UPDATER_IPC_CHANNELS = {
  CHECK_FOR_UPDATES: "auto-updater:check-for-updates",
  DOWNLOAD_UPDATE: "auto-updater:download-update",
  INSTALL_UPDATE: "auto-updater:install-update",
  UPDATE_AVAILABLE: "auto-updater:update-available",
  UPDATE_NOT_AVAILABLE: "auto-updater:update-not-available",
  DOWNLOAD_PROGRESS: "auto-updater:download-progress",
  UPDATE_DOWNLOADED: "auto-updater:update-downloaded",
  UPDATE_ERROR: "auto-updater:update-error",
} as const;

export type AutoUpdaterIPCChannel =
  (typeof AUTO_UPDATER_IPC_CHANNELS)[keyof typeof AUTO_UPDATER_IPC_CHANNELS];
