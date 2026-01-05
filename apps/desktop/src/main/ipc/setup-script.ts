import { spawn } from "child_process";
import { ipcMain, type BrowserWindow } from "electron";
import { SETUP_SCRIPT_IPC_CHANNELS } from "@chaosfix/core";

import type { SetupScriptOptions, SetupScriptResult } from "../../types/setup-script.types";

const SCRIPT_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export interface SetupScriptIPCDependencies {
  getMainWindow: () => BrowserWindow | null;
}

export function setupSetupScriptIPC(_deps: SetupScriptIPCDependencies): void {
  ipcMain.handle(
    SETUP_SCRIPT_IPC_CHANNELS.RUN,
    async (_event, options: SetupScriptOptions): Promise<SetupScriptResult> => {
      const { script, cwd, env } = options;

      return new Promise<SetupScriptResult>((resolve) => {
        let stdout = "";
        let stderr = "";
        let resolved = false;

        const child = spawn(script, {
          shell: true,
          cwd,
          env: {
            ...process.env,
            ...env,
          },
        });

        const timeout = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            child.kill("SIGTERM");
            resolve({
              success: false,
              error: "Script execution timed out after 5 minutes",
              stdout,
              stderr,
            });
          }
        }, SCRIPT_TIMEOUT_MS);

        child.stdout?.on("data", (data: Buffer) => {
          stdout += data.toString();
        });

        child.stderr?.on("data", (data: Buffer) => {
          stderr += data.toString();
        });

        child.on("error", (error) => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeout);
            resolve({
              success: false,
              error: error.message,
              stdout,
              stderr,
            });
          }
        });

        child.on("close", (code) => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeout);
            resolve({
              success: code === 0,
              error: code !== 0 ? `Script exited with code ${code}` : undefined,
              stdout,
              stderr,
            });
          }
        });
      });
    }
  );
}
