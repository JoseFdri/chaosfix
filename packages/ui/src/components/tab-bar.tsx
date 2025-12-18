import { type FC, type ReactNode } from "react";
import { clsx } from "clsx";

export interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  closable?: boolean;
}

export interface TabBarProps {
  tabs: Tab[];
  activeTabId: string | null;
  onTabSelect: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  onNewTab?: () => void;
  className?: string;
}

export const TabBar: FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onNewTab,
  className,
}) => {
  return (
    <div
      className={clsx(
        "flex items-center bg-gray-100 border-b border-gray-200",
        "min-h-[36px] overflow-x-auto",
        className
      )}
    >
      <div className="flex items-center">
        {tabs.map((tab) => (
          <TabItem
            key={tab.id}
            tab={tab}
            isActive={tab.id === activeTabId}
            onSelect={() => onTabSelect(tab.id)}
            onClose={onTabClose ? () => onTabClose(tab.id) : undefined}
          />
        ))}
      </div>
      {onNewTab && (
        <button
          type="button"
          onClick={onNewTab}
          className={clsx(
            "flex items-center justify-center w-8 h-8 ml-1",
            "text-gray-500 hover:text-gray-700 hover:bg-gray-200",
            "rounded transition-colors"
          )}
          aria-label="New tab"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

interface TabItemProps {
  tab: Tab;
  isActive: boolean;
  onSelect: () => void;
  onClose?: () => void;
}

const TabItem: FC<TabItemProps> = ({ tab, isActive, onSelect, onClose }) => {
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
