import { type FC, type ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface RepositorySectionProps {
  name: string;
  children?: ReactNode;
  className?: string;
}

/**
 * RepositorySection displays a repository name as a section header with workspace items below.
 *
 * @param name - Repository name displayed as the section title
 * @param children - Workspace items (typically SidebarItem components)
 * @param className - Additional CSS classes
 */
export const RepositorySection: FC<RepositorySectionProps> = ({
  name,
  children,
  className,
}) => {
  return (
    <div className={cn("flex flex-col", className)}>
      <h3 className="px-4 py-2 text-xs font-medium text-text-muted uppercase tracking-wide">
        {name}
      </h3>
      {children && (
        <div className="flex flex-col">
          {children}
        </div>
      )}
    </div>
  );
};
