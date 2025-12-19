import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { clsx } from "clsx";

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
        className={clsx(
          "inline-flex items-center justify-center transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          {
            // Variants
            "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500":
              variant === "default",
            "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500":
              variant === "ghost",
            "bg-transparent text-red-600 hover:bg-red-50 focus:ring-red-500":
              variant === "danger",
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
