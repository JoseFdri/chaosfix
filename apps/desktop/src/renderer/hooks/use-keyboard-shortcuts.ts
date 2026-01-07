import { useEffect, useCallback } from "react";
import type { SplitDirection } from "@chaosfix/core";

export interface UseKeyboardShortcutsOptions {
  /** Whether splitting is available (has active terminal) */
  canSplit: boolean;
  /** Whether there's a split layout in the active workspace */
  hasSplitLayout: boolean;
  /** The focused terminal ID (for pane-specific operations) */
  focusedTerminalId: string | null;
  /** Handler for split operations */
  onSplit: (direction: SplitDirection) => void;
  /** Handler for closing a pane (when in split layout) */
  onClosePane: (terminalId: string) => void;
  /** Handler for closing a tab (when not in split layout) */
  onCloseTab: (terminalId: string) => void;
}

/**
 * Keyboard shortcut definitions for split terminal operations.
 * These are designed to not conflict with Claude Code CLI shortcuts.
 */
const SPLIT_SHORTCUTS = {
  /** Split horizontally (side-by-side) */
  HORIZONTAL: { key: "d", meta: true, shift: false },
  /** Split vertically (top-bottom) */
  VERTICAL: { key: "d", meta: true, shift: true },
  /** Close current pane or tab */
  CLOSE: { key: "w", meta: true, shift: false },
} as const;

/**
 * Hook that manages keyboard shortcuts for split terminal operations.
 *
 * Shortcuts:
 * - Cmd+D: Split horizontally (side-by-side)
 * - Cmd+Shift+D: Split vertically (top-bottom)
 * - Cmd+W: Close active pane (if in split) or close tab (if not split)
 */
export function useKeyboardShortcuts({
  canSplit,
  hasSplitLayout,
  focusedTerminalId,
  onSplit,
  onClosePane,
  onCloseTab,
}: UseKeyboardShortcutsOptions): void {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent): void => {
      // Only process shortcuts with meta key (Cmd on macOS)
      if (!event.metaKey) {
        return;
      }

      const key = event.key.toLowerCase();

      // Cmd+D - Split horizontal
      if (key === SPLIT_SHORTCUTS.HORIZONTAL.key && !event.shiftKey && canSplit) {
        event.preventDefault();
        onSplit("horizontal");
        return;
      }

      // Cmd+Shift+D - Split vertical
      if (key === SPLIT_SHORTCUTS.VERTICAL.key && event.shiftKey && canSplit) {
        event.preventDefault();
        onSplit("vertical");
        return;
      }

      // Cmd+W - Close pane or tab
      if (key === SPLIT_SHORTCUTS.CLOSE.key && !event.shiftKey) {
        event.preventDefault();

        if (!focusedTerminalId) {
          return;
        }

        if (hasSplitLayout) {
          // In split layout, close the focused pane
          onClosePane(focusedTerminalId);
        } else {
          // Not in split, close the tab
          onCloseTab(focusedTerminalId);
        }
      }
    },
    [canSplit, hasSplitLayout, focusedTerminalId, onSplit, onClosePane, onCloseTab]
  );

  useEffect((): (() => void) => {
    window.addEventListener("keydown", handleKeyDown);
    return (): void => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
}
