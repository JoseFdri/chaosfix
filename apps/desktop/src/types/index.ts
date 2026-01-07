export type * from "./terminal.types";
export type * from "./dialog.types";
export type * from "./state.types";
export type * from "./workspace.types";
export type * from "./repository.types";
export type * from "./repository-config.types";
export type * from "./setup-script.types";
export type * from "./external-apps.types";
export type * from "./git.types";
export type * from "./ipc.types";
export type * from "./slice-registry.types";

// Side-effect import for global Window type augmentation
import "./window.types";
