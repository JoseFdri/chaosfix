import { type FC } from "react";
import { ToastProvider, ToastViewport } from "@chaosfix/ui";
import { Notification } from "./Notification.component";
import { useApp } from "../contexts/app-context";

/**
 * Container component that renders all active notifications.
 * Positioned in the bottom-right corner of the screen.
 * Uses the ToastProvider from @chaosfix/ui for proper Radix Toast integration.
 */
export const NotificationContainer: FC = () => {
  const { state, notifications } = useApp();
  const { notifications: notificationList } = state.notifications;

  return (
    <ToastProvider>
      {notificationList.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onDismiss={notifications.remove}
        />
      ))}
      <ToastViewport />
    </ToastProvider>
  );
};
