import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../libs/cn.lib";
import { MagnifyingGlassIcon, XMarkIcon } from "../../icons";

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  value: string;
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onClear, className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-4 w-4 text-text-muted" aria-hidden="true" />
        </div>
        <input
          ref={ref}
          type="search"
          value={value}
          className={cn(
            "w-full bg-surface-secondary text-text-primary placeholder:text-text-muted",
            "rounded-md border border-border-default",
            "pl-9 pr-9 py-2 text-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-focus",
            "transition-colors duration-150",
            className
          )}
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className={cn(
              "absolute inset-y-0 right-0 flex items-center pr-3",
              "text-text-muted hover:text-text-secondary",
              "transition-colors duration-150"
            )}
            aria-label="Clear search"
          >
            <XMarkIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
