import { type FC } from "react";
import * as Separator from "@radix-ui/react-separator";
import { cn } from "../../libs/cn.lib";
import { Button } from "../atoms/Button.atom";
import { FolderPlusIcon } from "../../icons";

export interface SidebarFooterProps {
  onAddRepository?: () => void;
  className?: string;
}

/**
 * SidebarFooter is a fixed footer at the bottom of the sidebar with action buttons.
 *
 * @param onAddRepository - Handler for "Add repository" button click
 * @param className - Additional CSS classes
 */
export const SidebarFooter: FC<SidebarFooterProps> = ({ onAddRepository, className }) => {
  return (
    <>
      <div className={cn("flex flex-col", className)}>
        <Separator.Root className="h-px bg-border-default" decorative />
        <div className="flex items-center justify-between gap-2 p-3">
          <Button variant="ghost" size="sm" onClick={onAddRepository} className="gap-2">
            <FolderPlusIcon className="w-4 h-4" />
            <span>Add repository</span>
          </Button>
        </div>
      </div>
    </>
  );
};
