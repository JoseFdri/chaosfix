import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type FormEvent,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";

export interface UseInputDialogOptions {
  inputDefaultValue?: string;
  isLoading?: boolean;
  open?: boolean;
  onSubmit: (value: string) => void | Promise<void>;
  onCancel?: () => void;
  onOpenChange?: (open: boolean) => void;
  validate?: (value: string) => string | undefined;
}

export interface UseInputDialogReturn {
  value: string;
  error: string | undefined;
  handleOpenChange: (isOpen: boolean) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  handleCancelClick: () => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const useInputDialog = ({
  inputDefaultValue = "",
  isLoading = false,
  open = false,
  onSubmit,
  onCancel,
  onOpenChange,
  validate,
}: UseInputDialogOptions): UseInputDialogReturn => {
  const [value, setValue] = useState(inputDefaultValue);
  const [error, setError] = useState<string | undefined>();
  const wasOpen = useRef(open);

  // Sync value with inputDefaultValue when dialog opens
  useEffect(() => {
    if (open && !wasOpen.current) {
      setValue(inputDefaultValue);
      setError(undefined);
    }
    wasOpen.current = open;
  }, [open, inputDefaultValue]);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        setValue(inputDefaultValue);
        setError(undefined);
        onCancel?.();
      }
      onOpenChange?.(isOpen);
    },
    [inputDefaultValue, onCancel, onOpenChange]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (isLoading) {
        return;
      }

      const trimmedValue = value.trim();

      if (validate) {
        const validationError = validate(trimmedValue);
        if (validationError) {
          setError(validationError);
          return;
        }
      }

      setError(undefined);
      await onSubmit(trimmedValue);
    },
    [value, validate, onSubmit, isLoading]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape" && !isLoading) {
        handleOpenChange(false);
      }
    },
    [handleOpenChange, isLoading]
  );

  const handleCancelClick = useCallback(() => {
    if (!isLoading) {
      handleOpenChange(false);
    }
  }, [handleOpenChange, isLoading]);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      if (error) {
        setError(undefined);
      }
    },
    [error]
  );

  return {
    value,
    error,
    handleOpenChange,
    handleSubmit,
    handleKeyDown,
    handleCancelClick,
    handleInputChange,
  };
};
