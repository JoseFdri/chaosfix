import type { Slice } from "./types";

// Types
export type NotificationType = "error" | "success" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
}

// State
export interface NotificationsState {
  notifications: Notification[];
}

// Actions
export type NotificationsAction =
  | { type: "notifications/add"; payload: Notification }
  | { type: "notifications/remove"; payload: string }
  | { type: "notifications/clear" };

// Initial state
const initialState: NotificationsState = {
  notifications: [],
};

// Reducer
function reducer(state: NotificationsState, action: NotificationsAction): NotificationsState {
  switch (action.type) {
    case "notifications/add": {
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    }

    case "notifications/remove": {
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };
    }

    case "notifications/clear": {
      return {
        ...state,
        notifications: [],
      };
    }

    default: {
      return state;
    }
  }
}

// Slice export
export const notificationsSlice: Slice<NotificationsState, NotificationsAction> = {
  name: "notifications",
  initialState,
  reducer,
};

// Action creators
export const notificationsActions = {
  add: (notification: Omit<Notification, "id"> & { id?: string }): NotificationsAction => ({
    type: "notifications/add",
    payload: {
      ...notification,
      id: notification.id ?? Date.now().toString(),
    },
  }),

  remove: (id: string): NotificationsAction => ({
    type: "notifications/remove",
    payload: id,
  }),

  clear: (): NotificationsAction => ({
    type: "notifications/clear",
  }),
};
