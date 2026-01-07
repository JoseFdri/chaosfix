import { cn } from "@/lib";
import { Button } from "@/components/ui";

import { SITE_DESCRIPTION } from "@/constants";

export interface HeroSectionProps {
  className?: string;
}

/**
 * Hero section with main headline, tagline, and call-to-action buttons.
 * This is the primary above-the-fold section of the landing page.
 */
export function HeroSection({ className }: HeroSectionProps): React.JSX.Element {
  return (
    <section
      id="hero"
      className={cn(
        "flex min-h-screen flex-col items-center justify-center",
        "px-4 pt-16 sm:px-6 lg:px-8",
        className
      )}
    >
      <div className="mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center rounded-full border border-border-default bg-surface-secondary px-4 py-1.5 text-sm text-text-secondary">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-accent-success" />
          Now available for macOS
        </div>

        {/* Main headline */}
        <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl lg:text-6xl">
          Manage Multiple Workspaces
          <br />
          <span className="text-accent-primary">in Parallel</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-base text-text-secondary sm:text-lg md:text-xl">
          {SITE_DESCRIPTION}
        </p>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Button size="lg">
            <a href="#download" className="flex items-center gap-2">
              Download for macOS
            </a>
          </Button>
          <Button variant="secondary" size="lg">
            <a href="#features">Learn More</a>
          </Button>
        </div>

        {/* Social proof or additional info */}
        <p className="mt-8 text-sm text-text-muted">Free and open source. Built with Electron.</p>
      </div>
    </section>
  );
}
