/// <reference types="vite/client" />

declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.svg?react" {
  import { type FC, type SVGProps } from "react";
  const content: FC<SVGProps<SVGSVGElement>>;
  export default content;
}
