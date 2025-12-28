import { createContext, useContext, useReducer, useMemo, type ReactNode } from "react";
import type { Repository, WorkspaceStatus, TerminalSession } from "@chaosfix/core";
import {
  combineSlices,
  createBoundActions,
  repositoriesSlice,
  repositoriesActions,
  workspacesSlice,
  workspacesActions,
  uiSlice,
  uiActions,
  type RepositoriesState,
  type RepositoriesAction,
  type WorkspacesState,
  type WorkspacesAction,
  type UIState,
  type UIAction,
  type WorkspaceWithTerminals,
} from "./slices";

// Combine all slices
const { initialState: INITIAL_STATE, reducer: combinedReducer } = combineSlices({
  repositories: repositoriesSlice,
  workspaces: workspacesSlice,
  ui: uiSlice,
});

// Infer combined state type
type CombinedState = typeof INITIAL_STATE;

// Combined action type - union of all slice actions
type AppAction = RepositoriesAction | WorkspacesAction | UIAction;

// Flattened state for context consumers
type FlatState = RepositoriesState & WorkspacesState & UIState;

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
}

// Wrapper reducer that handles cross-slice logic
function appReducer(state: CombinedState, action: AppAction): CombinedState {
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
    }),
    [dispatch]
  );

  // Flatten state for consumers
  const flatState: FlatState = useMemo(
    () => ({
      ...state.repositories,
      ...state.workspaces,
      ...state.ui,
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
    }),
    [flatState, boundActions]
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
