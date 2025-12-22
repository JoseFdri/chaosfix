import type { z } from "zod";

import type { projectConfigSchema } from "../schemas/project.schema";

export type ProjectConfig = z.infer<typeof projectConfigSchema>;
