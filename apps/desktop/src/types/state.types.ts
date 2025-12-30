import type { AppState } from "@chaosfix/config";

/**
 * State API exposed to renderer process
 */
export interface StateAPI {
  load: () => Promise<AppState | null>;
  save: (state: AppState) => Promise<boolean>;
}
