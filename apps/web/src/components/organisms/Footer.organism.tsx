import { cn } from "@/lib";
import { Logo } from "@/components/ui";

import { SITE_NAME } from "@/constants";

export interface FooterProps {
  className?: string;
}

/**
 * Site footer with logo, copyright, and optional links.
 */
export function Footer({ className }: FooterProps): React.JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "border-t border-border-default",
        "px-4 py-8 sm:px-6 sm:py-12 lg:px-8",
        className
      )}
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* Logo and site name */}
          <div className="flex items-center gap-2">
            <Logo src="/logo.svg" alt={SITE_NAME} width={24} height={24} />
            <span className="text-base font-medium text-text-primary">{SITE_NAME}</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <a
              href="https://github.com/chaosfix/chaosfix"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              GitHub
            </a>
            <a
              href="#features"
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              Features
            </a>
            <a
              href="#download"
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              Download
            </a>
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-border-default pt-8 text-center">
          <p className="text-sm text-text-muted">
            &copy; {currentYear} {SITE_NAME}. All rights reserved.
          </p>
          <p className="mt-2 text-xs text-text-muted">Built with Electron, React, and xterm.js</p>
        </div>
      </div>
    </footer>
  );
}
