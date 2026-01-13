export type ExternalAppId =
  | "vscode"
  | "cursor"
  | "windsurf"
  | "ghostty"
  | "iterm"
  | "terminal"
  | "xcode"
  | "finder";

export interface ExternalApp {
  id: ExternalAppId;
  name: string;
  installed: boolean;
}

export interface AppDefinition {
  id: ExternalAppId;
  name: string;
  bundlePath: string | null;
  cliCommand?: string;
  openCommand: string;
}
