import type {
  Workspace,
  WorkspaceStatus,
  TerminalSession,
  ExternalAppId,
  PaneNode,
  SplitDirection,
  TerminalPane,
  SplitPane,
} from "@chaosfix/core";
import type { Slice } from "./types";

// Extended workspace type with terminal management
export interface WorkspaceWithTerminals extends Omit<Workspace, "status"> {
  status: WorkspaceStatus;
  terminals: TerminalSession[];
  activeTerminalId: string | null;
  /** The selected external app for quick-open (persisted per workspace) */
  selectedAppId: ExternalAppId | null;
  /** Split pane layout tree (null means no splits, single terminal) */
  splitLayout: PaneNode | null;
  /** The terminal pane that currently has keyboard focus */
  focusedTerminalId: string | null;
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
  | { type: "workspaces/removeByRepository"; payload: string }
  | {
      type: "workspaces/setSelectedApp";
      payload: { workspaceId: string; appId: ExternalAppId | null };
    }
  | {
      type: "workspaces/splitTerminal";
      payload: { workspaceId: string; direction: SplitDirection; newTerminal: TerminalSession };
    }
  | { type: "workspaces/closePane"; payload: { workspaceId: string; terminalId: string } }
  | {
      type: "workspaces/resizePanes";
      payload: { workspaceId: string; splitId: string; sizes: number[] };
    }
  | {
      type: "workspaces/setFocusedPane";
      payload: { workspaceId: string; terminalId: string | null };
    }
  | {
      type: "workspaces/setSplitLayout";
      payload: { workspaceId: string; layout: PaneNode | null };
    };

// Initial state
const initialState: WorkspacesState = {
  workspaces: [],
  activeWorkspaceId: null,
};

// ============================================================================
// Helper functions for split pane tree operations
// ============================================================================

/**
 * Generates a unique ID for split panes.
 * Uses a simple counter with timestamp prefix for uniqueness.
 */
function generateSplitId(): string {
  return `split-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Updates sizes for a specific split pane by ID.
 */
function updateSplitSizes(node: PaneNode, splitId: string, sizes: number[]): PaneNode {
  if (node.type === "terminal") {
    return node;
  }

  if (node.id === splitId) {
    return { ...node, sizes };
  }

  return {
    ...node,
    children: node.children.map((child) => updateSplitSizes(child, splitId, sizes)),
  };
}

/**
 * Removes a terminal from the tree and collapses splits if only one child remains.
 * Returns the updated tree or null if the tree should be cleared.
 */
function removeTerminalFromTree(node: PaneNode, terminalId: string): PaneNode | null {
  if (node.type === "terminal") {
    if (node.terminalId === terminalId) {
      return null;
    }
    return node;
  }

  const updatedChildren: PaneNode[] = [];
  const keptIndices: number[] = [];

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (child) {
      const updated = removeTerminalFromTree(child, terminalId);
      if (updated !== null) {
        updatedChildren.push(updated);
        keptIndices.push(i);
      }
    }
  }

  if (updatedChildren.length === 0) {
    return null;
  }

  if (updatedChildren.length === 1) {
    // Collapse this split - return the single remaining child
    const firstChild = updatedChildren[0];
    return firstChild ?? null;
  }

  // Recalculate sizes proportionally from kept children
  const keptSizes: number[] = [];
  for (const idx of keptIndices) {
    const size = node.sizes[idx];
    if (typeof size === "number") {
      keptSizes.push(size);
    }
  }

  const totalKeptSize = keptSizes.reduce((sum, s) => sum + s, 0);

  // Normalize to sum to 100
  const normalizedSizes =
    totalKeptSize > 0
      ? keptSizes.map((s) => (s / totalKeptSize) * 100)
      : updatedChildren.map(() => 100 / updatedChildren.length);

  return {
    ...node,
    children: updatedChildren,
    sizes: normalizedSizes,
  };
}

/**
 * Gets all terminal IDs from a pane tree.
 */
export function getAllTerminalIds(node: PaneNode): string[] {
  if (node.type === "terminal") {
    return [node.terminalId];
  }

  return node.children.flatMap((child) => getAllTerminalIds(child));
}

/**
 * Replaces a terminal pane with a new node (used when splitting).
 */
function replaceTerminalInTree(
  node: PaneNode,
  terminalId: string,
  replacement: PaneNode
): PaneNode {
  if (node.type === "terminal") {
    if (node.terminalId === terminalId) {
      return replacement;
    }
    return node;
  }

  return {
    ...node,
    children: node.children.map((child) => replaceTerminalInTree(child, terminalId, replacement)),
  };
}

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
        workspaces: state.workspaces.map((w) => {
          if (w.id !== action.payload.workspaceId) {
            return w;
          }

          // If there's a split layout, collapse it to just the first terminal
          // (removing terminals that were created for the split panes)
          let terminalsToKeep = w.terminals;
          if (w.splitLayout) {
            const splitTerminalIds = getAllTerminalIds(w.splitLayout);
            const firstSplitTerminalId = splitTerminalIds[0];
            // Keep only the first terminal from the split (the original)
            terminalsToKeep = w.terminals.filter(
              (t) => t.id === firstSplitTerminalId || !splitTerminalIds.includes(t.id)
            );
          }

          return {
            ...w,
            terminals: [...terminalsToKeep, action.payload.terminal],
            activeTerminalId: action.payload.terminal.id,
            // Clear split layout when adding a new tab
            splitLayout: null,
            focusedTerminalId: null,
          };
        }),
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
          let updatedLayout = w.splitLayout
            ? removeTerminalFromTree(w.splitLayout, action.payload.terminalId)
            : null;

          // If the layout collapsed to a single terminal, clear it entirely
          if (updatedLayout?.type === "terminal") {
            updatedLayout = null;
          }

          return {
            ...w,
            terminals: newTerminals,
            activeTerminalId:
              w.activeTerminalId === action.payload.terminalId
                ? (newTerminals[0]?.id ?? null)
                : w.activeTerminalId,
            splitLayout: updatedLayout,
            focusedTerminalId:
              w.focusedTerminalId === action.payload.terminalId
                ? (newTerminals[0]?.id ?? null)
                : w.focusedTerminalId,
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

    case "workspaces/setSelectedApp": {
      return {
        ...state,
        workspaces: state.workspaces.map((w) =>
          w.id === action.payload.workspaceId ? { ...w, selectedAppId: action.payload.appId } : w
        ),
      };
    }

    case "workspaces/splitTerminal": {
      const { workspaceId, direction, newTerminal } = action.payload;
      return {
        ...state,
        workspaces: state.workspaces.map((w) => {
          if (w.id !== workspaceId) {
            return w;
          }

          // Get the terminal to split (focused or active)
          const targetTerminalId = w.focusedTerminalId ?? w.activeTerminalId;
          if (!targetTerminalId) {
            // No terminal to split, just add the new terminal
            return {
              ...w,
              terminals: [...w.terminals, newTerminal],
              activeTerminalId: newTerminal.id,
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
          if (w.splitLayout === null) {
            // First split - the split container becomes the root
            newLayout = splitContainer;
          } else {
            // Replace the target terminal with the split container
            newLayout = replaceTerminalInTree(w.splitLayout, targetTerminalId, splitContainer);
          }

          return {
            ...w,
            terminals: [...w.terminals, newTerminal],
            splitLayout: newLayout,
            focusedTerminalId: newTerminal.id,
          };
        }),
      };
    }

    case "workspaces/closePane": {
      const { workspaceId, terminalId } = action.payload;
      return {
        ...state,
        workspaces: state.workspaces.map((w) => {
          if (w.id !== workspaceId) {
            return w;
          }

          const newTerminals = w.terminals.filter((t) => t.id !== terminalId);
          let updatedLayout = w.splitLayout
            ? removeTerminalFromTree(w.splitLayout, terminalId)
            : null;

          // If the layout collapsed to a single terminal, clear it entirely
          // (a TerminalPane means only one terminal remains, no need for split)
          if (updatedLayout?.type === "terminal") {
            updatedLayout = null;
          }

          // Determine new focused terminal
          let newFocusedId: string | null = null;
          if (w.focusedTerminalId === terminalId) {
            // If we removed the focused terminal, focus another from the layout or terminals
            if (updatedLayout) {
              const remainingIds = getAllTerminalIds(updatedLayout);
              newFocusedId = remainingIds[0] ?? null;
            } else {
              newFocusedId = newTerminals[0]?.id ?? null;
            }
          } else {
            newFocusedId = w.focusedTerminalId;
          }

          return {
            ...w,
            terminals: newTerminals,
            activeTerminalId:
              w.activeTerminalId === terminalId
                ? (newTerminals[0]?.id ?? null)
                : w.activeTerminalId,
            splitLayout: updatedLayout,
            focusedTerminalId: newFocusedId,
          };
        }),
      };
    }

    case "workspaces/resizePanes": {
      const { workspaceId, splitId, sizes } = action.payload;
      return {
        ...state,
        workspaces: state.workspaces.map((w) => {
          if (w.id !== workspaceId || !w.splitLayout) {
            return w;
          }

          return {
            ...w,
            splitLayout: updateSplitSizes(w.splitLayout, splitId, sizes),
          };
        }),
      };
    }

    case "workspaces/setFocusedPane": {
      return {
        ...state,
        workspaces: state.workspaces.map((w) =>
          w.id === action.payload.workspaceId
            ? { ...w, focusedTerminalId: action.payload.terminalId }
            : w
        ),
      };
    }

    case "workspaces/setSplitLayout": {
      return {
        ...state,
        workspaces: state.workspaces.map((w) =>
          w.id === action.payload.workspaceId ? { ...w, splitLayout: action.payload.layout } : w
        ),
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

  setSelectedApp: (workspaceId: string, appId: ExternalAppId | null): WorkspacesAction => ({
    type: "workspaces/setSelectedApp",
    payload: { workspaceId, appId },
  }),

  splitTerminal: (
    workspaceId: string,
    direction: SplitDirection,
    newTerminal: TerminalSession
  ): WorkspacesAction => ({
    type: "workspaces/splitTerminal",
    payload: { workspaceId, direction, newTerminal },
  }),

  closePane: (workspaceId: string, terminalId: string): WorkspacesAction => ({
    type: "workspaces/closePane",
    payload: { workspaceId, terminalId },
  }),

  resizePanes: (workspaceId: string, splitId: string, sizes: number[]): WorkspacesAction => ({
    type: "workspaces/resizePanes",
    payload: { workspaceId, splitId, sizes },
  }),

  setFocusedPane: (workspaceId: string, terminalId: string | null): WorkspacesAction => ({
    type: "workspaces/setFocusedPane",
    payload: { workspaceId, terminalId },
  }),

  setSplitLayout: (workspaceId: string, layout: PaneNode | null): WorkspacesAction => ({
    type: "workspaces/setSplitLayout",
    payload: { workspaceId, layout },
  }),
};
