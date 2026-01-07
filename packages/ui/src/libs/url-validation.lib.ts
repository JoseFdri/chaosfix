/**
 * Git URL validation utilities
 */

/**
 * Regular expression patterns for git URL validation
 */
const HTTPS_PATTERN = /^https:\/\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+(\.git)?$/;
const SSH_PATTERN = /^git@[a-zA-Z0-9.-]+:[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+(\.git)?$/;

/**
 * Validates if a string is a valid git repository URL.
 * Supports both HTTPS and SSH formats.
 *
 * HTTPS examples:
 * - https://github.com/user/repo
 * - https://github.com/user/repo.git
 * - https://gitlab.com/user/repo.git
 *
 * SSH examples:
 * - git@github.com:user/repo.git
 * - git@gitlab.com:user/repo
 *
 * @param url - The URL string to validate
 * @returns true if the URL is a valid git repository URL, false otherwise
 */
export const isValidGitUrl = (url: string): boolean => {
  if (!url || typeof url !== "string") {
    return false;
  }

  const trimmedUrl = url.trim();

  if (trimmedUrl.length === 0) {
    return false;
  }

  return HTTPS_PATTERN.test(trimmedUrl) || SSH_PATTERN.test(trimmedUrl);
};
