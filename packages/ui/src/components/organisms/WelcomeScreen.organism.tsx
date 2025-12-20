import { type FC, type ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface WelcomeScreenProps {
  logo: ReactNode;
  children: ReactNode;
  stats?: ReactNode;
  className?: string;
}

export const WelcomeScreen: FC<WelcomeScreenProps> = ({
  logo,
  children,
  stats,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        "h-full w-full",
        "p-8 md:p-12",
        className
      )}
    >
      <div className="flex flex-col items-center gap-8 md:gap-12 max-w-4xl w-full">
        {/* Logo section */}
        <div className="flex-shrink-0">{logo}</div>

        {/* Action cards section */}
        <div className="flex-shrink-0 w-full">{children}</div>

        {/* Stats bar section */}
        {stats && <div className="flex-shrink-0">{stats}</div>}
      </div>
    </div>
  );
};
