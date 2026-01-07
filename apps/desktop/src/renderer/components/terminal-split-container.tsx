import { type FC, type ReactNode, useCallback } from "react";
import type { PaneNode } from "@chaosfix/core";
import { SplitPane } from "@chaosfix/ui";
import { TerminalView } from "./terminal-view";

interface TerminalSplitContainerProps {
  /** The pane node tree to render */
  paneNode: PaneNode;
  /** The worktree path for terminal initialization */
  worktreePath: string;
  /** The focused terminal ID (controls keyboard focus within splits) */
  focusedTerminalId: string | null;
  /** Callback when pane sizes change during resize */
  onResizePanes: (splitId: string, sizes: number[]) => void;
  /** Callback when a terminal pane is clicked (to set focus) */
  onPaneClick: (terminalId: string) => void;
}

/**
 * Generates a unique key for a pane node.
 * For terminal nodes, uses the terminalId.
 * For split nodes, uses the split id.
 */
function getNodeKey(node: PaneNode, index: number): string {
  if (node.type === "terminal") {
    return node.terminalId;
  }
  return node.id ?? `split-${index}`;
}

/**
 * Recursive component that renders the split layout tree.
 * - For terminal nodes: renders a TerminalView
 * - For split nodes: renders a SplitPane with recursive children
 *
 * All terminals are rendered visible (no display:none) within splits
 * since the split layout handles visibility through its structure.
 */
export const TerminalSplitContainer: FC<TerminalSplitContainerProps> = ({
  paneNode,
  worktreePath,
  focusedTerminalId,
  onResizePanes,
  onPaneClick,
}) => {
  const renderPane = useCallback(
    (node: PaneNode): ReactNode => {
      if (node.type === "terminal") {
        const isFocused = node.terminalId === focusedTerminalId;
        return (
          <div
            className={`w-full h-full ${isFocused ? "ring-1 ring-accent-primary ring-inset" : ""}`}
            onClick={() => onPaneClick(node.terminalId)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onPaneClick(node.terminalId);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <TerminalView
              terminalId={node.terminalId}
              worktreePath={worktreePath}
              isActive={true}
            />
          </div>
        );
      }

      if (node.type === "split") {
        return (
          <SplitPane
            direction={node.direction}
            sizes={node.sizes}
            onResize={(sizes) => onResizePanes(node.id, sizes)}
          >
            {node.children.map((child, index) => (
              <div key={getNodeKey(child, index)} className="w-full h-full">
                {renderPane(child)}
              </div>
            ))}
          </SplitPane>
        );
      }

      return null;
    },
    [worktreePath, focusedTerminalId, onResizePanes, onPaneClick]
  );

  return <div className="w-full h-full">{renderPane(paneNode)}</div>;
};
