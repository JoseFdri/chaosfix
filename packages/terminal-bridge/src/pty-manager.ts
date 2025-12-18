import * as pty from "node-pty";
import type { PTYCreateOptions, PTYInstance } from "./types";

interface ManagedPTY {
  instance: pty.IPty;
  dataListeners: ((data: string) => void)[];
  exitListeners: ((exitCode: number, signal?: number) => void)[];
}

/**
 * PTYManager handles the creation and management of pseudo-terminal instances
 * in the Electron main process.
 */
export class PTYManager {
  private ptys: Map<string, ManagedPTY> = new Map();

  /**
   * Create a new PTY instance
   */
  create(options: PTYCreateOptions): PTYInstance {
    const { id, cwd, env, shell, cols = 80, rows = 24 } = options;

    const defaultShell = process.env.SHELL || "/bin/zsh";
    const ptyInstance = pty.spawn(shell || defaultShell, [], {
      name: "xterm-256color",
      cols,
      rows,
      cwd,
      env: {
        ...process.env,
        ...env,
        TERM: "xterm-256color",
        COLORTERM: "truecolor",
      },
    });

    const managedPty: ManagedPTY = {
      instance: ptyInstance,
      dataListeners: [],
      exitListeners: [],
    };

    // Set up data handler
    ptyInstance.onData((data) => {
      for (const listener of managedPty.dataListeners) {
        listener(data);
      }
    });

    // Set up exit handler
    ptyInstance.onExit(({ exitCode, signal }) => {
      for (const listener of managedPty.exitListeners) {
        listener(exitCode, signal);
      }
      this.ptys.delete(id);
    });

    this.ptys.set(id, managedPty);

    return {
      id,
      pid: ptyInstance.pid,
      write: (data: string) => {
        ptyInstance.write(data);
      },
      resize: (cols: number, rows: number) => {
        ptyInstance.resize(cols, rows);
      },
      kill: () => {
        ptyInstance.kill();
        this.ptys.delete(id);
      },
      onData: (callback: (data: string) => void) => {
        managedPty.dataListeners.push(callback);
      },
      onExit: (callback: (exitCode: number, signal?: number) => void) => {
        managedPty.exitListeners.push(callback);
      },
    };
  }

  /**
   * Get a PTY instance by ID
   */
  get(id: string): ManagedPTY | undefined {
    return this.ptys.get(id);
  }

  /**
   * Write data to a PTY
   */
  write(id: string, data: string): boolean {
    const ptyInstance = this.ptys.get(id);
    if (ptyInstance) {
      ptyInstance.instance.write(data);
      return true;
    }
    return false;
  }

  /**
   * Resize a PTY
   */
  resize(id: string, cols: number, rows: number): boolean {
    const ptyInstance = this.ptys.get(id);
    if (ptyInstance) {
      ptyInstance.instance.resize(cols, rows);
      return true;
    }
    return false;
  }

  /**
   * Destroy a PTY instance
   */
  destroy(id: string): boolean {
    const ptyInstance = this.ptys.get(id);
    if (ptyInstance) {
      ptyInstance.instance.kill();
      this.ptys.delete(id);
      return true;
    }
    return false;
  }

  /**
   * Destroy all PTY instances
   */
  destroyAll(): void {
    for (const ptyInstance of this.ptys.values()) {
      ptyInstance.instance.kill();
    }
    this.ptys.clear();
  }

  /**
   * Get the count of active PTYs
   */
  get count(): number {
    return this.ptys.size;
  }

  /**
   * Get all PTY IDs
   */
  get ids(): string[] {
    return Array.from(this.ptys.keys());
  }
}

// Singleton instance for use in main process
export const ptyManager = new PTYManager();
