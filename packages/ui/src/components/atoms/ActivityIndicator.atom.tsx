import { type FC } from "react";
import { cn } from "../../libs/cn.lib";

export interface ActivityIndicatorProps {
  status: "active" | "idle" | "error";
  size?: "sm" | "md";
  className?: string;
}

export const ActivityIndicator: FC<ActivityIndicatorProps> = ({
  status,
  size = "sm",
  className,
}) => {
  return (
    <span
      className={cn(
        "inline-block rounded-full",
        {
          // Status colors
          "bg-accent-success": status === "active",
          "bg-text-muted": status === "idle",
          "bg-accent-error": status === "error",
          // Animation for active status
          "animate-pulse": status === "active",
          // Sizes
          "w-2 h-2": size === "sm",
          "w-3 h-3": size === "md",
        },
        className
      )}
      role="status"
      aria-label={`Status: ${status}`}
    />
  );
};
