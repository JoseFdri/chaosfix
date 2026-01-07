import { Squares2X2Icon, ShieldCheckIcon, CommandLineIcon, RectangleStackIcon } from "@chaosfix/ui";
import type { Feature } from "@chaosfix/ui";

/**
 * Feature highlights displayed on the homepage welcome screen.
 * These showcase the key capabilities of ChaosFix to new users.
 */
export const HOMEPAGE_FEATURES: Feature[] = [
  {
    id: "parallel-sessions",
    icon: <Squares2X2Icon className="w-6 h-6 sm:w-8 sm:h-8" />,
    title: "Run Multiple Sessions",
    description: "Run multiple terminal sessions in isolated workspaces",
  },
  {
    id: "isolated-workspaces",
    icon: <ShieldCheckIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
    title: "Isolated Workspaces",
    description: "Each workspace has its own git worktree and branch",
  },
  {
    id: "direct-cli",
    icon: <CommandLineIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
    title: "Direct CLI Access",
    description: "No abstraction - direct terminal access with full visibility",
  },
  {
    id: "smart-organization",
    icon: <RectangleStackIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
    title: "Smart Organization",
    description: "Manage multiple repositories from one place",
  },
];
