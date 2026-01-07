import type { SplitDirection } from "@chaosfix/core";

/**
 * Props for the SplitResizeHandle component.
 * Used to render a draggable handle between split panes.
 */
export interface SplitResizeHandleProps {
  /** Direction of the parent split container */
  direction: SplitDirection;
  /** Mouse down handler to initiate drag resize */
  onMouseDown: React.MouseEventHandler<HTMLDivElement>;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Props for the SplitPane component.
 * Renders a container that arranges children in a split layout.
 */
export interface SplitPaneProps {
  /** Direction children are arranged: "horizontal" (row) or "vertical" (column) */
  direction: SplitDirection;
  /** Percentage sizes for each child (should sum to 100) */
  sizes: number[];
  /** Child elements to render in the split layout */
  children: React.ReactNode[];
  /** Callback when pane sizes change during resize */
  onResize?: (sizes: number[]) => void;
  /** Minimum pane size in pixels (default: 100) */
  minSize?: number;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Configuration options for the useSplitResize hook.
 */
export interface UseSplitResizeOptions {
  /** Direction of the split container */
  direction: SplitDirection;
  /** Current percentage sizes of all panes */
  sizes: number[];
  /** Reference to the container element for dimension calculations */
  containerRef: React.RefObject<HTMLDivElement>;
  /** Minimum pane size in pixels (default: 100) */
  minSize?: number;
  /** Callback invoked when sizes change during drag */
  onResize: (sizes: number[]) => void;
}

/**
 * Return value of the useSplitResize hook.
 */
export interface UseSplitResizeReturn {
  /** Whether a resize drag operation is in progress */
  isDragging: boolean;
  /** Factory function to create mouse down handlers for each resize handle */
  handleMouseDown: (index: number) => React.MouseEventHandler<HTMLDivElement>;
}
