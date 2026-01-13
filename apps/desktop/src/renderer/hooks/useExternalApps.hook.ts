import { useState, useEffect, useCallback } from "react";

import type { ExternalApp, ExternalAppId } from "@chaosfix/core";

/**
 * Return type for the useExternalApps hook.
 */
export interface UseExternalAppsReturn {
  /** List of available external applications */
  apps: ExternalApp[];
  /** Open a path in a specific external application */
  openIn: (appId: ExternalAppId, path: string) => Promise<void>;
  /** Whether the app list is currently loading */
  isLoading: boolean;
}

/**
 * Hook for managing external application integration.
 *
 * Handles:
 * - Fetching the list of installed external apps on mount
 * - Providing a function to open paths in external applications
 * - Loading state management
 */
export function useExternalApps(): UseExternalAppsReturn {
  const [apps, setApps] = useState<ExternalApp[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch app list once on mount
  useEffect(() => {
    let isMounted = true;

    const loadApps = async (): Promise<void> => {
      try {
        const appList = await window.externalApps.list();
        if (isMounted) {
          setApps(appList);
        }
      } catch (err) {
        console.error("Failed to load external apps:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadApps();

    return (): void => {
      isMounted = false;
    };
  }, []);

  const openIn = useCallback(async (appId: ExternalAppId, path: string): Promise<void> => {
    try {
      const result = await window.externalApps.open(appId, path);
      if (!result.success) {
        console.error(`Failed to open in ${appId}:`, result.error);
      }
    } catch (err) {
      console.error(`Failed to open in ${appId}:`, err);
    }
  }, []);

  return {
    apps,
    openIn,
    isLoading,
  };
}
