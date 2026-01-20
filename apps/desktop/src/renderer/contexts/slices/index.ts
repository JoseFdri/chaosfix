// Types
export type { BaseAction, Slice, SliceState, SliceActions } from "./types";

// Constants
export { DEFAULT_SIDEBAR_WIDTH } from "./constants";

// Utilities
export { combineSlices } from "./combine-slices";
export { createBoundActions } from "./bind-actions";
export { createAppContext } from "./create-app-context";
export { sliceRegistry, createRegisteredSlice, type SliceRegistry } from "./registry";

// Slices
export {
  repositoriesSlice,
  repositoriesActions,
  type RepositoriesState,
  type RepositoriesAction,
} from "./repositories.slice";

export {
  workspacesSlice,
  workspacesActions,
  getActiveTerminalId,
  type WorkspacesState,
  type WorkspacesAction,
  type WorkspaceWithTabs,
} from "./workspaces.slice";

export { uiSlice, uiActions, type UIState, type UIAction } from "./ui.slice";

export {
  persistenceSlice,
  persistenceActions,
  type PersistenceState,
  type PersistenceAction,
} from "./persistence.slice";

export {
  preferencesSlice,
  preferencesActions,
  type PreferencesState,
  type PreferencesAction,
  type Theme,
} from "./preferences.slice";

export {
  notificationsSlice,
  notificationsActions,
  type NotificationsState,
  type NotificationsAction,
  type Notification,
  type NotificationType,
} from "./notifications.slice";

export {
  updatesSlice,
  updatesActions,
  type UpdatesState,
  type UpdatesAction,
  type UpdateInfo,
  type DownloadProgress,
  type UpdateStatus,
} from "./updates.slice";

// Hydration utilities
export {
  hydrationActions,
  extractSerializableState,
  hydrateRepositoriesState,
  hydrateWorkspacesState,
  type HydrationAction,
  type SerializableState,
} from "./hydration";
