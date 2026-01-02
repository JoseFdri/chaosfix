import { useCallback } from "react";

export interface UseConfirmDialogOptions {
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  onOpenChange?: (open: boolean) => void;
}

export interface UseConfirmDialogReturn {
  handleOpenChange: (isOpen: boolean) => void;
  handleConfirm: () => Promise<void>;
  handleCancel: () => void;
}

export const useConfirmDialog = ({
  isLoading = false,
  onConfirm,
  onCancel,
  onOpenChange,
}: UseConfirmDialogOptions): UseConfirmDialogReturn => {
  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen && !isLoading) {
        onCancel?.();
      }
      onOpenChange?.(isOpen);
    },
    [isLoading, onCancel, onOpenChange]
  );

  const handleConfirm = useCallback(async () => {
    if (isLoading) {
      return;
    }
    await onConfirm();
  }, [isLoading, onConfirm]);

  const handleCancel = useCallback(() => {
    if (!isLoading) {
      handleOpenChange(false);
    }
  }, [handleOpenChange, isLoading]);

  return {
    handleOpenChange,
    handleConfirm,
    handleCancel,
  };
};
