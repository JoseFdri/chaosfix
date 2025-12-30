import { createContext, useContext, useReducer, useMemo, useCallback, type ReactNode } from "react";
import type { Repository, WorkspaceStatus, TerminalSession } from "@chaosfix/core";
import type { AppState } from "@chaosfix/config";
import {
  combineSlices,
  createBoundActions,
  repositoriesSlice,
  repositoriesActions,
  workspacesSlice,
  workspacesActions,
  uiSlice,
  uiActions,
  persistenceSlice,
  persistenceActions,
  hydrationActions,
  extractSerializableState,
  hydrateRepositoriesState,
  hydrateWorkspacesState,
  type RepositoriesState,
  type RepositoriesAction,
  type WorkspacesState,
  type WorkspacesAction,
  type UIState,
  type UIAction,
  type PersistenceState,
  type PersistenceAction,
  type WorkspaceWithTerminals,
  type HydrationAction,
  type SerializableState,
} from "./slices";

// Combine all slices
const { initialState: INITIAL_STATE, reducer: combinedReducer } = combineSlices({
  repositories: repositoriesSlice,
  workspaces: workspacesSlice,
  ui: uiSlice,
  persistence: persistenceSlice,
});

// Infer combined state type
type CombinedState = typeof INITIAL_STATE;

// Combined action type - union of all slice actions plus hydration
type AppAction =
  | RepositoriesAction
  | WorkspacesAction
  | UIAction
  | PersistenceAction
  | HydrationAction;

// Flattened state for context consumers
type FlatState = RepositoriesState & WorkspacesState & UIState & PersistenceState;

// Context value type with flattened state and action methods
interface AppContextValue extends FlatState {
  addRepository: (repo: Repository) => void;
  removeRepository: (repoId: string) => void;
  addWorkspace: (workspace: WorkspaceWithTerminals) => void;
  removeWorkspace: (workspaceId: string) => void;
  setActiveWorkspace: (workspaceId: string | null) => void;
  updateWorkspaceStatus: (workspaceId: string, status: WorkspaceStatus) => void;
  addTerminal: (workspaceId: string, terminal: TerminalSession) => void;
  removeTerminal: (workspaceId: string, terminalId: string) => void;
  setActiveTerminal: (workspaceId: string, terminalId: string | null) => void;
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
  setSearchQuery: (query: string) => void;
  setPersistenceLoading: (isLoading: boolean) => void;
  setPersistenceSaved: (timestamp: string) => void;
  setPersistenceError: (error: string | null) => void;
  // Hydration actions
  hydrateState: (appState: AppState) => void;
  getSerializableState: () => SerializableState;
}

// Wrapper reducer that handles cross-slice logic
function appReducer(state: CombinedState, action: AppAction): CombinedState {
  // Handle hydration action - replaces repositories and workspaces state
  if (action.type === "hydration/hydrate") {
    const appState = action.payload;
    return {
      ...state,
      repositories: hydrateRepositoriesState(appState),
      workspaces: hydrateWorkspacesState(appState),
    };
  }

  // Handle cross-slice actions (e.g., removing a repository also removes its workspaces)
  if (action.type === "repositories/remove") {
    const repositoryId = action.payload;
    // First remove workspaces for this repository
    const stateWithoutWorkspaces = combinedReducer(
      state,
      workspacesActions.removeByRepository(repositoryId)
    );
    // Then remove the repository
    return combinedReducer(stateWithoutWorkspaces, action);
  }

  return combinedReducer(state, action);
}

// Context
const AppContext = createContext<AppContextValue | undefined>(undefined);

// Provider
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(appReducer, INITIAL_STATE);

  // Bind action creators - memoized since dispatch is stable
  const boundActions = useMemo(
    () => ({
      repositories: createBoundActions(repositoriesActions, dispatch),
      workspaces: createBoundActions(workspacesActions, dispatch),
      ui: createBoundActions(uiActions, dispatch),
      persistence: createBoundActions(persistenceActions, dispatch),
    }),
    [dispatch]
  );

  // Hydration action - dispatches to restore state from persistence
  const hydrateState = useCallback(
    (appState: AppState) => {
      dispatch(hydrationActions.hydrate(appState));
    },
    [dispatch]
  );

  // Get serializable state - extracts current state for persistence
  const getSerializableState = useCallback((): SerializableState => {
    return extractSerializableState(state.repositories, state.workspaces);
  }, [state.repositories, state.workspaces]);

  // Flatten state for consumers
  const flatState: FlatState = useMemo(
    () => ({
      ...state.repositories,
      ...state.workspaces,
      ...state.ui,
      ...state.persistence,
    }),
    [state]
  );

  const value: AppContextValue = useMemo(
    () => ({
      ...flatState,
      // Repositories actions
      addRepository: boundActions.repositories.add,
      removeRepository: boundActions.repositories.remove,
      // Workspaces actions
      addWorkspace: boundActions.workspaces.add,
      removeWorkspace: boundActions.workspaces.remove,
      setActiveWorkspace: boundActions.workspaces.setActive,
      updateWorkspaceStatus: boundActions.workspaces.updateStatus,
      addTerminal: boundActions.workspaces.addTerminal,
      removeTerminal: boundActions.workspaces.removeTerminal,
      setActiveTerminal: boundActions.workspaces.setActiveTerminal,
      // UI actions
      toggleSidebar: boundActions.ui.toggleSidebar,
      setSidebarWidth: boundActions.ui.setSidebarWidth,
      setSearchQuery: boundActions.ui.setSearchQuery,
      // Persistence actions
      setPersistenceLoading: boundActions.persistence.setLoading,
      setPersistenceSaved: boundActions.persistence.setSaved,
      setPersistenceError: boundActions.persistence.setError,
      // Hydration actions
      hydrateState,
      getSerializableState,
    }),
    [flatState, boundActions, hydrateState, getSerializableState]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook
export function useApp(): AppContextValue {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }

  return context;
}

// Re-export types for convenience
export type { WorkspaceWithTerminals };
