import { ipcRenderer } from "electron";
import { REPOSITORY_IPC_CHANNELS } from "@chaosfix/core";

import type {
  GetBranchesResult,
  GetRemotesResult,
  GetWorkspacesPathResult,
  RepositoryAPI,
} from "../types";

/**
 * Creates the repository API object for renderer process communication
 */
export function createRepositoryAPI(): RepositoryAPI {
  return {
    getBranches: (repositoryPath: string): Promise<GetBranchesResult> => {
      return ipcRenderer.invoke(REPOSITORY_IPC_CHANNELS.GET_BRANCHES, repositoryPath);
    },

    getRemotes: (repositoryPath: string): Promise<GetRemotesResult> => {
      return ipcRenderer.invoke(REPOSITORY_IPC_CHANNELS.GET_REMOTES, repositoryPath);
    },

    getWorkspacesPath: (repositoryName: string): Promise<GetWorkspacesPathResult> => {
      return ipcRenderer.invoke(REPOSITORY_IPC_CHANNELS.GET_WORKSPACES_PATH, repositoryName);
    },
  };
}
