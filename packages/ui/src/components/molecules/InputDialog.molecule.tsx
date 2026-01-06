import { forwardRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Input,
  Button,
  type DialogProps,
} from "../atoms";
import { cn } from "../../libs/cn.lib";
import { useInputDialog } from "../../hooks/useInputDialog.hook";

export interface InputDialogProps extends Omit<DialogProps, "children"> {
  title: string;
  description?: string;
  inputLabel?: string;
  inputPlaceholder?: string;
  inputDefaultValue?: string;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onSubmit: (value: string) => void | Promise<void>;
  onCancel?: () => void;
  validate?: (value: string) => string | undefined;
  className?: string;
}

export const InputDialog = forwardRef<HTMLInputElement, InputDialogProps>(
  (
    {
      title,
      description,
      inputLabel,
      inputPlaceholder = "Enter value...",
      inputDefaultValue = "",
      submitLabel = "Submit",
      cancelLabel = "Cancel",
      isLoading = false,
      onSubmit,
      onCancel,
      validate,
      className,
      open,
      onOpenChange,
      ...props
    },
    ref
  ) => {
    const {
      value,
      error,
      handleOpenChange,
      handleSubmit,
      handleKeyDown,
      handleCancelClick,
      handleInputChange,
    } = useInputDialog({
      inputDefaultValue,
      isLoading,
      open,
      onSubmit,
      onCancel,
      onOpenChange,
      validate,
    });

    return (
      <Dialog open={open} onOpenChange={handleOpenChange} {...props}>
        <DialogContent
          className={cn(className)}
          showCloseButton={!isLoading}
          onPointerDownOutside={(e) => {
            if (isLoading) {
              e.preventDefault();
            }
          }}
          onEscapeKeyDown={(e) => {
            if (isLoading) {
              e.preventDefault();
            }
          }}
        >
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>

            <Input
              ref={ref}
              label={inputLabel}
              placeholder={inputPlaceholder}
              value={value}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              error={error}
              disabled={isLoading}
              autoFocus
            />

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancelClick}
                disabled={isLoading}
              >
                {cancelLabel}
              </Button>
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? "Loading..." : submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
);

InputDialog.displayName = "InputDialog";
