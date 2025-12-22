import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../libs/cn.lib";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-focus focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          {
            // Variants
            "bg-accent-primary text-text-inverse hover:bg-blue-600": variant === "primary",
            "bg-surface-secondary text-text-primary hover:bg-surface-hover":
              variant === "secondary",
            "bg-transparent text-text-secondary hover:bg-surface-secondary": variant === "ghost",
            "bg-accent-error text-text-inverse hover:bg-red-600": variant === "danger",
            // Sizes
            "text-sm px-3 py-1.5 rounded": size === "sm",
            "text-sm px-4 py-2 rounded-md": size === "md",
            "text-base px-6 py-3 rounded-lg": size === "lg",
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

Button.displayName = "Button";
