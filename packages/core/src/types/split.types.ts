/**
 * Direction of a split pane container.
 * - "horizontal": Children are arranged side-by-side (in a row)
 * - "vertical": Children are arranged top-to-bottom (in a column)
 */
export type SplitDirection = "horizontal" | "vertical";

/**
 * A terminal pane leaf node in the split tree.
 * Represents a single terminal instance within the layout.
 */
export interface TerminalPane {
  /** Discriminant for identifying terminal leaf nodes */
  type: "terminal";
  /** Reference to the associated TerminalSession.id */
  terminalId: string;
}

/**
 * A split container node in the pane tree.
 * Contains two or more child panes arranged in a direction.
 */
export interface SplitPane {
  /** Discriminant for identifying split container nodes */
  type: "split";
  /** Unique identifier for the split container (used for resize operations) */
  id: string;
  /** The direction children are arranged */
  direction: SplitDirection;
  /**
   * Percentage sizes for each child pane.
   * Array length must match children length.
   * Values should sum to 100.
   */
  sizes: number[];
  /** Child panes (minimum 2 children required for a valid split) */
  children: PaneNode[];
}

/**
 * A node in the pane tree structure.
 * Discriminated union that can be either a terminal leaf or a split container.
 * Supports unlimited recursive nesting.
 */
export type PaneNode = TerminalPane | SplitPane;
