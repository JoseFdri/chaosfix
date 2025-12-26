import { createContext, useContext, useReducer, useCallback, type ReactNode } from "react";
import type { Repository, Workspace, WorkspaceStatus, TerminalSession } from "@chaosfix/core";

// Types
interface WorkspaceWithTerminals extends Omit<Workspace, "status"> {
  status: WorkspaceStatus;
  terminals: TerminalSession[];
  activeTerminalId: string | null;
}

interface AppState {
  repositories: Repository[];
  workspaces: WorkspaceWithTerminals[];
  activeWorkspaceId: string | null;
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  searchQuery: string;
}

type AppAction =
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "ADD_REPOSITORY"; payload: Repository }
  | { type: "REMOVE_REPOSITORY"; payload: string }
  | { type: "ADD_WORKSPACE"; payload: WorkspaceWithTerminals }
  | { type: "REMOVE_WORKSPACE"; payload: string }
  | { type: "SET_ACTIVE_WORKSPACE"; payload: string | null }
  | { type: "UPDATE_WORKSPACE_STATUS"; payload: { workspaceId: string; status: WorkspaceStatus } }
  | { type: "ADD_TERMINAL"; payload: { workspaceId: string; terminal: TerminalSession } }
  | { type: "REMOVE_TERMINAL"; payload: { workspaceId: string; terminalId: string } }
  | { type: "SET_ACTIVE_TERMINAL"; payload: { workspaceId: string; terminalId: string | null } }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_SIDEBAR_WIDTH"; payload: number };

interface AppContextValue extends AppState {
  setSearchQuery: (query: string) => void;
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
}

// Initial state
const INITIAL_STATE: AppState = {
  repositories: [],
  workspaces: [],
  activeWorkspaceId: null,
  sidebarCollapsed: false,
  sidebarWidth: 250,
  searchQuery: "",
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_SEARCH_QUERY": {
      return {
        ...state,
        searchQuery: action.payload,
      };
    }

    case "ADD_REPOSITORY": {
      return {
        ...state,
        repositories: [...state.repositories, action.payload],
      };
    }

    case "REMOVE_REPOSITORY": {
      return {
        ...state,
        repositories: state.repositories.filter((r) => r.id !== action.payload),
        workspaces: state.workspaces.filter((w) => w.repositoryId !== action.payload),
      };
    }

    case "ADD_WORKSPACE": {
      return {
        ...state,
        workspaces: [...state.workspaces, action.payload],
        activeWorkspaceId: action.payload.id,
      };
    }

    case "REMOVE_WORKSPACE": {
      const newWorkspaces = state.workspaces.filter((w) => w.id !== action.payload);
      return {
        ...state,
        workspaces: newWorkspaces,
        activeWorkspaceId:
          state.activeWorkspaceId === action.payload
            ? (newWorkspaces[0]?.id ?? null)
            : state.activeWorkspaceId,
      };
    }

    case "SET_ACTIVE_WORKSPACE": {
      return {
        ...state,
        activeWorkspaceId: action.payload,
      };
    }

    case "UPDATE_WORKSPACE_STATUS": {
      return {
        ...state,
        workspaces: state.workspaces.map((w) =>
          w.id === action.payload.workspaceId ? { ...w, status: action.payload.status } : w
        ),
      };
    }

    case "ADD_TERMINAL": {
      return {
        ...state,
        workspaces: state.workspaces.map((w) =>
          w.id === action.payload.workspaceId
            ? {
                ...w,
                terminals: [...w.terminals, action.payload.terminal],
                activeTerminalId: action.payload.terminal.id,
              }
            : w
        ),
      };
    }

    case "REMOVE_TERMINAL": {
      return {
        ...state,
        workspaces: state.workspaces.map((w) => {
          if (w.id !== action.payload.workspaceId) {
            return w;
          }
          const newTerminals = w.terminals.filter((t) => t.id !== action.payload.terminalId);
          return {
            ...w,
            terminals: newTerminals,
            activeTerminalId:
              w.activeTerminalId === action.payload.terminalId
                ? (newTerminals[0]?.id ?? null)
                : w.activeTerminalId,
          };
        }),
      };
    }

    case "SET_ACTIVE_TERMINAL": {
      return {
        ...state,
        workspaces: state.workspaces.map((w) =>
          w.id === action.payload.workspaceId
            ? { ...w, activeTerminalId: action.payload.terminalId }
            : w
        ),
      };
    }

    case "TOGGLE_SIDEBAR": {
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed,
      };
    }

    case "SET_SIDEBAR_WIDTH": {
      return {
        ...state,
        sidebarWidth: action.payload,
      };
    }

    default: {
      return state;
    }
  }
}

// Context
const AppContext = createContext<AppContextValue | undefined>(undefined);

// Provider
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(appReducer, INITIAL_STATE);

  // Memoized action creators
  const setSearchQuery = useCallback((query: string): void => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });
  }, []);

  const addRepository = useCallback((repo: Repository): void => {
    dispatch({ type: "ADD_REPOSITORY", payload: repo });
  }, []);

  const removeRepository = useCallback((repoId: string): void => {
    dispatch({ type: "REMOVE_REPOSITORY", payload: repoId });
  }, []);

  const addWorkspace = useCallback((workspace: WorkspaceWithTerminals): void => {
    dispatch({ type: "ADD_WORKSPACE", payload: workspace });
  }, []);

  const removeWorkspace = useCallback((workspaceId: string): void => {
    dispatch({ type: "REMOVE_WORKSPACE", payload: workspaceId });
  }, []);

  const setActiveWorkspace = useCallback((workspaceId: string | null): void => {
    dispatch({ type: "SET_ACTIVE_WORKSPACE", payload: workspaceId });
  }, []);

  const updateWorkspaceStatus = useCallback(
    (workspaceId: string, status: WorkspaceStatus): void => {
      dispatch({ type: "UPDATE_WORKSPACE_STATUS", payload: { workspaceId, status } });
    },
    []
  );

  const addTerminal = useCallback((workspaceId: string, terminal: TerminalSession): void => {
    dispatch({ type: "ADD_TERMINAL", payload: { workspaceId, terminal } });
  }, []);

  const removeTerminal = useCallback((workspaceId: string, terminalId: string): void => {
    dispatch({ type: "REMOVE_TERMINAL", payload: { workspaceId, terminalId } });
  }, []);

  const setActiveTerminal = useCallback((workspaceId: string, terminalId: string | null): void => {
    dispatch({ type: "SET_ACTIVE_TERMINAL", payload: { workspaceId, terminalId } });
  }, []);

  const toggleSidebar = useCallback((): void => {
    dispatch({ type: "TOGGLE_SIDEBAR" });
  }, []);

  const setSidebarWidth = useCallback((width: number): void => {
    dispatch({ type: "SET_SIDEBAR_WIDTH", payload: width });
  }, []);

  const value: AppContextValue = {
    ...state,
    setSearchQuery,
    addRepository,
    removeRepository,
    addWorkspace,
    removeWorkspace,
    setActiveWorkspace,
    updateWorkspaceStatus,
    addTerminal,
    removeTerminal,
    setActiveTerminal,
    toggleSidebar,
    setSidebarWidth,
  };

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
