import { type FC, useCallback } from "react";
import { useDragResize } from "@chaosfix/ui";
import type { TerminalSession, Tab } from "@chaosfix/core";
import { useApp, type WorkspaceWithTabs } from "./contexts/app-context";
import {
  useFilteredRepositories,
  useRepositoryActions,
  useWorkspaceTabs,
  useAppHandlers,
  usePersistence,
  useCreateWorkspace,
  useRemoveWorkspace,
  useTheme,
  useSetupScript,
  useExternalApps,
  useCloneRepository,
  useSplitActions,
  useKeyboardShortcuts,
  useTabLifecycle,
  useTerminalExit,
  useSelectedAppDropdown,
  useRepositorySettingsDialog,
} from "./hooks";
import { NotificationContainer } from "./components/NotificationContainer.component";
import { AppDialogs } from "./components/AppDialogs.component";
import { AppSidebar } from "./components/AppSidebar.component";
import { WorkspaceHeader } from "./components/WorkspaceHeader.component";
import { WorkspaceTerminalArea } from "./components/WorkspaceTerminalArea.component";
import {
  DEFAULT_TERMINAL_LABEL,
  INITIAL_TERMINAL_PID,
  DEFAULT_TERMINAL_STATUS,
  MIN_SIDEBAR_WIDTH,
  MAX_SIDEBAR_WIDTH,
} from "../constants";

/**
 * Creates an initial tab with a terminal session for a workspace.
 */
function createInitialTab(workspaceId: string): Tab {
  const terminal: TerminalSession = {
    id: `${workspaceId}-${Date.now()}`,
    workspaceId,
    pid: INITIAL_TERMINAL_PID,
    title: DEFAULT_TERMINAL_LABEL,
    status: DEFAULT_TERMINAL_STATUS,
    createdAt: new Date(),
  };

  return {
    id: `${workspaceId}-tab-${Date.now()}`,
    label: DEFAULT_TERMINAL_LABEL,
    terminals: [terminal],
    splitLayout: null,
    focusedTerminalId: terminal.id,
    createdAt: Date.now(),
  };
}

/**
 * Handles workspace click by setting it active and auto-creating a tab if needed.
 */
function handleWorkspaceClick(
  workspace: WorkspaceWithTabs,
  setActive: (workspaceId: string | null) => void,
  addTab: (workspaceId: string, tab: Tab) => void
): void {
  setActive(workspace.id);

  // If workspace has no tabs, create an initial tab with a terminal
  if (workspace.tabs.length === 0) {
    const tab = createInitialTab(workspace.id);
    addTab(workspace.id, tab);
  }
}

export const App: FC = () => {
  const {
    state,
    repositories: repositoriesActions,
    workspaces: workspacesActions,
    ui,
    persistence,
    notifications,
    hydrateState,
    getSerializableState,
  } = useApp();

  // Destructure state for easier access
  const allRepositories = state.repositories.repositories;
  const allWorkspaces = state.workspaces.workspaces;
  const activeWorkspaceId = state.workspaces.activeWorkspaceId;
  const sidebarCollapsed = state.ui.sidebarCollapsed;
  const searchQuery = state.ui.searchQuery;

  // Sidebar resize
  const {
    width: sidebarWidth,
    isDragging,
    handleMouseDown,
  } = useDragResize({
    initialWidth: state.ui.sidebarWidth,
    minWidth: MIN_SIDEBAR_WIDTH,
    maxWidth: MAX_SIDEBAR_WIDTH,
    onWidthChange: ui.setSidebarWidth,
  });

  // Theme management
  const { isDark, toggleTheme } = useTheme();

  // External apps integration (Open in VSCode, Finder, etc.)
  const { apps, openIn, isLoading: isLoadingExternalApps } = useExternalApps();

  // Initialize persistence (load on mount, auto-save on changes)
  usePersistence({
    repositories: allRepositories,
    workspaces: allWorkspaces,
    hydrateState,
    getSerializableState,
    setPersistenceLoading: persistence.setLoading,
    setPersistenceSaved: persistence.setSaved,
    setPersistenceError: persistence.setError,
  });

  const filteredRepositories = useFilteredRepositories({
    repositories: allRepositories,
    searchQuery,
    workspaces: allWorkspaces,
  });
  const { handleAddRepository } = useRepositoryActions({
    repositories: allRepositories,
    addRepository: repositoriesActions.add,
  });

  const activeWorkspace = allWorkspaces.find((w) => w.id === activeWorkspaceId);
  const activeRepository = activeWorkspace
    ? allRepositories.find((r) => r.id === activeWorkspace.repositoryId)
    : null;

  // Compute selected app with icon for the OpenInDropdown
  const { selectedApp: selectedAppForDropdown } = useSelectedAppDropdown({
    activeWorkspace,
    apps,
  });

  const { tabs, handleTabSelect, handleTabClose, handleTabRename, handleNewTab } = useWorkspaceTabs(
    {
      activeWorkspace,
      onAddTab: workspacesActions.addTab,
      onRemoveTab: workspacesActions.removeTab,
      onSetActiveTab: workspacesActions.setActiveTab,
      onUpdateTabLabel: workspacesActions.updateTabLabel,
    }
  );

  // Split pane actions hook - all split operations are now tab-scoped
  const { handleSplit, handleResizePanes, handlePaneClick, handleClosePane, canSplit, activeTab } =
    useSplitActions({
      activeWorkspace,
      onSplitTerminalInTab: workspacesActions.splitTerminalInTab,
      onResizePanesInTab: workspacesActions.resizePanesInTab,
      onSetFocusedTerminalInTab: workspacesActions.setFocusedTerminalInTab,
      onRemoveTerminalFromTab: workspacesActions.removeTerminalFromTab,
    });

  // Keyboard shortcuts for split operations - now use activeTab
  useKeyboardShortcuts({
    canSplit,
    hasSplitLayout: Boolean(activeTab?.splitLayout),
    focusedTerminalId: activeTab?.focusedTerminalId ?? activeTab?.terminals[0]?.id ?? null,
    onSplit: handleSplit,
    onClosePane: handleClosePane,
    onCloseTab: handleTabClose,
  });

  // Tab lifecycle hook - handles PTY cleanup when tabs are removed
  useTabLifecycle({ workspaces: allWorkspaces });

  // Handle terminal process exit - close the pane or the entire tab
  const { handleTerminalExit } = useTerminalExit({
    workspaces: allWorkspaces,
    onRemoveTerminalFromTab: workspacesActions.removeTerminalFromTab,
    onRemoveTab: workspacesActions.removeTab,
  });

  // Setup script hook for running workspace setup after creation
  const { runSetup } = useSetupScript({
    updateWorkspaceStatus: workspacesActions.updateStatus,
    onError: (_workspaceId, error) => {
      notifications.add({
        type: "error",
        title: "Setup Failed",
        message: `Workspace setup script failed: ${error}`,
      });
    },
  });

  // Workspace creation dialog state and handlers
  const {
    isDialogOpen,
    openDialog,
    closeDialog,
    isLoading: isCreatingWorkspace,
    handleSubmit: handleWorkspaceSubmit,
    pendingRepository,
    defaultWorkspaceName,
  } = useCreateWorkspace({
    addWorkspace: workspacesActions.add,
    onSuccess: (workspace) => {
      // Auto-create initial tab with terminal for the new workspace
      const tab = createInitialTab(workspace.id);
      workspacesActions.addTab(workspace.id, tab);

      // Run setup script in the background (after workspace is in state)
      // Config can be stored in repo (chaosfix.json) or app storage (~/.chaosfix/configs/{repoId}.json)
      const repository = allRepositories.find((r) => r.id === workspace.repositoryId);
      if (repository) {
        runSetup(workspace.id, workspace.worktreePath, repository.id, repository.path);
      }
    },
  });

  const { handleNewWorkspace, handleCloneFromUrl } = useAppHandlers({
    onNewWorkspace: openDialog,
    onCloneFromUrl: () => setCloneDialogOpen(true),
  });

  // Repository settings dialog state and handlers
  const {
    activeSettingsRepoId,
    activeSettingsRepo,
    openSettingsDialog,
    closeSettingsDialog,
    handleRepositorySettingsChange,
    handleRepositoryRemove,
  } = useRepositorySettingsDialog({
    repositories: allRepositories,
    updateRepository: repositoriesActions.update,
    removeRepository: repositoriesActions.remove,
  });

  // Workspace removal dialog state and handlers
  const {
    isDialogOpen: isRemoveDialogOpen,
    openDialog: openRemoveDialog,
    closeDialog: closeRemoveDialog,
    isLoading: isRemovingWorkspace,
    handleConfirm: handleRemoveConfirm,
  } = useRemoveWorkspace({
    removeWorkspace: workspacesActions.remove,
  });

  // Clone repository dialog state and handlers
  const {
    isOpen: isCloneDialogOpen,
    setIsOpen: setCloneDialogOpen,
    progress: cloneProgress,
    isCloning,
    handleClone,
    handleSelectDirectory,
  } = useCloneRepository({
    onSuccess: (result) => {
      repositoriesActions.add({
        id: crypto.randomUUID(),
        name: result.repoName,
        path: result.path,
        defaultBranch: result.defaultBranch,
        workspaces: [],
        createdAt: new Date(),
      });
    },
    onError: (error) => {
      notifications.add({
        type: "error",
        title: "Clone Failed",
        message: error,
      });
    },
  });

  // Sidebar workspace click handler - sets active and auto-creates tab if needed
  const handleSidebarWorkspaceClick = useCallback(
    (workspace: WorkspaceWithTabs) => {
      handleWorkspaceClick(workspace, workspacesActions.setActive, workspacesActions.addTab);
    },
    [workspacesActions.setActive, workspacesActions.addTab]
  );

  // Sidebar remove workspace handler - opens dialog with workspace and repo path
  const handleSidebarRemoveWorkspace = useCallback(
    (workspace: WorkspaceWithTabs, repositoryPath: string) => {
      openRemoveDialog(workspace, repositoryPath);
    },
    [openRemoveDialog]
  );

  return (
    <>
      {/* Application Dialogs */}
      <AppDialogs
        createWorkspace={{
          isOpen: isDialogOpen,
          isLoading: isCreatingWorkspace,
          pendingRepositoryName: pendingRepository?.name ?? null,
          defaultWorkspaceName,
          onOpenChange: (open) => {
            if (!open) {
              closeDialog();
            }
          },
          onSubmit: handleWorkspaceSubmit,
          onCancel: closeDialog,
        }}
        removeWorkspace={{
          isOpen: isRemoveDialogOpen,
          isLoading: isRemovingWorkspace,
          onOpenChange: (open) => {
            if (!open) {
              closeRemoveDialog();
            }
          },
          onConfirm: handleRemoveConfirm,
          onCancel: closeRemoveDialog,
        }}
        repositorySettings={{
          activeRepoId: activeSettingsRepoId,
          activeRepo: activeSettingsRepo,
          onOpenChange: (open) => {
            if (!open) {
              closeSettingsDialog();
            }
          },
          onSettingsChange: handleRepositorySettingsChange,
          onRemove: handleRepositoryRemove,
        }}
        clone={{
          isOpen: isCloneDialogOpen,
          isCloning,
          progress: cloneProgress,
          onOpenChange: setCloneDialogOpen,
          onClone: handleClone,
          onSelectDirectory: handleSelectDirectory,
        }}
      />

      <div className="flex h-screen bg-surface-primary text-text-primary">
        {/* Sidebar */}
        <AppSidebar
          width={sidebarWidth}
          collapsed={sidebarCollapsed}
          isResizing={isDragging}
          activeWorkspaceId={activeWorkspaceId}
          filteredRepositories={filteredRepositories}
          allWorkspaces={allWorkspaces}
          searchQuery={searchQuery}
          search={{
            value: searchQuery,
            onChange: ui.setSearchQuery,
            onClear: () => ui.setSearchQuery(""),
          }}
          footer={{ onAddRepository: handleAddRepository }}
          workspaceHandlers={{
            onWorkspaceClick: handleSidebarWorkspaceClick,
            onRemoveWorkspace: handleSidebarRemoveWorkspace,
          }}
          onSettingsClick={openSettingsDialog}
          onNewWorkspace={handleNewWorkspace}
          onResizeHandleMouseDown={handleMouseDown}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Workspace Header (Title Bar, Status Bar, Tab Bar) */}
          {activeWorkspace && (
            <WorkspaceHeader
              activeWorkspace={activeWorkspace}
              activeRepositoryName={activeRepository?.name}
              tabs={tabs}
              theme={{
                isDark,
                onToggle: toggleTheme,
              }}
              tabHandlers={{
                onTabSelect: handleTabSelect,
                onTabClose: handleTabClose,
                onTabRename: handleTabRename,
                onNewTab: handleNewTab,
              }}
              externalApps={{
                apps,
                selectedApp: selectedAppForDropdown,
                isLoading: isLoadingExternalApps,
                onSelect: (appId) => {
                  if (activeWorkspace.worktreePath) {
                    workspacesActions.setSelectedApp(activeWorkspace.id, appId);
                    openIn(appId, activeWorkspace.worktreePath);
                  }
                },
                onWorkspaceClick: () => {
                  if (activeWorkspace.selectedAppId && activeWorkspace.worktreePath) {
                    openIn(activeWorkspace.selectedAppId, activeWorkspace.worktreePath);
                  }
                },
                onCopyPath: () => {
                  if (activeWorkspace.worktreePath) {
                    navigator.clipboard.writeText(activeWorkspace.worktreePath);
                  }
                },
              }}
            />
          )}

          {/* Terminal Area */}
          <WorkspaceTerminalArea
            allWorkspaces={allWorkspaces}
            activeWorkspaceId={activeWorkspaceId}
            activeTab={activeTab ?? null}
            canSplit={canSplit}
            terminalHandlers={{
              onTerminalExit: handleTerminalExit,
              onPaneClick: handlePaneClick,
              onSplit: handleSplit,
              onClosePane: handleClosePane,
              onTabClose: handleTabClose,
            }}
            resizeHandlers={{
              onResizePanes: handleResizePanes,
            }}
            welcomeScreenHandlers={{
              onAddRepository: handleAddRepository,
              onCloneFromUrl: handleCloneFromUrl,
            }}
          />
        </div>
      </div>

      {/* Notification Container - renders toast notifications */}
      <NotificationContainer />
    </>
  );
};
