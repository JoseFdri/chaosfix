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
  Logo,
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
import type { TerminalSession, ExternalAppId } from "@chaosfix/core";
import { useApp, type WorkspaceWithTerminals } from "./contexts/app-context";
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
} from "./hooks";
import { TerminalView } from "./components/terminal-view";
import { NotificationContainer } from "./components/NotificationContainer.component";
import {
  WORKSPACE_DIALOG,
  REMOVE_WORKSPACE_DIALOG,
  DEFAULT_TERMINAL_LABEL,
  INITIAL_TERMINAL_PID,
  DEFAULT_TERMINAL_STATUS,
  MIN_SIDEBAR_WIDTH,
  MAX_SIDEBAR_WIDTH,
} from "../constants";
import logoSrc from "./assets/logo.svg";

/**
 * Creates an initial terminal session for a workspace.
 * The terminal ID is generated to match the pattern used by useTerminal hook.
 */
function createInitialTerminalSession(workspaceId: string): TerminalSession {
  return {
    id: `${workspaceId}-${Date.now()}`,
    workspaceId,
    pid: INITIAL_TERMINAL_PID,
    title: DEFAULT_TERMINAL_LABEL,
    status: DEFAULT_TERMINAL_STATUS,
    createdAt: new Date(),
  };
}

/**
 * Handles workspace click by setting it active and auto-creating a terminal if needed.
 */
function handleWorkspaceClick(
  workspace: WorkspaceWithTerminals,
  setActive: (workspaceId: string | null) => void,
  addTerminal: (workspaceId: string, terminal: TerminalSession) => void
): void {
  setActive(workspace.id);

  if (workspace.terminals.length === 0) {
    const terminal = createInitialTerminalSession(workspace.id);
    addTerminal(workspace.id, terminal);
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
      onAddTerminal: workspacesActions.addTerminal,
      onRemoveTerminal: workspacesActions.removeTerminal,
      onSetActiveTerminal: workspacesActions.setActiveTerminal,
      onRenameTerminal: workspacesActions.renameTerminal,
    }
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
      // Auto-create initial terminal for the new workspace
      const terminal = createInitialTerminalSession(workspace.id);
      workspacesActions.addTerminal(workspace.id, terminal);

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
                          workspacesActions.addTerminal
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
          {activeWorkspace?.activeTerminalId && (
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
          {activeWorkspace?.activeTerminalId && (
            <TabBar
              tabs={tabs}
              activeTabId={activeWorkspace.activeTerminalId}
              onTabSelect={handleTabSelect}
              onTabClose={handleTabClose}
              onTabRename={handleTabRename}
              onNewTab={handleNewTab}
            />
          )}

          {/* Terminal Area - Render all workspace terminals to preserve sessions across workspace switches */}
          <div className="flex-1 bg-surface-primary relative">
            {allWorkspaces.flatMap((workspace) =>
              workspace.terminals.map((terminal) => (
                <TerminalView
                  key={terminal.id}
                  terminalId={terminal.id}
                  worktreePath={workspace.worktreePath}
                  isActive={
                    workspace.id === activeWorkspaceId && terminal.id === workspace.activeTerminalId
                  }
                />
              ))
            )}
            {!activeWorkspace?.activeTerminalId && (
              <WelcomeScreen logo={<Logo src={logoSrc} alt="ChaosFix Logo" />}>
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
