/**
 * Terminal-related constants.
 */

export const DEFAULT_CWD = "/";
export const DEFAULT_TERMINAL_LABEL = "New Tab";

/**
 * Initial PID value for terminal sessions before they are connected to a PTY.
 * A value of 0 indicates the terminal has not yet been assigned a process.
 */
export const INITIAL_TERMINAL_PID = 0;

/**
 * Default status for newly created terminal sessions.
 */
export const DEFAULT_TERMINAL_STATUS = "idle" as const;
