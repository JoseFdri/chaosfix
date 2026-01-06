import { existsSync } from "node:fs";
import type { ExternalApp, ExternalAppId } from "@chaosfix/core";

class ExternalAppDetectorNotInitializedError extends Error {
  constructor() {
    super("ExternalAppDetector: detectInstalledApps() must be called before getInstalledApps()");
    this.name = "ExternalAppDetectorNotInitializedError";
  }
}

function escapeShellArg(path: string): string {
  // Escape characters that are special in shell (without adding outer quotes since templates already have them)
  // Replace backslashes first, then double quotes, then other special chars
  return path
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\$/g, "\\$")
    .replace(/`/g, "\\`");
}

interface AppDefinition {
  id: ExternalAppId;
  name: string;
  bundlePath: string | null;
  cliCommand?: string;
  openCommand: string;
}

const APP_DEFINITIONS: AppDefinition[] = [
  {
    id: "finder",
    name: "Finder",
    bundlePath: null,
    openCommand: 'open "{path}"',
  },
  {
    id: "cursor",
    name: "Cursor",
    bundlePath: "/Applications/Cursor.app",
    cliCommand: "cursor",
    openCommand: 'cursor "{path}"',
  },
  {
    id: "vscode",
    name: "VS Code",
    bundlePath: "/Applications/Visual Studio Code.app",
    cliCommand: "code",
    openCommand: 'code "{path}"',
  },
  {
    id: "xcode",
    name: "Xcode",
    bundlePath: "/Applications/Xcode.app",
    openCommand: 'open -a Xcode "{path}"',
  },
  {
    id: "ghostty",
    name: "Ghostty",
    bundlePath: "/Applications/Ghostty.app",
    openCommand: 'open -a Ghostty "{path}"',
  },
  {
    id: "iterm",
    name: "iTerm",
    bundlePath: "/Applications/iTerm.app",
    openCommand: 'open -a iTerm "{path}"',
  },
  {
    id: "terminal",
    name: "Terminal",
    bundlePath: "/System/Applications/Utilities/Terminal.app",
    openCommand: 'open -a Terminal "{path}"',
  },
  {
    id: "windsurf",
    name: "Windsurf",
    bundlePath: "/Applications/Windsurf.app",
    cliCommand: "windsurf",
    openCommand: 'windsurf "{path}"',
  },
];

export class ExternalAppDetector {
  private installedApps: ExternalApp[] = [];
  private openCommands: Map<ExternalAppId, string> = new Map();
  private hasDetected = false;

  async detectInstalledApps(): Promise<ExternalApp[]> {
    const detectedApps: ExternalApp[] = [];

    for (const definition of APP_DEFINITIONS) {
      const isInstalled = this.isAppInstalled(definition);

      if (isInstalled) {
        detectedApps.push({
          id: definition.id,
          name: definition.name,
          installed: true,
        });
        this.openCommands.set(definition.id, definition.openCommand);
      }
    }

    this.installedApps = detectedApps;
    this.hasDetected = true;

    return detectedApps;
  }

  getInstalledApps(): ExternalApp[] {
    if (!this.hasDetected) {
      throw new ExternalAppDetectorNotInitializedError();
    }
    return this.installedApps;
  }

  getOpenCommand(appId: ExternalAppId, path: string): string | null {
    const template = this.openCommands.get(appId);
    if (template === undefined) {
      return null;
    }
    // Replace {path} placeholder with properly escaped path (templates already have quotes)
    return template.replace("{path}", escapeShellArg(path));
  }

  private isAppInstalled(definition: AppDefinition): boolean {
    if (definition.bundlePath === null) {
      return true;
    }
    return existsSync(definition.bundlePath);
  }
}

export const externalAppDetector = new ExternalAppDetector();
