import { contextBridge } from "electron";

import { createAutoUpdaterAPI } from "./auto-updater-api";
import { createDialogAPI } from "./dialog-api";
import { createExternalAppsAPI } from "./external-apps-api";
import { createGitAPI } from "./git-api";
import { createRepositoryAPI } from "./repository-api";
import { createRepositoryConfigAPI } from "./repository-config-api";
import { createSetupScriptAPI } from "./setup-script-api";
import { createStateAPI } from "./state-api";
import { createTerminalAPI } from "./terminal-api";
import { createWorkspaceAPI } from "./workspace-api";

// Re-export types for external consumption
export type * from "../types";

// Create API instances
const autoUpdaterAPI = createAutoUpdaterAPI();
const terminalAPI = createTerminalAPI();
const dialogAPI = createDialogAPI();
const stateAPI = createStateAPI();
const workspaceAPI = createWorkspaceAPI();
const repositoryAPI = createRepositoryAPI();
const repositoryConfigAPI = createRepositoryConfigAPI();
const setupScriptAPI = createSetupScriptAPI();
const externalAppsAPI = createExternalAppsAPI();
const gitAPI = createGitAPI();

// Expose APIs to renderer process via context bridge
contextBridge.exposeInMainWorld("autoUpdater", autoUpdaterAPI);
contextBridge.exposeInMainWorld("terminal", terminalAPI);
contextBridge.exposeInMainWorld("dialog", dialogAPI);
contextBridge.exposeInMainWorld("state", stateAPI);
contextBridge.exposeInMainWorld("workspace", workspaceAPI);
contextBridge.exposeInMainWorld("repository", repositoryAPI);
contextBridge.exposeInMainWorld("repositoryConfig", repositoryConfigAPI);
contextBridge.exposeInMainWorld("setupScript", setupScriptAPI);
contextBridge.exposeInMainWorld("externalApps", externalAppsAPI);
contextBridge.exposeInMainWorld("git", gitAPI);
