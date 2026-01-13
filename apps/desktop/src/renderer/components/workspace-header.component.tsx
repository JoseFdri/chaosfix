import { type FC, type ReactNode } from "react";
import {
  TabBar,
  TitleBar,
  ThemeToggle,
  WorkspaceStatusBar,
  StatusBarItem,
  Spinner,
  OpenInDropdown,
  getAppIcon,
  type Tab as UITab,
} from "@chaosfix/ui";
import type { ExternalApp, ExternalAppId } from "@chaosfix/core";
import type { SelectedAppDropdownItem } from "../hooks";
import type { WorkspaceWithTabs } from "../contexts/app-context";

/**
 * Props for theme management.
 */
interface ThemeProps {
  isDark: boolean;
  onToggle: () => void;
}

/**
 * Props for the tab bar handlers.
 */
interface TabBarHandlers {
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onTabRename: (tabId: string, newLabel: string) => void;
  onNewTab: () => void;
}

/**
 * Props for the OpenInDropdown external apps functionality.
 */
interface ExternalAppsProps {
  apps: ExternalApp[];
  selectedApp: SelectedAppDropdownItem | null;
  isLoading: boolean;
  onSelect: (appId: ExternalAppId) => void;
  onWorkspaceClick: () => void;
  onCopyPath: () => void;
}

/**
 * Props for the WorkspaceHeader component.
 */
export interface WorkspaceHeaderProps {
  activeWorkspace: WorkspaceWithTabs;
  activeRepositoryName: string | undefined;
  tabs: UITab[];
  theme: ThemeProps;
  tabHandlers: TabBarHandlers;
  externalApps: ExternalAppsProps;
}

/**
 * Maps apps to include icons and shortcuts.
 */
function mapAppsWithIcons(
  apps: ExternalApp[]
): Array<ExternalApp & { icon?: ReactNode; shortcut?: string }> {
  return apps.map((app) => {
    const IconComponent = getAppIcon(app.id);
    return {
      ...app,
      icon: IconComponent ? <IconComponent className="w-5 h-5" /> : undefined,
      shortcut: app.id === "ghostty" ? "⌘O" : undefined,
    };
  });
}

/**
 * Renders the workspace title bar with theme toggle.
 */
function WorkspaceTitleBar({
  title,
  subtitle,
  theme,
}: {
  title: string;
  subtitle: string | undefined;
  theme: ThemeProps;
}): ReactNode {
  return (
    <TitleBar
      title={title}
      subtitle={subtitle}
      actions={<ThemeToggle isDark={theme.isDark} onToggle={theme.onToggle} />}
    />
  );
}

/**
 * Renders the workspace status bar with OpenInDropdown.
 */
function WorkspaceStatusBarWithDropdown({
  workspace,
  externalApps,
}: {
  workspace: WorkspaceWithTabs;
  externalApps: ExternalAppsProps;
}): ReactNode {
  const appsWithIcons = mapAppsWithIcons(externalApps.apps);

  return (
    <WorkspaceStatusBar>
      {workspace.status === "setting_up" && (
        <StatusBarItem icon={<Spinner size="xs" />} label="Setting up..." />
      )}
      <div className="ml-auto">
        <OpenInDropdown
          workspaceName={workspace.name}
          apps={appsWithIcons}
          selectedApp={externalApps.selectedApp}
          onSelect={(appId) => externalApps.onSelect(appId as ExternalAppId)}
          onWorkspaceClick={externalApps.onWorkspaceClick}
          onCopyPath={externalApps.onCopyPath}
          disabled={externalApps.isLoading || !workspace.worktreePath}
        />
      </div>
    </WorkspaceStatusBar>
  );
}

/**
 * Renders the tab bar for workspace tabs.
 */
function WorkspaceTabBar({
  tabs,
  activeTabId,
  handlers,
}: {
  tabs: UITab[];
  activeTabId: string;
  handlers: TabBarHandlers;
}): ReactNode {
  return (
    <TabBar
      tabs={tabs}
      activeTabId={activeTabId}
      onTabSelect={handlers.onTabSelect}
      onTabClose={handlers.onTabClose}
      onTabRename={handlers.onTabRename}
      onNewTab={handlers.onNewTab}
    />
  );
}

/**
 * WorkspaceHeader renders the title bar, status bar, and tab bar for the active workspace.
 *
 * This component is purely presentational - all state and handlers are passed as props.
 *
 * Contents:
 * - TitleBar with workspace name and theme toggle (always shown when workspace is active)
 * - WorkspaceStatusBar with setup indicator and OpenInDropdown (shown when activeTabId exists)
 * - TabBar for managing workspace tabs (shown when activeTabId exists)
 */
export const WorkspaceHeader: FC<WorkspaceHeaderProps> = ({
  activeWorkspace,
  activeRepositoryName,
  tabs,
  theme,
  tabHandlers,
  externalApps,
}) => {
  const hasActiveTab = Boolean(activeWorkspace.activeTabId);

  return (
    <>
      {/* TitleBar is always shown when there's an active workspace */}
      <WorkspaceTitleBar
        title={activeWorkspace.name}
        subtitle={activeRepositoryName}
        theme={theme}
      />
      {/* StatusBar and TabBar are only shown when there's an active tab */}
      {hasActiveTab && (
        <>
          <WorkspaceStatusBarWithDropdown workspace={activeWorkspace} externalApps={externalApps} />
          <WorkspaceTabBar
            tabs={tabs}
            activeTabId={activeWorkspace.activeTabId as string}
            handlers={tabHandlers}
          />
        </>
      )}
    </>
  );
};
