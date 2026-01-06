import { type FC, type ReactNode } from "react";
import { cn } from "../../libs/cn.lib";

export interface StatusBarItemProps {
  icon: ReactNode;
  label: string;
  className?: string;
}

export const StatusBarItem: FC<StatusBarItemProps> = ({ icon, label, className }) => {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className="flex-shrink-0" aria-hidden="true">
        {icon}
      </span>
      <span className="text-xs text-text-muted">{label}</span>
    </div>
  );
};
