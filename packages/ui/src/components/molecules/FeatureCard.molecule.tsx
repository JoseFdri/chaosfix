import { type FC, type ReactNode } from "react";
import { InteractiveCard } from "../atoms";
import { cn } from "../../libs/cn.lib";

export interface FeatureCardProps {
  /** Icon to display at the top of the card */
  icon: ReactNode;
  /** Title of the feature */
  title: string;
  /** Description of the feature */
  description: string;
  /** Enable entrance animation */
  animateEntrance?: boolean;
  /** Delay in ms for staggered entrance animations */
  entranceDelay?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * FeatureCard displays a single feature with an icon, title, and description.
 * Composes InteractiveCard atom for glow and tilt effects.
 *
 * @param icon - Icon to display at the top
 * @param title - Feature title
 * @param description - Feature description
 * @param animateEntrance - Enable entrance animation
 * @param entranceDelay - Delay for staggered animations
 * @param className - Additional CSS classes
 */
export const FeatureCard: FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  animateEntrance = false,
  entranceDelay = 0,
  className,
}) => {
  return (
    <InteractiveCard
      animateEntrance={animateEntrance}
      entranceDelay={entranceDelay}
      className={cn("flex flex-col items-center text-center p-4 sm:p-6", className)}
      enableGlow={true}
      enableTilt={true}
    >
      <div
        className={cn(
          "flex items-center justify-center",
          "w-10 h-10 sm:w-12 sm:h-12",
          "mb-3 sm:mb-4",
          "text-text-accent"
        )}
        aria-hidden="true"
      >
        {icon}
      </div>
      <h3 className="text-text-primary font-semibold text-sm sm:text-base mb-1 sm:mb-2">{title}</h3>
      <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">{description}</p>
    </InteractiveCard>
  );
};
