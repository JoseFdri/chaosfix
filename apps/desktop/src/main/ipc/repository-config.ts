import { ipcMain, type BrowserWindow } from "electron";
import * as fs from "fs/promises";
import * as os from "os";
import * as path from "path";

import { REPOSITORY_CONFIG_IPC_CHANNELS } from "@chaosfix/core";
import {
  APP_DATA_DIR,
  CONFIG_FILE_NAME,
  DEFAULT_PROJECT_CONFIG,
  projectConfigSchema,
  REPO_CONFIG_DIR,
  type ProjectConfig,
} from "@chaosfix/config";

import type {
  LoadConfigOptions,
  LoadConfigResult,
  SaveConfigOptions,
  SaveConfigResult,
} from "../../types/repository-config.types";

export interface RepositoryConfigIPCDependencies {
  getMainWindow: () => BrowserWindow | null;
}

function getAppConfigPath(repositoryId: string): string {
  const homeDir = os.homedir();
  return path.join(
    homeDir,
    `.${APP_DATA_DIR.toLowerCase()}`,
    REPO_CONFIG_DIR,
    `${repositoryId}.json`
  );
}

function getRepoConfigPath(repositoryPath: string): string {
  return path.join(repositoryPath, CONFIG_FILE_NAME);
}

async function tryLoadFromPath(configPath: string): Promise<ProjectConfig | null> {
  try {
    const content = await fs.readFile(configPath, "utf-8");
    const parsed = JSON.parse(content);
    const result = projectConfigSchema.safeParse(parsed);

    if (result.success) {
      return result.data;
    }

    return null;
  } catch {
    return null;
  }
}

async function loadConfig(options: LoadConfigOptions): Promise<LoadConfigResult> {
  const repoConfigPath = getRepoConfigPath(options.repositoryPath);
  const repoConfig = await tryLoadFromPath(repoConfigPath);

  if (repoConfig) {
    return { config: repoConfig, source: "repo" };
  }

  const appConfigPath = getAppConfigPath(options.repositoryId);
  const appConfig = await tryLoadFromPath(appConfigPath);

  if (appConfig) {
    return { config: appConfig, source: "app" };
  }

  return { config: DEFAULT_PROJECT_CONFIG, source: "default" };
}

async function saveConfig(options: SaveConfigOptions): Promise<SaveConfigResult> {
  const result = projectConfigSchema.safeParse(options.config);

  if (!result.success) {
    return { success: false, location: "default", error: result.error.message };
  }

  const configContent = JSON.stringify(result.data, null, 2);

  const repoConfigPath = getRepoConfigPath(options.repositoryPath);
  try {
    await fs.writeFile(repoConfigPath, configContent, "utf-8");
    return { success: true, location: "repo" };
  } catch {
    // Fallback to app storage
  }

  const appConfigPath = getAppConfigPath(options.repositoryId);
  try {
    const dir = path.dirname(appConfigPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(appConfigPath, configContent, "utf-8");
    return { success: true, location: "app" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, location: "default", error: message };
  }
}

export function setupRepositoryConfigIPC(_deps: RepositoryConfigIPCDependencies): void {
  ipcMain.handle(
    REPOSITORY_CONFIG_IPC_CHANNELS.LOAD,
    async (_event, options: LoadConfigOptions): Promise<LoadConfigResult> => {
      return loadConfig(options);
    }
  );

  ipcMain.handle(
    REPOSITORY_CONFIG_IPC_CHANNELS.SAVE,
    async (_event, options: SaveConfigOptions): Promise<SaveConfigResult> => {
      return saveConfig(options);
    }
  );
}
