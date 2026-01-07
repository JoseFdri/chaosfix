import { type FC } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { type SplitDirection } from "@chaosfix/core";
import { cn } from "../../libs/cn.lib";

export interface SplitButtonProps {
  /** Callback when a split direction is selected */
  onSplit: (direction: SplitDirection) => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/** Horizontal split icon - two vertical rectangles side by side */
const HorizontalSplitIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className={className}
  >
    <rect x="1" y="2" width="5.5" height="12" rx="1" />
    <rect x="9.5" y="2" width="5.5" height="12" rx="1" />
  </svg>
);

/** Vertical split icon - two horizontal rectangles stacked */
const VerticalSplitIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className={className}
  >
    <rect x="2" y="1" width="12" height="5.5" rx="1" />
    <rect x="2" y="9.5" width="12" height="5.5" rx="1" />
  </svg>
);

/** Split icon shown on the button - generic split indicator */
const SplitIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className={className}
  >
    <rect x="1" y="1" width="14" height="14" rx="2" />
    <line x1="8" y1="1" x2="8" y2="15" />
  </svg>
);

export const SplitButton: FC<SplitButtonProps> = ({ onSplit, disabled = false, className }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild disabled={disabled}>
        <button
          type="button"
          className={cn(
            "flex items-center justify-center w-8 h-8",
            "text-text-muted hover:text-text-primary hover:bg-surface-hover",
            "rounded transition-colors duration-150",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-text-muted",
            className
          )}
          disabled={disabled}
          aria-label="Split terminal"
        >
          <SplitIcon className="w-4 h-4" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={cn(
            "min-w-[160px] bg-surface-primary border border-border-default rounded-lg",
            "shadow-lg",
            "py-1.5",
            "z-50",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          )}
          sideOffset={6}
          align="end"
        >
          <DropdownMenu.Item
            className={cn(
              "relative flex items-center gap-3 px-3 py-2 text-sm",
              "text-text-primary rounded mx-1",
              "cursor-pointer select-none outline-none",
              "transition-colors duration-150",
              "data-[highlighted]:bg-surface-hover"
            )}
            onSelect={() => onSplit("horizontal")}
          >
            <HorizontalSplitIcon className="w-4 h-4 flex-shrink-0" />
            <span>Split Horizontal</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={cn(
              "relative flex items-center gap-3 px-3 py-2 text-sm",
              "text-text-primary rounded mx-1",
              "cursor-pointer select-none outline-none",
              "transition-colors duration-150",
              "data-[highlighted]:bg-surface-hover"
            )}
            onSelect={() => onSplit("vertical")}
          >
            <VerticalSplitIcon className="w-4 h-4 flex-shrink-0" />
            <span>Split Vertical</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
