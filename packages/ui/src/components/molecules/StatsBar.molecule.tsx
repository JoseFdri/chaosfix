import { type FC, type ReactNode, Children } from "react";
import * as Separator from "@radix-ui/react-separator";
import { cn } from "../../lib/utils";

export interface StatsBarProps {
  children: ReactNode;
  className?: string;
}

/**
 * StatsBar displays a horizontal row of StatItem components with dot separators.
 *
 * @param children - StatItem components to display
 * @param className - Additional CSS classes
 */
export const StatsBar: FC<StatsBarProps> = ({
  children,
  className,
}) => {
  const childArray = Children.toArray(children);

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3",
        "text-text-muted",
        className
      )}
    >
      {childArray.map((child, index) => (
        <div key={index} className="flex items-center gap-3">
          {child}
          {index < childArray.length - 1 && (
            <Separator.Root
              orientation="vertical"
              decorative
              className="w-px h-1 bg-current rounded-full"
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </div>
  );
};
