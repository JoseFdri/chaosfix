import { type FC } from "react";
import {
  Sidebar,
  SidebarItem,
  TabBar,
  TitleBar,
  ActivityIndicator,
  SearchInput,
  SidebarFooter,
  RepositorySection,
  WelcomeScreen,
  ActionCard,
  ActionCardGroup,
  Logo,
  DocumentTextIcon,
  GlobeAltIcon,
  DocumentDuplicateIcon,
  PlusIcon,
  InputDialog,
  ConfirmDialog,
  IconButton,
  ArchiveBoxXMarkIcon,
} from "@chaosfix/ui";
import type { TerminalSession } from "@chaosfix/core";
import { useApp, type WorkspaceWithTerminals } from "./contexts/app-context";
import {
  useFilteredRepositories,
  useRepositoryActions,
  useWorkspaceTabs,
  useAppHandlers,
  usePersistence,
  useCreateWorkspace,
  useRemoveWorkspace,
} from "./hooks";
import { TerminalView } from "./components/terminal-view";
import {
  SIDEBAR_WIDTH,
  WORKSPACE_DIALOG,
  REMOVE_WORKSPACE_DIALOG,
  DEFAULT_TERMINAL_LABEL,
  INITIAL_TERMINAL_PID,
  DEFAULT_TERMINAL_STATUS,
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
    hydrateState,
    getSerializableState,
  } = useApp();

  // Destructure state for easier access
  const allRepositories = state.repositories.repositories;
  const allWorkspaces = state.workspaces.workspaces;
  const activeWorkspaceId = state.workspaces.activeWorkspaceId;
  const sidebarCollapsed = state.ui.sidebarCollapsed;
  const searchQuery = state.ui.searchQuery;

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
  });
  const { handleAddRepository } = useRepositoryActions({
    repositories: allRepositories,
    addRepository: repositoriesActions.add,
  });

  const activeWorkspace = allWorkspaces.find((w) => w.id === activeWorkspaceId);
  const activeRepository = activeWorkspace
    ? allRepositories.find((r) => r.id === activeWorkspace.repositoryId)
    : null;

  const { tabs, handleTabSelect, handleTabClose, handleTabRename, handleNewTab } = useWorkspaceTabs(
    {
      activeWorkspace,
      onAddTerminal: workspacesActions.addTerminal,
      onRemoveTerminal: workspacesActions.removeTerminal,
      onSetActiveTerminal: workspacesActions.setActiveTerminal,
      onRenameTerminal: workspacesActions.renameTerminal,
    }
  );

  // Workspace creation dialog state and handlers
  const {
    isDialogOpen,
    openDialog,
    closeDialog,
    isLoading: isCreatingWorkspace,
    handleSubmit: handleWorkspaceSubmit,
    pendingRepository,
  } = useCreateWorkspace({
    addWorkspace: workspacesActions.add,
    onSuccess: (workspace) => {
      // Auto-create initial terminal for the new workspace
      const terminal = createInitialTerminalSession(workspace.id);
      workspacesActions.addTerminal(workspace.id, terminal);
    },
  });

  const {
    handleDisplaySettings,
    handleSettings,
    handleNewWorkspace,
    handleCloneFromUrl,
    handleQuickStart,
  } = useAppHandlers({
    onNewWorkspace: openDialog,
  });

  // Workspace removal dialog state and handlers
  const {
    isDialogOpen: isRemoveDialogOpen,
    openDialog: openRemoveDialog,
    closeDialog: closeRemoveDialog,
    isLoading: isRemovingWorkspace,
    isCheckingStatus,
    hasUncommittedChanges,
    handleConfirm: handleRemoveConfirm,
  } = useRemoveWorkspace({
    removeWorkspace: workspacesActions.remove,
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
        title={
          hasUncommittedChanges
            ? REMOVE_WORKSPACE_DIALOG.TITLE_WARNING
            : REMOVE_WORKSPACE_DIALOG.TITLE
        }
        description={
          hasUncommittedChanges
            ? REMOVE_WORKSPACE_DIALOG.DESCRIPTION_WARNING
            : REMOVE_WORKSPACE_DIALOG.DESCRIPTION
        }
        confirmLabel={
          hasUncommittedChanges
            ? REMOVE_WORKSPACE_DIALOG.FORCE_CONFIRM_LABEL
            : REMOVE_WORKSPACE_DIALOG.CONFIRM_LABEL
        }
        cancelLabel={REMOVE_WORKSPACE_DIALOG.CANCEL_LABEL}
        variant={hasUncommittedChanges ? "destructive" : "default"}
        isLoading={isRemovingWorkspace || isCheckingStatus}
        onConfirm={() => handleRemoveConfirm(hasUncommittedChanges)}
        onCancel={closeRemoveDialog}
      />

      <div className="flex h-screen bg-gray-900 text-gray-100">
        {/* Sidebar */}
        <Sidebar
          width={SIDEBAR_WIDTH}
          collapsed={sidebarCollapsed}
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
          footer={
            <SidebarFooter
              onAddRepository={handleAddRepository}
              onDisplaySettings={handleDisplaySettings}
              onSettings={handleSettings}
            />
          }
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
                  onSettingsClick={() => {
                    // TODO: Implement repository settings dialog
                    console.log("Open settings for repository:", repo.id, repo.name);
                  }}
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
                        <div className="flex items-center gap-1">
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
                          <ActivityIndicator
                            status={workspace.status === "active" ? "active" : "idle"}
                          />
                        </div>
                      }
                    />
                  ))}
                </RepositorySection>
              );
            })
          )}
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Title Bar */}
          {activeWorkspace && (
            <TitleBar title={activeWorkspace.name} subtitle={activeRepository?.name} />
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
          <div className="flex-1 bg-gray-900 relative">
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
                  <ActionCard
                    icon={<DocumentDuplicateIcon className="w-8 h-8" />}
                    label="Quick start"
                    onClick={handleQuickStart}
                  />
                </ActionCardGroup>
              </WelcomeScreen>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
