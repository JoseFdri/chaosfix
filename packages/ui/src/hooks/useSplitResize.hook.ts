import { useState, useCallback, useRef, useEffect } from "react";
import type { UseSplitResizeOptions, UseSplitResizeReturn } from "../types";

const DEFAULT_MIN_SIZE = 100;

/**
 * Hook for handling drag-resize behavior in split pane containers.
 * Manages mouse drag interactions to resize adjacent panes while
 * respecting minimum size constraints.
 *
 * @param options - Configuration options for the resize behavior
 * @returns Object containing drag state and mouse down handler factory
 */
export const useSplitResize = ({
  direction,
  sizes,
  containerRef,
  minSize = DEFAULT_MIN_SIZE,
  onResize,
}: UseSplitResizeOptions): UseSplitResizeReturn => {
  const [isDragging, setIsDragging] = useState(false);

  const dragIndexRef = useRef<number>(-1);
  const startPositionRef = useRef(0);
  const startSizesRef = useRef<number[]>([]);
  const onResizeRef = useRef(onResize);

  useEffect(() => {
    onResizeRef.current = onResize;
  }, [onResize]);

  const calculateMinSizePercentage = useCallback((): number => {
    const container = containerRef.current;
    if (!container) {
      return 5;
    }

    const containerSize =
      direction === "horizontal" ? container.offsetWidth : container.offsetHeight;
    if (containerSize === 0) {
      return 5;
    }

    return (minSize / containerSize) * 100;
  }, [containerRef, direction, minSize]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container || dragIndexRef.current < 0) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const containerSize = direction === "horizontal" ? containerRect.width : containerRect.height;
      const position =
        direction === "horizontal" ? e.clientX - containerRect.left : e.clientY - containerRect.top;

      const deltaPosition = position - startPositionRef.current;
      const deltaPercentage = (deltaPosition / containerSize) * 100;

      const newSizes = [...startSizesRef.current];
      const index = dragIndexRef.current;

      const minPercentage = calculateMinSizePercentage();

      const startLeftSize = startSizesRef.current[index];
      const startRightSize = startSizesRef.current[index + 1];

      if (startLeftSize === undefined || startRightSize === undefined) {
        return;
      }

      const newLeftSize = startLeftSize + deltaPercentage;
      const newRightSize = startRightSize - deltaPercentage;

      if (newLeftSize >= minPercentage && newRightSize >= minPercentage) {
        newSizes[index] = newLeftSize;
        newSizes[index + 1] = newRightSize;
        onResizeRef.current(newSizes);
      }
    },
    [containerRef, direction, calculateMinSizePercentage]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragIndexRef.current = -1;
    document.body.style.userSelect = "";
    document.body.style.cursor = "";

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback(
    (index: number): React.MouseEventHandler<HTMLDivElement> =>
      (e) => {
        e.preventDefault();

        const container = containerRef.current;
        if (!container) {
          return;
        }

        const containerRect = container.getBoundingClientRect();
        const position =
          direction === "horizontal"
            ? e.clientX - containerRect.left
            : e.clientY - containerRect.top;

        dragIndexRef.current = index;
        startPositionRef.current = position;
        startSizesRef.current = [...sizes];

        setIsDragging(true);
        document.body.style.userSelect = "none";
        document.body.style.cursor = direction === "horizontal" ? "col-resize" : "row-resize";

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      },
    [containerRef, direction, sizes, handleMouseMove, handleMouseUp]
  );

  useEffect(() => {
    return (): void => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [handleMouseMove, handleMouseUp]);

  return {
    isDragging,
    handleMouseDown,
  };
};
