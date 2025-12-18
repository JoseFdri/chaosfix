import { useEffect, useCallback } from "react";

interface ShortcutOptions {
  enabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

type ModifierKey = "meta" | "ctrl" | "alt" | "shift";

interface ParsedShortcut {
  key: string;
  modifiers: ModifierKey[];
}

function parseShortcut(shortcut: string): ParsedShortcut {
  const parts = shortcut.toLowerCase().split("+");
  const key = parts.pop() || "";
  const modifiers: ModifierKey[] = [];

  for (const part of parts) {
    if (part === "cmd" || part === "meta") {
      modifiers.push("meta");
    } else if (part === "ctrl" || part === "control") {
      modifiers.push("ctrl");
    } else if (part === "alt" || part === "option") {
      modifiers.push("alt");
    } else if (part === "shift") {
      modifiers.push("shift");
    }
  }

  return { key, modifiers };
}

function matchesShortcut(event: KeyboardEvent, shortcut: ParsedShortcut): boolean {
  const { key, modifiers } = shortcut;

  // Check if key matches
  if (event.key.toLowerCase() !== key) {
    return false;
  }

  // Check modifiers
  const hasCtrl = modifiers.includes("ctrl");
  const hasMeta = modifiers.includes("meta");
  const hasAlt = modifiers.includes("alt");
  const hasShift = modifiers.includes("shift");

  return (
    event.ctrlKey === hasCtrl &&
    event.metaKey === hasMeta &&
    event.altKey === hasAlt &&
    event.shiftKey === hasShift
  );
}

export function useKeyboardShortcut(
  shortcut: string,
  callback: () => void,
  options: ShortcutOptions = {}
): void {
  const { enabled = true, preventDefault = true, stopPropagation = false } = options;

  const parsedShortcut = parseShortcut(shortcut);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) {
        return;
      }

      if (matchesShortcut(event, parsedShortcut)) {
        if (preventDefault) {
          event.preventDefault();
        }
        if (stopPropagation) {
          event.stopPropagation();
        }
        callback();
      }
    },
    [enabled, parsedShortcut, preventDefault, stopPropagation, callback]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
}
