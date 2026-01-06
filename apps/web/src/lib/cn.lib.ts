import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to safely merge Tailwind CSS classes.
 * Uses clsx for conditional class handling and tailwind-merge for conflict resolution.
 *
 * This is a local copy for RSC compatibility to avoid importing from the
 * bundled @chaosfix/ui package which includes client-side hooks.
 *
 * @param inputs - Class values to merge (strings, objects, arrays)
 * @returns Merged class string with Tailwind conflicts resolved
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
