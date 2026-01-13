import { useMemo, type ReactNode } from "react";

import type { ExternalApp } from "@chaosfix/core";
import { getAppIcon } from "@chaosfix/ui";

import type { WorkspaceWithTabs } from "../contexts/slices/workspaces.slice";

/**
 * Selected app with icon for dropdown display.
 */
export interface SelectedAppDropdownItem {
  id: string;
  name: string;
  icon?: ReactNode;
}

/**
 * Options for the useSelectedAppDropdown hook.
 */
export interface UseSelectedAppDropdownOptions {
  /** The currently active workspace */
  activeWorkspace: WorkspaceWithTabs | undefined;
  /** List of available external applications */
  apps: ExternalApp[];
}

/**
 * Return type for the useSelectedAppDropdown hook.
 */
export interface UseSelectedAppDropdownReturn {
  /** The selected app with icon for display in dropdown, or null if none selected */
  selectedApp: SelectedAppDropdownItem | null;
}

/**
 * Hook for computing the selected app with icon for the OpenInDropdown.
 *
 * Memoizes the computation to prevent unnecessary recalculations
 * when dependencies haven't changed.
 */
export function useSelectedAppDropdown({
  activeWorkspace,
  apps,
}: UseSelectedAppDropdownOptions): UseSelectedAppDropdownReturn {
  const selectedApp = useMemo((): SelectedAppDropdownItem | null => {
    if (!activeWorkspace?.selectedAppId) {
      return null;
    }

    const app = apps.find((a) => a.id === activeWorkspace.selectedAppId);
    if (!app) {
      return null;
    }

    const IconComponent = getAppIcon(app.id);
    return {
      id: app.id,
      name: app.name,
      icon: IconComponent ? <IconComponent className="w-4 h-4" /> : undefined,
    };
  }, [activeWorkspace?.selectedAppId, apps]);

  return {
    selectedApp,
  };
}
