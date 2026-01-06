import { ipcRenderer } from "electron";
import { WORKSPACE_IPC_CHANNELS } from "@chaosfix/core";

import type {
  CreateWorkspaceOptions,
  CreateWorkspaceResult,
  RemoveWorkspaceOptions,
  RemoveWorkspaceResult,
  ValidateRepoResult,
  WorkspaceAPI,
} from "../types";

/**
 * Creates the workspace API object for renderer process communication
 */
export function createWorkspaceAPI(): WorkspaceAPI {
  return {
    validateRepository: (path: string): Promise<ValidateRepoResult> => {
      return ipcRenderer.invoke(WORKSPACE_IPC_CHANNELS.VALIDATE_REPO, path);
    },

    create: (options: CreateWorkspaceOptions): Promise<CreateWorkspaceResult> => {
      return ipcRenderer.invoke(WORKSPACE_IPC_CHANNELS.CREATE, options);
    },

    remove: (options: RemoveWorkspaceOptions): Promise<RemoveWorkspaceResult> => {
      return ipcRenderer.invoke(WORKSPACE_IPC_CHANNELS.REMOVE, options);
    },
  };
}
