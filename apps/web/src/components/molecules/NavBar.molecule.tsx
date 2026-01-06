"use client";

import { cn } from "@/lib";
import { Logo } from "@/components/ui";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useCallback } from "react";

import { SITE_NAME } from "@/constants";

export interface NavBarProps {
  className?: string;
}

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "Demo", href: "#demo" },
];

/**
 * Top navigation bar for the landing page.
 * Includes logo, navigation links, and CTA button.
 * Responsive design with mobile hamburger menu.
 */
export function NavBar({ className }: NavBarProps): React.JSX.Element {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <nav
      className={cn(
        "fixed left-0 right-0 top-0 z-50",
        "bg-surface-primary/80 backdrop-blur-md",
        "border-b border-border-default",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and site name */}
          <a href="#" className="flex items-center gap-2">
            <Logo src="/logo.svg" alt={SITE_NAME} width={32} height={32} />
            <span className="text-lg font-semibold text-text-primary">{SITE_NAME}</span>
          </a>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#download"
              className={cn(
                "inline-flex items-center justify-center font-medium transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-focus focus-visible:ring-offset-2",
                "bg-accent-primary text-text-inverse hover:bg-blue-600",
                "text-sm px-3 py-1.5 rounded"
              )}
            >
              Download
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-md text-text-secondary md:hidden"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-border-default bg-surface-primary md:hidden">
          <div className="space-y-1 px-4 py-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block rounded-md px-3 py-2 text-base font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                onClick={closeMobileMenu}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2">
              <a
                href="#download"
                onClick={closeMobileMenu}
                className={cn(
                  "inline-flex w-full items-center justify-center font-medium transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-focus focus-visible:ring-offset-2",
                  "bg-accent-primary text-text-inverse hover:bg-blue-600",
                  "text-sm px-4 py-2 rounded-md"
                )}
              >
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
