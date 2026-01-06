import { cn } from "@/lib";

import { SectionHeading } from "@/components/atoms";
import { FeatureCard } from "@/components/molecules";
import { FEATURES } from "@/constants";

export interface FeaturesGridProps {
  className?: string;
}

/**
 * Features grid section displaying feature cards in a responsive grid layout.
 * Uses the SectionHeading atom and FeatureCard molecules.
 */
export function FeaturesGrid({ className }: FeaturesGridProps): React.JSX.Element {
  return (
    <section
      id="features"
      className={cn("py-16 sm:py-20 md:py-24", "px-4 sm:px-6 lg:px-8", className)}
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Everything You Need"
          subtitle="Powerful features to supercharge your Claude Code workflow"
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.id}
              iconName={feature.iconName}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
