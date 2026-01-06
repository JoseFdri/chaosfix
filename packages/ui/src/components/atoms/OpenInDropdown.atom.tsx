import { type FC } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "../../libs/cn.lib";
import { ArrowTopRightOnSquareIcon } from "../../icons";
import { IconButton } from "./IconButton.atom";

interface AppItem {
  id: string;
  name: string;
}

export interface OpenInDropdownProps {
  apps: AppItem[];
  onSelect: (appId: string) => void;
  disabled?: boolean;
}

export const OpenInDropdown: FC<OpenInDropdownProps> = ({ apps, onSelect, disabled = false }) => {
  const hasApps = apps.length > 0;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild disabled={disabled || !hasApps}>
        <IconButton variant="ghost" size="sm" label="Open in..." disabled={disabled || !hasApps}>
          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={cn(
            "min-w-[160px] bg-surface-secondary border border-border-default rounded-md",
            "shadow-lg",
            "p-1",
            "z-50",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          )}
          sideOffset={4}
          align="end"
        >
          {apps.map((app) => (
            <DropdownMenu.Item
              key={app.id}
              className={cn(
                "relative flex items-center gap-2 px-3 py-2 text-sm",
                "text-text-primary rounded",
                "cursor-pointer select-none outline-none",
                "transition-colors duration-150",
                "data-[highlighted]:bg-surface-hover",
                "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none"
              )}
              onSelect={() => onSelect(app.id)}
            >
              <ArrowTopRightOnSquareIcon className="h-4 w-4 text-text-muted" />
              <span>{app.name}</span>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
