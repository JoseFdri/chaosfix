import { type FC, type ReactNode } from "react";
import { clsx } from "clsx";

export interface SidebarProps {
  width?: number;
  collapsed?: boolean;
  children: ReactNode;
  className?: string;
}

export const Sidebar: FC<SidebarProps> = ({
  width = 250,
  collapsed = false,
  children,
  className,
}) => {
  return (
    <aside
      className={clsx(
        "flex flex-col bg-gray-100 border-r border-gray-200",
        "transition-all duration-200 ease-in-out",
        "overflow-hidden",
        className
      )}
      style={{ width: collapsed ? 0 : width }}
    >
      <div className="flex-1 overflow-y-auto">{children}</div>
    </aside>
  );
};
