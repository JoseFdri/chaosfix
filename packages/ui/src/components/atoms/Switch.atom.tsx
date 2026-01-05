import { forwardRef } from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "../../libs/cn.lib";

export interface SwitchProps {
  /** Current checked state */
  checked: boolean;
  /** Callback when checked state changes */
  onCheckedChange: (checked: boolean) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Name attribute for form submission */
  name?: string;
  /** Additional styling for the switch */
  className?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onCheckedChange, disabled = false, name, className }, ref) => {
    return (
      <SwitchPrimitive.Root
        ref={ref}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        name={name}
        className={cn(
          "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center",
          "rounded-full border-2 border-transparent shadow-sm",
          "transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-[state=checked]:bg-accent-primary data-[state=unchecked]:bg-surface-tertiary",
          className
        )}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0",
            "transition-transform duration-200",
            "data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
          )}
        />
      </SwitchPrimitive.Root>
    );
  }
);

Switch.displayName = "Switch";
