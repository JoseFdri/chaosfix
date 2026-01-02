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
} from "./hooks";
import { TerminalView } from "./components/terminal-view";
import {
  SIDEBAR_WIDTH,
  WORKSPACE_DIALOG,
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

  const { tabs, handleTabSelect, handleTabClose, handleNewTab } = useWorkspaceTabs({
    activeWorkspace,
    onRemoveTerminal: workspacesActions.removeTerminal,
  });

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
                <RepositorySection key={repo.id} name={repo.name}>
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
                        <ActivityIndicator
                          status={workspace.status === "active" ? "active" : "idle"}
                        />
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
              onNewTab={handleNewTab}
            />
          )}

          {/* Terminal Area */}
          <div className="flex-1 bg-gray-900">
            {activeWorkspace?.activeTerminalId ? (
              <TerminalView
                key={activeWorkspace.activeTerminalId}
                workspaceId={activeWorkspace.id}
                worktreePath={activeWorkspace.worktreePath}
              />
            ) : (
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
