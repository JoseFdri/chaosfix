import { type ReactNode, type JSX } from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { ToastViewport } from "../components/atoms/Toast.atom";

export interface ToastProviderProps {
  children: ReactNode;
  duration?: number;
}

export function ToastProvider({ children, duration = 5000 }: ToastProviderProps): JSX.Element {
  return (
    <ToastPrimitive.Provider swipeDirection="right" duration={duration}>
      {children}
      <ToastViewport />
    </ToastPrimitive.Provider>
  );
}
