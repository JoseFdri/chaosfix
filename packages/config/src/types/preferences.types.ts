import type { z } from "zod";

import type { appPreferencesSchema } from "../schemas/preferences.schema";

export type AppPreferences = z.infer<typeof appPreferencesSchema>;
