import type { PaneNode } from "../types/split.types";

/**
 * Generates a unique ID for split panes.
 * Uses a timestamp prefix with random suffix for uniqueness.
 */
export function generateSplitId(): string {
  return `split-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Updates sizes for a specific split pane by ID.
 * Recursively searches the tree for the target split and updates its sizes.
 *
 * @param node - The pane node to search/update
 * @param splitId - The ID of the split pane to update
 * @param sizes - The new size percentages for the split's children
 * @returns A new pane node with the updated sizes
 */
export function updateSplitSizes(node: PaneNode, splitId: string, sizes: number[]): PaneNode {
  if (node.type === "terminal") {
    return node;
  }

  if (node.id === splitId) {
    return { ...node, sizes };
  }

  return {
    ...node,
    children: node.children.map((child) => updateSplitSizes(child, splitId, sizes)),
  };
}

/**
 * Removes a terminal from the tree and collapses splits if only one child remains.
 * Normalizes remaining sizes to sum to 100 after removal.
 *
 * @param node - The pane node to search/update
 * @param terminalId - The ID of the terminal to remove
 * @returns The updated tree, or null if the tree should be cleared
 */
export function removeTerminalFromTree(node: PaneNode, terminalId: string): PaneNode | null {
  if (node.type === "terminal") {
    if (node.terminalId === terminalId) {
      return null;
    }
    return node;
  }

  const updatedChildren: PaneNode[] = [];
  const keptIndices: number[] = [];

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (child) {
      const updated = removeTerminalFromTree(child, terminalId);
      if (updated !== null) {
        updatedChildren.push(updated);
        keptIndices.push(i);
      }
    }
  }

  if (updatedChildren.length === 0) {
    return null;
  }

  if (updatedChildren.length === 1) {
    // Collapse this split - return the single remaining child
    const firstChild = updatedChildren[0];
    return firstChild ?? null;
  }

  // Recalculate sizes proportionally from kept children
  const keptSizes: number[] = [];
  for (const idx of keptIndices) {
    const size = node.sizes[idx];
    if (typeof size === "number") {
      keptSizes.push(size);
    }
  }

  const totalKeptSize = keptSizes.reduce((sum, s) => sum + s, 0);

  // Normalize to sum to 100
  const normalizedSizes =
    totalKeptSize > 0
      ? keptSizes.map((s) => (s / totalKeptSize) * 100)
      : updatedChildren.map(() => 100 / updatedChildren.length);

  return {
    ...node,
    children: updatedChildren,
    sizes: normalizedSizes,
  };
}

/**
 * Gets all terminal IDs from a pane tree.
 * Recursively collects all terminal IDs in the tree structure.
 *
 * @param node - The pane node to traverse
 * @returns An array of all terminal IDs in the tree
 */
export function getAllTerminalIds(node: PaneNode): string[] {
  if (node.type === "terminal") {
    return [node.terminalId];
  }

  return node.children.flatMap((child) => getAllTerminalIds(child));
}

/**
 * Replaces a terminal pane with a new node (used when splitting).
 * Recursively searches for the target terminal and replaces it.
 *
 * @param node - The pane node to search/update
 * @param terminalId - The ID of the terminal to replace
 * @param replacement - The new node to insert in place of the terminal
 * @returns A new pane node with the replacement applied
 */
export function replaceTerminalInTree(
  node: PaneNode,
  terminalId: string,
  replacement: PaneNode
): PaneNode {
  if (node.type === "terminal") {
    if (node.terminalId === terminalId) {
      return replacement;
    }
    return node;
  }

  return {
    ...node,
    children: node.children.map((child) => replaceTerminalInTree(child, terminalId, replacement)),
  };
}
