import { contextBridge } from "electron";

import { createTerminalAPI } from "./terminal-api";
import { createDialogAPI } from "./dialog-api";

// Re-export types for external consumption
export type * from "./types";

// Create API instances
const terminalAPI = createTerminalAPI();
const dialogAPI = createDialogAPI();

// Expose APIs to renderer process via context bridge
contextBridge.exposeInMainWorld("terminal", terminalAPI);
contextBridge.exposeInMainWorld("dialog", dialogAPI);
