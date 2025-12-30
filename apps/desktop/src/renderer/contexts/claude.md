# Contexts Architecture Guide

This document provides guidelines for creating and managing React contexts in the desktop application.

## Slice-Based Architecture

The app uses a **slice-based reducer pattern** similar to Redux Toolkit but built on React's `useReducer`. Each domain has its own slice file that encapsulates:

- State shape
- Action types
- Reducer logic
- Action creators

### Auto-Registration via Slice Registry

Slices are automatically discovered and bound to dispatch through the **slice registry** (`slices/registry.ts`). This eliminates manual wiring in `app-context.tsx`.

## Creating a New Slice

When adding new state management, create a new slice file in `slices/`:

### 1. Create the Slice File

Create `slices/{domain}.slice.ts` following this template:

```typescript
import type { Slice } from "./types";

// State
export interface {Domain}State {
  // Define state shape
}

// Actions - use domain-prefixed action types
export type {Domain}Action =
  | { type: "{domain}/actionOne"; payload: PayloadType }
  | { type: "{domain}/actionTwo"; payload: AnotherPayloadType };

// Initial state
const initialState: {Domain}State = {
  // Default values
};

// Reducer
function reducer(state: {Domain}State, action: {Domain}Action): {Domain}State {
  switch (action.type) {
    case "{domain}/actionOne": {
      return { ...state, /* updates */ };
    }
    // Handle other actions...
    default: {
      return state;
    }
  }
}

// Slice export
export const {domain}Slice: Slice<{Domain}State, {Domain}Action> = {
  name: "{domain}",
  initialState,
  reducer,
};

// Action creators
export const {domain}Actions = {
  actionOne: (payload: PayloadType): {Domain}Action => ({
    type: "{domain}/actionOne",
    payload,
  }),
  // Other action creators...
};
```

### 2. Export from Index

Add exports to `slices/index.ts`:

```typescript
export {
  {domain}Slice,
  {domain}Actions,
  type {Domain}State,
  type {Domain}Action,
} from "./{domain}.slice";
```

### 3. Register in Slice Registry

Add the slice to `slices/registry.ts`:

```typescript
import { {domain}Slice, {domain}Actions } from "./{domain}.slice";

export const sliceRegistry = {
  // ...existing slices
  {domain}: createRegisteredSlice({domain}Slice, {domain}Actions),
} as const;
```

That's it! The slice is now automatically:

- Combined into the app state
- Action creators bound to dispatch
- Available via `useApp()` hook as `{domain}.actionOne()`, etc.

### 4. Update useApp Hook Types (Optional)

If you want explicit typing in `app-context.tsx`, add the action interface:

```typescript
interface {Domain}Actions {
  actionOne: (payload: PayloadType) => void;
  // ...other actions
}
```

And add to `UseAppReturn`:

```typescript
interface UseAppReturn {
  // ...existing
  {domain}: {Domain}Actions;
}
```

## Naming Conventions

- **Action types**: Use `{domain}/{actionName}` format (e.g., `"workspaces/add"`)
- **Slice files**: Use `{domain}.slice.ts` naming (e.g., `workspaces.slice.ts`)
- **State interfaces**: Use `{Domain}State` (e.g., `WorkspacesState`)
- **Action types**: Use `{Domain}Action` (e.g., `WorkspacesAction`)
- **Action creators object**: Use `{domain}Actions` (e.g., `workspacesActions`)

## Cross-Slice Logic

When actions need to affect multiple slices (e.g., removing a repository also removes its workspaces), handle this in the `createWrapReducer` function in `app-context.tsx`:

```typescript
function createWrapReducer<TState extends AppCombinedState, TAction extends BaseAction>(
  baseReducer: (state: TState, action: TAction) => TState
) {
  return (state: TState, action: BaseAction): TState => {
    // Handle cross-slice actions
    if (action.type === "repositories/remove") {
      const repositoryId = (action as { type: string; payload: string }).payload;
      const stateWithoutWorkspaces = baseReducer(
        state,
        workspacesActions.removeByRepository(repositoryId) as unknown as TAction
      );
      return baseReducer(stateWithoutWorkspaces, action as unknown as TAction);
    }

    return baseReducer(state, action as unknown as TAction);
  };
}
```

## Best Practices

1. **Single Responsibility**: Each slice manages one domain of state
2. **Immutable Updates**: Always return new state objects
3. **Action Creators**: Always use action creators instead of inline action objects
4. **Type Safety**: Export and use proper TypeScript types
5. **Registry Pattern**: Register slices in `registry.ts` for automatic binding
6. **Default Case**: Always include a default case that returns unchanged state
7. **Constants**: Define magic numbers and default values in `slices/constants.ts` using UPPER_SNAKE_CASE

## Key Files

- `slices/registry.ts` - Central slice registry for auto-binding
- `slices/create-app-context.tsx` - Factory function that creates context from registry
- `app-context.tsx` - App-specific context with cross-slice logic and typed `useApp` hook
- `slices/bind-actions.ts` - Utility to bind action creators to dispatch
- `types/slice-registry.types.ts` - Type definitions for the registry pattern

## When to Create a New Slice

Create a new slice when:

- Adding a new domain of state (e.g., notifications, settings, themes)
- State has 3+ related properties
- State has dedicated actions that don't belong to existing slices

Do NOT create a new slice when:

- Adding a single property to existing state
- The state logically belongs to an existing domain
