import { forwardRef, type ReactNode, type ComponentPropsWithoutRef, type ElementRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";

export interface ActionCardProps extends ComponentPropsWithoutRef<"button"> {
  icon: ReactNode;
  label: string;
  asChild?: boolean;
}

export const ActionCard = forwardRef<ElementRef<"button">, ActionCardProps>(
  ({ icon, label, asChild = false, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          "flex flex-col items-start justify-between",
          "w-full min-h-[160px] p-6",
          "bg-surface-secondary border border-border-default rounded-lg",
          "text-left",
          "transition-all duration-150",
          "hover:brightness-110",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-focus focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          className
        )}
        {...props}
      >
        <div className="text-text-secondary" aria-hidden="true">
          {icon}
        </div>
        <span className="text-text-primary font-medium text-base">
          {label}
        </span>
      </Comp>
    );
  }
);

ActionCard.displayName = "ActionCard";
