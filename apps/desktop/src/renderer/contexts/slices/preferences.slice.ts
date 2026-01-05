import type { Slice } from "./types";

// Theme type matching @chaosfix/config preferences schema
export type Theme = "light" | "dark" | "system";

// State
export interface PreferencesState {
  theme: Theme;
}

// Actions
export type PreferencesAction = { type: "preferences/setTheme"; payload: Theme };

// Initial state - defaults to system preference
const initialState: PreferencesState = {
  theme: "system",
};

// Reducer
function reducer(state: PreferencesState, action: PreferencesAction): PreferencesState {
  switch (action.type) {
    case "preferences/setTheme": {
      return {
        ...state,
        theme: action.payload,
      };
    }

    default: {
      return state;
    }
  }
}

// Slice export
export const preferencesSlice: Slice<PreferencesState, PreferencesAction> = {
  name: "preferences",
  initialState,
  reducer,
};

// Action creators
export const preferencesActions = {
  setTheme: (theme: Theme): PreferencesAction => ({
    type: "preferences/setTheme",
    payload: theme,
  }),
};
