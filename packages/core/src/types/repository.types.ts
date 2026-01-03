export interface Repository {
  id: string;
  name: string;
  path: string;
  defaultBranch: string;
  workspaces: string[]; // Workspace IDs
  createdAt: Date;
  branchFrom?: string; // Branch to create new workspaces from
  defaultRemote?: string; // Preferred remote for push/pull operations
}
