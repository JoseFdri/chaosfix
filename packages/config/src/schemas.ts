import { z } from "zod";

// Project configuration schema (chaosfix.json)
export const projectConfigSchema = z.object({
  version: z.string().default("1.0"),
  name: z.string().optional(),
  defaultBranch: z.string().default("main"),
  workspaceDefaults: z
    .object({
      setupScript: z.string().optional(),
      teardownScript: z.string().optional(),
      env: z.record(z.string()).optional(),
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
        env: z.record(z.string()).optional(),
      })
    )
    .optional(),
});

export type ProjectConfig = z.infer<typeof projectConfigSchema>;

// Application preferences schema
export const appPreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system"),
  terminal: z.object({
    fontFamily: z.string().default("Menlo, Monaco, monospace"),
    fontSize: z.number().min(8).max(32).default(14),
    lineHeight: z.number().min(1).max(2).default(1.2),
    cursorStyle: z.enum(["block", "underline", "bar"]).default("block"),
    cursorBlink: z.boolean().default(true),
    scrollback: z.number().min(100).max(100000).default(10000),
  }),
  keyboard: z.object({
    newWorkspace: z.string().default("Cmd+N"),
    closeWorkspace: z.string().default("Cmd+W"),
    nextWorkspace: z.string().default("Cmd+]"),
    prevWorkspace: z.string().default("Cmd+["),
    commandPalette: z.string().default("Cmd+K"),
    toggleSidebar: z.string().default("Cmd+B"),
  }),
  sidebar: z.object({
    width: z.number().min(150).max(500).default(250),
    collapsed: z.boolean().default(false),
  }),
  notifications: z.object({
    enabled: z.boolean().default(true),
    sound: z.boolean().default(false),
    terminalActivity: z.boolean().default(true),
    workspaceReady: z.boolean().default(true),
  }),
});

export type AppPreferences = z.infer<typeof appPreferencesSchema>;

// Workspace state schema (for persistence)
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

export type WorkspaceState = z.infer<typeof workspaceStateSchema>;

// Full app state schema (for persistence)
export const appStateSchema = z.object({
  version: z.string(),
  repositories: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      path: z.string(),
      defaultBranch: z.string(),
    })
  ),
  workspaces: z.array(workspaceStateSchema),
  activeWorkspaceId: z.string().nullable(),
  preferences: appPreferencesSchema,
});

export type AppState = z.infer<typeof appStateSchema>;
