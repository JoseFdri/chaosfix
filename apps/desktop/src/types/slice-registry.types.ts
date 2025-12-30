import type { BaseAction, Slice } from "../renderer/contexts/slices/types";

/**
 * A registered slice bundling the slice definition with its action creators.
 * Used by the slice registry to auto-bind actions to dispatch.
 */
export interface RegisteredSlice<
  TState,
  TAction extends BaseAction,
  TActions extends Record<string, (...args: never[]) => TAction>,
> {
  slice: Slice<TState, TAction>;
  actions: TActions;
}

/**
 * Helper type to extract the state type from a registered slice.
 */
export type ExtractRegisteredState<T> =
  T extends RegisteredSlice<infer S, infer _TAction, infer _TActions> ? S : never;

/**
 * Helper type to extract the action type from a registered slice.
 */
export type ExtractRegisteredAction<T> =
  T extends RegisteredSlice<unknown, infer A, infer _TActions> ? A : never;

/**
 * Helper type to extract the actions object type from a registered slice.
 */
export type ExtractRegisteredActions<T> =
  T extends RegisteredSlice<unknown, BaseAction, infer A> ? A : never;
