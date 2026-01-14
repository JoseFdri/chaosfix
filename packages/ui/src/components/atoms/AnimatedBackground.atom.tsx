import { forwardRef, useRef, type HTMLAttributes } from "react";
import { cn } from "../../libs/cn.lib";
import { useMousePosition } from "../../hooks/useMousePosition.hook";

const MAX_PARALLAX_OFFSET = 8;

export interface AnimatedBackgroundProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Enable parallax effect based on mouse position */
  enableParallax?: boolean;
}

export const AnimatedBackground = forwardRef<HTMLDivElement, AnimatedBackgroundProps>(
  ({ className, enableParallax = true, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mousePosition = useMousePosition(containerRef);

    const parallaxX = enableParallax
      ? (mousePosition.normalizedX - 0.5) * MAX_PARALLAX_OFFSET * 2
      : 0;
    const parallaxY = enableParallax
      ? (mousePosition.normalizedY - 0.5) * MAX_PARALLAX_OFFSET * 2
      : 0;

    const parallaxStyle = enableParallax
      ? {
          transform: `translate(${parallaxX}px, ${parallaxY}px)`,
          transition: "transform 0.3s ease-out",
        }
      : undefined;

    return (
      <div
        ref={containerRef}
        className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}
        {...props}
      >
        <div
          ref={ref}
          className={cn("absolute -inset-4", "bg-surface-primary", "motion-reduce:animate-none")}
          style={parallaxStyle}
        />
      </div>
    );
  }
);

AnimatedBackground.displayName = "AnimatedBackground";
