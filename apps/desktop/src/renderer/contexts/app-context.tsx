import { useCallback } from "react";
import type { AppState } from "@chaosfix/config";
import type { Repository, TerminalSession, WorkspaceStatus } from "@chaosfix/core";
import {
  createAppContext,
  sliceRegistry,
  workspacesActions,
  hydrationActions,
  extractSerializableState,
  hydrateRepositoriesState,
  hydrateWorkspacesState,
  type RepositoriesState,
  type WorkspacesState,
  type UIState,
  type PersistenceState,
  type WorkspaceWithTerminals,
  type SerializableState,
  type BaseAction,
} from "./slices";

/**
 * Combined state type matching the slice registry structure.
 */
interface AppCombinedState {
  repositories: RepositoriesState;
  workspaces: WorkspacesState;
  ui: UIState;
  persistence: PersistenceState;
}

/**
 * Creates a wrapper reducer that handles cross-slice logic.
 * - Hydration: restores state from persistence
 * - Repository removal: also removes associated workspaces
 */
function createWrapReducer<TState extends AppCombinedState, TAction extends BaseAction>(
  baseReducer: (state: TState, action: TAction) => TState
) {
  return (state: TState, action: BaseAction): TState => {
    // Handle hydration action - replaces repositories and workspaces state
    if (action.type === "hydration/hydrate") {
      const appState = (action as { type: string; payload: AppState }).payload;
      return {
        ...state,
        repositories: hydrateRepositoriesState(appState),
        workspaces: hydrateWorkspacesState(appState),
      };
    }

    // Handle cross-slice action: removing a repository also removes its workspaces
    if (action.type === "repositories/remove") {
      const repositoryId = (action as { type: string; payload: string }).payload;
      // First remove workspaces for this repository
      const stateWithoutWorkspaces = baseReducer(
        state,
        workspacesActions.removeByRepository(repositoryId) as unknown as TAction
      );
      // Then remove the repository
      return baseReducer(stateWithoutWorkspaces, action as unknown as TAction);
    }

    return baseReducer(state, action as unknown as TAction);
  };
}

// Create the app context from the slice registry
// Note: Type casts required due to complex generic inference between wrapReducer's
// BaseAction return type and createAppContext's CombinedAction constraint
const {
  Provider: BaseProvider,
  useAppContext,
  /* eslint-disable @typescript-eslint/no-explicit-any */
} = createAppContext(sliceRegistry as any, {
  wrapReducer: createWrapReducer as any,
});
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * App context provider.
 * Wraps children with the auto-generated context provider.
 */
export function AppProvider({ children }: { children: React.ReactNode }): JSX.Element {
  return <BaseProvider>{children}</BaseProvider>;
}

/**
 * Bound actions for repository operations.
 */
interface RepositoriesActions {
  add: (repository: Repository) => void;
  remove: (repositoryId: string) => void;
  update: (id: string, updates: Partial<Repository>) => void;
}

/**
 * Bound actions for workspace operations.
 */
interface WorkspacesActions {
  add: (workspace: WorkspaceWithTerminals) => void;
  remove: (workspaceId: string) => void;
  setActive: (workspaceId: string | null) => void;
  updateStatus: (workspaceId: string, status: WorkspaceStatus) => void;
  addTerminal: (workspaceId: string, terminal: TerminalSession) => void;
  removeTerminal: (workspaceId: string, terminalId: string) => void;
  setActiveTerminal: (workspaceId: string, terminalId: string | null) => void;
  renameTerminal: (workspaceId: string, terminalId: string, title: string) => void;
  removeByRepository: (repositoryId: string) => void;
}

/**
 * Bound actions for UI operations.
 */
interface UIActions {
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
  setSearchQuery: (query: string) => void;
}

/**
 * Bound actions for persistence operations.
 */
interface PersistenceActions {
  setLoading: (isLoading: boolean) => void;
  setSaved: (timestamp: string) => void;
  setError: (error: string | null) => void;
}

/**
 * Return type for the useApp hook.
 */
interface UseAppReturn {
  state: AppCombinedState;
  repositories: RepositoriesActions;
  workspaces: WorkspacesActions;
  ui: UIActions;
  persistence: PersistenceActions;
  hydrateState: (appState: AppState) => void;
  getSerializableState: () => SerializableState;
}

/**
 * Hook to access app state and actions.
 *
 * Returns grouped actions by domain:
 * - repositories.add, repositories.remove
 * - workspaces.add, workspaces.remove, workspaces.setActive, etc.
 * - ui.toggleSidebar, ui.setSidebarWidth, ui.setSearchQuery
 * - persistence.setLoading, persistence.setSaved, persistence.setError
 *
 * Plus state access via `state` property:
 * - state.repositories, state.workspaces, state.ui, state.persistence
 *
 * And hydration utilities:
 * - hydrateState(appState) - restore state from persistence
 * - getSerializableState() - extract state for persistence
 */
export function useApp(): UseAppReturn {
  const context = useAppContext();

  // Cast context to typed version (cast through unknown due to generic type variance)
  const typedContext = context as unknown as {
    state: AppCombinedState;
    repositories: RepositoriesActions;
    workspaces: WorkspacesActions;
    ui: UIActions;
    persistence: PersistenceActions;
    dispatch: (action: BaseAction) => void;
  };

  // Extract stable references for dependency arrays
  const { dispatch } = typedContext;
  const { repositories: repositoriesState, workspaces: workspacesState } = typedContext.state;

  // Hydration action - dispatches to restore state from persistence
  const hydrateState = useCallback(
    (appState: AppState) => {
      dispatch(hydrationActions.hydrate(appState));
    },
    [dispatch]
  );

  // Get serializable state - extracts current state for persistence
  const getSerializableState = useCallback((): SerializableState => {
    return extractSerializableState(repositoriesState, workspacesState);
  }, [repositoriesState, workspacesState]);

  return {
    state: typedContext.state,
    repositories: typedContext.repositories,
    workspaces: typedContext.workspaces,
    ui: typedContext.ui,
    persistence: typedContext.persistence,
    hydrateState,
    getSerializableState,
  };
}

// Re-export types for convenience
export type { WorkspaceWithTerminals };
