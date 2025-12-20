import { create } from "zustand";
import type { Repository, Workspace, WorkspaceStatus, TerminalSession } from "@chaosfix/core";

interface WorkspaceWithTerminals extends Omit<Workspace, "status"> {
  status: WorkspaceStatus;
  terminals: TerminalSession[];
  activeTerminalId: string | null;
}

interface AppState {
  // Data
  repositories: Repository[];
  workspaces: WorkspaceWithTerminals[];
  activeWorkspaceId: string | null;

  // UI State
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  searchQuery: string;

  // Actions
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

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  repositories: [],
  workspaces: [],
  activeWorkspaceId: null,
  sidebarCollapsed: false,
  sidebarWidth: 250,
  searchQuery: "",

  // Actions
  setSearchQuery: (query) => set({ searchQuery: query }),
  addRepository: (repo) =>
    set((state) => ({
      repositories: [...state.repositories, repo],
    })),

  removeRepository: (repoId) =>
    set((state) => ({
      repositories: state.repositories.filter((r) => r.id !== repoId),
      workspaces: state.workspaces.filter((w) => w.repositoryId !== repoId),
    })),

  addWorkspace: (workspace) =>
    set((state) => ({
      workspaces: [...state.workspaces, workspace],
      activeWorkspaceId: workspace.id,
    })),

  removeWorkspace: (workspaceId) =>
    set((state) => {
      const newWorkspaces = state.workspaces.filter((w) => w.id !== workspaceId);
      return {
        workspaces: newWorkspaces,
        activeWorkspaceId:
          state.activeWorkspaceId === workspaceId
            ? newWorkspaces[0]?.id ?? null
            : state.activeWorkspaceId,
      };
    }),

  setActiveWorkspace: (workspaceId) =>
    set({ activeWorkspaceId: workspaceId }),

  updateWorkspaceStatus: (workspaceId, status) =>
    set((state) => ({
      workspaces: state.workspaces.map((w) =>
        w.id === workspaceId ? { ...w, status } : w
      ),
    })),

  addTerminal: (workspaceId, terminal) =>
    set((state) => ({
      workspaces: state.workspaces.map((w) =>
        w.id === workspaceId
          ? {
              ...w,
              terminals: [...w.terminals, terminal],
              activeTerminalId: terminal.id,
            }
          : w
      ),
    })),

  removeTerminal: (workspaceId, terminalId) =>
    set((state) => ({
      workspaces: state.workspaces.map((w) => {
        if (w.id !== workspaceId) {
          return w;
        }
        const newTerminals = w.terminals.filter((t) => t.id !== terminalId);
        return {
          ...w,
          terminals: newTerminals,
          activeTerminalId:
            w.activeTerminalId === terminalId
              ? newTerminals[0]?.id ?? null
              : w.activeTerminalId,
        };
      }),
    })),

  setActiveTerminal: (workspaceId, terminalId) =>
    set((state) => ({
      workspaces: state.workspaces.map((w) =>
        w.id === workspaceId ? { ...w, activeTerminalId: terminalId } : w
      ),
    })),

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setSidebarWidth: (width) =>
    set({ sidebarWidth: width }),
}));
