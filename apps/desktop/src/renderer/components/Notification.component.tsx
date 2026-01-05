import { type FC, useEffect, useRef, useCallback } from "react";
import { Toast } from "@chaosfix/ui";
import type { Notification as NotificationData, NotificationType } from "../contexts/slices";

const AUTO_DISMISS_DURATION_MS = 5000;

interface NotificationProps {
  notification: NotificationData;
  onDismiss: (id: string) => void;
}

/**
 * Maps notification types to Toast variant types.
 */
function mapTypeToVariant(type: NotificationType): "info" | "success" | "error" {
  switch (type) {
    case "error": {
      return "error";
    }
    case "success": {
      return "success";
    }
    case "info":
    default: {
      return "info";
    }
  }
}

/**
 * Individual notification component that renders a Toast with auto-dismiss functionality.
 * Uses the Toast component from @chaosfix/ui for consistent styling.
 */
export const Notification: FC<NotificationProps> = ({ notification, onDismiss }) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDismiss = useCallback(() => {
    onDismiss(notification.id);
  }, [notification.id, onDismiss]);

  useEffect(() => {
    timeoutRef.current = setTimeout(handleDismiss, AUTO_DISMISS_DURATION_MS);

    return (): void => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleDismiss]);

  return (
    <Toast
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          handleDismiss();
        }
      }}
      title={notification.title ?? getDefaultTitle(notification.type)}
      description={notification.message}
      variant={mapTypeToVariant(notification.type)}
    />
  );
};

/**
 * Returns a default title based on notification type when no title is provided.
 */
function getDefaultTitle(type: NotificationType): string {
  switch (type) {
    case "error": {
      return "Error";
    }
    case "success": {
      return "Success";
    }
    case "info":
    default: {
      return "Info";
    }
  }
}
