import { type FC } from "react";
import { useTerminal } from "../hooks";

interface TerminalViewProps {
  workspaceId: string;
}

export const TerminalView: FC<TerminalViewProps> = ({ workspaceId }) => {
  const { containerRef } = useTerminal({ workspaceId });

  return <div ref={containerRef} className="terminal-container w-full h-full" />;
};
