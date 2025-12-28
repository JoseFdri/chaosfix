import type { BaseAction } from "./types";

/**
 * Binds action creators to a dispatch function.
 * Uses a generic dispatch type to work with combined reducers.
 *
 * @template TAction - The action type that the dispatch function accepts
 * @template T - The action creators object type
 * @param actions - Object containing action creator functions
 * @param dispatch - Dispatch function that accepts actions
 * @returns Object with bound action functions
 */
export function createBoundActions<
  TAction extends BaseAction,
  T extends Record<string, (...args: never[]) => TAction>,
>(
  actions: T,
  dispatch: (action: TAction) => void
): { [K in keyof T]: (...args: Parameters<T[K]>) => void } {
  const bound = {} as { [K in keyof T]: (...args: Parameters<T[K]>) => void };

  for (const key of Object.keys(actions)) {
    const typedKey = key as keyof T;
    const actionCreator = actions[typedKey] as T[keyof T];
    bound[typedKey] = ((...args: unknown[]) => {
      dispatch(actionCreator(...(args as Parameters<typeof actionCreator>)));
    }) as (typeof bound)[typeof typedKey];
  }

  return bound;
}
