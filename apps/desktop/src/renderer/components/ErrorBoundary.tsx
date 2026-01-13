import { Component, type ReactNode, type ErrorInfo } from "react";
import { Button } from "@chaosfix/ui";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-gray-100 p-8">
          <h1 className="text-xl font-semibold mb-4">Something went wrong</h1>
          <p className="text-text-muted mb-6 text-center max-w-md">
            An unexpected error occurred. Please try again or restart the application.
          </p>
          {error && (
            <pre className="bg-surface-secondary p-4 rounded mb-6 text-sm text-red-400 max-w-lg overflow-auto">
              {error.message}
            </pre>
          )}
          <Button variant="primary" onClick={this.handleReset}>
            Try Again
          </Button>
        </div>
      );
    }

    return children;
  }
}
