/**
 * Slice type definitions for the modular reducer pattern.
 *
 * A slice represents a self-contained piece of state with its own:
 * - State shape
 * - Action types
 * - Reducer logic
 * - Action creators
 */

/**
 * Base action type that all slice actions must extend.
 */
export interface BaseAction {
  type: string;
}

/**
 * Defines a state slice with its reducer and initial state.
 *
 * @template TState - The shape of the slice's state
 * @template TAction - The union of action types this slice handles
 */
export interface Slice<TState, TAction extends BaseAction> {
  name: string;
  initialState: TState;
  reducer: (state: TState, action: TAction) => TState;
}

/**
 * Helper type to extract state from a slice.
 */
export type SliceState<T> = T extends Slice<infer S, BaseAction> ? S : never;

/**
 * Helper type to extract actions from a slice.
 */
export type SliceActions<T> = T extends Slice<unknown, infer A> ? A : never;
