import { type FC, type MouseEventHandler } from "react";
import { cn } from "../../libs/cn.lib";

export interface ResizeHandleProps {
  onMouseDown: MouseEventHandler<HTMLDivElement>;
  className?: string;
}

export const ResizeHandle: FC<ResizeHandleProps> = ({ onMouseDown, className }) => {
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      className={cn(
        "flex-shrink-0 w-1 h-full cursor-col-resize group",
        "flex items-center justify-center",
        className
      )}
      onMouseDown={onMouseDown}
    >
      <div
        className={cn(
          "w-0.5 h-full transition-colors duration-150",
          "bg-border-primary",
          "group-hover:bg-accent-primary"
        )}
      />
    </div>
  );
};
