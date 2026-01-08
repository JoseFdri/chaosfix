import { type FC } from "react";
import { useTerminal } from "../hooks";

interface TerminalViewProps {
  terminalId: string;
  worktreePath: string;
  isActive: boolean;
  /** Optional click handler for selecting this terminal pane */
  onClick?: () => void;
  /** Called when the terminal process exits */
  onExit?: (terminalId: string, exitCode: number) => void;
}

export const TerminalView: FC<TerminalViewProps> = ({
  terminalId,
  worktreePath,
  isActive,
  onClick,
  onExit,
}) => {
  const { containerRef } = useTerminal({ terminalId, cwd: worktreePath, onExit });

  return (
    <div
      ref={containerRef}
      className="terminal-container w-full h-full"
      style={{ display: isActive ? "block" : "none" }}
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
