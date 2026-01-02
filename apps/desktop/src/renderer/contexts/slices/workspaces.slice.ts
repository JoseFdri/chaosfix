import type { Workspace, WorkspaceStatus, TerminalSession } from "@chaosfix/core";
import type { Slice } from "./types";

// Extended workspace type with terminal management
export interface WorkspaceWithTerminals extends Omit<Workspace, "status"> {
  status: WorkspaceStatus;
  terminals: TerminalSession[];
  activeTerminalId: string | null;
}

// State
export interface WorkspacesState {
  workspaces: WorkspaceWithTerminals[];
  activeWorkspaceId: string | null;
}

// Actions
export type WorkspacesAction =
  | { type: "workspaces/add"; payload: WorkspaceWithTerminals }
  | { type: "workspaces/remove"; payload: string }
  | { type: "workspaces/setActive"; payload: string | null }
  | { type: "workspaces/updateStatus"; payload: { workspaceId: string; status: WorkspaceStatus } }
  | { type: "workspaces/addTerminal"; payload: { workspaceId: string; terminal: TerminalSession } }
  | { type: "workspaces/removeTerminal"; payload: { workspaceId: string; terminalId: string } }
  | {
      type: "workspaces/setActiveTerminal";
      payload: { workspaceId: string; terminalId: string | null };
    }
  | {
      type: "workspaces/renameTerminal";
      payload: { workspaceId: string; terminalId: string; title: string };
    }
  | { type: "workspaces/removeByRepository"; payload: string };

// Initial state
const initialState: WorkspacesState = {
  workspaces: [],
  activeWorkspaceId: null,
};

// Reducer
function reducer(state: WorkspacesState, action: WorkspacesAction): WorkspacesState {
  switch (action.type) {
    case "workspaces/add": {
      return {
        ...state,
        workspaces: [...state.workspaces, action.payload],
        activeWorkspaceId: action.payload.id,
      };
    }

    case "workspaces/remove": {
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

    case "workspaces/setActive": {
      return {
        ...state,
        activeWorkspaceId: action.payload,
      };
    }

    case "workspaces/updateStatus": {
      return {
        ...state,
        workspaces: state.workspaces.map((w) =>
          w.id === action.payload.workspaceId ? { ...w, status: action.payload.status } : w
        ),
      };
    }

    case "workspaces/addTerminal": {
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

    case "workspaces/removeTerminal": {
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

    case "workspaces/setActiveTerminal": {
      return {
        ...state,
        workspaces: state.workspaces.map((w) =>
          w.id === action.payload.workspaceId
            ? { ...w, activeTerminalId: action.payload.terminalId }
            : w
        ),
      };
    }

    case "workspaces/renameTerminal": {
      return {
        ...state,
        workspaces: state.workspaces.map((w) =>
          w.id === action.payload.workspaceId
            ? {
                ...w,
                terminals: w.terminals.map((t) =>
                  t.id === action.payload.terminalId ? { ...t, title: action.payload.title } : t
                ),
              }
            : w
        ),
      };
    }

    case "workspaces/removeByRepository": {
      return {
        ...state,
        workspaces: state.workspaces.filter((w) => w.repositoryId !== action.payload),
      };
    }

    default: {
      return state;
    }
  }
}

// Slice export
export const workspacesSlice: Slice<WorkspacesState, WorkspacesAction> = {
  name: "workspaces",
  initialState,
  reducer,
};

// Action creators
export const workspacesActions = {
  add: (workspace: WorkspaceWithTerminals): WorkspacesAction => ({
    type: "workspaces/add",
    payload: workspace,
  }),

  remove: (workspaceId: string): WorkspacesAction => ({
    type: "workspaces/remove",
    payload: workspaceId,
  }),

  setActive: (workspaceId: string | null): WorkspacesAction => ({
    type: "workspaces/setActive",
    payload: workspaceId,
  }),

  updateStatus: (workspaceId: string, status: WorkspaceStatus): WorkspacesAction => ({
    type: "workspaces/updateStatus",
    payload: { workspaceId, status },
  }),

  addTerminal: (workspaceId: string, terminal: TerminalSession): WorkspacesAction => ({
    type: "workspaces/addTerminal",
    payload: { workspaceId, terminal },
  }),

  removeTerminal: (workspaceId: string, terminalId: string): WorkspacesAction => ({
    type: "workspaces/removeTerminal",
    payload: { workspaceId, terminalId },
  }),

  setActiveTerminal: (workspaceId: string, terminalId: string | null): WorkspacesAction => ({
    type: "workspaces/setActiveTerminal",
    payload: { workspaceId, terminalId },
  }),

  renameTerminal: (workspaceId: string, terminalId: string, title: string): WorkspacesAction => ({
    type: "workspaces/renameTerminal",
    payload: { workspaceId, terminalId, title },
  }),

  removeByRepository: (repositoryId: string): WorkspacesAction => ({
    type: "workspaces/removeByRepository",
    payload: repositoryId,
  }),
};
