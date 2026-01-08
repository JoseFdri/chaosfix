import { type FC, type ReactNode, useRef, useCallback } from "react";
import type { PaneNode, SplitDirection } from "@chaosfix/core";
import { SplitResizeHandle, useSplitResize } from "@chaosfix/ui";

interface SplitResizeOverlayProps {
  /** The pane node tree to render resize handles for */
  paneNode: PaneNode;
  /** Callback when pane sizes change during resize */
  onResizePanes: (splitId: string, sizes: number[]) => void;
}

interface ResizeHandleInfo {
  splitId: string;
  direction: SplitDirection;
  sizes: number[];
  index: number;
  position: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

/**
 * Recursively collects resize handle positions from a split layout tree.
 */
function collectResizeHandles(
  node: PaneNode,
  parentBounds = { top: 0, left: 0, width: 100, height: 100 }
): ResizeHandleInfo[] {
  if (node.type === "terminal") {
    return [];
  }

  const handles: ResizeHandleInfo[] = [];
  const { direction, sizes, children, id } = node;
  const isHorizontal = direction === "horizontal";

  let offset = 0;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const size = sizes[i] ?? 100 / children.length;

    if (!child) {
      continue;
    }

    // Calculate child bounds
    const childBounds = isHorizontal
      ? {
          top: parentBounds.top,
          left: parentBounds.left + (offset / 100) * parentBounds.width,
          width: (size / 100) * parentBounds.width,
          height: parentBounds.height,
        }
      : {
          top: parentBounds.top + (offset / 100) * parentBounds.height,
          left: parentBounds.left,
          width: parentBounds.width,
          height: (size / 100) * parentBounds.height,
        };

    // Add resize handle after this child (except for the last child)
    const isLast = i === children.length - 1;
    if (!isLast) {
      const handlePosition = isHorizontal
        ? {
            top: parentBounds.top,
            left: childBounds.left + childBounds.width,
            width: 0.5, // Handle width as percentage
            height: parentBounds.height,
          }
        : {
            top: childBounds.top + childBounds.height,
            left: parentBounds.left,
            width: parentBounds.width,
            height: 0.5, // Handle height as percentage
          };

      handles.push({
        splitId: id,
        direction,
        sizes,
        index: i,
        position: handlePosition,
      });
    }

    // Recurse into child
    handles.push(...collectResizeHandles(child, childBounds));

    offset += size;
  }

  return handles;
}

/**
 * Individual resize handle with its own resize logic.
 */
const ResizeHandleWrapper: FC<{
  handle: ResizeHandleInfo;
  containerRef: React.RefObject<HTMLDivElement>;
  onResizePanes: (splitId: string, sizes: number[]) => void;
}> = ({ handle, containerRef, onResizePanes }) => {
  const { isDragging, handleMouseDown } = useSplitResize({
    direction: handle.direction,
    sizes: handle.sizes,
    containerRef,
    onResize: useCallback(
      (newSizes: number[]) => {
        onResizePanes(handle.splitId, newSizes);
      },
      [onResizePanes, handle.splitId]
    ),
  });

  const isHorizontal = handle.direction === "horizontal";

  return (
    <div
      className="absolute"
      style={{
        top: `${handle.position.top}%`,
        left: `${handle.position.left}%`,
        width: isHorizontal ? "6px" : `${handle.position.width}%`,
        height: isHorizontal ? `${handle.position.height}%` : "6px",
        transform: isHorizontal ? "translateX(-50%)" : "translateY(-50%)",
        zIndex: 10,
      }}
      data-dragging={isDragging}
    >
      <SplitResizeHandle direction={handle.direction} onMouseDown={handleMouseDown(handle.index)} />
    </div>
  );
};

/**
 * Overlay component that renders resize handles for a split layout.
 * This component renders an absolutely positioned layer on top of the terminal area
 * with just the resize handles (not the terminals themselves).
 */
export const SplitResizeOverlay: FC<SplitResizeOverlayProps> = ({ paneNode, onResizePanes }) => {
  const containerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const handles = collectResizeHandles(paneNode);

  const renderHandles = useCallback((): ReactNode => {
    return handles.map((handle, idx) => (
      <ResizeHandleWrapper
        key={`${handle.splitId}-${handle.index}-${idx}`}
        handle={handle}
        containerRef={containerRef}
        onResizePanes={onResizePanes}
      />
    ));
  }, [handles, onResizePanes]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-10">
      <div className="relative w-full h-full pointer-events-auto">{renderHandles()}</div>
    </div>
  );
};
