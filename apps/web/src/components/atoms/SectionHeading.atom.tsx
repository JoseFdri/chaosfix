import { cn } from "@/lib";

export interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  centered?: boolean;
}

/**
 * Reusable section heading component for landing page sections.
 * Provides consistent typography and spacing for section titles and subtitles.
 */
export function SectionHeading({
  title,
  subtitle,
  className,
  centered = true,
}: SectionHeadingProps): React.JSX.Element {
  return (
    <div className={cn("mb-8 sm:mb-12", centered && "text-center", className)}>
      <h2 className="text-2xl font-bold text-text-primary sm:text-3xl md:text-4xl">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-base text-text-secondary sm:mt-4 sm:text-lg md:text-xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
