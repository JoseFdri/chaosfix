# Contexts Architecture Guide

This document provides guidelines for creating and managing React contexts in the desktop application.

## Slice-Based Architecture

The app uses a **slice-based reducer pattern** similar to Redux Toolkit but built on React's `useReducer`. Each domain has its own slice file that encapsulates:

- State shape
- Action types
- Reducer logic
- Action creators

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

### 3. Integrate with App Context

Update `app-context.tsx`:

1. Import the new slice, action creators, and action type from `./slices`
2. Add to `combineSlices()` call
3. Add the action type to `AppAction` union (e.g., `| {Domain}Action`)
4. Add bound actions using `createBoundActions` in a `useMemo`
5. Add action methods to `AppContextValue` interface
6. Map bound actions to context value

## Naming Conventions

- **Action types**: Use `{domain}/{actionName}` format (e.g., `"workspaces/add"`)
- **Slice files**: Use `{domain}.slice.ts` naming (e.g., `workspaces.slice.ts`)
- **State interfaces**: Use `{Domain}State` (e.g., `WorkspacesState`)
- **Action types**: Use `{Domain}Action` (e.g., `WorkspacesAction`)
- **Action creators object**: Use `{domain}Actions` (e.g., `workspacesActions`)

## Cross-Slice Logic

When actions need to affect multiple slices (e.g., removing a repository also removes its workspaces), handle this in the wrapper reducer in `app-context.tsx`:

```typescript
function appReducer(state: CombinedState, action: AppAction): CombinedState {
  // Handle cross-slice actions
  if (action.type === "repositories/remove") {
    const repositoryId = action.payload;
    const stateWithoutWorkspaces = combinedReducer(
      state,
      workspacesActions.removeByRepository(repositoryId)
    );
    return combinedReducer(stateWithoutWorkspaces, action);
  }

  return combinedReducer(state, action);
}
```

## Best Practices

1. **Single Responsibility**: Each slice manages one domain of state
2. **Immutable Updates**: Always return new state objects
3. **Action Creators**: Always use action creators instead of inline action objects
4. **Type Safety**: Export and use proper TypeScript types
5. **Bound Actions**: Use `createBoundActions` helper from `slices/bind-actions.ts` to bind slice actions to dispatch
6. **Default Case**: Always include a default case that returns unchanged state
7. **Constants**: Define magic numbers and default values in `slices/constants.ts` using UPPER_SNAKE_CASE

## When to Create a New Slice

Create a new slice when:

- Adding a new domain of state (e.g., notifications, settings, themes)
- State has 3+ related properties
- State has dedicated actions that don't belong to existing slices

Do NOT create a new slice when:

- Adding a single property to existing state
- The state logically belongs to an existing domain
