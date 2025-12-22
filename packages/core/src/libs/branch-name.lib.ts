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
