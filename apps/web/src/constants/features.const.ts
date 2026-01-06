/**
 * Features constants for the landing page.
 * Defines the feature cards displayed in the features grid section.
 */

/**
 * Feature item interface for feature cards
 */
export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: "terminal" | "branches" | "parallel" | "isolation" | "speed" | "native";
}

/**
 * List of features displayed on the landing page
 */
export const FEATURES: FeatureItem[] = [
  {
    id: "terminal-interface",
    title: "Terminal-First Interface",
    description:
      "The terminal IS the interface. No abstraction layers over Claude Code CLI. You see exactly what Claude sees.",
    iconName: "terminal",
  },
  {
    id: "git-worktrees",
    title: "Git Worktree Isolation",
    description:
      "Each workspace is isolated in its own git worktree with a dedicated branch. No conflicts between parallel sessions.",
    iconName: "branches",
  },
  {
    id: "parallel-sessions",
    title: "Parallel Sessions",
    description:
      "Run multiple Claude Code sessions simultaneously. Work on different features, bug fixes, or experiments at once.",
    iconName: "parallel",
  },
  {
    id: "workspace-isolation",
    title: "Complete Workspace Isolation",
    description:
      "Each session has its own isolated environment. Changes in one workspace never affect another.",
    iconName: "isolation",
  },
  {
    id: "native-performance",
    title: "Native Performance",
    description:
      "Built with Electron for macOS. Native terminal emulation with xterm.js and node-pty for responsive interaction.",
    iconName: "native",
  },
  {
    id: "fast-switching",
    title: "Fast Context Switching",
    description:
      "Instantly switch between sessions with tabs. Keep multiple tasks in progress without losing context.",
    iconName: "speed",
  },
];
