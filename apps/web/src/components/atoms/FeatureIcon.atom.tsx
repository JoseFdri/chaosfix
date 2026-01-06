import { cn } from "@/lib";
import {
  CommandLineIcon,
  CodeBracketSquareIcon,
  Squares2X2Icon,
  ShieldCheckIcon,
  CpuChipIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType, SVGProps } from "react";

export type FeatureIconName =
  | "terminal"
  | "branches"
  | "parallel"
  | "isolation"
  | "speed"
  | "native";

export interface FeatureIconProps {
  iconName: FeatureIconName;
  className?: string;
}

const ICON_MAP: Record<FeatureIconName, ComponentType<SVGProps<SVGSVGElement>>> = {
  terminal: CommandLineIcon,
  branches: CodeBracketSquareIcon,
  parallel: Squares2X2Icon,
  isolation: ShieldCheckIcon,
  speed: BoltIcon,
  native: CpuChipIcon,
};

/**
 * Icon wrapper component for feature cards.
 * Provides consistent styling and sizing for feature icons.
 */
export function FeatureIcon({ iconName, className }: FeatureIconProps): React.JSX.Element {
  const IconComponent = ICON_MAP[iconName];

  return (
    <div
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-lg",
        "bg-accent-primary/10",
        className
      )}
    >
      <IconComponent className="h-6 w-6 text-accent-primary" />
    </div>
  );
}
