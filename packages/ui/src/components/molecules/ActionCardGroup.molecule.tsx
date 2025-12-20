import { type FC, type ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface ActionCardGroupProps {
  children: ReactNode;
  className?: string;
}

/**
 * ActionCardGroup is a layout component for displaying multiple ActionCard components.
 * It arranges cards horizontally with consistent spacing and handles responsive stacking.
 *
 * @param children - ActionCard components to display
 * @param className - Additional CSS classes
 */
export const ActionCardGroup: FC<ActionCardGroupProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-center gap-4",
        "w-full",
        className
      )}
    >
      {children}
    </div>
  );
};
