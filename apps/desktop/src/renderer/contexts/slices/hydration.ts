import type { Repository, TerminalSession, ExternalAppId } from "@chaosfix/core";
import type { AppState } from "@chaosfix/config";
import type { WorkspaceWithTerminals, WorkspacesState } from "./workspaces.slice";
import type { RepositoriesState } from "./repositories.slice";

// Default PID value for terminals that need to be reconnected
const DEFAULT_TERMINAL_PID = -1;

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
 * Serializable workspace for persistence (dates as ISO strings).
 */
interface SerializedWorkspace {
  id: string;
  name: string;
  repositoryId: string;
  worktreePath: string;
  branchName: string;
  terminals: Array<{
    id: string;
    title: string;
    scrollbackHistory?: string;
  }>;
  activeTerminalId: string | null;
  /** The selected external app for quick-open */
  selectedAppId?: string | null;
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
 * Converts a WorkspaceWithTerminals with Date objects to a serialized format.
 */
function serializeWorkspace(workspace: WorkspaceWithTerminals): SerializedWorkspace {
  return {
    id: workspace.id,
    name: workspace.name,
    repositoryId: workspace.repositoryId,
    worktreePath: workspace.worktreePath,
    branchName: workspace.branchName,
    terminals: workspace.terminals.map((t) => ({
      id: t.id,
      title: t.title,
      scrollbackHistory: undefined,
    })),
    activeTerminalId: workspace.activeTerminalId,
    selectedAppId: workspace.selectedAppId,
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
 * Converts a serialized terminal from persistence to a TerminalSession.
 * Terminals need to be reconnected after hydration, so pid is set to -1.
 */
function deserializeTerminal(
  serialized: AppState["workspaces"][number]["terminals"][number],
  workspaceId: string
): TerminalSession {
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
 * Converts a serialized workspace from persistence to a WorkspaceWithTerminals.
 */
function deserializeWorkspace(serialized: AppState["workspaces"][number]): WorkspaceWithTerminals {
  return {
    id: serialized.id,
    name: serialized.name,
    repositoryId: serialized.repositoryId,
    worktreePath: serialized.worktreePath,
    branchName: serialized.branchName,
    status: "idle",
    terminals: serialized.terminals.map((t) => deserializeTerminal(t, serialized.id)),
    activeTerminalId: serialized.activeTerminalId,
    selectedAppId: (serialized.selectedAppId as ExternalAppId) ?? null,
    createdAt: new Date(serialized.createdAt),
    updatedAt: new Date(serialized.updatedAt),
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
