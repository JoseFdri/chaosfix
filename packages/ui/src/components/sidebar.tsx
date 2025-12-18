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
    <div className={clsx("py-2", className)}>
      {title && (
        <h3 className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
};

export interface SidebarItemProps {
  label: string;
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
  trailing?: ReactNode;
  indent?: number;
  className?: string;
}

export const SidebarItem: FC<SidebarItemProps> = ({
  label,
  icon,
  active = false,
  onClick,
  trailing,
  indent = 0,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "w-full flex items-center gap-2 px-4 py-1.5 text-sm text-left",
        "transition-colors duration-150",
        "hover:bg-gray-200 focus:bg-gray-200 focus:outline-none",
        {
          "bg-blue-100 text-blue-900 hover:bg-blue-200": active,
          "text-gray-700": !active,
        },
        className
      )}
      style={{ paddingLeft: `${16 + indent * 16}px` }}
    >
      {icon && <span className="flex-shrink-0 w-4 h-4">{icon}</span>}
      <span className="flex-1 truncate">{label}</span>
      {trailing && <span className="flex-shrink-0">{trailing}</span>}
    </button>
  );
};
