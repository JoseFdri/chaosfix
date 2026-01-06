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
