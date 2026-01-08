import { type FC, type CSSProperties, useMemo } from "react";
import { useTerminal } from "../hooks";
import type { TerminalBounds } from "../libs";

interface TerminalViewProps {
  terminalId: string;
  worktreePath: string;
  isActive: boolean;
  /** Optional click handler for selecting this terminal pane */
  onClick?: () => void;
  /** Called when the terminal process exits */
  onExit?: (terminalId: string, exitCode: number) => void;
  /** Optional bounds for positioning within split layout (percentages 0-100) */
  bounds?: TerminalBounds | null;
  /** Whether this terminal pane has keyboard focus in split view */
  isFocused?: boolean;
}

export const TerminalView: FC<TerminalViewProps> = ({
  terminalId,
  worktreePath,
  isActive,
  onClick,
  onExit,
  bounds,
  isFocused,
}) => {
  const { containerRef } = useTerminal({ terminalId, cwd: worktreePath, onExit });

  const style = useMemo((): CSSProperties => {
    if (!isActive) {
      return { display: "none" };
    }

    if (bounds) {
      return {
        position: "absolute",
        top: `${bounds.top}%`,
        left: `${bounds.left}%`,
        width: `${bounds.width}%`,
        height: `${bounds.height}%`,
      };
    }

    return {};
  }, [isActive, bounds]);

  const focusRingClass = isFocused ? "ring-1 ring-accent-primary ring-inset" : "";

  return (
    <div
      ref={containerRef}
      className={`terminal-container w-full h-full ${focusRingClass}`}
      style={style}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e): void => {
              if (e.key === "Enter") {
                onClick();
              }
            }
          : undefined
      }
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    />
  );
};
