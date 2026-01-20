import { type FC } from "react";
import { cn } from "../../libs/cn.lib";
import { Button } from "../atoms/Button.atom";

export interface UpdateTooltipProps {
  /** Current status of the update */
  status: "available" | "downloading" | "ready" | "error";
  /** Version number of the available update */
  version?: string;
  /** Release notes for the update */
  releaseNotes?: string;
  /** Download progress information */
  progress?: { percent: number };
  /** Error message if update failed */
  error?: string;
  /** Called when user clicks "Update" button */
  onUpdate: () => void;
  /** Called when user clicks "Install & Restart" */
  onInstall: () => void;
  /** Called when user clicks "Dismiss" or "Later" */
  onDismiss: () => void;
  /** Called when user clicks "Retry" (for error state) */
  onRetry?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Tooltip component that displays update status in the bottom-right corner.
 * Shows different UI based on update status (available, downloading, ready, error).
 */
export const UpdateTooltip: FC<UpdateTooltipProps> = ({
  status,
  version,
  progress,
  error,
  onUpdate,
  onInstall,
  onDismiss,
  onRetry,
  className,
}) => {
  const renderContent = (): JSX.Element | null => {
    switch (status) {
      case "available":
        return (
          <>
            <div className="mb-3">
              <h3 className="text-sm font-medium text-text-primary">Update available</h3>
              {version && <p className="text-sm text-text-secondary mt-0.5">Version {version}</p>}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="primary" onClick={onUpdate}>
                Update
              </Button>
              <Button size="sm" variant="ghost" onClick={onDismiss}>
                Dismiss
              </Button>
            </div>
          </>
        );

      case "downloading":
        return (
          <>
            <div className="mb-3">
              <h3 className="text-sm font-medium text-text-primary">Downloading update...</h3>
              {progress && (
                <p className="text-sm text-text-secondary mt-0.5">
                  {Math.round(progress.percent)}%
                </p>
              )}
            </div>
            <div className="w-full bg-surface-tertiary rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-accent-primary h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress?.percent ?? 0}%` }}
              />
            </div>
          </>
        );

      case "ready":
        return (
          <>
            <div className="mb-3">
              <h3 className="text-sm font-medium text-text-primary">Update ready to install</h3>
              {version && <p className="text-sm text-text-secondary mt-0.5">Version {version}</p>}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="primary" onClick={onInstall}>
                Install & Restart
              </Button>
              <Button size="sm" variant="ghost" onClick={onDismiss}>
                Later
              </Button>
            </div>
          </>
        );

      case "error":
        return (
          <>
            <div className="mb-3">
              <h3 className="text-sm font-medium text-text-primary">Update failed</h3>
              {error && <p className="text-sm text-accent-error mt-0.5 line-clamp-2">{error}</p>}
            </div>
            <div className="flex gap-2">
              {onRetry && (
                <Button size="sm" variant="primary" onClick={onRetry}>
                  Retry
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={onDismiss}>
                Dismiss
              </Button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50",
        "max-w-sm p-4",
        "bg-surface-secondary border border-border-default rounded-lg shadow-lg",
        className
      )}
      role="status"
      aria-live="polite"
    >
      {renderContent()}
    </div>
  );
};
