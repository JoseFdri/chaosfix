import { useState, useCallback, useRef, useEffect } from "react";

const DEFAULT_MIN_WIDTH = 150;
const DEFAULT_MAX_WIDTH = 500;

export interface UseDragResizeOptions {
  initialWidth: number;
  minWidth?: number;
  maxWidth?: number;
  onWidthChange?: (width: number) => void;
}

export interface UseDragResizeReturn {
  width: number;
  isDragging: boolean;
  handleMouseDown: (e: React.MouseEvent) => void;
}

export const useDragResize = ({
  initialWidth,
  minWidth = DEFAULT_MIN_WIDTH,
  maxWidth = DEFAULT_MAX_WIDTH,
  onWidthChange,
}: UseDragResizeOptions): UseDragResizeReturn => {
  const [width, setWidth] = useState(initialWidth);
  const [isDragging, setIsDragging] = useState(false);

  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const onWidthChangeRef = useRef(onWidthChange);

  useEffect(() => {
    onWidthChangeRef.current = onWidthChange;
  }, [onWidthChange]);

  const clampWidth = useCallback(
    (value: number): number => {
      return Math.min(Math.max(value, minWidth), maxWidth);
    },
    [minWidth, maxWidth]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const deltaX = e.clientX - startXRef.current;
      const newWidth = clampWidth(startWidthRef.current + deltaX);

      setWidth(newWidth);
      onWidthChangeRef.current?.(newWidth);
    },
    [clampWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.userSelect = "";
    document.body.style.cursor = "";

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      startXRef.current = e.clientX;
      startWidthRef.current = width;

      setIsDragging(true);
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [width, handleMouseMove, handleMouseUp]
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
    width,
    isDragging,
    handleMouseDown,
  };
};
