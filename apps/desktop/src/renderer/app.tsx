import { type FC } from "react";
import { Sidebar, SidebarSection, SidebarItem, TabBar, ActivityIndicator } from "@chaosfix/ui";
import { useAppStore } from "./stores/app-store";
import { TerminalView } from "./components/terminal-view";

export const App: FC = () => {
  const {
    repositories,
    workspaces,
    activeWorkspaceId,
    sidebarCollapsed,
    setActiveWorkspace,
  } = useAppStore();

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const tabs = activeWorkspace?.terminals.map((t) => ({
    id: t.id,
    label: t.title || "Terminal",
    closable: true,
  })) || [];

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <Sidebar width={250} collapsed={sidebarCollapsed}>
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-lg font-semibold text-white">ChaosFix</h1>
        </div>
        <SidebarSection title="Repositories">
          {repositories.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              No repositories added
            </div>
          ) : (
            repositories.map((repo) => (
              <div key={repo.id}>
                <SidebarItem
                  label={repo.name}
                  icon={<FolderIcon />}
                />
                {workspaces
                  .filter((w) => w.repositoryId === repo.id)
                  .map((workspace) => (
                    <SidebarItem
                      key={workspace.id}
                      label={workspace.name}
                      active={workspace.id === activeWorkspaceId}
                      onClick={() => setActiveWorkspace(workspace.id)}
                      indent={1}
                      trailing={
                        <ActivityIndicator
                          status={workspace.status === "active" ? "active" : "idle"}
                        />
                      }
                    />
                  ))}
              </div>
            ))
          )}
        </SidebarSection>
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
            <WelcomeScreen />
          )}
        </div>
      </div>
    </div>
  );
};

const WelcomeScreen: FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-300 mb-4">
          Welcome to ChaosFix
        </h2>
        <p className="text-gray-500 mb-6">
          Add a repository to get started with parallel Claude Code sessions.
        </p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Add Repository
        </button>
      </div>
    </div>
  );
};

const FolderIcon: FC = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
    />
  </svg>
);
