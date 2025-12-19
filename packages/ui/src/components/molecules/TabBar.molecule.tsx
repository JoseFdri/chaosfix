import { type FC } from "react";
import { clsx } from "clsx";
import { TabItem, type Tab } from "../atoms/TabItem.atom";

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
