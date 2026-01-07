import { forwardRef, type ImgHTMLAttributes } from "react";
import { cn } from "../../libs/cn.lib";

/**
 * CSS custom properties for glow filter values.
 * Using CSS variables allows hover state to be handled purely in CSS.
 */
const glowStyles = {
  "--glow-default": "drop-shadow(0 0 8px rgba(59, 130, 246, 0.2))",
  "--glow-hover":
    "drop-shadow(0 0 20px rgba(59, 130, 246, 0.5)) drop-shadow(0 0 40px rgba(147, 51, 234, 0.3))",
} as React.CSSProperties;

export interface AnimatedLogoProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "width" | "height"
> {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Size of the logo in pixels (applies to both width and height) */
  size?: number;
}

export const AnimatedLogo = forwardRef<HTMLImageElement, AnimatedLogoProps>(
  ({ src, alt = "Logo", size = 240, className, style, ...props }, ref) => {
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={cn(
          "object-contain",
          "motion-safe:animate-float",
          "motion-reduce:animate-none",
          "transition-[filter] duration-300 ease-out",
          // Use CSS filter with custom properties for hover state
          "[filter:var(--glow-default)]",
          "hover:[filter:var(--glow-hover)]",
          className
        )}
        style={{
          ...glowStyles,
          ...style,
        }}
        {...props}
      />
    );
  }
);

AnimatedLogo.displayName = "AnimatedLogo";
