import { useState, useEffect, useRef, useCallback } from "react";

export interface EmberParticle {
  id: number;
  /** X position as percentage (0-100) */
  x: number;
  /** Y position as percentage (0-100) */
  y: number;
  /** Particle size in pixels */
  size: number;
  /** Opacity (0-1) */
  opacity: number;
  /** Horizontal velocity */
  velocityX: number;
  /** Vertical velocity (negative = upward) */
  velocityY: number;
}

export interface UseEmberParticlesOptions {
  /** Whether particle animation is enabled */
  enabled?: boolean;
  /** Intensity multiplier (0-1), affects spawn rate and max particles */
  intensity?: number;
  /** Container width in pixels */
  containerWidth?: number;
  /** Container height in pixels */
  containerHeight?: number;
}

export interface UseEmberParticlesReturn {
  particles: EmberParticle[];
}

interface InternalParticle extends EmberParticle {
  /** Birth timestamp for lifetime calculation */
  birthTime: number;
  /** Total lifetime in milliseconds */
  lifetime: number;
}

const DEFAULT_OPTIONS: Required<UseEmberParticlesOptions> = {
  enabled: true,
  intensity: 0.5,
  containerWidth: 100,
  containerHeight: 100,
};

const MIN_LIFETIME_MS = 1500;
const MAX_LIFETIME_MS = 2500;
const MIN_SIZE_PX = 2;
const MAX_SIZE_PX = 6;
const BASE_MAX_PARTICLES = 15;
const INTENSITY_MAX_PARTICLES_BONUS = 5;
const BASE_SPAWN_INTERVAL_MS = 400;
const MIN_SPAWN_INTERVAL_MS = 200;

function createParticle(id: number): InternalParticle {
  const lifetime = MIN_LIFETIME_MS + Math.random() * (MAX_LIFETIME_MS - MIN_LIFETIME_MS);

  return {
    id,
    x: Math.random() * 100,
    y: 90 + Math.random() * 10,
    size: MIN_SIZE_PX + Math.random() * (MAX_SIZE_PX - MIN_SIZE_PX),
    opacity: 0.7 + Math.random() * 0.3,
    velocityX: (Math.random() - 0.5) * 0.3,
    velocityY: -(0.5 + Math.random() * 0.5),
    birthTime: performance.now(),
    lifetime,
  };
}

function updateParticle(
  particle: InternalParticle,
  deltaTime: number,
  now: number
): InternalParticle | null {
  const age = now - particle.birthTime;
  const lifeProgress = age / particle.lifetime;

  if (lifeProgress >= 1) {
    return null;
  }

  const fadeStartProgress = 0.3;
  const opacity =
    lifeProgress < fadeStartProgress
      ? particle.opacity
      : particle.opacity * (1 - (lifeProgress - fadeStartProgress) / (1 - fadeStartProgress));

  const timeScale = deltaTime / 16.67;

  return {
    ...particle,
    x: particle.x + particle.velocityX * timeScale,
    y: particle.y + particle.velocityY * timeScale,
    opacity: Math.max(0, opacity),
  };
}

function checkReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useEmberParticles(options: UseEmberParticlesOptions = {}): UseEmberParticlesReturn {
  const { enabled = DEFAULT_OPTIONS.enabled, intensity = DEFAULT_OPTIONS.intensity } = options;

  const [particles, setParticles] = useState<EmberParticle[]>([]);

  const internalParticlesRef = useRef<InternalParticle[]>([]);
  const nextIdRef = useRef(0);
  const lastFrameTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const spawnIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reducedMotionRef = useRef(false);

  const clampedIntensity = Math.max(0, Math.min(1, intensity));
  const maxParticles = Math.floor(
    BASE_MAX_PARTICLES + clampedIntensity * INTENSITY_MAX_PARTICLES_BONUS
  );

  const spawnParticle = useCallback(() => {
    if (internalParticlesRef.current.length >= maxParticles) {
      return;
    }

    const newParticle = createParticle(nextIdRef.current++);
    internalParticlesRef.current.push(newParticle);
  }, [maxParticles]);

  const animationLoop = useCallback(() => {
    const now = performance.now();
    const deltaTime = lastFrameTimeRef.current ? now - lastFrameTimeRef.current : 16.67;
    lastFrameTimeRef.current = now;

    const updatedParticles: InternalParticle[] = [];

    for (const particle of internalParticlesRef.current) {
      const updated = updateParticle(particle, deltaTime, now);
      if (updated) {
        updatedParticles.push(updated);
      }
    }

    internalParticlesRef.current = updatedParticles;

    const visibleParticles: EmberParticle[] = updatedParticles.map(
      ({ id, x, y, size, opacity, velocityX, velocityY }) => ({
        id,
        x,
        y,
        size,
        opacity,
        velocityX,
        velocityY,
      })
    );

    setParticles(visibleParticles);

    rafIdRef.current = requestAnimationFrame(animationLoop);
  }, []);

  useEffect(() => {
    reducedMotionRef.current = checkReducedMotion();

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event: MediaQueryListEvent): void => {
      reducedMotionRef.current = event.matches;
    };

    mediaQuery.addEventListener("change", handleChange);

    return (): void => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (!enabled || reducedMotionRef.current) {
      internalParticlesRef.current = [];
      setParticles([]);
      return;
    }

    lastFrameTimeRef.current = performance.now();
    rafIdRef.current = requestAnimationFrame(animationLoop);

    const spawnInterval = Math.max(
      MIN_SPAWN_INTERVAL_MS,
      BASE_SPAWN_INTERVAL_MS - clampedIntensity * (BASE_SPAWN_INTERVAL_MS - MIN_SPAWN_INTERVAL_MS)
    );

    spawnIntervalRef.current = setInterval(spawnParticle, spawnInterval);

    return (): void => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      if (spawnIntervalRef.current !== null) {
        clearInterval(spawnIntervalRef.current);
        spawnIntervalRef.current = null;
      }

      internalParticlesRef.current = [];
    };
  }, [enabled, clampedIntensity, animationLoop, spawnParticle]);

  if (reducedMotionRef.current) {
    return { particles: [] };
  }

  return { particles };
}
