import { type FC } from "react";
import { cn } from "../../libs/cn.lib";

export interface ActivityIndicatorProps {
  status: "active" | "idle" | "error" | "setting_up";
  size?: "sm" | "md";
  className?: string;
}

export const ActivityIndicator: FC<ActivityIndicatorProps> = ({
  status,
  size = "sm",
  className,
}) => {
  const ariaLabel = status === "setting_up" ? "Status: setting up" : `Status: ${status}`;

  return (
    <span
      className={cn(
        "inline-block rounded-full",
        {
          // Status colors
          "bg-accent-success": status === "active",
          "bg-text-muted": status === "idle",
          "bg-accent-error": status === "error",
          "bg-accent-warning": status === "setting_up",
          // Animations
          "animate-pulse": status === "active" || status === "setting_up",
          // Sizes
          "w-2 h-2": size === "sm",
          "w-3 h-3": size === "md",
        },
        className
      )}
      role="status"
      aria-label={ariaLabel}
    />
  );
};
