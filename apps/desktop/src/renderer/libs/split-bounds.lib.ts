import type { PaneNode } from "@chaosfix/core";

/**
 * Represents bounds as percentages (0-100) for a terminal within a split layout.
 */
export interface TerminalBounds {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * Map of terminal IDs to their calculated bounds.
 */
export type TerminalBoundsMap = Map<string, TerminalBounds>;

/**
 * Recursively calculates bounds for all terminals in a split layout tree.
 * Returns a Map of terminalId -> bounds (percentages 0-100).
 *
 * @param node - The root PaneNode of the split layout
 * @param parentBounds - The bounds of the parent container (defaults to full 100x100)
 */
export function calculateTerminalBounds(
  node: PaneNode,
  parentBounds: TerminalBounds = { top: 0, left: 0, width: 100, height: 100 }
): TerminalBoundsMap {
  const boundsMap: TerminalBoundsMap = new Map();

  if (node.type === "terminal") {
    boundsMap.set(node.terminalId, parentBounds);
    return boundsMap;
  }

  const { direction, sizes, children } = node;
  const isHorizontal = direction === "horizontal";

  let offset = 0;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const size = sizes[i] ?? 100 / children.length;

    if (!child) {
      continue;
    }

    const childBounds: TerminalBounds = isHorizontal
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

    const childBoundsMap = calculateTerminalBounds(child, childBounds);
    for (const [terminalId, bounds] of childBoundsMap) {
      boundsMap.set(terminalId, bounds);
    }

    offset += size;
  }

  return boundsMap;
}

/**
 * Gets bounds for a specific terminal from a split layout.
 * Returns null if the terminal is not in the layout or layout is null.
 */
export function getTerminalBounds(
  layout: PaneNode | null,
  terminalId: string
): TerminalBounds | null {
  if (!layout) {
    return null;
  }

  const boundsMap = calculateTerminalBounds(layout);
  return boundsMap.get(terminalId) ?? null;
}
