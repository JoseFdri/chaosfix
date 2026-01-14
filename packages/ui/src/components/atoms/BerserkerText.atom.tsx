import { forwardRef, useRef, useId, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "../../libs/cn.lib";
import { useEmberParticles } from "../../hooks/useEmberParticles.hook";

export interface BerserkerTextProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  /** Intensity of the effect (0-1), affects glow strength and particle count */
  intensity?: number;
  /** Disable all effects (shows plain text) */
  disabled?: boolean;
  /** Override default ember color (CSS color value) */
  emberColor?: string;
  /** Override default glow color (CSS color value) */
  glowColor?: string;
}

const DEFAULT_EMBER_COLOR = "#ef4444";
const DEFAULT_GLOW_COLOR = "rgba(220, 38, 38, 0.8)";

export const BerserkerText = forwardRef<HTMLSpanElement, BerserkerTextProps>(
  (
    {
      children,
      intensity = 0.7,
      disabled = false,
      emberColor = DEFAULT_EMBER_COLOR,
      glowColor = DEFAULT_GLOW_COLOR,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLSpanElement>(null);
    const filterId = useId();
    const { particles } = useEmberParticles({
      enabled: !disabled,
      intensity,
    });

    if (disabled) {
      return (
        <span ref={ref} className={className} style={style} {...props}>
          {children}
        </span>
      );
    }

    return (
      <span ref={ref} className={cn("relative inline-block", className)} style={style} {...props}>
        {/* SVG Filter for heat distortion */}
        <svg className="absolute h-0 w-0" aria-hidden="true">
          <defs>
            <filter id={filterId}>
              <feTurbulence
                type="turbulence"
                baseFrequency="0.02 0.05"
                numOctaves="2"
                result="turbulence"
              >
                <animate
                  attributeName="baseFrequency"
                  dur="3s"
                  values="0.02 0.05;0.03 0.06;0.02 0.05"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap
                in="SourceGraphic"
                in2="turbulence"
                scale="2"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>

        {/* Ember particles layer */}
        <span
          ref={containerRef}
          className={cn(
            "pointer-events-none absolute inset-0 overflow-visible",
            "motion-reduce:hidden"
          )}
          aria-hidden="true"
        >
          {particles.map((particle) => (
            <span
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
                backgroundColor: emberColor,
                opacity: particle.opacity,
                boxShadow: `0 0 ${particle.size * 2}px ${emberColor}`,
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </span>

        {/* Text with glow and distortion effects */}
        <span
          className={cn(
            "relative inline-block",
            "motion-safe:animate-berserkerTextPulse",
            "motion-safe:animate-berserkerHeatShimmer",
            "motion-reduce:animate-none"
          )}
          style={{
            filter: `url(#${filterId})`,
            color: "inherit",
            textShadow: `0 0 10px ${glowColor}, 0 0 20px ${glowColor}, 0 0 30px ${glowColor}`,
          }}
        >
          {children}
        </span>
      </span>
    );
  }
);

BerserkerText.displayName = "BerserkerText";
