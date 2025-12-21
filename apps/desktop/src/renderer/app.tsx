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
import { useAppStore } from "./stores/app-store";
import { TerminalView } from "./components/terminal-view";
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
  } = useAppStore();

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const tabs = activeWorkspace?.terminals.map((t) => ({
    id: t.id,
    label: t.title || "Terminal",
    closable: true,
  })) || [];

  // Filter repositories and workspaces based on search query
  const filteredRepositories = repositories.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddRepository = async () => {
    try {
      const result = await window.dialog.selectDirectory();
      if (!result) {
        return;
      }

      // Check if repository already exists
      const existingRepo = repositories.find((r) => r.path === result.path);
      if (existingRepo) {
        return;
      }

      addRepository({
        id: crypto.randomUUID(),
        name: result.name,
        path: result.path,
        defaultBranch: "main",
        workspaces: [],
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Failed to add repository:", error);
    }
  };

  const handleDisplaySettings = () => {
    // TODO: Implement display settings
    console.log("Display settings clicked");
  };

  const handleSettings = () => {
    // TODO: Implement settings dialog
    console.log("Settings clicked");
  };

  const handleNewWorkspace = (repoId: string) => {
    // TODO: Implement new workspace creation
    console.log("New workspace for repo:", repoId);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <Sidebar
        width={250}
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
            <WelcomeScreen
              logo={<Logo src={logoSrc} alt="ChaosFix Logo" />}
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
                  onClick={() => console.log("Clone from URL")}
                />
                <ActionCard
                  icon={<DocumentDuplicateIcon className="w-8 h-8" />}
                  label="Quick start"
                  onClick={() => console.log("Quick start")}
                />
              </ActionCardGroup>
            </WelcomeScreen>
          )}
        </div>
      </div>
    </div>
  );
};
