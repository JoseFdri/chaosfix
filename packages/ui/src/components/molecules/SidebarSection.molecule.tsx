import { type FC, type ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface SidebarSectionProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export const SidebarSection: FC<SidebarSectionProps> = ({
  title,
  children,
  className,
}) => {
  return (
    <div className={cn("py-2", className)}>
      {title && (
        <h3 className="px-4 py-1 text-xs font-semibold text-text-muted uppercase tracking-wider">
          {title}
        </h3>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
};
