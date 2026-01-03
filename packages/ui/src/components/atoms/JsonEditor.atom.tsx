import { cn } from "../../libs/cn.lib";
import { useJsonEditor, type UseJsonEditorOptions } from "../../hooks/useJsonEditor.hook";

export interface JsonEditorProps extends UseJsonEditorOptions {
  className?: string;
  height?: string;
  label?: string;
}

export function JsonEditor({
  value,
  onChange,
  onValidationChange,
  className,
  height = "200px",
  label,
}: JsonEditorProps): React.ReactElement {
  const { editorRef, errors, isValid } = useJsonEditor({
    value,
    onChange,
    onValidationChange,
  });

  const editorId = label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={editorId} className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <div
        id={editorId}
        ref={editorRef}
        className={cn(
          "w-full overflow-hidden rounded-md border",
          "bg-surface-secondary transition-colors duration-150",
          "focus-within:ring-2 focus-within:ring-ring-focus",
          isValid ? "border-border-default" : "border-accent-error focus-within:ring-accent-error",
          className
        )}
        style={{ height }}
        role="textbox"
        aria-label={label || "JSON editor"}
        aria-invalid={!isValid}
        aria-describedby={!isValid && errors.length > 0 ? `${editorId}-errors` : undefined}
      />
      {errors.length > 0 && (
        <div id={`${editorId}-errors`} className="flex flex-col gap-1" role="alert">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-accent-error">
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
