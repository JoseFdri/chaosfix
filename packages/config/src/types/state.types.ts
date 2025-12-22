import type { z } from "zod";

import type { appStateSchema, workspaceStateSchema } from "../schemas/state.schema";

export type WorkspaceState = z.infer<typeof workspaceStateSchema>;
export type AppState = z.infer<typeof appStateSchema>;
