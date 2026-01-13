import { type FC, type CSSProperties, useMemo } from "react";
import { TerminalView } from "./TerminalView";
import { TerminalToolbar } from "./TerminalToolbar";
import type { TerminalBounds } from "../libs";

const TOOLBAR_HEIGHT_PX = 32;

interface TerminalContainerProps {
  terminalId: string;
  worktreePath: string;
  isActive: boolean;
  onClick?: () => void;
  onExit?: (terminalId: string, exitCode: number) => void;
  bounds?: TerminalBounds | null;
  isFocused?: boolean;
  onSplit?: () => void;
  onClose?: () => void;
}

export const TerminalContainer: FC<TerminalContainerProps> = ({
  terminalId,
  worktreePath,
  isActive,
  onClick,
  onExit,
  bounds,
  isFocused,
  onSplit,
  onClose,
}) => {
  const containerStyle = useMemo((): CSSProperties => {
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
        zIndex: isFocused ? 10 : 0,
      };
    }

    return {};
  }, [isActive, bounds, isFocused]);

  const focusRingClass = isFocused ? "ring-1 ring-accent-primary ring-inset" : "";

  return (
    <div
      className={`flex flex-col w-full h-full ${focusRingClass}`}
      style={containerStyle}
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
    >
      <div
        className="w-full shrink-0 bg-surface-secondary"
        style={{ height: `${TOOLBAR_HEIGHT_PX}px` }}
      >
        <TerminalToolbar onSplit={onSplit} onClose={onClose} />
      </div>
      <div className="flex-1 min-h-0">
        <TerminalView
          terminalId={terminalId}
          worktreePath={worktreePath}
          isActive={isActive}
          onExit={onExit}
        />
      </div>
    </div>
  );
};
