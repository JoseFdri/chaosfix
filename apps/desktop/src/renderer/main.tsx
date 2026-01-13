import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastProvider } from "@chaosfix/ui";
import { AppProvider } from "./contexts/app-context";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { App } from "./app";
import "./styles/index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AppProvider>
    </ErrorBoundary>
  </StrictMode>
);
