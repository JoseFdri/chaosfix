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
import { useFilteredRepositories, useRepositoryActions } from "./hooks";
import { TerminalView } from "./components/terminal-view";
import { SIDEBAR_WIDTH, DEFAULT_TERMINAL_LABEL } from "../constants";
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
  } = useApp();

  const filteredRepositories = useFilteredRepositories({ repositories, searchQuery });
  const { handleAddRepository } = useRepositoryActions({ repositories, addRepository });

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const tabs =
    activeWorkspace?.terminals.map((t) => ({
      id: t.id,
      label: t.title || DEFAULT_TERMINAL_LABEL,
      closable: true,
    })) || [];

  const handleDisplaySettings = (): void => {
    // TODO: Implement display settings
  };

  const handleSettings = (): void => {
    // TODO: Implement settings dialog
  };

  const handleNewWorkspace = (_repoId: string): void => {
    // TODO: Implement new workspace creation
  };

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
            onTabSelect={(_tabId) => {
              // TODO: Implement tab selection
            }}
            onTabClose={(_tabId) => {
              // TODO: Implement tab close
            }}
            onNewTab={() => {
              // TODO: Implement new tab
            }}
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
                  onClick={() => {
                    // TODO: Implement clone from URL
                  }}
                />
                <ActionCard
                  icon={<DocumentDuplicateIcon className="w-8 h-8" />}
                  label="Quick start"
                  onClick={() => {
                    // TODO: Implement quick start
                  }}
                />
              </ActionCardGroup>
            </WelcomeScreen>
          )}
        </div>
      </div>
    </div>
  );
};
