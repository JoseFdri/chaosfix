import { type FC, useRef, Children } from "react";
import { cn } from "../../libs/cn.lib";
import { useSplitResize } from "../../hooks/useSplitResize.hook";
import { SplitResizeHandle } from "../atoms/SplitResizeHandle.atom";
import type { SplitPaneProps } from "../../types";

const DEFAULT_MIN_SIZE = 100;

/**
 * Recursive split container component for rendering pane layouts.
 * Arranges children in a row (horizontal) or column (vertical) with
 * draggable resize handles between them.
 *
 * @param direction - How to arrange children: "horizontal" (row) or "vertical" (column)
 * @param sizes - Percentage sizes for each child (must match children count)
 * @param children - Child elements to render in the split layout
 * @param onResize - Callback when sizes change during resize
 * @param minSize - Minimum pane size in pixels (default: 100)
 * @param className - Optional additional CSS classes
 */
export const SplitPane: FC<SplitPaneProps> = ({
  direction,
  sizes,
  children,
  onResize,
  minSize = DEFAULT_MIN_SIZE,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const childArray = Children.toArray(children);

  const { isDragging, handleMouseDown } = useSplitResize({
    direction,
    sizes,
    containerRef,
    minSize,
    onResize: onResize ?? ((): void => {}),
  });

  const isHorizontal = direction === "horizontal";

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex w-full h-full overflow-hidden",
        isHorizontal ? "flex-row" : "flex-col",
        className
      )}
      data-split-direction={direction}
      data-dragging={isDragging}
    >
      {childArray.map((child, index) => {
        const size = sizes[index] ?? 100 / childArray.length;
        const isLast = index === childArray.length - 1;

        return (
          <div
            key={index}
            className="flex"
            style={{ [isHorizontal ? "width" : "height"]: `${size}%` }}
          >
            <div className="flex-1 overflow-hidden">{child}</div>
            {!isLast && (
              <SplitResizeHandle direction={direction} onMouseDown={handleMouseDown(index)} />
            )}
          </div>
        );
      })}
    </div>
  );
};
