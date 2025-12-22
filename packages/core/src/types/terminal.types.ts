export interface TerminalSession {
  id: string;
  workspaceId: string;
  pid: number;
  title: string;
  status: TerminalSessionStatus;
  createdAt: Date;
}

export type TerminalSessionStatus = "running" | "idle" | "closed" | "error";
