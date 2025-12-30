import type { DialogAPI } from "./dialog.types";
import type { StateAPI } from "./state.types";
import type { TerminalAPI } from "./terminal.types";
import type { WorkspaceAPI } from "./workspace.types";

/**
 * Global window type declarations for exposed APIs
 */
declare global {
  interface Window {
    terminal: TerminalAPI;
    dialog: DialogAPI;
    state: StateAPI;
    workspace: WorkspaceAPI;
  }
}
