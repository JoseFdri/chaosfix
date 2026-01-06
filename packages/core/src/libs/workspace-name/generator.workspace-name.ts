import { TECH_ADJECTIVES } from "./adjectives.workspace-name";
import { TECH_NOUNS } from "./nouns.workspace-name";

/**
 * Generates a random tech-themed workspace name in kebab-case format.
 * Returns a name like "quantum-pulse" or "cyber-stream".
 */
export function generateRandomWorkspaceName(): string {
  const adjective = TECH_ADJECTIVES[Math.floor(Math.random() * TECH_ADJECTIVES.length)];
  const noun = TECH_NOUNS[Math.floor(Math.random() * TECH_NOUNS.length)];
  return `${adjective}-${noun}`;
}
