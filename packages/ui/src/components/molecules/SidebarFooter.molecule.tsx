import { type FC } from "react";
import * as Separator from "@radix-ui/react-separator";
import * as Tooltip from "@radix-ui/react-tooltip";
import { cn } from "../../lib/utils";
import { Button } from "../atoms/Button.atom";
import { IconButton } from "../atoms/IconButton.atom";
import { FolderPlusIcon, ComputerDesktopIcon, Cog6ToothIcon } from "../../icons";

export interface SidebarFooterProps {
  onAddRepository?: () => void;
  onDisplaySettings?: () => void;
  onSettings?: () => void;
  className?: string;
}

/**
 * SidebarFooter is a fixed footer at the bottom of the sidebar with action buttons.
 *
 * @param onAddRepository - Handler for "Add repository" button click
 * @param onDisplaySettings - Handler for display/monitor icon button click
 * @param onSettings - Handler for settings gear icon button click
 * @param className - Additional CSS classes
 */
export const SidebarFooter: FC<SidebarFooterProps> = ({
  onAddRepository,
  onDisplaySettings,
  onSettings,
  className,
}) => {
  return (
    <Tooltip.Provider delayDuration={300}>
      <div className={cn("flex flex-col", className)}>
        <Separator.Root
          className="h-px bg-border-default"
          decorative
        />
        <div className="flex items-center justify-between gap-2 p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddRepository}
            className="gap-2"
          >
            <FolderPlusIcon className="w-4 h-4" />
            <span>Add repository</span>
          </Button>

          <div className="flex items-center gap-1">
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <IconButton
                  variant="ghost"
                  size="sm"
                  label="Display settings"
                  onClick={onDisplaySettings}
                >
                  <ComputerDesktopIcon className="w-4 h-4" />
                </IconButton>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="px-2 py-1 text-xs text-text-primary bg-surface-secondary border border-border-default rounded shadow-lg"
                  sideOffset={5}
                >
                  Display settings
                  <Tooltip.Arrow className="fill-border-default" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <IconButton
                  variant="ghost"
                  size="sm"
                  label="Settings"
                  onClick={onSettings}
                >
                  <Cog6ToothIcon className="w-4 h-4" />
                </IconButton>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="px-2 py-1 text-xs text-text-primary bg-surface-secondary border border-border-default rounded shadow-lg"
                  sideOffset={5}
                >
                  Settings
                  <Tooltip.Arrow className="fill-border-default" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  );
};
