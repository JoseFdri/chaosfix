import { cn } from "@/lib";

import { SectionHeading } from "@/components/atoms";

export interface DemoShowcaseProps {
  className?: string;
}

/**
 * Demo/screenshots section showcasing the application interface.
 * Includes section heading and placeholder for screenshot images.
 */
export function DemoShowcase({ className }: DemoShowcaseProps): React.JSX.Element {
  return (
    <section
      id="demo"
      className={cn(
        "py-16 sm:py-20 md:py-24",
        "px-4 sm:px-6 lg:px-8",
        "bg-surface-secondary",
        className
      )}
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="See It in Action"
          subtitle="Manage multiple Claude Code sessions with an intuitive interface"
        />

        {/* Screenshot container */}
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-xl border border-border-default bg-surface-primary shadow-2xl">
          {/* Browser-like chrome */}
          <div className="flex h-10 items-center gap-2 border-b border-border-default bg-surface-secondary px-4">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className="h-3 w-3 rounded-full bg-yellow-500" />
              <span className="h-3 w-3 rounded-full bg-green-500" />
            </div>
            <div className="ml-4 flex-1 rounded bg-surface-hover px-3 py-1 text-xs text-text-muted">
              ChaosFix
            </div>
          </div>

          {/* Screenshot placeholder */}
          <div className="aspect-video bg-surface-primary">
            <div className="flex h-full flex-col items-center justify-center gap-4 text-text-muted">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-surface-secondary">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-sm">Application screenshot coming soon</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mx-auto mt-8 max-w-2xl text-center">
          <p className="text-base text-text-secondary sm:text-lg">
            Run multiple isolated workspaces side by side. Each terminal connects directly to Claude
            Code CLI with full terminal emulation, giving you the exact same experience as running
            in your native terminal.
          </p>
        </div>
      </div>
    </section>
  );
}
