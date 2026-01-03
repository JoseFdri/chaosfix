import { contextBridge } from "electron";

import { createDialogAPI } from "./dialog-api";
import { createRepositoryAPI } from "./repository-api";
import { createStateAPI } from "./state-api";
import { createTerminalAPI } from "./terminal-api";
import { createWorkspaceAPI } from "./workspace-api";

// Re-export types for external consumption
export type * from "../types";

// Create API instances
const terminalAPI = createTerminalAPI();
const dialogAPI = createDialogAPI();
const stateAPI = createStateAPI();
const workspaceAPI = createWorkspaceAPI();
const repositoryAPI = createRepositoryAPI();

// Expose APIs to renderer process via context bridge
contextBridge.exposeInMainWorld("terminal", terminalAPI);
contextBridge.exposeInMainWorld("dialog", dialogAPI);
contextBridge.exposeInMainWorld("state", stateAPI);
contextBridge.exposeInMainWorld("workspace", workspaceAPI);
contextBridge.exposeInMainWorld("repository", repositoryAPI);
