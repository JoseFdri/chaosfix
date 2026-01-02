import { type FC } from "react";
import { useTerminal } from "../hooks";

interface TerminalViewProps {
  terminalId: string;
  worktreePath: string;
  isActive: boolean;
}

export const TerminalView: FC<TerminalViewProps> = ({ terminalId, worktreePath, isActive }) => {
  const { containerRef } = useTerminal({ terminalId, cwd: worktreePath });

  return (
    <div
      ref={containerRef}
      className="terminal-container w-full h-full"
      style={{ display: isActive ? "block" : "none" }}
    />
  );
};
