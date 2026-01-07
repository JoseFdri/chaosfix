import type { BrowserWindow } from "electron";
import type { PTYManager } from "@chaosfix/terminal-bridge";
import { setupTerminalIPC } from "./terminal";
import { setupDialogIPC } from "./dialog";
import { setupStateIPC } from "./state";
import { setupWorkspaceIPC } from "./workspace";
import { setupRepositoryIPC } from "./repository";
import { setupRepositoryConfigIPC } from "./repository-config";
import { setupSetupScriptIPC } from "./setup-script";
import { setupExternalAppsIPC } from "./external-apps";
import { setupGitIPC } from "./git";

export interface IPCDependencies {
  getMainWindow: () => BrowserWindow | null;
  ptyManager: PTYManager;
}

export function setupAllIPC(deps: IPCDependencies): void {
  setupTerminalIPC({
    getMainWindow: deps.getMainWindow,
    ptyManager: deps.ptyManager,
  });

  setupDialogIPC({
    getMainWindow: deps.getMainWindow,
  });

  setupStateIPC({});

  setupWorkspaceIPC({
    getMainWindow: deps.getMainWindow,
  });

  setupRepositoryIPC({
    getMainWindow: deps.getMainWindow,
  });

  setupRepositoryConfigIPC({
    getMainWindow: deps.getMainWindow,
  });

  setupSetupScriptIPC({
    getMainWindow: deps.getMainWindow,
  });

  setupExternalAppsIPC({
    getMainWindow: deps.getMainWindow,
  });

  setupGitIPC({
    getMainWindow: deps.getMainWindow,
  });
}

export { setupTerminalIPC } from "./terminal";
export { setupDialogIPC } from "./dialog";
export { setupStateIPC } from "./state";
export { setupWorkspaceIPC } from "./workspace";
export { setupRepositoryIPC } from "./repository";
export { setupRepositoryConfigIPC } from "./repository-config";
export { setupSetupScriptIPC } from "./setup-script";
export { setupExternalAppsIPC } from "./external-apps";
export { setupGitIPC } from "./git";
