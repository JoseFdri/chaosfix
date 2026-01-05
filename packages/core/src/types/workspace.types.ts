export interface Workspace {
  id: string;
  name: string;
  repositoryId: string;
  worktreePath: string;
  branchName: string;
  createdAt: Date;
  updatedAt: Date;
  status: WorkspaceStatus;
}

export type WorkspaceStatus = "active" | "idle" | "error" | "archived" | "setting_up";
