import { forwardRef, type ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "../../libs/cn.lib";
import { XMarkIcon } from "../../icons";

export interface DialogProps extends DialogPrimitive.DialogProps {
  children: ReactNode;
}

export const Dialog = ({ children, ...props }: DialogProps): React.JSX.Element => {
  return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>;
};

Dialog.displayName = "Dialog";

export interface DialogTriggerProps extends DialogPrimitive.DialogTriggerProps {
  children: ReactNode;
}

export const DialogTrigger = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  DialogTriggerProps
>(({ children, ...props }, ref) => {
  return (
    <DialogPrimitive.Trigger ref={ref} asChild {...props}>
      {children}
    </DialogPrimitive.Trigger>
  );
});

DialogTrigger.displayName = "DialogTrigger";

export interface DialogContentProps extends DialogPrimitive.DialogContentProps {
  children: ReactNode;
  showCloseButton?: boolean;
}

export const DialogContent = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ children, className, showCloseButton = true, ...props }, ref) => {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          "fixed inset-0 z-50 bg-black/50",
          "data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut"
        )}
      />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
          "rounded-lg border border-border-default bg-surface-primary p-6 shadow-xl",
          "data-[state=open]:animate-dialogIn data-[state=closed]:animate-dialogOut",
          "focus-visible:outline-none",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            className={cn(
              "absolute right-4 top-4 rounded-md p-1",
              "text-text-muted hover:text-text-secondary",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-focus"
            )}
            aria-label="Close dialog"
          >
            <XMarkIcon className="h-4 w-4" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

DialogContent.displayName = "DialogContent";

export interface DialogHeaderProps {
  children: ReactNode;
  className?: string;
}

export const DialogHeader = ({ children, className }: DialogHeaderProps): React.JSX.Element => {
  return <div className={cn("mb-4 flex flex-col gap-1.5", className)}>{children}</div>;
};

DialogHeader.displayName = "DialogHeader";

export interface DialogTitleProps extends DialogPrimitive.DialogTitleProps {
  children: ReactNode;
}

export const DialogTitle = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  DialogTitleProps
>(({ children, className, ...props }, ref) => {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn("text-lg font-semibold text-text-primary", className)}
      {...props}
    >
      {children}
    </DialogPrimitive.Title>
  );
});

DialogTitle.displayName = "DialogTitle";

export interface DialogDescriptionProps extends DialogPrimitive.DialogDescriptionProps {
  children: ReactNode;
}

export const DialogDescription = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ children, className, ...props }, ref) => {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn("text-sm text-text-secondary", className)}
      {...props}
    >
      {children}
    </DialogPrimitive.Description>
  );
});

DialogDescription.displayName = "DialogDescription";

export interface DialogFooterProps {
  children: ReactNode;
  className?: string;
}

export const DialogFooter = ({ children, className }: DialogFooterProps): React.JSX.Element => {
  return <div className={cn("mt-6 flex justify-end gap-3", className)}>{children}</div>;
};

DialogFooter.displayName = "DialogFooter";

export const DialogClose = DialogPrimitive.Close;
