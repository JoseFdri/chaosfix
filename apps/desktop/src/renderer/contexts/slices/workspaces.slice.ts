import {
  generateSplitId,
  removeTerminalFromTree,
  getAllTerminalIds,
  replaceTerminalInTree,
  updateSplitSizes,
  type Workspace,
  type WorkspaceStatus,
  type TerminalSession,
  type ExternalAppId,
  type PaneNode,
  type SplitDirection,
  type TerminalPane,
  type SplitPane,
  type Tab,
} from "@chaosfix/core";
import type { Slice } from "./types";

/**
 * Extended workspace type with tab-based terminal management.
 * Each tab owns its terminals and split layout independently.
 */
export interface WorkspaceWithTabs extends Omit<Workspace, "status"> {
  status: WorkspaceStatus;
  /** The selected external app for quick-open (persisted per workspace) */
  selectedAppId: ExternalAppId | null;
  /** Tabs owned by this workspace */
  tabs: Tab[];
  /** Currently active tab ID (null if no tabs) */
  activeTabId: string | null;
}

/**
 * Helper selector to get the active terminal ID from a workspace.
 * Returns the focused terminal in the active tab, or the first terminal if none focused.
 */
export function getActiveTerminalId(workspace: WorkspaceWithTabs): string | null {
  const activeTab = workspace.tabs.find((t) => t.id === workspace.activeTabId);
  return activeTab?.focusedTerminalId ?? activeTab?.terminals[0]?.id ?? null;
}

// State
export interface WorkspacesState {
  workspaces: WorkspaceWithTabs[];
  activeWorkspaceId: string | null;
}

// Actions
export type WorkspacesAction =
  | { type: "workspaces/add"; payload: WorkspaceWithTabs }
  | { type: "workspaces/remove"; payload: string }
  | { type: "workspaces/setActive"; payload: string | null }
  | { type: "workspaces/updateStatus"; payload: { workspaceId: string; status: WorkspaceStatus } }
  | { type: "workspaces/removeByRepository"; payload: string }
  | {
      type: "workspaces/setSelectedApp";
      payload: { workspaceId: string; appId: ExternalAppId | null };
    }
  // Tab-focused actions
  | { type: "workspaces/addTab"; payload: { workspaceId: string; tab: Tab } }
  | { type: "workspaces/removeTab"; payload: { workspaceId: string; tabId: string } }
  | { type: "workspaces/setActiveTab"; payload: { workspaceId: string; tabId: string } }
  | {
      type: "workspaces/updateTabLabel";
      payload: { workspaceId: string; tabId: string; label: string };
    }
  | {
      type: "workspaces/addTerminalToTab";
      payload: { workspaceId: string; tabId: string; terminal: TerminalSession };
    }
  | {
      type: "workspaces/removeTerminalFromTab";
      payload: { workspaceId: string; tabId: string; terminalId: string };
    }
  | {
      type: "workspaces/splitTerminalInTab";
      payload: {
        workspaceId: string;
        tabId: string;
        direction: SplitDirection;
        newTerminal: TerminalSession;
      };
    }
  | {
      type: "workspaces/setFocusedTerminalInTab";
      payload: { workspaceId: string; tabId: string; terminalId: string | null };
    }
  | {
      type: "workspaces/resizePanesInTab";
      payload: { workspaceId: string; tabId: string; splitId: string; sizes: number[] };
    }
  | {
      type: "workspaces/setTabSplitLayout";
      payload: { workspaceId: string; tabId: string; layout: PaneNode | null };
    };

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

    case "workspaces/removeByRepository": {
      return {
        ...state,
        workspaces: state.workspaces.filter((w) => w.repositoryId !== action.payload),
      };
    }

    case "workspaces/setSelectedApp": {
      return {
        ...state,
        workspaces: state.workspaces.map((w) =>
          w.id === action.payload.workspaceId ? { ...w, selectedAppId: action.payload.appId } : w
        ),
      };
    }

    // Tab-focused action handlers

    case "workspaces/addTab": {
      const { workspaceId, tab } = action.payload;
      return {
        ...state,
        workspaces: state.workspaces.map((w) => {
          if (w.id !== workspaceId) {
            return w;
          }
          return {
            ...w,
            tabs: [...w.tabs, tab],
            activeTabId: tab.id,
          };
        }),
      };
    }

    case "workspaces/removeTab": {
      const { workspaceId, tabId } = action.payload;
      return {
        ...state,
        workspaces: state.workspaces.map((w) => {
          if (w.id !== workspaceId) {
            return w;
          }

          const tabIndex = w.tabs.findIndex((t) => t.id === tabId);
          if (tabIndex === -1) {
            return w;
          }

          const newTabs = w.tabs.filter((t) => t.id !== tabId);

          // Determine new activeTabId if the closed tab was active
          let newActiveTabId: string | null = w.activeTabId;
          if (w.activeTabId === tabId) {
            if (newTabs.length === 0) {
              newActiveTabId = null;
            } else {
              // Select the tab at max(closedIndex - 1, 0)
              const newIndex = Math.max(tabIndex - 1, 0);
              newActiveTabId = newTabs[newIndex]?.id ?? null;
            }
          }

          return {
            ...w,
            tabs: newTabs,
            activeTabId: newActiveTabId,
          };
        }),
      };
    }

    case "workspaces/setActiveTab": {
      const { workspaceId, tabId } = action.payload;
      return {
        ...state,
        workspaces: state.workspaces.map((w) =>
          w.id === workspaceId ? { ...w, activeTabId: tabId } : w
        ),
      };
    }

    case "workspaces/updateTabLabel": {
      const { workspaceId, tabId, label } = action.payload;
      return {
        ...state,
        workspaces: state.workspaces.map((w) => {
          if (w.id !== workspaceId) {
            return w;
          }
          return {
            ...w,
            tabs: w.tabs.map((t) => (t.id === tabId ? { ...t, label } : t)),
          };
        }),
      };
    }

    case "workspaces/addTerminalToTab": {
      const { workspaceId, tabId, terminal } = action.payload;
      return {
        ...state,
        workspaces: state.workspaces.map((w) => {
          if (w.id !== workspaceId) {
            return w;
          }
          return {
            ...w,
            tabs: w.tabs.map((t) => {
              if (t.id !== tabId) {
                return t;
              }
              return {
                ...t,
                terminals: [...t.terminals, terminal],
                focusedTerminalId: terminal.id,
              };
            }),
          };
        }),
      };
    }

    case "workspaces/removeTerminalFromTab": {
      const { workspaceId, tabId, terminalId } = action.payload;
      return {
        ...state,
        workspaces: state.workspaces.map((w) => {
          if (w.id !== workspaceId) {
            return w;
          }
          return {
            ...w,
            tabs: w.tabs.map((t) => {
              if (t.id !== tabId) {
                return t;
              }

              const newTerminals = t.terminals.filter((term) => term.id !== terminalId);
              let updatedLayout = t.splitLayout
                ? removeTerminalFromTree(t.splitLayout, terminalId)
                : null;

              // If the layout collapsed to a single terminal, clear it entirely
              if (updatedLayout?.type === "terminal") {
                updatedLayout = null;
              }

              // Determine new focusedTerminalId
              let newFocusedId: string | null = null;
              if (t.focusedTerminalId === terminalId) {
                if (updatedLayout) {
                  const remainingIds = getAllTerminalIds(updatedLayout);
                  newFocusedId = remainingIds[0] ?? null;
                } else {
                  newFocusedId = newTerminals[0]?.id ?? null;
                }
              } else {
                newFocusedId = t.focusedTerminalId;
              }

              return {
                ...t,
                terminals: newTerminals,
                splitLayout: updatedLayout,
                focusedTerminalId: newFocusedId,
              };
            }),
          };
        }),
      };
    }

    case "workspaces/splitTerminalInTab": {
      const { workspaceId, tabId, direction, newTerminal } = action.payload;
      return {
        ...state,
        workspaces: state.workspaces.map((w) => {
          if (w.id !== workspaceId) {
            return w;
          }
          return {
            ...w,
            tabs: w.tabs.map((t) => {
              if (t.id !== tabId) {
                return t;
              }

              // Get the terminal to split (focused or first terminal)
              const targetTerminalId = t.focusedTerminalId ?? t.terminals[0]?.id;
              if (!targetTerminalId) {
                // No terminal to split, just add the new terminal
                return {
                  ...t,
                  terminals: [...t.terminals, newTerminal],
                  focusedTerminalId: newTerminal.id,
                };
              }

              // Create terminal panes
              const existingPane: TerminalPane = { type: "terminal", terminalId: targetTerminalId };
              const newPane: TerminalPane = { type: "terminal", terminalId: newTerminal.id };

              // Create the split container
              const splitContainer: SplitPane = {
                type: "split",
                id: generateSplitId(),
                direction,
                sizes: [50, 50],
                children: [existingPane, newPane],
              };

              // Update the layout
              let newLayout: PaneNode;
              if (t.splitLayout === null) {
                // First split - the split container becomes the root
                newLayout = splitContainer;
              } else {
                // Replace the target terminal with the split container
                newLayout = replaceTerminalInTree(t.splitLayout, targetTerminalId, splitContainer);
              }

              return {
                ...t,
                terminals: [...t.terminals, newTerminal],
                splitLayout: newLayout,
                focusedTerminalId: newTerminal.id,
              };
            }),
          };
        }),
      };
    }

    case "workspaces/setFocusedTerminalInTab": {
      const { workspaceId, tabId, terminalId } = action.payload;
      return {
        ...state,
        workspaces: state.workspaces.map((w) => {
          if (w.id !== workspaceId) {
            return w;
          }
          return {
            ...w,
            tabs: w.tabs.map((t) => (t.id === tabId ? { ...t, focusedTerminalId: terminalId } : t)),
          };
        }),
      };
    }

    case "workspaces/resizePanesInTab": {
      const { workspaceId, tabId, splitId, sizes } = action.payload;
      return {
        ...state,
        workspaces: state.workspaces.map((w) => {
          if (w.id !== workspaceId) {
            return w;
          }
          return {
            ...w,
            tabs: w.tabs.map((t) => {
              if (t.id !== tabId || !t.splitLayout) {
                return t;
              }
              return {
                ...t,
                splitLayout: updateSplitSizes(t.splitLayout, splitId, sizes),
              };
            }),
          };
        }),
      };
    }

    case "workspaces/setTabSplitLayout": {
      const { workspaceId, tabId, layout } = action.payload;
      return {
        ...state,
        workspaces: state.workspaces.map((w) => {
          if (w.id !== workspaceId) {
            return w;
          }
          return {
            ...w,
            tabs: w.tabs.map((t) => (t.id === tabId ? { ...t, splitLayout: layout } : t)),
          };
        }),
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
  add: (workspace: WorkspaceWithTabs): WorkspacesAction => ({
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

  removeByRepository: (repositoryId: string): WorkspacesAction => ({
    type: "workspaces/removeByRepository",
    payload: repositoryId,
  }),

  setSelectedApp: (workspaceId: string, appId: ExternalAppId | null): WorkspacesAction => ({
    type: "workspaces/setSelectedApp",
    payload: { workspaceId, appId },
  }),

  // Tab-focused action creators

  addTab: (workspaceId: string, tab: Tab): WorkspacesAction => ({
    type: "workspaces/addTab",
    payload: { workspaceId, tab },
  }),

  removeTab: (workspaceId: string, tabId: string): WorkspacesAction => ({
    type: "workspaces/removeTab",
    payload: { workspaceId, tabId },
  }),

  setActiveTab: (workspaceId: string, tabId: string): WorkspacesAction => ({
    type: "workspaces/setActiveTab",
    payload: { workspaceId, tabId },
  }),

  updateTabLabel: (workspaceId: string, tabId: string, label: string): WorkspacesAction => ({
    type: "workspaces/updateTabLabel",
    payload: { workspaceId, tabId, label },
  }),

  addTerminalToTab: (
    workspaceId: string,
    tabId: string,
    terminal: TerminalSession
  ): WorkspacesAction => ({
    type: "workspaces/addTerminalToTab",
    payload: { workspaceId, tabId, terminal },
  }),

  removeTerminalFromTab: (
    workspaceId: string,
    tabId: string,
    terminalId: string
  ): WorkspacesAction => ({
    type: "workspaces/removeTerminalFromTab",
    payload: { workspaceId, tabId, terminalId },
  }),

  splitTerminalInTab: (
    workspaceId: string,
    tabId: string,
    direction: SplitDirection,
    newTerminal: TerminalSession
  ): WorkspacesAction => ({
    type: "workspaces/splitTerminalInTab",
    payload: { workspaceId, tabId, direction, newTerminal },
  }),

  setFocusedTerminalInTab: (
    workspaceId: string,
    tabId: string,
    terminalId: string | null
  ): WorkspacesAction => ({
    type: "workspaces/setFocusedTerminalInTab",
    payload: { workspaceId, tabId, terminalId },
  }),

  resizePanesInTab: (
    workspaceId: string,
    tabId: string,
    splitId: string,
    sizes: number[]
  ): WorkspacesAction => ({
    type: "workspaces/resizePanesInTab",
    payload: { workspaceId, tabId, splitId, sizes },
  }),

  setTabSplitLayout: (
    workspaceId: string,
    tabId: string,
    layout: PaneNode | null
  ): WorkspacesAction => ({
    type: "workspaces/setTabSplitLayout",
    payload: { workspaceId, tabId, layout },
  }),
};
