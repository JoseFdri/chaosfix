import { forwardRef } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "../../libs/cn.lib";
import { ChevronDownIcon } from "../../icons";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  /** Current selected value */
  value: string;
  /** Callback when value changes */
  onValueChange: (value: string) => void;
  /** Available options */
  options: SelectOption[];
  /** Placeholder when no value selected */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Additional styling */
  className?: string;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    { value, onValueChange, options, placeholder = "Select...", disabled = false, className },
    ref
  ) => {
    return (
      <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectPrimitive.Trigger
          ref={ref}
          className={cn(
            "inline-flex h-10 w-full min-w-[180px] items-center justify-between gap-2",
            "rounded-md border border-border-subtle bg-surface-secondary px-3 py-2",
            "text-sm text-text-primary",
            "transition-colors duration-150",
            "hover:bg-surface-tertiary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-focus",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "data-[placeholder]:text-text-muted",
            className
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon asChild>
            <ChevronDownIcon className="h-4 w-4 text-text-muted" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={cn(
              "relative z-50 max-h-96 min-w-[var(--radix-select-trigger-width)] overflow-hidden",
              "rounded-md border border-border-subtle bg-surface-secondary shadow-lg",
              "data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut"
            )}
            position="popper"
            sideOffset={4}
          >
            <SelectPrimitive.Viewport className="p-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center",
                    "rounded-sm px-3 py-2 text-sm text-text-primary outline-none",
                    "transition-colors duration-150",
                    "hover:bg-surface-tertiary",
                    "focus:bg-surface-tertiary",
                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    "data-[state=checked]:bg-surface-hover data-[state=checked]:font-medium"
                  )}
                >
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    );
  }
);

Select.displayName = "Select";
