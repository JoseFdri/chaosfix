import { type FC, type ReactNode } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { cn } from "../../libs/cn.lib";

export interface SidebarProps {
  width?: number;
  collapsed?: boolean;
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export const Sidebar: FC<SidebarProps> = ({
  width = 250,
  collapsed = false,
  children,
  header,
  footer,
  className,
}) => {
  return (
    <aside
      className={cn(
        "flex flex-col bg-surface-secondary border-r border-border-default",
        "transition-all duration-200 ease-in-out",
        "overflow-hidden",
        className
      )}
      style={{ width: collapsed ? 0 : width }}
    >
      {header && <div className="flex-shrink-0">{header}</div>}

      <ScrollArea.Root className="flex-1 overflow-hidden">
        <ScrollArea.Viewport className="h-full w-full">{children}</ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="flex select-none touch-none p-0.5 bg-transparent transition-colors duration-150 ease-out hover:bg-surface-hover data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="flex-1 bg-border-default rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner className="bg-surface-secondary" />
      </ScrollArea.Root>

      {footer && <div className="flex-shrink-0">{footer}</div>}
    </aside>
  );
};
