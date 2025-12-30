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
    repositories,
    workspaces,
    activeWorkspaceId,
    sidebarCollapsed,
    searchQuery,
    setActiveWorkspace,
    setSearchQuery,
    addRepository,
    addWorkspace,
    hydrateState,
    getSerializableState,
    setPersistenceLoading,
    setPersistenceSaved,
    setPersistenceError,
  } = useApp();

  // Initialize persistence (load on mount, auto-save on changes)
  usePersistence({
    repositories,
    workspaces,
    hydrateState,
    getSerializableState,
    setPersistenceLoading,
    setPersistenceSaved,
    setPersistenceError,
  });

  const filteredRepositories = useFilteredRepositories({ repositories, searchQuery });
  const { handleAddRepository } = useRepositoryActions({
    repositories,
    addRepository,
    addWorkspace,
  });

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);

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
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
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
            const repoWorkspaces = workspaces.filter((w) => w.repositoryId === repo.id);
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
                    onClick={() => setActiveWorkspace(workspace.id)}
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
        {activeWorkspace && (
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
          {activeWorkspace ? (
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
