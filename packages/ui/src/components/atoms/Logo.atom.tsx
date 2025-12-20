import { forwardRef, type ImgHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface LogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
}

export const Logo = forwardRef<HTMLImageElement, LogoProps>(
  ({ src, alt = "Logo", width = 240, height = 240, className, ...props }, ref) => {
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn("object-contain", className)}
        {...props}
      />
    );
  }
);

Logo.displayName = "Logo";
