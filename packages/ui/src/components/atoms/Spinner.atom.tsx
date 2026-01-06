import { type FC } from "react";
import { cn } from "../../libs/cn.lib";

export interface SpinnerProps {
  size?: "xs" | "sm" | "md";
  className?: string;
}

const SIZE_CLASSES = {
  xs: "w-3 h-3", // 12px
  sm: "w-4 h-4", // 16px
  md: "w-5 h-5", // 20px
} as const;

export const Spinner: FC<SpinnerProps> = ({ size = "sm", className }) => {
  return (
    <svg
      className={cn("animate-spin text-text-muted", SIZE_CLASSES[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label="Loading"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};
