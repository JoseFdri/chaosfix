import { type FC, type ReactNode } from "react";
import { InteractiveCard } from "../atoms";
import { cn } from "../../libs/cn.lib";

const STAGGER_DELAY_MS = 100;

export interface Feature {
  /** Unique identifier for the feature */
  id: string;
  /** Icon to display at the top of the card */
  icon: ReactNode;
  /** Title of the feature */
  title: string;
  /** Description of the feature */
  description: string;
}

export interface FeatureHighlightsProps {
  /** Array of features to display */
  features: Feature[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * FeatureHighlights displays a responsive grid of feature cards with staggered entrance animations.
 * Uses CSS animation-delay for performance-friendly stagger effects.
 *
 * @param features - Array of features to display
 * @param className - Additional CSS classes
 */
export const FeatureHighlights: FC<FeatureHighlightsProps> = ({ features, className }) => {
  return (
    <div
      className={cn(
        "grid gap-4 sm:gap-6",
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        "w-full",
        className
      )}
    >
      {features.map((feature, index) => (
        <InteractiveCard
          key={feature.id}
          animateEntrance={true}
          entranceDelay={index * STAGGER_DELAY_MS}
          className="flex flex-col items-center text-center p-4 sm:p-6"
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
            {feature.icon}
          </div>
          <h3 className="text-text-primary font-semibold text-sm sm:text-base mb-1 sm:mb-2">
            {feature.title}
          </h3>
          <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
            {feature.description}
          </p>
        </InteractiveCard>
      ))}
    </div>
  );
};
