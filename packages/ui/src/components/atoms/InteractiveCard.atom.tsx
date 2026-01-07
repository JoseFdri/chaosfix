import {
  forwardRef,
  useRef,
  type ReactNode,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type CSSProperties,
} from "react";
import { cn } from "../../libs/cn.lib";
import { useMousePosition } from "../../hooks/useMousePosition.hook";

const MAX_TILT_ANGLE = 6;
const GLOW_RADIUS = 150;

export interface InteractiveCardProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  /** Enable cursor-tracking glow border effect */
  enableGlow?: boolean;
  /** Enable 3D tilt effect on hover */
  enableTilt?: boolean;
  /** Enable entrance animation */
  animateEntrance?: boolean;
  /** Delay in ms for staggered entrance animations */
  entranceDelay?: number;
}

export const InteractiveCard = forwardRef<ElementRef<"div">, InteractiveCardProps>(
  (
    {
      children,
      enableGlow = true,
      enableTilt = true,
      animateEntrance = false,
      entranceDelay = 0,
      className,
      style,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const cardRef = (forwardedRef as React.RefObject<HTMLDivElement>) || internalRef;
    const mousePosition = useMousePosition(cardRef);

    const calculateTiltTransform = (): string => {
      if (!enableTilt || !mousePosition.isOver) {
        return "perspective(1000px) rotateX(0deg) rotateY(0deg)";
      }

      // Calculate tilt based on normalized mouse position (0.5 is center)
      const tiltX = (mousePosition.normalizedY - 0.5) * MAX_TILT_ANGLE * -2;
      const tiltY = (mousePosition.normalizedX - 0.5) * MAX_TILT_ANGLE * 2;

      return `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    };

    const combinedStyle: CSSProperties = {
      "--mouse-x": `${mousePosition.x}px`,
      "--mouse-y": `${mousePosition.y}px`,
      "--glow-radius": `${GLOW_RADIUS}px`,
      "--glow-opacity": mousePosition.isOver && enableGlow ? 1 : 0,
      transform: calculateTiltTransform(),
      animationDelay: animateEntrance ? `${entranceDelay}ms` : undefined,
      ...style,
    } as CSSProperties;

    return (
      <div
        ref={cardRef}
        className={cn(
          // Base styles
          "relative overflow-hidden",
          "bg-surface-secondary border border-border-default rounded-lg",
          "p-6",
          // Transition for smooth tilt and hover effects
          "transition-transform duration-200 ease-out",
          // Entrance animation
          animateEntrance && "animate-fadeUp opacity-0",
          // Reduced motion support
          "motion-reduce:transition-none motion-reduce:animate-none motion-reduce:opacity-100",
          // Focus states (keyboard navigation)
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-focus focus-visible:ring-offset-2",
          className
        )}
        style={combinedStyle}
        tabIndex={props.tabIndex ?? 0}
        {...props}
      >
        {/* Glow effect overlay */}
        {enableGlow && (
          <div
            className={cn(
              "pointer-events-none absolute inset-0 rounded-lg",
              "transition-opacity duration-300 ease-out",
              "motion-reduce:hidden"
            )}
            style={{
              background: `radial-gradient(
                var(--glow-radius) circle at var(--mouse-x) var(--mouse-y),
                rgba(59, 130, 246, 0.15),
                transparent 40%
              )`,
              opacity: "var(--glow-opacity)",
            }}
            aria-hidden="true"
          />
        )}
        {/* Glow border effect */}
        {enableGlow && (
          <div
            className={cn(
              "pointer-events-none absolute inset-0 rounded-lg",
              "transition-opacity duration-300 ease-out",
              "motion-reduce:hidden"
            )}
            style={{
              background: `radial-gradient(
                var(--glow-radius) circle at var(--mouse-x) var(--mouse-y),
                rgba(59, 130, 246, 0.4),
                transparent 40%
              )`,
              opacity: "var(--glow-opacity)",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "xor",
              WebkitMaskComposite: "xor",
              padding: "1px",
            }}
            aria-hidden="true"
          />
        )}
        {/* Card content */}
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);

InteractiveCard.displayName = "InteractiveCard";
