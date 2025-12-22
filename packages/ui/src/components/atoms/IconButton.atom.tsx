import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../libs/cn.lib";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  label: string;
  children: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = "default", size = "md", label, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        aria-label={label}
        title={label}
        className={cn(
          "inline-flex items-center justify-center transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-focus focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          {
            // Variants
            "bg-surface-secondary text-text-secondary hover:bg-surface-hover":
              variant === "default",
            "bg-transparent text-text-secondary hover:bg-surface-secondary": variant === "ghost",
            "bg-transparent text-accent-error hover:bg-red-50": variant === "danger",
            // Sizes
            "w-7 h-7 rounded": size === "sm",
            "w-9 h-9 rounded-md": size === "md",
            "w-11 h-11 rounded-lg": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
