import { type FC } from "react";
import {
  Sidebar,
  SidebarItem,
  TabBar,
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
} from "@chaosfix/ui";
import { useApp } from "./contexts/app-context";
import {
  useFilteredRepositories,
  useRepositoryActions,
  useWorkspaceTabs,
  useAppHandlers,
  usePersistence,
} from "./hooks";
import { TerminalView } from "./components/terminal-view";
import { SIDEBAR_WIDTH } from "../constants";
import logoSrc from "./assets/logo.svg";

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

  const { tabs, handleTabSelect, handleTabClose, handleNewTab } = useWorkspaceTabs({
    activeWorkspace,
  });

  const {
    handleDisplaySettings,
    handleSettings,
    handleNewWorkspace,
    handleCloneFromUrl,
    handleQuickStart,
  } = useAppHandlers();

  return (
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
                  onClick={() => handleNewWorkspace(repo.id)}
                />
                {repoWorkspaces.map((workspace) => (
                  <SidebarItem
                    key={workspace.id}
                    label={workspace.name}
                    active={workspace.id === activeWorkspaceId}
                    onClick={() => workspacesActions.setActive(workspace.id)}
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
            <TerminalView workspaceId={activeWorkspace.id} />
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
  );
};
