import { describe, expect, it } from "vitest";

import { TECH_ADJECTIVES } from "./adjectives.workspace-name";
import { generateRandomWorkspaceName } from "./generator.workspace-name";
import { TECH_NOUNS } from "./nouns.workspace-name";

describe("generateRandomWorkspaceName", () => {
  it("returns a string in adjective-noun format with exactly one hyphen", () => {
    const name = generateRandomWorkspaceName();
    const hyphens = name.split("-").length - 1;

    expect(hyphens).toBe(1);
  });

  it("matches valid workspace name pattern (lowercase letters and one hyphen)", () => {
    const name = generateRandomWorkspaceName();
    const pattern = /^[a-z]+-[a-z]+$/;

    expect(name).toMatch(pattern);
  });

  it("returns different names on multiple calls (randomness test)", () => {
    const names = new Set<string>();
    const iterations = 20;

    for (let i = 0; i < iterations; i++) {
      names.add(generateRandomWorkspaceName());
    }

    // With 51 adjectives and 53 nouns, we have 2703 possible combinations
    // Running 20 iterations should yield more than 1 unique result
    expect(names.size).toBeGreaterThan(1);
  });

  it("uses an adjective from TECH_ADJECTIVES list", () => {
    const name = generateRandomWorkspaceName();
    const [adjective] = name.split("-");

    expect(TECH_ADJECTIVES).toContain(adjective);
  });

  it("uses a noun from TECH_NOUNS list", () => {
    const name = generateRandomWorkspaceName();
    const [, noun] = name.split("-");

    expect(TECH_NOUNS).toContain(noun);
  });
});
