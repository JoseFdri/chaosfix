import { type FC } from "react";
import { cn } from "../../libs/cn.lib";
import type { SplitResizeHandleProps } from "../../types";

/**
 * Visual drag handle component for resizing split panes.
 * Displays between adjacent panes and provides visual feedback on hover/drag.
 *
 * @param direction - The split direction ("horizontal" or "vertical")
 * @param onMouseDown - Handler to initiate drag resize
 * @param className - Optional additional CSS classes
 */
export const SplitResizeHandle: FC<SplitResizeHandleProps> = ({
  direction,
  onMouseDown,
  className,
}) => {
  const isHorizontal = direction === "horizontal";

  return (
    <div
      role="separator"
      aria-orientation={isHorizontal ? "vertical" : "horizontal"}
      className={cn(
        "flex-shrink-0 group",
        "flex items-center justify-center",
        isHorizontal ? "w-1.5 h-full cursor-col-resize" : "h-1.5 w-full cursor-row-resize",
        className
      )}
      onMouseDown={onMouseDown}
    >
      <div
        className={cn(
          "transition-colors duration-150",
          "bg-border-primary",
          "group-hover:bg-accent-primary",
          isHorizontal ? "w-0.5 h-full" : "h-0.5 w-full"
        )}
      />
    </div>
  );
};
