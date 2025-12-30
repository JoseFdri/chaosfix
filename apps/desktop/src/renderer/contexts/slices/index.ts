// Types
export type { BaseAction, Slice, SliceState, SliceActions } from "./types";

// Constants
export { DEFAULT_SIDEBAR_WIDTH } from "./constants";

// Utilities
export { combineSlices } from "./combine-slices";
export { createBoundActions } from "./bind-actions";

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
  type WorkspacesState,
  type WorkspacesAction,
  type WorkspaceWithTerminals,
} from "./workspaces.slice";

export { uiSlice, uiActions, type UIState, type UIAction } from "./ui.slice";

export {
  persistenceSlice,
  persistenceActions,
  type PersistenceState,
  type PersistenceAction,
} from "./persistence.slice";

// Hydration utilities
export {
  hydrationActions,
  extractSerializableState,
  hydrateRepositoriesState,
  hydrateWorkspacesState,
  type HydrationAction,
  type SerializableState,
} from "./hydration";
