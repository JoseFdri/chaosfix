import { type FC } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { IconButton } from "../atoms/IconButton.atom";
import { SunIcon, MoonIcon } from "../../icons";

export interface ThemeToggleProps {
  /** Whether the resolved theme is dark (after applying system preference) */
  isDark: boolean;
  /** Handler called when the toggle is clicked */
  onToggle: () => void;
}

/**
 * Theme toggle component that displays a sun/moon icon.
 * Shows sun icon when in dark mode (to toggle to light).
 * Shows moon icon when in light mode (to toggle to dark).
 */
export const ThemeToggle: FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  const Icon = isDark ? SunIcon : MoonIcon;
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <IconButton variant="ghost" size="sm" label={label} onClick={onToggle}>
            <Icon className="w-4 h-4" />
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="px-2 py-1 text-xs text-text-primary bg-surface-secondary border border-border-default rounded shadow-lg z-50"
            sideOffset={5}
          >
            {label}
            <Tooltip.Arrow className="fill-border-default" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
