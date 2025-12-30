import type { Slice } from "./types";

// State
export interface PersistenceState {
  isLoading: boolean;
  lastSaved: string | null;
  error: string | null;
}

// Actions
export type PersistenceAction =
  | { type: "persistence/setLoading"; payload: boolean }
  | { type: "persistence/setSaved"; payload: string }
  | { type: "persistence/setError"; payload: string | null };

// Initial state
const initialState: PersistenceState = {
  isLoading: false,
  lastSaved: null,
  error: null,
};

// Reducer
function reducer(state: PersistenceState, action: PersistenceAction): PersistenceState {
  switch (action.type) {
    case "persistence/setLoading": {
      return {
        ...state,
        isLoading: action.payload,
      };
    }

    case "persistence/setSaved": {
      return {
        ...state,
        lastSaved: action.payload,
        error: null,
      };
    }

    case "persistence/setError": {
      return {
        ...state,
        error: action.payload,
      };
    }

    default: {
      return state;
    }
  }
}

// Slice export
export const persistenceSlice: Slice<PersistenceState, PersistenceAction> = {
  name: "persistence",
  initialState,
  reducer,
};

// Action creators
export const persistenceActions = {
  setLoading: (isLoading: boolean): PersistenceAction => ({
    type: "persistence/setLoading",
    payload: isLoading,
  }),

  setSaved: (timestamp: string): PersistenceAction => ({
    type: "persistence/setSaved",
    payload: timestamp,
  }),

  setError: (error: string | null): PersistenceAction => ({
    type: "persistence/setError",
    payload: error,
  }),
};
