import { type FC } from "react";

interface IconProps {
  className?: string;
}

/** Finder app icon */
export const FinderIcon: FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="4" fill="#1B97F3" />
    <ellipse cx="9" cy="10" rx="1.5" ry="2" fill="white" />
    <ellipse cx="15" cy="10" rx="1.5" ry="2" fill="white" />
    <path
      d="M8 15 Q12 18 16 15"
      stroke="white"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />
    <path d="M12 12 L12 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** VS Code app icon */
export const VSCodeIcon: FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M3 7.5L9 12L3 16.5V7.5Z" fill="#0078D4" />
    <path d="M9 12L17 3V21L9 12Z" fill="#0078D4" />
    <path d="M17 3L21 5.5V18.5L17 21V3Z" fill="#0078D4" />
    <path d="M3 7.5L9 12L3 16.5" stroke="#2D9CDB" strokeWidth="1" fill="none" />
  </svg>
);

/** Cursor app icon */
export const CursorIcon: FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="4" fill="#1A1A1A" />
    <path d="M8 6L8 18L12 14L16 18L16 6L12 10L8 6Z" fill="white" />
  </svg>
);

/** Xcode app icon */
export const XcodeIcon: FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="4" fill="#147EFB" />
    <path
      d="M6 8L12 12L6 16M18 8L12 12L18 16"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

/** Ghostty app icon */
export const GhosttyIcon: FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="4" fill="#1E1E2E" />
    <path
      d="M7 9C7 7.34315 8.34315 6 10 6H14C15.6569 6 17 7.34315 17 9V15C17 16.1046 16.1046 17 15 17H13L12 19L11 17H9C7.89543 17 7 16.1046 7 15V9Z"
      fill="white"
    />
    <circle cx="10" cy="11" r="1.5" fill="#1E1E2E" />
    <circle cx="14" cy="11" r="1.5" fill="#1E1E2E" />
  </svg>
);

/** iTerm app icon */
export const ITermIcon: FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="4" fill="#1D1D1D" />
    <rect x="4" y="6" width="16" height="2" rx="1" fill="#2ECC40" />
    <text x="6" y="15" fontSize="8" fill="#2ECC40" fontFamily="monospace">
      &gt;_
    </text>
  </svg>
);

/** Terminal app icon */
export const TerminalIcon: FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="4" fill="#1D1D1D" />
    <path
      d="M6 8L10 12L6 16"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path d="M12 16H18" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** Windsurf app icon */
export const WindsurfIcon: FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="4" fill="#0F766E" />
    <path
      d="M7 16L12 6L17 16"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path d="M9 12H15" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** Map of app IDs to their icon components */
export const APP_ICONS: Record<string, FC<IconProps>> = {
  finder: FinderIcon,
  vscode: VSCodeIcon,
  cursor: CursorIcon,
  xcode: XcodeIcon,
  ghostty: GhosttyIcon,
  iterm: ITermIcon,
  terminal: TerminalIcon,
  windsurf: WindsurfIcon,
};

/** Get the icon component for an app ID */
export function getAppIcon(appId: string): FC<IconProps> | undefined {
  return APP_ICONS[appId];
}
