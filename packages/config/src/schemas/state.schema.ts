import { z } from "zod";

import { appPreferencesSchema } from "./preferences.schema";

export const workspaceStateSchema = z.object({
  id: z.string(),
  name: z.string(),
  repositoryId: z.string(),
  worktreePath: z.string(),
  branchName: z.string(),
  terminals: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      scrollbackHistory: z.string().optional(),
    })
  ),
  activeTerminalId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const appStateSchema = z.object({
  version: z.string(),
  repositories: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      path: z.string(),
      defaultBranch: z.string(),
      branchFrom: z.string().optional(),
      defaultRemote: z.string().optional(),
    })
  ),
  workspaces: z.array(workspaceStateSchema),
  activeWorkspaceId: z.string().nullable(),
  preferences: appPreferencesSchema,
});
