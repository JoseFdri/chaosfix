import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  type ReactNode,
  type Dispatch,
} from "react";
import { createBoundActions } from "./bind-actions";
import type { BaseAction } from "./types";
import type {
  RegisteredSlice,
  ExtractRegisteredState,
  ExtractRegisteredAction,
  ExtractRegisteredActions,
} from "../../../types/slice-registry.types";

/**
 * Base registry constraint type.
 * Uses 'any' for state and action to avoid TypeScript variance issues with reducer parameters.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRegisteredSlice = RegisteredSlice<any, any, Record<string, (...args: any[]) => any>>;

/**
 * Combined state type from a registry.
 * Maps each registry key to its slice's state type.
 */
type CombinedState<TRegistry extends Record<string, AnyRegisteredSlice>> = {
  [K in keyof TRegistry]: ExtractRegisteredState<TRegistry[K]>;
};

/**
 * Combined action type from a registry.
 * Union of all slice action types.
 */
type CombinedAction<TRegistry extends Record<string, AnyRegisteredSlice>> = {
  [K in keyof TRegistry]: ExtractRegisteredAction<TRegistry[K]>;
}[keyof TRegistry];

/**
 * Bound actions type from a registry.
 * Maps each registry key to its bound action functions.
 */
type BoundActions<TRegistry extends Record<string, AnyRegisteredSlice>> = {
  [K in keyof TRegistry]: {
    [A in keyof ExtractRegisteredActions<TRegistry[K]>]: ExtractRegisteredActions<
      TRegistry[K]
    >[A] extends (...args: infer P) => unknown
      ? (...args: P) => void
      : never;
  };
};

/**
 * Context value combining state and bound actions.
 */
type ContextValue<TRegistry extends Record<string, AnyRegisteredSlice>> = {
  state: CombinedState<TRegistry>;
  dispatch: Dispatch<CombinedAction<TRegistry>>;
} & BoundActions<TRegistry>;

/**
 * Options for creating an app context.
 */
interface CreateAppContextOptions<TRegistry extends Record<string, AnyRegisteredSlice>> {
  /**
   * Optional wrapper for the base reducer to handle cross-slice logic.
   * Receives the base reducer and should return a wrapped reducer.
   */
  wrapReducer?: (
    baseReducer: (
      state: CombinedState<TRegistry>,
      action: CombinedAction<TRegistry>
    ) => CombinedState<TRegistry>
  ) => (state: CombinedState<TRegistry>, action: BaseAction) => CombinedState<TRegistry>;
}

/**
 * Return type for createAppContext function.
 */
interface CreateAppContextResult<TRegistry extends Record<string, AnyRegisteredSlice>> {
  Provider: ({ children }: { children: ReactNode }) => JSX.Element;
  useAppContext: () => ContextValue<TRegistry>;
  initialState: CombinedState<TRegistry>;
  reducer: (
    state: CombinedState<TRegistry>,
    action: CombinedAction<TRegistry> | BaseAction
  ) => CombinedState<TRegistry>;
  Context: React.Context<ContextValue<TRegistry> | undefined>;
}

/**
 * Creates a complete React context system from a slice registry.
 * Automatically combines slices, binds actions, and generates types.
 *
 * @param registry - The slice registry containing all slices and their actions
 * @param options - Optional configuration for the context
 * @returns Provider component, hook, and utilities
 */
export function createAppContext<TRegistry extends Record<string, AnyRegisteredSlice>>(
  registry: TRegistry,
  options?: CreateAppContextOptions<TRegistry>
): CreateAppContextResult<TRegistry> {
  // Build initial state from registry
  const initialState = Object.fromEntries(
    Object.entries(registry).map(([key, { slice }]) => [key, slice.initialState])
  ) as CombinedState<TRegistry>;

  // Build combined reducer
  const baseReducer = (
    state: CombinedState<TRegistry>,
    action: CombinedAction<TRegistry>
  ): CombinedState<TRegistry> => {
    let hasChanged = false;
    const newState = {} as CombinedState<TRegistry>;

    for (const [key, { slice }] of Object.entries(registry)) {
      const typedKey = key as keyof TRegistry;
      const prevSliceState = state[typedKey];
      const nextSliceState = slice.reducer(prevSliceState, action);
      newState[typedKey] = nextSliceState as CombinedState<TRegistry>[typeof typedKey];
      if (nextSliceState !== prevSliceState) {
        hasChanged = true;
      }
    }

    return hasChanged ? newState : state;
  };

  // The reducer type is a union because wrapReducer may return a reducer that accepts BaseAction
  // while baseReducer only accepts CombinedAction. Both are valid at runtime.
  const reducer = (options?.wrapReducer?.(baseReducer) ?? baseReducer) as (
    state: CombinedState<TRegistry>,
    action: CombinedAction<TRegistry> | BaseAction
  ) => CombinedState<TRegistry>;

  // Create context
  const Context = createContext<ContextValue<TRegistry> | undefined>(undefined);

  // Provider component
  function Provider({ children }: { children: ReactNode }): JSX.Element {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Bind all actions from registry - stable reference since registry and dispatch don't change
    // Note: dispatch from useReducer is guaranteed stable, but included for exhaustive deps
    const boundActions = useMemo(() => {
      const result = {} as BoundActions<TRegistry>;
      for (const [key, { actions }] of Object.entries(registry)) {
        const typedKey = key as keyof TRegistry;
        result[typedKey] = createBoundActions(
          actions,
          dispatch as Dispatch<BaseAction>
        ) as BoundActions<TRegistry>[typeof typedKey];
      }
      return result;
    }, [dispatch]);

    const value = useMemo(
      (): ContextValue<TRegistry> => ({
        state,
        dispatch,
        ...boundActions,
      }),
      [state, dispatch, boundActions]
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  // Hook
  function useAppContext(): ContextValue<TRegistry> {
    const context = useContext(Context);
    if (context === undefined) {
      throw new Error("useAppContext must be used within a Provider");
    }
    return context;
  }

  return {
    Provider,
    useAppContext,
    initialState,
    reducer,
    Context,
  };
}
