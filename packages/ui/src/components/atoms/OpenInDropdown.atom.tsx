import { type FC, type ReactNode, forwardRef, type ComponentPropsWithoutRef } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "../../libs/cn.lib";
import { ChevronDownIcon } from "../../icons";

interface AppItem {
  id: string;
  name: string;
  icon?: ReactNode;
  shortcut?: string;
}

export interface OpenInDropdownProps {
  /** List of apps to show in the dropdown */
  apps: AppItem[];
  /** Callback when an app is selected */
  onSelect: (appId: string) => void;
  /** Callback when copy path is clicked */
  onCopyPath?: () => void;
  /** The workspace name to display in the trigger */
  workspaceName: string;
  /** Whether the dropdown is disabled */
  disabled?: boolean;
  /** The currently selected app (to show icon and enable quick-open) */
  selectedApp?: AppItem | null;
  /** Callback when the workspace name is clicked (quick-open with selected app) */
  onWorkspaceClick?: () => void;
}

const TriggerButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<"button">>(
  ({ className, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 text-sm",
        "bg-surface-secondary border border-border-default rounded-md",
        "text-text-primary",
        "hover:bg-surface-hover transition-colors duration-150",
        "focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-1",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
);
TriggerButton.displayName = "TriggerButton";

export const OpenInDropdown: FC<OpenInDropdownProps> = ({
  apps,
  onSelect,
  onCopyPath,
  workspaceName,
  disabled = false,
  selectedApp,
  onWorkspaceClick,
}) => {
  const hasApps = apps.length > 0;
  const canQuickOpen = selectedApp && onWorkspaceClick && !disabled;

  return (
    <div className="flex items-center">
      {/* Selected app icon + slash + clickable workspace name */}
      <button
        type="button"
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 text-sm",
          "bg-surface-secondary border border-r-0 border-border-default rounded-l-md",
          "text-text-primary",
          canQuickOpen && "hover:bg-surface-hover cursor-pointer",
          !canQuickOpen && "cursor-default",
          "transition-colors duration-150",
          "focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-1",
          disabled && "opacity-50"
        )}
        onClick={canQuickOpen ? onWorkspaceClick : undefined}
        disabled={disabled}
      >
        {selectedApp?.icon && <span className="flex-shrink-0 w-4 h-4">{selectedApp.icon}</span>}
        <span className="font-medium text-text-muted">/</span>
        <span className="font-medium">{workspaceName}</span>
      </button>

      {/* Dropdown trigger for app selection */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild disabled={disabled || !hasApps}>
          <TriggerButton disabled={disabled || !hasApps} className="rounded-l-none border-l-0">
            <span className="text-text-muted">Open</span>
            <ChevronDownIcon className="h-3.5 w-3.5 text-text-muted ml-0.5" />
          </TriggerButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className={cn(
              "min-w-[180px] bg-surface-secondary border border-border-default rounded-lg",
              "shadow-lg",
              "py-1.5",
              "z-50",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
            )}
            sideOffset={6}
            align="start"
          >
            {apps.map((app) => (
              <DropdownMenu.Item
                key={app.id}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2 text-sm",
                  "text-text-primary",
                  "cursor-pointer select-none outline-none",
                  "transition-colors duration-150",
                  "data-[highlighted]:bg-surface-hover",
                  "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none"
                )}
                onSelect={() => onSelect(app.id)}
              >
                {app.icon && <span className="flex-shrink-0 w-5 h-5">{app.icon}</span>}
                <span className="flex-1">{app.name}</span>
                {app.shortcut && (
                  <span className="text-xs text-text-muted font-mono">{app.shortcut}</span>
                )}
              </DropdownMenu.Item>
            ))}

            {onCopyPath && (
              <>
                <DropdownMenu.Separator className="h-px bg-border-default my-1.5 mx-2" />
                <DropdownMenu.Item
                  className={cn(
                    "relative flex items-center gap-3 px-3 py-2 text-sm",
                    "text-text-primary",
                    "cursor-pointer select-none outline-none",
                    "transition-colors duration-150",
                    "data-[highlighted]:bg-surface-hover"
                  )}
                  onSelect={onCopyPath}
                >
                  <CopyIcon className="flex-shrink-0 w-5 h-5 text-text-muted" />
                  <span className="flex-1">Copy path</span>
                  <span className="text-xs text-text-muted font-mono">⇧⌘C</span>
                </DropdownMenu.Item>
              </>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};

/** Simple copy icon */
const CopyIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className={className}
  >
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
