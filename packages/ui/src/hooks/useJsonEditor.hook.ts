import { useEffect, useRef, useCallback, useState } from "react";
import { EditorView, basicSetup } from "codemirror";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorState } from "@codemirror/state";

const VALIDATION_DEBOUNCE_MS = 300;

export interface UseJsonEditorOptions {
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (errors: string[]) => void;
}

export interface UseJsonEditorReturn {
  editorRef: (node: HTMLDivElement | null) => void;
  errors: string[];
  isValid: boolean;
}

function validateJson(value: string): string[] {
  if (!value.trim()) {
    return [];
  }

  try {
    JSON.parse(value);
    return [];
  } catch (error) {
    if (error instanceof SyntaxError) {
      return [error.message];
    }
    return ["Invalid JSON"];
  }
}

export function useJsonEditor({
  value,
  onChange,
  onValidationChange,
}: UseJsonEditorOptions): UseJsonEditorReturn {
  const [errors, setErrors] = useState<string[]>([]);
  const viewRef = useRef<EditorView | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isExternalUpdateRef = useRef(false);

  // Stable refs for callbacks and initial value to avoid recreating the editor
  const onChangeRef = useRef(onChange);
  const onValidationChangeRef = useRef(onValidationChange);
  const initialValueRef = useRef(value);

  // Keep refs in sync with latest props
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onValidationChangeRef.current = onValidationChange;
  }, [onValidationChange]);

  const handleValidation = useCallback((content: string): void => {
    const validationErrors = validateJson(content);
    setErrors(validationErrors);
    onValidationChangeRef.current?.(validationErrors);
  }, []);

  const handleUpdate = useCallback(
    (update: { docChanged: boolean; state: EditorState }): void => {
      if (!update.docChanged || isExternalUpdateRef.current) {
        return;
      }

      const newValue = update.state.doc.toString();
      onChangeRef.current(newValue);

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        handleValidation(newValue);
      }, VALIDATION_DEBOUNCE_MS);
    },
    [handleValidation]
  );

  const editorRef = useCallback(
    (node: HTMLDivElement | null): void => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }

      if (!node) {
        containerRef.current = null;
        return;
      }

      containerRef.current = node;

      const state = EditorState.create({
        doc: initialValueRef.current,
        extensions: [
          basicSetup,
          json(),
          oneDark,
          EditorView.updateListener.of(handleUpdate),
          EditorView.theme({
            "&": {
              fontSize: "13px",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            },
            ".cm-scroller": {
              overflow: "auto",
            },
            ".cm-content": {
              caretColor: "#c6c6c6",
            },
            ".cm-cursor": {
              borderLeftColor: "#c6c6c6",
            },
            "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }),
        ],
      });

      viewRef.current = new EditorView({
        state,
        parent: node,
      });

      handleValidation(initialValueRef.current);
    },
    [handleUpdate, handleValidation]
  );

  useEffect(() => {
    const view = viewRef.current;
    if (!view) {
      return;
    }

    const currentContent = view.state.doc.toString();
    if (currentContent === value) {
      return;
    }

    isExternalUpdateRef.current = true;
    view.dispatch({
      changes: {
        from: 0,
        to: currentContent.length,
        insert: value,
      },
    });
    isExternalUpdateRef.current = false;
  }, [value]);

  useEffect(() => {
    return (): void => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, []);

  return {
    editorRef,
    errors,
    isValid: errors.length === 0,
  };
}
