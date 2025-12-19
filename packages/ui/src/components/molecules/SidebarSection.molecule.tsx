import { type FC, type ReactNode } from "react";
import { clsx } from "clsx";

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
