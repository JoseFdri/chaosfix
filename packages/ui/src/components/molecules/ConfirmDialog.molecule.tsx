import { type JSX } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  type DialogProps,
} from "../atoms";
import { cn } from "../../libs/cn.lib";
import { useConfirmDialog } from "../../hooks/useConfirmDialog.hook";

export interface ConfirmDialogProps extends Omit<DialogProps, "children"> {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  className?: string;
}

export const ConfirmDialog = ({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  isLoading = false,
  onConfirm,
  onCancel,
  className,
  open,
  onOpenChange,
  ...props
}: ConfirmDialogProps): JSX.Element => {
  const { handleOpenChange, handleConfirm, handleCancel } = useConfirmDialog({
    isLoading,
    onConfirm,
    onCancel,
    onOpenChange,
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
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={handleCancel} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={variant === "destructive" ? "danger" : "primary"}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

ConfirmDialog.displayName = "ConfirmDialog";
