import { app, ipcMain } from "electron";
import * as fs from "fs/promises";
import * as path from "path";

import { STATE_IPC_CHANNELS } from "@chaosfix/core";
import {
  appStateSchema,
  DEFAULT_APP_PREFERENCES,
  STATE_FILE_NAME,
  type AppState,
} from "@chaosfix/config";

const DEFAULT_APP_STATE: AppState = {
  version: "1.0",
  repositories: [],
  workspaces: [],
  activeWorkspaceId: null,
  preferences: DEFAULT_APP_PREFERENCES,
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface StateIPCDependencies {
  // Empty interface maintained for consistency with other IPC modules
  // and to allow future extension without API changes
}

function getStatePath(): string {
  return path.join(app.getPath("userData"), STATE_FILE_NAME);
}

async function loadState(): Promise<AppState> {
  const statePath = getStatePath();

  try {
    const content = await fs.readFile(statePath, "utf-8");
    const parsed = JSON.parse(content);
    const result = appStateSchema.safeParse(parsed);

    if (result.success) {
      return result.data;
    }

    console.error("Invalid state file, using defaults:", result.error);
    return DEFAULT_APP_STATE;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return DEFAULT_APP_STATE;
    }

    console.error("Error loading state:", error);
    return DEFAULT_APP_STATE;
  }
}

async function saveState(state: AppState): Promise<void> {
  const statePath = getStatePath();
  const result = appStateSchema.safeParse(state);

  if (!result.success) {
    throw new Error(`Invalid state: ${result.error.message}`);
  }

  const dir = path.dirname(statePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(statePath, JSON.stringify(result.data, null, 2), "utf-8");
}

export function setupStateIPC(_deps: StateIPCDependencies): void {
  ipcMain.handle(STATE_IPC_CHANNELS.LOAD, async () => {
    return loadState();
  });

  ipcMain.handle(STATE_IPC_CHANNELS.SAVE, async (_event, state: AppState) => {
    return saveState(state);
  });
}
