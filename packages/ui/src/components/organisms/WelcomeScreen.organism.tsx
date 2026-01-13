import { type FC, type ReactNode } from "react";
import { cn } from "../../libs/cn.lib";
import { AnimatedBackground } from "../atoms";
import { FeatureHighlights, type Feature } from "../molecules";

export interface WelcomeScreenProps {
  /** Optional logo component to display at the top */
  logo?: ReactNode;
  /** Optional title to display below the logo */
  title?: string;
  /** Action cards or other main content */
  children: ReactNode;
  /** Optional stats section displayed below main content */
  stats?: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Array of features to display as highlight cards */
  features?: Feature[];
  /** Enable the animated gradient background effect (default: true) */
  enableBackground?: boolean;
}

/**
 * WelcomeScreen is the main landing page component that displays
 * the logo, action cards, optional feature highlights, and stats.
 *
 * When no features are provided, it renders the classic layout.
 * When features are provided, it renders an enhanced layout with
 * animated feature cards.
 */
export const WelcomeScreen: FC<WelcomeScreenProps> = ({
  logo,
  title,
  children,
  stats,
  className,
  features,
  enableBackground = true,
}) => {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center",
        "h-full w-full",
        "p-8 md:p-12",
        className
      )}
    >
      {/* Animated gradient background layer */}
      {enableBackground && <AnimatedBackground enableParallax={true} />}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 md:gap-12 max-w-4xl w-full">
        {/* Logo and title section */}
        {(logo || title) && (
          <div className="flex-shrink-0 flex flex-col items-center gap-4">
            {logo}
            {title && (
              <h1 className="text-4xl md:text-5xl font-bold text-content-primary tracking-tight">
                {title}
              </h1>
            )}
          </div>
        )}

        {/* Feature highlights section (optional) */}
        {features && features.length > 0 && (
          <div className="flex-shrink-0 w-full">
            <FeatureHighlights features={features} />
          </div>
        )}

        {/* Action cards section */}
        <div className="flex-shrink-0 w-full">{children}</div>

        {/* Stats bar section */}
        {stats && <div className="flex-shrink-0">{stats}</div>}
      </div>
    </div>
  );
};
