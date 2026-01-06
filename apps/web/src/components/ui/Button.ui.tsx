import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

/**
 * Button component for the landing page.
 * RSC-compatible version mirroring @chaosfix/ui Button.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-focus focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-accent-primary text-text-inverse hover:bg-blue-600": variant === "primary",
            "bg-surface-secondary text-text-primary hover:bg-surface-hover":
              variant === "secondary",
            "bg-transparent text-text-secondary hover:bg-surface-secondary": variant === "ghost",
            "bg-accent-error text-text-inverse hover:bg-red-600": variant === "danger",
            "rounded px-3 py-1.5 text-sm": size === "sm",
            "rounded-md px-4 py-2 text-sm": size === "md",
            "rounded-lg px-6 py-3 text-base": size === "lg",
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
