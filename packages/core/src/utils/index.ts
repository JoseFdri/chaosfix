import type { Result } from "../types";

/**
 * Create a successful Result
 */
export function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

/**
 * Create a failed Result
 */
export function err<E>(error: E): Result<never, E> {
  return { success: false, error };
}

/**
 * Sanitize a branch name for git
 */
export function sanitizeBranchName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Create a workspace branch name from workspace name
 */
export function createWorkspaceBranchName(workspaceName: string): string {
  const sanitized = sanitizeBranchName(workspaceName);
  const timestamp = Date.now();
  return `chaosfix/${sanitized}-${timestamp}`;
}
