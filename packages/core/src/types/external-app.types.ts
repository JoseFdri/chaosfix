export type ExternalAppId = "vscode" | "cursor" | "windsurf" | "ghostty" | "iterm" | "finder";

export interface ExternalApp {
  id: ExternalAppId;
  name: string;
  installed: boolean;
}
