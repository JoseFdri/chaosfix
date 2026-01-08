import { type FC, type ReactNode, useState, useRef, useEffect, type KeyboardEvent } from "react";
import { cn } from "../../libs/cn.lib";

export interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  closable?: boolean;
}

export interface TabItemProps {
  tab: Tab;
  isActive: boolean;
  onSelect: () => void;
  onClose?: () => void;
  onRename?: (newLabel: string) => void;
}

export const TabItem: FC<TabItemProps> = ({ tab, isActive, onSelect, onClose, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(tab.label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(tab.label);
  }, [tab.label]);

  const handleDoubleClick = (): void => {
    if (onRename) {
      setIsEditing(true);
      setEditValue(tab.label);
    }
  };

  const handleBlur = (): void => {
    const trimmedValue = editValue.trim();
    if (trimmedValue && trimmedValue !== tab.label) {
      onRename?.(trimmedValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputRef.current?.blur();
    } else if (e.key === "Escape") {
      setEditValue(tab.label);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-1.5 px-3 py-1.5",
        "border-r border-border-default cursor-pointer",
        "transition-colors duration-150",
        {
          "bg-surface-primary border-b-2 border-b-accent-primary": isActive,
          "bg-surface-secondary hover:bg-surface-hover": !isActive,
        }
      )}
      onClick={onSelect}
      role="tab"
      aria-selected={isActive}
    >
      {tab.icon && <span className="w-4 h-4 flex-shrink-0">{tab.icon}</span>}
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "text-sm w-[120px] px-1 py-0 border rounded",
            "bg-surface-primary border-border-default",
            "text-text-primary outline-none focus:border-accent-primary"
          )}
        />
      ) : (
        <span
          className={cn("text-sm truncate max-w-[120px]", {
            "text-text-primary font-medium": isActive,
            "text-text-secondary": !isActive,
          })}
          onDoubleClick={handleDoubleClick}
        >
          {tab.label}
        </span>
      )}
      {tab.closable !== false && onClose && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className={cn(
            "w-4 h-4 flex items-center justify-center rounded",
            "text-text-muted hover:text-text-primary hover:bg-surface-hover",
            "opacity-0 group-hover:opacity-100 transition-opacity"
          )}
          aria-label={`Close ${tab.label}`}
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
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
