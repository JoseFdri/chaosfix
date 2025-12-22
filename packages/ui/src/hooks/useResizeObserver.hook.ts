import { useEffect, useRef, useState, useCallback } from "react";

interface Size {
  width: number;
  height: number;
}

export function useResizeObserver<T extends HTMLElement = HTMLElement>(): [
  (node: T | null) => void,
  Size | null,
] {
  const [size, setSize] = useState<Size | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const elementRef = useRef<T | null>(null);

  const setRef = useCallback((node: T | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (node) {
      observerRef.current = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          const { width, height } = entry.contentRect;
          setSize({ width, height });
        }
      });

      observerRef.current.observe(node);
      elementRef.current = node;

      // Set initial size
      const { width, height } = node.getBoundingClientRect();
      setSize({ width, height });
    } else {
      elementRef.current = null;
      setSize(null);
    }
  }, []);

  useEffect(() => {
    return (): void => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return [setRef, size];
}
