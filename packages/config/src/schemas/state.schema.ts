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
  /** The selected external app for quick-open (e.g., "vscode", "cursor") */
  selectedAppId: z.string().nullable().optional(),
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
      saveConfigToRepo: z.boolean().optional(),
    })
  ),
  workspaces: z.array(workspaceStateSchema),
  activeWorkspaceId: z.string().nullable(),
  preferences: appPreferencesSchema,
});
