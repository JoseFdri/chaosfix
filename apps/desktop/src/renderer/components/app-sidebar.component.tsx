import { type FC, type ReactNode } from "react";
import {
  Sidebar,
  SidebarItem,
  SearchInput,
  SidebarFooter,
  RepositorySection,
  ResizeHandle,
  PlusIcon,
  IconButton,
  ArchiveBoxXMarkIcon,
} from "@chaosfix/ui";
import type { Repository } from "@chaosfix/core";
import type { WorkspaceWithTabs } from "../contexts/app-context";

/**
 * Props for the SearchInput header.
 */
interface SearchHeaderProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

/**
 * Props for workspace item event handlers.
 */
interface WorkspaceItemHandlers {
  onWorkspaceClick: (workspace: WorkspaceWithTabs) => void;
  onRemoveWorkspace: (workspace: WorkspaceWithTabs, repositoryPath: string) => void;
}

/**
 * Props for sidebar footer.
 */
interface SidebarFooterProps {
  onAddRepository: () => void;
}

/**
 * Props for the AppSidebar component.
 */
export interface AppSidebarProps {
  width: number;
  collapsed: boolean;
  isResizing: boolean;
  activeWorkspaceId: string | null;
  filteredRepositories: Repository[];
  allWorkspaces: WorkspaceWithTabs[];
  searchQuery: string;
  search: SearchHeaderProps;
  footer: SidebarFooterProps;
  workspaceHandlers: WorkspaceItemHandlers;
  onSettingsClick: (repositoryId: string) => void;
  onNewWorkspace: (repositoryId: string, repositoryName: string, repositoryPath: string) => void;
  onResizeHandleMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * Renders the search header for the sidebar.
 */
function SidebarSearchHeader({ value, onChange, onClear }: SearchHeaderProps): ReactNode {
  return (
    <div className="p-3 pt-10">
      <SearchInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClear={onClear}
        placeholder="Search repositories..."
      />
    </div>
  );
}

/**
 * Renders the empty state when no repositories match.
 */
function EmptyRepositoriesState({ searchQuery }: { searchQuery: string }): ReactNode {
  return (
    <div className="px-4 py-8 text-sm text-text-muted text-center">
      {searchQuery ? "No repositories match your search" : "No repositories added"}
    </div>
  );
}

/**
 * Renders a single workspace item in the sidebar.
 */
function WorkspaceItem({
  workspace,
  isActive,
  repositoryPath,
  onWorkspaceClick,
  onRemoveWorkspace,
}: {
  workspace: WorkspaceWithTabs;
  isActive: boolean;
  repositoryPath: string;
  onWorkspaceClick: (workspace: WorkspaceWithTabs) => void;
  onRemoveWorkspace: (workspace: WorkspaceWithTabs, repositoryPath: string) => void;
}): ReactNode {
  return (
    <SidebarItem
      label={workspace.name}
      active={isActive}
      onClick={() => onWorkspaceClick(workspace)}
      trailing={
        <IconButton
          size="sm"
          variant="ghost"
          label="Remove workspace"
          onClick={(e) => {
            e.stopPropagation();
            onRemoveWorkspace(workspace, repositoryPath);
          }}
        >
          <ArchiveBoxXMarkIcon className="w-4 h-4" />
        </IconButton>
      }
    />
  );
}

/**
 * Renders a repository section with its workspaces.
 */
function RepositorySectionWithWorkspaces({
  repository,
  workspaces,
  activeWorkspaceId,
  onSettingsClick,
  onNewWorkspace,
  workspaceHandlers,
}: {
  repository: Repository;
  workspaces: WorkspaceWithTabs[];
  activeWorkspaceId: string | null;
  onSettingsClick: (repositoryId: string) => void;
  onNewWorkspace: (repositoryId: string, repositoryName: string, repositoryPath: string) => void;
  workspaceHandlers: WorkspaceItemHandlers;
}): ReactNode {
  return (
    <RepositorySection
      name={repository.name}
      onSettingsClick={() => onSettingsClick(repository.id)}
    >
      <SidebarItem
        label="New workspace"
        icon={<PlusIcon className="w-4 h-4" />}
        onClick={() => onNewWorkspace(repository.id, repository.name, repository.path)}
      />
      {workspaces.map((workspace) => (
        <WorkspaceItem
          key={workspace.id}
          workspace={workspace}
          isActive={workspace.id === activeWorkspaceId}
          repositoryPath={repository.path}
          onWorkspaceClick={workspaceHandlers.onWorkspaceClick}
          onRemoveWorkspace={workspaceHandlers.onRemoveWorkspace}
        />
      ))}
    </RepositorySection>
  );
}

/**
 * Renders the list of repository sections.
 */
function RepositoriesList({
  repositories,
  allWorkspaces,
  activeWorkspaceId,
  onSettingsClick,
  onNewWorkspace,
  workspaceHandlers,
}: {
  repositories: Repository[];
  allWorkspaces: WorkspaceWithTabs[];
  activeWorkspaceId: string | null;
  onSettingsClick: (repositoryId: string) => void;
  onNewWorkspace: (repositoryId: string, repositoryName: string, repositoryPath: string) => void;
  workspaceHandlers: WorkspaceItemHandlers;
}): ReactNode {
  return (
    <>
      {repositories.map((repo) => {
        const repoWorkspaces = allWorkspaces.filter((w) => w.repositoryId === repo.id);
        return (
          <RepositorySectionWithWorkspaces
            key={repo.id}
            repository={repo}
            workspaces={repoWorkspaces}
            activeWorkspaceId={activeWorkspaceId}
            onSettingsClick={onSettingsClick}
            onNewWorkspace={onNewWorkspace}
            workspaceHandlers={workspaceHandlers}
          />
        );
      })}
    </>
  );
}

/**
 * AppSidebar renders the main sidebar with repository sections and workspace items.
 *
 * This component is purely presentational - all state and handlers are passed as props.
 *
 * Contents:
 * - SearchInput header for filtering repositories
 * - Repository sections with workspace items
 * - New workspace button per repository
 * - Remove workspace button per workspace
 * - SidebarFooter with add repository button
 * - ResizeHandle for adjusting sidebar width
 */
export const AppSidebar: FC<AppSidebarProps> = ({
  width,
  collapsed,
  isResizing,
  activeWorkspaceId,
  filteredRepositories,
  allWorkspaces,
  searchQuery,
  search,
  footer,
  workspaceHandlers,
  onSettingsClick,
  onNewWorkspace,
  onResizeHandleMouseDown,
}) => {
  return (
    <>
      <Sidebar
        width={width}
        collapsed={collapsed}
        isResizing={isResizing}
        header={
          <SidebarSearchHeader
            value={search.value}
            onChange={search.onChange}
            onClear={search.onClear}
          />
        }
        footer={<SidebarFooter onAddRepository={footer.onAddRepository} />}
      >
        {filteredRepositories.length === 0 ? (
          <EmptyRepositoriesState searchQuery={searchQuery} />
        ) : (
          <RepositoriesList
            repositories={filteredRepositories}
            allWorkspaces={allWorkspaces}
            activeWorkspaceId={activeWorkspaceId}
            onSettingsClick={onSettingsClick}
            onNewWorkspace={onNewWorkspace}
            workspaceHandlers={workspaceHandlers}
          />
        )}
      </Sidebar>
      <ResizeHandle onMouseDown={onResizeHandleMouseDown} />
    </>
  );
};
