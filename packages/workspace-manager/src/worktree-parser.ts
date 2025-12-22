import type { WorktreeInfo } from "./types";

// Worktree porcelain output prefixes
const WORKTREE_PREFIX = "worktree ";
const HEAD_PREFIX = "HEAD ";
const BRANCH_PREFIX = "branch ";
const REFS_HEADS_PREFIX = "refs/heads/";

/**
 * Parse a single worktree block from git worktree list --porcelain output
 */
function parseWorktreeBlock(block: string, mainRepoPath: string): WorktreeInfo | null {
  const lines = block.split("\n");
  const worktree: WorktreeInfo = {
    path: "",
    branch: "",
    commit: "",
    isMain: false,
    isBare: false,
  };

  for (const line of lines) {
    if (line.startsWith(WORKTREE_PREFIX)) {
      worktree.path = line.substring(WORKTREE_PREFIX.length);
      worktree.isMain = worktree.path === mainRepoPath;
    } else if (line.startsWith(HEAD_PREFIX)) {
      worktree.commit = line.substring(HEAD_PREFIX.length);
    } else if (line.startsWith(BRANCH_PREFIX)) {
      worktree.branch = line.substring(BRANCH_PREFIX.length).replace(REFS_HEADS_PREFIX, "");
    } else if (line === "bare") {
      worktree.isBare = true;
    }
  }

  return worktree.path ? worktree : null;
}

/**
 * Parse git worktree list --porcelain output into WorktreeInfo array
 */
export function parseWorktreeOutput(output: string, mainRepoPath: string): WorktreeInfo[] {
  const blocks = output.split("\n\n").filter(Boolean);
  const worktrees: WorktreeInfo[] = [];

  for (const block of blocks) {
    const worktree = parseWorktreeBlock(block, mainRepoPath);
    if (worktree) {
      worktrees.push(worktree);
    }
  }

  return worktrees;
}
