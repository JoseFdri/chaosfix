import type { ExternalApp, ExternalAppId } from "@chaosfix/core";

/**
 * Result of opening a path in an external application
 */
export interface OpenInExternalAppResult {
  /** Whether the operation succeeded */
  success: boolean;
  /** Error message if the operation failed */
  error?: string;
}

/**
 * External apps API exposed to renderer process
 */
export interface ExternalAppsAPI {
  list: () => Promise<ExternalApp[]>;
  open: (appId: ExternalAppId, path: string) => Promise<OpenInExternalAppResult>;
}
