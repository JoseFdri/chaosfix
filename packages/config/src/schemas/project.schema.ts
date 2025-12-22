import { z } from "zod";

export const projectConfigSchema = z.object({
  version: z.string().default("1.0"),
  name: z.string().optional(),
  defaultBranch: z.string().default("main"),
  workspaceDefaults: z
    .object({
      setupScript: z.string().optional(),
      teardownScript: z.string().optional(),
      env: z.record(z.string(), z.string()).optional(),
      shell: z.string().optional(),
    })
    .optional(),
  templates: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        branchPrefix: z.string().optional(),
        setupScript: z.string().optional(),
        env: z.record(z.string(), z.string()).optional(),
      })
    )
    .optional(),
});
