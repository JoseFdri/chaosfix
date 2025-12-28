import type { BaseAction } from "./types";

/**
 * Generic slice interface that works with any state/action types.
 */
type AnySlice = {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialState: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reducer: (state: any, action: any) => any;
};

/**
 * Extract state type from a slice.
 */
type InferState<T> = T extends { initialState: infer S } ? S : never;

/**
 * Combines multiple slices into a single reducer and initial state.
 *
 * Each slice handles its own portion of the state tree, and the combined
 * reducer dispatches actions to all slice reducers.
 *
 * @example
 * ```ts
 * const { reducer, initialState } = combineSlices({
 *   repositories: repositoriesSlice,
 *   workspaces: workspacesSlice,
 *   ui: uiSlice,
 * });
 * ```
 */
export function combineSlices<TSlices extends Record<string, AnySlice>>(
  slices: TSlices
): {
  initialState: { [K in keyof TSlices]: InferState<TSlices[K]> };
  reducer: (
    state: { [K in keyof TSlices]: InferState<TSlices[K]> },
    action: BaseAction
  ) => { [K in keyof TSlices]: InferState<TSlices[K]> };
} {
  type CombinedState = { [K in keyof TSlices]: InferState<TSlices[K]> };

  const sliceEntries = Object.entries(slices);

  // Build initial state from all slices
  const initialState = {} as CombinedState;
  for (const [key, slice] of sliceEntries) {
    (initialState as Record<string, unknown>)[key] = slice.initialState;
  }

  // Combined reducer that dispatches to all slice reducers
  const reducer = (state: CombinedState, action: BaseAction): CombinedState => {
    let hasChanged = false;
    const nextState = {} as CombinedState;

    for (const [key, slice] of sliceEntries) {
      const previousStateForKey = (state as Record<string, unknown>)[key];
      const nextStateForKey = slice.reducer(previousStateForKey, action);

      (nextState as Record<string, unknown>)[key] = nextStateForKey;

      if (nextStateForKey !== previousStateForKey) {
        hasChanged = true;
      }
    }

    return hasChanged ? nextState : state;
  };

  return { initialState, reducer };
}
