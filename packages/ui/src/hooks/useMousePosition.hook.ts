import { useState, useCallback, useRef, useEffect, type RefObject } from "react";

export interface MousePosition {
  /** Absolute X position relative to element */
  x: number;
  /** Absolute Y position relative to element */
  y: number;
  /** Normalized X position (0 to 1, where 0.5 is center) */
  normalizedX: number;
  /** Normalized Y position (0 to 1, where 0.5 is center) */
  normalizedY: number;
  /** Whether mouse is currently over the element */
  isOver: boolean;
}

const DEFAULT_POSITION: MousePosition = {
  x: 0,
  y: 0,
  normalizedX: 0.5,
  normalizedY: 0.5,
  isOver: false,
};

export function useMousePosition<T extends HTMLElement>(ref: RefObject<T | null>): MousePosition {
  const [position, setPosition] = useState<MousePosition>(DEFAULT_POSITION);
  const rafIdRef = useRef<number | null>(null);
  const pendingPositionRef = useRef<MousePosition | null>(null);

  const updatePosition = useCallback(() => {
    if (pendingPositionRef.current) {
      setPosition(pendingPositionRef.current);
      pendingPositionRef.current = null;
    }
    rafIdRef.current = null;
  }, []);

  const scheduleUpdate = useCallback(
    (newPosition: MousePosition) => {
      pendingPositionRef.current = newPosition;

      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(updatePosition);
      }
    },
    [updatePosition]
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const element = ref.current;
      if (!element) {
        return;
      }

      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const normalizedX = rect.width > 0 ? x / rect.width : 0.5;
      const normalizedY = rect.height > 0 ? y / rect.height : 0.5;

      scheduleUpdate({
        x,
        y,
        normalizedX: Math.max(0, Math.min(1, normalizedX)),
        normalizedY: Math.max(0, Math.min(1, normalizedY)),
        isOver: true,
      });
    },
    [ref, scheduleUpdate]
  );

  const handleMouseEnter = useCallback(
    (event: MouseEvent) => {
      const element = ref.current;
      if (!element) {
        return;
      }

      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const normalizedX = rect.width > 0 ? x / rect.width : 0.5;
      const normalizedY = rect.height > 0 ? y / rect.height : 0.5;

      scheduleUpdate({
        x,
        y,
        normalizedX: Math.max(0, Math.min(1, normalizedX)),
        normalizedY: Math.max(0, Math.min(1, normalizedY)),
        isOver: true,
      });
    },
    [ref, scheduleUpdate]
  );

  const handleMouseLeave = useCallback(() => {
    scheduleUpdate({
      ...DEFAULT_POSITION,
      isOver: false,
    });
  }, [scheduleUpdate]);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return (): void => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);

      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [ref, handleMouseMove, handleMouseEnter, handleMouseLeave]);

  return position;
}
