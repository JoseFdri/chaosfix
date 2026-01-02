/**
 * Workspace-related constants.
 */

// Validation
export const PATH_SEGMENT_REGEX = /^[a-zA-Z0-9_-]+$/;
export const MAX_NAME_LENGTH = 100;

// Directory structure
export const WORKSPACE_BASE_DIR = "chaosfix";
export const WORKSPACE_SUBDIR = "workspace";

// Error messages
export const WORKSPACE_ERRORS = {
  INVALID_REPOSITORY_NAME:
    "Invalid repository name. Use only letters, numbers, hyphens, and underscores.",
  INVALID_WORKSPACE_NAME:
    "Invalid workspace name. Use only letters, numbers, hyphens, and underscores.",
  WORKSPACE_NAME_REQUIRED: "Workspace name is required",
  NO_REPOSITORY_SELECTED: "No repository selected",
} as const;

// Dialog text
export const WORKSPACE_DIALOG = {
  TITLE_PREFIX: "Create Workspace in",
  TITLE_FALLBACK: "Repository",
  DESCRIPTION:
    "Enter a name for your new workspace. This will create a new git worktree with an isolated branch.",
  INPUT_LABEL: "Workspace name",
  INPUT_PLACEHOLDER: "my-feature",
  SUBMIT_LABEL: "Create",
  CANCEL_LABEL: "Cancel",
} as const;

// Remove workspace dialog text
export const REMOVE_WORKSPACE_DIALOG = {
  TITLE: "Remove Workspace",
  TITLE_WARNING: "Workspace Has Uncommitted Changes",
  DESCRIPTION: "Are you sure you want to remove this workspace? This will delete the git worktree.",
  DESCRIPTION_WARNING:
    "This workspace has uncommitted changes. Removing it will discard these changes.",
  CONFIRM_LABEL: "Remove",
  FORCE_CONFIRM_LABEL: "Force Remove",
  CANCEL_LABEL: "Cancel",
} as const;

// Default values
export const DEFAULT_WORKSPACE_STATUS = "idle" as const;
