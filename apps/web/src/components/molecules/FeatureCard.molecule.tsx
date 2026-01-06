import { cn } from "@/lib";
import { FeatureIcon, type FeatureIconName } from "@/components/atoms";

export interface FeatureCardProps {
  iconName: FeatureIconName;
  title: string;
  description: string;
  className?: string;
}

/**
 * Feature display card for the features grid.
 * Composes FeatureIcon with heading and description text.
 */
export function FeatureCard({
  iconName,
  title,
  description,
  className,
}: FeatureCardProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl p-6",
        "bg-surface-secondary",
        "border border-border-default",
        "transition-colors duration-200",
        "hover:border-border-subtle hover:bg-surface-hover",
        className
      )}
    >
      <FeatureIcon iconName={iconName} />
      <h3 className="mt-4 text-lg font-semibold text-text-primary">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary sm:text-base">{description}</p>
    </div>
  );
}
