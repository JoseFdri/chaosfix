import { type FC, type ReactNode, useState, useCallback } from "react";
import {
  Sidebar,
  SidebarItem,
  TabBar,
  TitleBar,
  SearchInput,
  SidebarFooter,
  RepositorySection,
  WelcomeScreen,
  ActionCard,
  ActionCardGroup,
  AnimatedLogo,
  DocumentTextIcon,
  GlobeAltIcon,
  PlusIcon,
  InputDialog,
  ConfirmDialog,
  RepositorySettingsDialog,
  IconButton,
  ArchiveBoxXMarkIcon,
  ResizeHandle,
  useDragResize,
  ThemeToggle,
  WorkspaceStatusBar,
  StatusBarItem,
  Spinner,
  OpenInDropdown,
  getAppIcon,
  CloneDialog,
} from "@chaosfix/ui";
import type { TerminalSession, ExternalAppId, Tab } from "@chaosfix/core";
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
} from "./hooks";
import { TerminalContainer } from "./components/terminal-container";
import { SplitResizeOverlay } from "./components/split-resize-overlay";
import { NotificationContainer } from "./components/NotificationContainer.component";
import { calculateTerminalBounds } from "./libs";
import {
  WORKSPACE_DIALOG,
  REMOVE_WORKSPACE_DIALOG,
  DEFAULT_TERMINAL_LABEL,
  INITIAL_TERMINAL_PID,
  DEFAULT_TERMINAL_STATUS,
  MIN_SIDEBAR_WIDTH,
  MAX_SIDEBAR_WIDTH,
  HOMEPAGE_FEATURES,
} from "../constants";
import logoSrc from "./assets/logo.svg";

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
  const getSelectedAppForDropdown = (): {
    id: string;
    name: string;
    icon?: ReactNode;
  } | null => {
    if (!activeWorkspace?.selectedAppId) {
      return null;
    }
    const app = apps.find((a) => a.id === activeWorkspace.selectedAppId);
    if (!app) {
      return null;
    }
    const IconComponent = getAppIcon(app.id);
    return {
      ...app,
      icon: IconComponent ? <IconComponent className="w-4 h-4" /> : undefined,
    };
  };
  const selectedAppForDropdown = getSelectedAppForDropdown();

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
  const handleTerminalExit = useCallback(
    (terminalId: string, _exitCode: number) => {
      // Find the workspace and tab containing this terminal
      for (const workspace of allWorkspaces) {
        for (const tab of workspace.tabs) {
          const terminal = tab.terminals.find((t) => t.id === terminalId);
          if (terminal) {
            // If tab has split layout (multiple terminals), remove just this terminal
            // If tab has only one terminal, remove the entire tab
            if (tab.terminals.length > 1) {
              workspacesActions.removeTerminalFromTab(workspace.id, tab.id, terminalId);
            } else {
              workspacesActions.removeTab(workspace.id, tab.id);
            }
            return;
          }
        }
      }
    },
    [allWorkspaces, workspacesActions]
  );

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

  // Repository settings dialog state
  const [activeSettingsRepoId, setActiveSettingsRepoId] = useState<string | null>(null);
  const activeSettingsRepo = activeSettingsRepoId
    ? allRepositories.find((r) => r.id === activeSettingsRepoId)
    : null;

  // Repository settings callbacks
  const handleRepositorySettingsChange = useCallback(
    (
      id: string,
      updates: { branchFrom?: string; defaultRemote?: string; saveConfigToRepo?: boolean }
    ) => {
      repositoriesActions.update(id, updates);
    },
    [repositoriesActions]
  );

  const handleRepositoryRemove = useCallback(() => {
    if (!activeSettingsRepoId) {
      return;
    }
    // Close the dialog first
    setActiveSettingsRepoId(null);
    // Remove the repository (cascades to remove workspaces in state via wrapReducer)
    repositoriesActions.remove(activeSettingsRepoId);
  }, [activeSettingsRepoId, repositoriesActions]);

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

  return (
    <>
      {/* Create Workspace Dialog */}
      <InputDialog
        open={isDialogOpen}
        onOpenChange={(open: boolean) => {
          if (!open) {
            closeDialog();
          }
        }}
        title={`${WORKSPACE_DIALOG.TITLE_PREFIX} ${pendingRepository?.name ?? WORKSPACE_DIALOG.TITLE_FALLBACK}`}
        description={WORKSPACE_DIALOG.DESCRIPTION}
        inputLabel={WORKSPACE_DIALOG.INPUT_LABEL}
        inputPlaceholder={WORKSPACE_DIALOG.INPUT_PLACEHOLDER}
        inputDefaultValue={defaultWorkspaceName}
        submitLabel={WORKSPACE_DIALOG.SUBMIT_LABEL}
        cancelLabel={WORKSPACE_DIALOG.CANCEL_LABEL}
        isLoading={isCreatingWorkspace}
        onSubmit={handleWorkspaceSubmit}
        onCancel={closeDialog}
      />

      {/* Remove Workspace Confirm Dialog */}
      <ConfirmDialog
        open={isRemoveDialogOpen}
        onOpenChange={(open: boolean) => {
          if (!open) {
            closeRemoveDialog();
          }
        }}
        title={REMOVE_WORKSPACE_DIALOG.TITLE}
        description={REMOVE_WORKSPACE_DIALOG.DESCRIPTION}
        confirmLabel={REMOVE_WORKSPACE_DIALOG.CONFIRM_LABEL}
        cancelLabel={REMOVE_WORKSPACE_DIALOG.CANCEL_LABEL}
        isLoading={isRemovingWorkspace}
        onConfirm={handleRemoveConfirm}
        onCancel={closeRemoveDialog}
      />

      {/* Repository Settings Dialog */}
      {activeSettingsRepo && (
        <RepositorySettingsDialog
          open={activeSettingsRepoId !== null}
          onOpenChange={(open: boolean) => {
            if (!open) {
              setActiveSettingsRepoId(null);
            }
          }}
          repository={{
            id: activeSettingsRepo.id,
            name: activeSettingsRepo.name,
            path: activeSettingsRepo.path,
            branchFrom: activeSettingsRepo.branchFrom,
            defaultRemote: activeSettingsRepo.defaultRemote,
            saveConfigToRepo: activeSettingsRepo.saveConfigToRepo,
          }}
          onSettingsChange={handleRepositorySettingsChange}
          onRemove={handleRepositoryRemove}
        />
      )}

      {/* Clone Repository Dialog */}
      <CloneDialog
        open={isCloneDialogOpen}
        onOpenChange={setCloneDialogOpen}
        onClone={handleClone}
        onSelectDirectory={handleSelectDirectory}
        progress={cloneProgress}
        isCloning={isCloning}
      />

      <div className="flex h-screen bg-surface-primary text-text-primary">
        {/* Sidebar */}
        <Sidebar
          width={sidebarWidth}
          collapsed={sidebarCollapsed}
          isResizing={isDragging}
          header={
            <div className="p-3 pt-10">
              <SearchInput
                value={searchQuery}
                onChange={(e) => ui.setSearchQuery(e.target.value)}
                onClear={() => ui.setSearchQuery("")}
                placeholder="Search repositories..."
              />
            </div>
          }
          footer={<SidebarFooter onAddRepository={handleAddRepository} />}
        >
          {filteredRepositories.length === 0 ? (
            <div className="px-4 py-8 text-sm text-text-muted text-center">
              {searchQuery ? "No repositories match your search" : "No repositories added"}
            </div>
          ) : (
            filteredRepositories.map((repo) => {
              const repoWorkspaces = allWorkspaces.filter((w) => w.repositoryId === repo.id);
              return (
                <RepositorySection
                  key={repo.id}
                  name={repo.name}
                  onSettingsClick={() => setActiveSettingsRepoId(repo.id)}
                >
                  <SidebarItem
                    label="New workspace"
                    icon={<PlusIcon className="w-4 h-4" />}
                    onClick={() => handleNewWorkspace(repo.id, repo.name, repo.path)}
                  />
                  {repoWorkspaces.map((workspace) => (
                    <SidebarItem
                      key={workspace.id}
                      label={workspace.name}
                      active={workspace.id === activeWorkspaceId}
                      onClick={() =>
                        handleWorkspaceClick(
                          workspace,
                          workspacesActions.setActive,
                          workspacesActions.addTab
                        )
                      }
                      trailing={
                        <IconButton
                          size="sm"
                          variant="ghost"
                          label="Remove workspace"
                          onClick={(e) => {
                            e.stopPropagation();
                            openRemoveDialog(workspace, repo.path);
                          }}
                        >
                          <ArchiveBoxXMarkIcon className="w-4 h-4" />
                        </IconButton>
                      }
                    />
                  ))}
                </RepositorySection>
              );
            })
          )}
        </Sidebar>

        {/* Resize Handle */}
        <ResizeHandle onMouseDown={handleMouseDown} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Title Bar */}
          {activeWorkspace && (
            <TitleBar
              title={activeWorkspace.name}
              subtitle={activeRepository?.name}
              actions={<ThemeToggle isDark={isDark} onToggle={toggleTheme} />}
            />
          )}

          {/* Workspace Status Bar */}
          {activeWorkspace?.activeTabId && (
            <WorkspaceStatusBar>
              {activeWorkspace.status === "setting_up" && (
                <StatusBarItem icon={<Spinner size="xs" />} label="Setting up..." />
              )}
              <div className="ml-auto">
                <OpenInDropdown
                  workspaceName={activeWorkspace.name}
                  apps={apps.map((app) => {
                    const IconComponent = getAppIcon(app.id);
                    return {
                      ...app,
                      icon: IconComponent ? <IconComponent className="w-5 h-5" /> : undefined,
                      shortcut: app.id === "ghostty" ? "⌘O" : undefined,
                    };
                  })}
                  selectedApp={selectedAppForDropdown}
                  onSelect={(appId) => {
                    if (activeWorkspace.worktreePath) {
                      // Save the selected app for this workspace
                      workspacesActions.setSelectedApp(activeWorkspace.id, appId as ExternalAppId);
                      openIn(appId as ExternalAppId, activeWorkspace.worktreePath);
                    }
                  }}
                  onWorkspaceClick={() => {
                    if (activeWorkspace.selectedAppId && activeWorkspace.worktreePath) {
                      openIn(activeWorkspace.selectedAppId, activeWorkspace.worktreePath);
                    }
                  }}
                  onCopyPath={() => {
                    if (activeWorkspace.worktreePath) {
                      navigator.clipboard.writeText(activeWorkspace.worktreePath);
                    }
                  }}
                  disabled={isLoadingExternalApps || !activeWorkspace.worktreePath}
                />
              </div>
            </WorkspaceStatusBar>
          )}

          {/* Tab Bar */}
          {activeWorkspace?.activeTabId && (
            <TabBar
              tabs={tabs}
              activeTabId={activeWorkspace.activeTabId}
              onTabSelect={handleTabSelect}
              onTabClose={handleTabClose}
              onTabRename={handleTabRename}
              onNewTab={handleNewTab}
            />
          )}

          {/* Terminal Area - Render all workspace terminals to preserve sessions across workspace switches */}
          <div className="flex-1 bg-surface-primary relative">
            {/* Resize handles overlay for split layouts - now from active tab */}
            {activeTab?.splitLayout && (
              <SplitResizeOverlay
                paneNode={activeTab.splitLayout}
                onResizePanes={handleResizePanes}
              />
            )}

            {/* Render all terminals from all tabs across all workspaces */}
            {allWorkspaces.flatMap((workspace) => {
              const isActiveWorkspace = workspace.id === activeWorkspaceId;

              return workspace.tabs.flatMap((tab) => {
                const isActiveTab = isActiveWorkspace && tab.id === workspace.activeTabId;

                // Calculate bounds for terminals in split layout (only for active tab)
                const boundsMap =
                  isActiveTab && tab.splitLayout ? calculateTerminalBounds(tab.splitLayout) : null;

                return tab.terminals.map((terminal) => {
                  const bounds = boundsMap?.get(terminal.id) ?? null;
                  // Terminal is in split only if it has bounds (is part of the split layout)
                  const isInSplit = bounds !== null;

                  // Terminal is active (visible) if:
                  // - Workspace is active AND
                  // - Tab is active AND
                  // - Either: it's in a split (has bounds), OR it's the only terminal
                  const isActive = isActiveTab && (isInSplit || tab.terminals.length === 1);

                  return (
                    <TerminalContainer
                      key={terminal.id}
                      terminalId={terminal.id}
                      worktreePath={workspace.worktreePath}
                      isActive={isActive}
                      bounds={bounds}
                      isFocused={isActiveTab && terminal.id === tab.focusedTerminalId}
                      onClick={isInSplit ? (): void => handlePaneClick(terminal.id) : undefined}
                      onExit={handleTerminalExit}
                      onSplit={
                        isActiveTab && canSplit ? (): void => handleSplit("horizontal") : undefined
                      }
                      onClose={
                        isActiveTab
                          ? (): void => {
                              if (tab.terminals.length > 1) {
                                // If tab has multiple terminals (split), close just this pane
                                handleClosePane(terminal.id);
                              } else {
                                // If tab has only one terminal, close the entire tab
                                handleTabClose(tab.id);
                              }
                            }
                          : undefined
                      }
                    />
                  );
                });
              });
            })}
            {!activeWorkspace?.activeTabId && (
              <WelcomeScreen
                logo={<AnimatedLogo src={logoSrc} alt="ChaosFix Logo" size={180} />}
                features={HOMEPAGE_FEATURES}
              >
                <ActionCardGroup>
                  <ActionCard
                    icon={<DocumentTextIcon className="w-8 h-8" />}
                    label="Open project"
                    onClick={handleAddRepository}
                  />
                  <ActionCard
                    icon={<GlobeAltIcon className="w-8 h-8" />}
                    label="Clone from URL"
                    onClick={handleCloneFromUrl}
                  />
                </ActionCardGroup>
              </WelcomeScreen>
            )}
          </div>
        </div>
      </div>

      {/* Notification Container - renders toast notifications */}
      <NotificationContainer />
    </>
  );
};
