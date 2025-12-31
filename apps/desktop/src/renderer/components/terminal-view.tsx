import { type FC } from "react";
import { useTerminal } from "../hooks";

interface TerminalViewProps {
  workspaceId: string;
  worktreePath: string;
}

export const TerminalView: FC<TerminalViewProps> = ({ workspaceId, worktreePath }) => {
  const { containerRef } = useTerminal({ workspaceId, cwd: worktreePath });

  return <div ref={containerRef} className="terminal-container w-full h-full" />;
};
