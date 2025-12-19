import { type FC, type ReactNode } from "react";
import { clsx } from "clsx";

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
}

export const TabItem: FC<TabItemProps> = ({ tab, isActive, onSelect, onClose }) => {
  return (
    <div
      className={clsx(
        "group flex items-center gap-1.5 px-3 py-1.5",
        "border-r border-gray-200 cursor-pointer",
        "transition-colors duration-150",
        {
          "bg-white border-b-2 border-b-blue-500": isActive,
          "bg-gray-100 hover:bg-gray-200": !isActive,
        }
      )}
      onClick={onSelect}
      role="tab"
      aria-selected={isActive}
    >
      {tab.icon && <span className="w-4 h-4 flex-shrink-0">{tab.icon}</span>}
      <span
        className={clsx("text-sm truncate max-w-[120px]", {
          "text-gray-900 font-medium": isActive,
          "text-gray-600": !isActive,
        })}
      >
        {tab.label}
      </span>
      {tab.closable !== false && onClose && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className={clsx(
            "w-4 h-4 flex items-center justify-center rounded",
            "text-gray-400 hover:text-gray-700 hover:bg-gray-300",
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
