import { forwardRef, type ReactNode, type ComponentPropsWithoutRef, type ElementRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../libs/cn.lib";

export interface StatItemProps extends ComponentPropsWithoutRef<"div"> {
  icon: ReactNode;
  label: string;
  asChild?: boolean;
}

export const StatItem = forwardRef<ElementRef<"div">, StatItemProps>(
  ({ icon, label, asChild = false, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5",
          "text-text-muted text-sm",
          "transition-colors duration-150",
          asChild && "hover:text-text-secondary cursor-pointer",
          className
        )}
        {...props}
      >
        <span className="flex-shrink-0" aria-hidden="true">
          {icon}
        </span>
        <span>{label}</span>
      </Comp>
    );
  }
);

StatItem.displayName = "StatItem";
