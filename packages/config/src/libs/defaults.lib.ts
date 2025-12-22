import type { AppPreferences } from "../types/preferences.types";
import type { ProjectConfig } from "../types/project.types";

export const DEFAULT_PROJECT_CONFIG: ProjectConfig = {
  version: "1.0",
  defaultBranch: "main",
};

export const DEFAULT_APP_PREFERENCES: AppPreferences = {
  theme: "system",
  terminal: {
    fontFamily: "Menlo, Monaco, monospace",
    fontSize: 14,
    lineHeight: 1.2,
    cursorStyle: "block",
    cursorBlink: true,
    scrollback: 10000,
  },
  keyboard: {
    newWorkspace: "Cmd+N",
    closeWorkspace: "Cmd+W",
    nextWorkspace: "Cmd+]",
    prevWorkspace: "Cmd+[",
    commandPalette: "Cmd+K",
    toggleSidebar: "Cmd+B",
  },
  sidebar: {
    width: 250,
    collapsed: false,
  },
  notifications: {
    enabled: true,
    sound: false,
    terminalActivity: true,
    workspaceReady: true,
  },
};
