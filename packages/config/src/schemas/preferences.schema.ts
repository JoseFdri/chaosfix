import { z } from "zod";

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
  updates: z
    .object({
      autoCheck: z.boolean().default(true),
      lastCheckTimestamp: z.number().nullable().default(null),
      dismissedVersion: z.string().nullable().default(null),
    })
    .default({
      autoCheck: true,
      lastCheckTimestamp: null,
      dismissedVersion: null,
    }),
});
