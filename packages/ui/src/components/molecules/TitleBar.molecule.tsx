import { type FC, type ReactNode } from "react";
import { cn } from "../../libs/cn.lib";

export interface TitleBarProps {
  /** Primary title to display (e.g., workspace name) */
  title: string;
  /** Optional subtitle (e.g., repository name) */
  subtitle?: string;
  /** Optional actions to render on the right side (e.g., theme toggle) */
  actions?: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Title bar component that displays workspace information.
 * Includes macOS window draggable region styling.
 */
export const TitleBar: FC<TitleBarProps> = ({ title, subtitle, actions, className }) => {
  return (
    <div
      className={cn(
        "flex items-center",
        "h-10 px-4",
        "bg-surface-secondary border-b border-border-default",
        "select-none",
        className
      )}
      style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
    >
      {/* Spacer to balance the actions on the right for centered title */}
      <div className="w-8 flex-shrink-0" />

      {/* Centered title */}
      <div className="flex-1 flex items-center justify-center gap-2 text-sm">
        {subtitle && <span className="text-text-muted">{subtitle}</span>}
        {subtitle && <span className="text-text-muted">/</span>}
        <span className="text-text-primary font-medium">{title}</span>
      </div>

      {/* Actions slot - no-drag to make buttons clickable */}
      <div
        className="w-8 flex-shrink-0 flex items-center justify-end"
        style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
      >
        {actions}
      </div>
    </div>
  );
};
