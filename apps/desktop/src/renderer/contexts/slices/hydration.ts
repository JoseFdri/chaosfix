import type { Repository, TerminalSession, ExternalAppId, PaneNode, Tab } from "@chaosfix/core";
import type { AppState } from "@chaosfix/config";
import type { WorkspaceWithTabs, WorkspacesState } from "./workspaces.slice";
import type { RepositoriesState } from "./repositories.slice";

// Default PID value for terminals that need to be reconnected
const DEFAULT_TERMINAL_PID = -1;

/**
 * Extracts all terminal IDs from a split layout tree.
 * Used for validation during deserialization.
 */
function getAllTerminalIdsFromLayout(node: PaneNode): string[] {
  if (node.type === "terminal") {
    return [node.terminalId];
  }
  return node.children.flatMap((child) => getAllTerminalIdsFromLayout(child));
}

/**
 * Validates that all terminal IDs referenced in a split layout exist in the terminal list.
 * Returns the layout if valid, null if invalid (to reset to non-split state).
 */
function validateSplitLayout(layout: PaneNode | null, terminalIds: string[]): PaneNode | null {
  if (!layout) {
    return null;
  }

  const layoutTerminalIds = getAllTerminalIdsFromLayout(layout);
  const terminalIdSet = new Set(terminalIds);
  const allExist = layoutTerminalIds.every((id) => terminalIdSet.has(id));

  // If any referenced terminal doesn't exist, reset the layout
  return allExist ? layout : null;
}

/**
 * Hydration action for restoring state from persistence.
 * This is a top-level action handled directly in the app reducer.
 */
export type HydrationAction = {
  type: "hydration/hydrate";
  payload: AppState;
};

/**
 * Hydration action creator.
 */
export const hydrationActions = {
  hydrate: (appState: AppState): HydrationAction => ({
    type: "hydration/hydrate",
    payload: appState,
  }),
};

/**
 * Serializable repository for persistence (dates as ISO strings).
 */
interface SerializedRepository {
  id: string;
  name: string;
  path: string;
  defaultBranch: string;
  branchFrom?: string;
  defaultRemote?: string;
  saveConfigToRepo?: boolean;
  workspaces: string[];
  createdAt: string;
}

/**
 * Serializable terminal for persistence.
 */
interface SerializedTerminal {
  id: string;
  title: string;
  scrollbackHistory?: string;
}

/**
 * Serializable tab for persistence.
 */
interface SerializedTab {
  id: string;
  label: string;
  terminals: SerializedTerminal[];
  splitLayout: PaneNode | null;
  focusedTerminalId: string | null;
  createdAt: number;
}

/**
 * Serializable workspace for persistence (dates as ISO strings).
 * Supports both old (terminals array) and new (tabs array) format for migration.
 */
interface SerializedWorkspace {
  id: string;
  name: string;
  repositoryId: string;
  worktreePath: string;
  branchName: string;
  /** @deprecated Use tabs instead. Kept for backward compatibility during migration. */
  terminals?: Array<{
    id: string;
    title: string;
    scrollbackHistory?: string;
  }>;
  /** @deprecated Use tabs instead. Kept for backward compatibility during migration. */
  activeTerminalId?: string | null;
  /** @deprecated Use tabs instead. Kept for backward compatibility during migration. */
  splitLayout?: PaneNode | null;
  /** @deprecated Use tabs instead. Kept for backward compatibility during migration. */
  focusedTerminalId?: string | null;
  /** The selected external app for quick-open */
  selectedAppId?: string | null;
  /** Tab-centric model: array of tabs */
  tabs?: SerializedTab[];
  /** Tab-centric model: currently active tab ID */
  activeTabId?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Serializable state for persistence.
 */
export interface SerializableState {
  repositories: SerializedRepository[];
  workspaces: SerializedWorkspace[];
  activeWorkspaceId: string | null;
}

/**
 * Converts a Repository with Date objects to a serialized format with ISO strings.
 */
function serializeRepository(repo: Repository): SerializedRepository {
  return {
    id: repo.id,
    name: repo.name,
    path: repo.path,
    defaultBranch: repo.defaultBranch,
    branchFrom: repo.branchFrom,
    defaultRemote: repo.defaultRemote,
    saveConfigToRepo: repo.saveConfigToRepo,
    workspaces: repo.workspaces,
    createdAt: repo.createdAt.toISOString(),
  };
}

/**
 * Converts a WorkspaceWithTabs with Date objects to a serialized format.
 */
function serializeWorkspace(workspace: WorkspaceWithTabs): SerializedWorkspace {
  return {
    id: workspace.id,
    name: workspace.name,
    repositoryId: workspace.repositoryId,
    worktreePath: workspace.worktreePath,
    branchName: workspace.branchName,
    selectedAppId: workspace.selectedAppId,
    // Serialize tabs with tab-centric model
    tabs: workspace.tabs.map((tab) => ({
      id: tab.id,
      label: tab.label,
      terminals: tab.terminals.map((t) => ({
        id: t.id,
        title: t.title,
        scrollbackHistory: undefined,
      })),
      splitLayout: tab.splitLayout,
      focusedTerminalId: tab.focusedTerminalId,
      createdAt: tab.createdAt,
    })),
    activeTabId: workspace.activeTabId,
    createdAt: workspace.createdAt.toISOString(),
    updatedAt: workspace.updatedAt.toISOString(),
  };
}

/**
 * Extracts serializable state from repositories and workspaces state.
 * Converts Date objects to ISO strings for JSON persistence.
 */
export function extractSerializableState(
  repositoriesState: RepositoriesState,
  workspacesState: WorkspacesState
): SerializableState {
  return {
    repositories: repositoriesState.repositories.map(serializeRepository),
    workspaces: workspacesState.workspaces.map(serializeWorkspace),
    activeWorkspaceId: workspacesState.activeWorkspaceId,
  };
}

/**
 * Converts a serialized repository from persistence to a Repository with Date objects.
 */
function deserializeRepository(serialized: AppState["repositories"][number]): Repository {
  return {
    id: serialized.id,
    name: serialized.name,
    path: serialized.path,
    defaultBranch: serialized.defaultBranch,
    branchFrom: serialized.branchFrom,
    defaultRemote: serialized.defaultRemote,
    saveConfigToRepo: serialized.saveConfigToRepo,
    workspaces: [],
    createdAt: new Date(),
  };
}

/**
 * Shape of a serialized terminal from persistence.
 */
interface PersistedTerminal {
  id: string;
  title: string;
  scrollbackHistory?: string;
}

/**
 * Converts a serialized terminal from persistence to a TerminalSession.
 * Terminals need to be reconnected after hydration, so pid is set to -1.
 */
function deserializeTerminal(serialized: PersistedTerminal, workspaceId: string): TerminalSession {
  return {
    id: serialized.id,
    title: serialized.title,
    workspaceId,
    pid: DEFAULT_TERMINAL_PID,
    status: "closed",
    createdAt: new Date(),
  };
}

/**
 * Migrates old workspace format (terminals array) to new tab-centric format.
 * Creates a single tab containing all terminals and the split layout.
 */
function migrateOldWorkspaceToTabs(
  serialized: AppState["workspaces"][number],
  workspaceId: string
): { tabs: Tab[]; activeTabId: string | null } {
  const terminals = serialized.terminals ?? [];
  if (terminals.length === 0) {
    return { tabs: [], activeTabId: null };
  }

  // Get terminal IDs for validation
  const terminalIds = terminals.map((t) => t.id);

  // Cast and validate split layout
  const rawSplitLayout = serialized.splitLayout as PaneNode | null | undefined;
  const validatedSplitLayout = validateSplitLayout(rawSplitLayout ?? null, terminalIds);

  // Validate focusedTerminalId
  const focusedTerminalId = serialized.focusedTerminalId;
  const validatedFocusedTerminalId =
    focusedTerminalId && terminalIds.includes(focusedTerminalId) ? focusedTerminalId : null;

  // Create a single tab containing all terminals
  const tab: Tab = {
    id: `${workspaceId}-migrated-tab`,
    label: terminals[0]?.title || "Terminal",
    terminals: terminals.map((t) => deserializeTerminal(t, workspaceId)),
    splitLayout: validatedSplitLayout,
    focusedTerminalId: validatedFocusedTerminalId,
    createdAt: Date.now(),
  };

  return { tabs: [tab], activeTabId: tab.id };
}

/**
 * Deserializes tabs from the new tab-centric format.
 */
function deserializeTabs(serializedTabs: SerializedTab[] | undefined, workspaceId: string): Tab[] {
  if (!serializedTabs || serializedTabs.length === 0) {
    return [];
  }

  return serializedTabs.map((tab) => {
    // Get terminal IDs for validation
    const terminalIds = tab.terminals.map((t) => t.id);

    // Validate split layout
    const validatedSplitLayout = validateSplitLayout(tab.splitLayout, terminalIds);

    // Validate focusedTerminalId
    const validatedFocusedTerminalId =
      tab.focusedTerminalId && terminalIds.includes(tab.focusedTerminalId)
        ? tab.focusedTerminalId
        : null;

    return {
      id: tab.id,
      label: tab.label,
      terminals: tab.terminals.map((t) => deserializeTerminal(t, workspaceId)),
      splitLayout: validatedSplitLayout,
      focusedTerminalId: validatedFocusedTerminalId,
      createdAt: tab.createdAt,
    };
  });
}

/**
 * Converts a serialized workspace from persistence to a WorkspaceWithTabs.
 * Handles migration from old (terminals array) to new (tabs array) format.
 */
function deserializeWorkspace(serialized: AppState["workspaces"][number]): WorkspaceWithTabs {
  // Check if this is new tab-centric format or old format
  const hasTabsFormat = Array.isArray((serialized as unknown as SerializedWorkspace).tabs);

  let tabs: Tab[];
  let activeTabId: string | null;

  if (hasTabsFormat) {
    // New tab-centric format
    const serializedWorkspace = serialized as unknown as SerializedWorkspace;
    tabs = deserializeTabs(serializedWorkspace.tabs, serialized.id);
    activeTabId = serializedWorkspace.activeTabId ?? tabs[0]?.id ?? null;
  } else {
    // Old format - migrate to tab-centric
    const migrated = migrateOldWorkspaceToTabs(serialized, serialized.id);
    tabs = migrated.tabs;
    activeTabId = migrated.activeTabId;
  }

  return {
    id: serialized.id,
    name: serialized.name,
    repositoryId: serialized.repositoryId,
    worktreePath: serialized.worktreePath,
    branchName: serialized.branchName,
    status: "idle",
    selectedAppId: (serialized.selectedAppId as ExternalAppId) ?? null,
    createdAt: new Date(serialized.createdAt),
    updatedAt: new Date(serialized.updatedAt),
    tabs,
    activeTabId,
  };
}

/**
 * Converts persisted AppState to hydrated repositories state.
 */
export function hydrateRepositoriesState(appState: AppState): RepositoriesState {
  const workspacesByRepo = new Map<string, string[]>();

  for (const workspace of appState.workspaces) {
    const existing = workspacesByRepo.get(workspace.repositoryId) ?? [];
    existing.push(workspace.id);
    workspacesByRepo.set(workspace.repositoryId, existing);
  }

  return {
    repositories: appState.repositories.map((repo) => ({
      ...deserializeRepository(repo),
      workspaces: workspacesByRepo.get(repo.id) ?? [],
    })),
  };
}

/**
 * Converts persisted AppState to hydrated workspaces state.
 */
export function hydrateWorkspacesState(appState: AppState): WorkspacesState {
  return {
    workspaces: appState.workspaces.map(deserializeWorkspace),
    activeWorkspaceId: appState.activeWorkspaceId,
  };
}
