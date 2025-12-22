import { forwardRef, type ReactNode } from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { cn } from "../../libs/cn.lib";
import { XMarkIcon } from "../../icons";

export interface ToastProps extends ToastPrimitive.ToastProps {
  title: string;
  description?: string;
  variant?: "info" | "success" | "warning" | "error";
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const Toast = forwardRef<React.ElementRef<typeof ToastPrimitive.Root>, ToastProps>(
  ({ title, description, variant = "info", action, className, ...props }, ref) => {
    return (
      <ToastPrimitive.Root
        ref={ref}
        className={cn(
          "group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-lg border p-4 shadow-lg",
          "data-[state=open]:animate-slideIn data-[state=closed]:animate-slideOut",
          "data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]",
          "data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
          "data-[swipe=cancel]:transition-transform data-[swipe=move]:transition-none",
          {
            "bg-surface-secondary border-border-default": variant === "info",
            "bg-green-900/50 border-green-700": variant === "success",
            "bg-yellow-900/50 border-yellow-700": variant === "warning",
            "bg-red-900/50 border-red-700": variant === "error",
          },
          className
        )}
        {...props}
      >
        <div className="flex-1 grid gap-1">
          <ToastPrimitive.Title className="text-sm font-medium text-text-primary">
            {title}
          </ToastPrimitive.Title>
          {description && (
            <ToastPrimitive.Description className="text-sm text-text-secondary">
              {description}
            </ToastPrimitive.Description>
          )}
        </div>
        {action && (
          <ToastPrimitive.Action
            altText={action.label}
            onClick={action.onClick}
            className={cn(
              "inline-flex h-8 shrink-0 items-center justify-center rounded-md border px-3 text-sm font-medium",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-focus",
              "border-border-default text-text-primary hover:bg-surface-hover"
            )}
          >
            {action.label}
          </ToastPrimitive.Action>
        )}
        <ToastPrimitive.Close
          className={cn(
            "absolute right-2 top-2 rounded-md p-1",
            "text-text-muted hover:text-text-secondary",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-focus"
          )}
        >
          <XMarkIcon className="h-4 w-4" />
        </ToastPrimitive.Close>
      </ToastPrimitive.Root>
    );
  }
);

Toast.displayName = "Toast";

export interface ToastViewportProps extends ToastPrimitive.ToastViewportProps {
  children?: ReactNode;
}

export const ToastViewport = forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  ToastViewportProps
>(({ className, ...props }, ref) => {
  return (
    <ToastPrimitive.Viewport
      ref={ref}
      className={cn(
        "fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 gap-2",
        "sm:top-auto sm:right-0 sm:bottom-0 sm:flex-col md:max-w-[420px]",
        className
      )}
      {...props}
    />
  );
});

ToastViewport.displayName = "ToastViewport";
