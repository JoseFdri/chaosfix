import { DEFAULT_SIDEBAR_WIDTH } from "./constants";
import type { Slice } from "./types";

// State
export interface UIState {
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  searchQuery: string;
}

// Actions
export type UIAction =
  | { type: "ui/toggleSidebar" }
  | { type: "ui/setSidebarWidth"; payload: number }
  | { type: "ui/setSearchQuery"; payload: string };

// Initial state
const initialState: UIState = {
  sidebarCollapsed: false,
  sidebarWidth: DEFAULT_SIDEBAR_WIDTH,
  searchQuery: "",
};

// Reducer
function reducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case "ui/toggleSidebar": {
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed,
      };
    }

    case "ui/setSidebarWidth": {
      return {
        ...state,
        sidebarWidth: action.payload,
      };
    }

    case "ui/setSearchQuery": {
      return {
        ...state,
        searchQuery: action.payload,
      };
    }

    default: {
      return state;
    }
  }
}

// Slice export
export const uiSlice: Slice<UIState, UIAction> = {
  name: "ui",
  initialState,
  reducer,
};

// Action creators
export const uiActions = {
  toggleSidebar: (): UIAction => ({
    type: "ui/toggleSidebar",
  }),

  setSidebarWidth: (width: number): UIAction => ({
    type: "ui/setSidebarWidth",
    payload: width,
  }),

  setSearchQuery: (query: string): UIAction => ({
    type: "ui/setSearchQuery",
    payload: query,
  }),
};
