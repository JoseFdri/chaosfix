import { type FC } from "react";
import { cn } from "../../libs/cn.lib";

export interface TitleBarProps {
  /** Primary title to display (e.g., workspace name) */
  title: string;
  /** Optional subtitle (e.g., repository name) */
  subtitle?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Title bar component that displays workspace information.
 * Includes macOS window draggable region styling.
 */
export const TitleBar: FC<TitleBarProps> = ({ title, subtitle, className }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        "h-10 px-4",
        "bg-surface-secondary border-b border-border-default",
        "select-none",
        className
      )}
      style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
    >
      <div className="flex items-center gap-2 text-sm">
        {subtitle && <span className="text-text-muted">{subtitle}</span>}
        {subtitle && <span className="text-text-muted">/</span>}
        <span className="text-text-primary font-medium">{title}</span>
      </div>
    </div>
  );
};
