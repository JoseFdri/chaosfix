import { type FC, type ReactNode } from "react";
import { cn } from "../../libs/cn.lib";

export interface WorkspaceStatusBarProps {
  children: ReactNode;
  className?: string;
}

export const WorkspaceStatusBar: FC<WorkspaceStatusBarProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "flex items-center bg-surface-secondary border-b border-border-default",
        "min-h-[24px] px-3 py-1",
        className
      )}
    >
      {children}
    </div>
  );
};
