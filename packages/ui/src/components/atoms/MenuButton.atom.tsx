import { forwardRef, type ReactNode } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "../../libs/cn.lib";
import { EllipsisHorizontalIcon } from "../../icons";
import { IconButton } from "./IconButton.atom";

export interface MenuButtonProps {
  children: ReactNode;
  label?: string;
  className?: string;
}

export interface MenuButtonItemProps extends DropdownMenu.DropdownMenuItemProps {
  children: ReactNode;
}

const MenuButtonRoot = forwardRef<HTMLButtonElement, MenuButtonProps>(
  ({ children, label = "More options", className }, ref) => {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <IconButton ref={ref} variant="ghost" size="sm" label={label} className={className}>
            <EllipsisHorizontalIcon className="h-4 w-4" />
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
            {children}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    );
  }
);

MenuButtonRoot.displayName = "MenuButton";

const MenuButtonItem = forwardRef<HTMLDivElement, MenuButtonItemProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <DropdownMenu.Item
        ref={ref}
        className={cn(
          "relative flex items-center gap-2 px-3 py-2 text-sm",
          "text-text-primary rounded",
          "cursor-pointer select-none outline-none",
          "transition-colors duration-150",
          "data-[highlighted]:bg-surface-hover",
          "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
          className
        )}
        {...props}
      >
        {children}
      </DropdownMenu.Item>
    );
  }
);

MenuButtonItem.displayName = "MenuButton.Item";

export const MenuButton = Object.assign(MenuButtonRoot, {
  Item: MenuButtonItem,
});
