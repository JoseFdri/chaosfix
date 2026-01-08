import type { FC } from "react";

interface TerminalToolbarProps {
  onSplit?: () => void;
  onClose?: () => void;
}

export const TerminalToolbar: FC<TerminalToolbarProps> = ({ onSplit, onClose }) => {
  return (
    <div className="flex justify-end items-center gap-1 px-2 w-full h-full">
      {onSplit && (
        <button
          type="button"
          onClick={onSplit}
          className="w-6 h-6 flex items-center justify-center rounded text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
          aria-label="Split terminal"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <rect x="1" y="1" width="14" height="14" rx="2" />
            <line x1="8" y1="1" x2="8" y2="15" />
          </svg>
        </button>
      )}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
          aria-label="Close terminal"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
