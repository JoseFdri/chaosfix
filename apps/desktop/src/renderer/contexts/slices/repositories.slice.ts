import type { Repository } from "@chaosfix/core";
import type { Slice } from "./types";

// State
export interface RepositoriesState {
  repositories: Repository[];
}

// Actions
export type RepositoriesAction =
  | { type: "repositories/add"; payload: Repository }
  | { type: "repositories/remove"; payload: string }
  | { type: "repositories/update"; payload: { id: string; updates: Partial<Repository> } };

// Initial state
const initialState: RepositoriesState = {
  repositories: [],
};

// Reducer
function reducer(state: RepositoriesState, action: RepositoriesAction): RepositoriesState {
  switch (action.type) {
    case "repositories/add": {
      return {
        ...state,
        repositories: [...state.repositories, action.payload],
      };
    }

    case "repositories/remove": {
      return {
        ...state,
        repositories: state.repositories.filter((r) => r.id !== action.payload),
      };
    }

    case "repositories/update": {
      const { id, updates } = action.payload;
      return {
        ...state,
        repositories: state.repositories.map((r) => (r.id === id ? { ...r, ...updates } : r)),
      };
    }

    default: {
      return state;
    }
  }
}

// Slice export
export const repositoriesSlice: Slice<RepositoriesState, RepositoriesAction> = {
  name: "repositories",
  initialState,
  reducer,
};

// Action creators
export const repositoriesActions = {
  add: (repository: Repository): RepositoriesAction => ({
    type: "repositories/add",
    payload: repository,
  }),

  remove: (repositoryId: string): RepositoriesAction => ({
    type: "repositories/remove",
    payload: repositoryId,
  }),

  update: (id: string, updates: Partial<Repository>): RepositoriesAction => ({
    type: "repositories/update",
    payload: { id, updates },
  }),
};
