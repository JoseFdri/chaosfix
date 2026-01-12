import { z } from "zod";

import { appPreferencesSchema } from "./preferences.schema";

// Split direction type
const splitDirectionSchema = z.enum(["horizontal", "vertical"]);

// Terminal pane leaf node
const terminalPaneSchema = z.object({
  type: z.literal("terminal"),
  terminalId: z.string(),
});

// Split pane container node (recursive structure requires lazy evaluation)
type PaneNodeSchema = z.ZodType<
  | { type: "terminal"; terminalId: string }
  | {
      type: "split";
      id: string;
      direction: "horizontal" | "vertical";
      sizes: number[];
      children: unknown[];
    }
>;

const paneNodeSchema: PaneNodeSchema = z.lazy(() =>
  z.union([
    terminalPaneSchema,
    z.object({
      type: z.literal("split"),
      id: z.string(),
      direction: splitDirectionSchema,
      sizes: z.array(z.number()),
      children: z.array(paneNodeSchema),
    }),
  ])
);

// Terminal schema for persistence
const terminalStateSchema = z.object({
  id: z.string(),
  title: z.string(),
  scrollbackHistory: z.string().optional(),
});

// Tab schema for the new tab-centric model
const tabStateSchema = z.object({
  id: z.string(),
  label: z.string(),
  terminals: z.array(terminalStateSchema),
  splitLayout: paneNodeSchema.nullable(),
  focusedTerminalId: z.string().nullable(),
  createdAt: z.number(),
});

/**
 * Workspace state schema supporting both old and new format.
 * - Old format: has terminals array, activeTerminalId, splitLayout, focusedTerminalId
 * - New format: has tabs array, activeTabId
 *
 * The hydration layer handles migration from old to new format.
 */
export const workspaceStateSchema = z.object({
  id: z.string(),
  name: z.string(),
  repositoryId: z.string(),
  worktreePath: z.string(),
  branchName: z.string(),
  // Old format fields (optional for backward compatibility)
  terminals: z.array(terminalStateSchema).optional(),
  activeTerminalId: z.string().nullable().optional(),
  splitLayout: paneNodeSchema.nullable().optional(),
  focusedTerminalId: z.string().nullable().optional(),
  // New tab-centric format fields
  tabs: z.array(tabStateSchema).optional(),
  activeTabId: z.string().nullable().optional(),
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
