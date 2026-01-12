import type { PaneNode } from "./split.types";
import type { TerminalSession } from "./terminal.types";

/**
 * Represents a tab in the application.
 * A tab owns a collection of terminals and their split layout.
 */
export interface Tab {
  /** Unique identifier for the tab */
  id: string;
  /** Display label shown in the tab bar */
  label: string;
  /** Terminal sessions owned by this tab */
  terminals: TerminalSession[];
  /** Split layout tree for arranging terminals. Null when no splits exist. */
  splitLayout: PaneNode | null;
  /** ID of the currently focused terminal within this tab. Null if no terminal is focused. */
  focusedTerminalId: string | null;
  /** Timestamp when the tab was created (milliseconds since epoch) */
  createdAt: number;
}
