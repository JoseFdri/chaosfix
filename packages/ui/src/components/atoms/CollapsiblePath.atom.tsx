import { type FC, useState, useCallback } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { cn } from "../../libs/cn.lib";

export interface CollapsiblePathProps {
  /** The label text displayed above the path (e.g., "Root path:") */
  label: string;
  /** The full path to display */
  path: string;
  /** Optional additional styling */
  className?: string;
}

/**
 * Truncates a path by showing the first and last segments with ellipsis.
 * Example: "/Users/john/Documents/projects/myapp" becomes "/Users/.../myapp"
 */
const truncatePath = (path: string): string => {
  const segments = path.split("/").filter(Boolean);

  if (segments.length <= 2) {
    return path;
  }

  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];

  return `/${firstSegment}/.../${lastSegment}`;
};

/**
 * A collapsible path display component that shows a truncated path
 * with the ability to expand to show the full path.
 */
export const CollapsiblePath: FC<CollapsiblePathProps> = ({ label, path, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const displayPath = isExpanded ? path : truncatePath(path);

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span className="text-sm text-text-secondary">{label}</span>
      <button
        type="button"
        role="button"
        aria-expanded={isExpanded}
        aria-label={isExpanded ? `Collapse path: ${path}` : `Expand path: ${truncatePath(path)}`}
        onClick={toggleExpanded}
        className={cn(
          "flex items-center gap-1 text-sm text-text-primary",
          "text-left cursor-pointer",
          "hover:text-text-secondary transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-focus focus-visible:rounded"
        )}
      >
        <span className="break-all">{displayPath}</span>
        <ChevronDownIcon
          className={cn(
            "w-4 h-4 flex-shrink-0 transition-transform duration-150",
            isExpanded && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>
    </div>
  );
};
