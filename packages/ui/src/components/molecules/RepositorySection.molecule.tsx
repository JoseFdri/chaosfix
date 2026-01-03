import { type FC, type ReactNode } from "react";
import { cn } from "../../libs/cn.lib";
import { IconButton } from "../atoms/IconButton.atom";
import { Cog6ToothIcon } from "../../icons";

export interface RepositorySectionProps {
  name: string;
  children?: ReactNode;
  className?: string;
  onSettingsClick?: () => void;
}

/**
 * RepositorySection displays a repository name as a section header with workspace items below.
 *
 * @param name - Repository name displayed as the section title
 * @param children - Workspace items (typically SidebarItem components)
 * @param className - Additional CSS classes
 * @param onSettingsClick - Callback when settings icon is clicked
 */
export const RepositorySection: FC<RepositorySectionProps> = ({
  name,
  children,
  className,
  onSettingsClick,
}) => {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between px-4 py-2">
        <h3 className="text-xs font-medium text-text-muted uppercase tracking-wide">{name}</h3>
        {onSettingsClick && (
          <IconButton
            size="sm"
            variant="ghost"
            label="Repository settings"
            onClick={onSettingsClick}
          >
            <Cog6ToothIcon className="w-4 h-4" />
          </IconButton>
        )}
      </div>
      {children && <div className="flex flex-col">{children}</div>}
    </div>
  );
};
