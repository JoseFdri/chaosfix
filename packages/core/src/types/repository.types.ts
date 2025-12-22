export interface Repository {
  id: string;
  name: string;
  path: string;
  defaultBranch: string;
  workspaces: string[]; // Workspace IDs
  createdAt: Date;
}
