import { repositoriesSlice, repositoriesActions } from "./repositories.slice";
import { workspacesSlice, workspacesActions } from "./workspaces.slice";
import { uiSlice, uiActions } from "./ui.slice";
import { persistenceSlice, persistenceActions } from "./persistence.slice";
import { preferencesSlice, preferencesActions } from "./preferences.slice";
import type { BaseAction, Slice } from "./types";
import type { RegisteredSlice } from "../../../types/slice-registry.types";

/**
 * Helper to create a type-safe registered slice entry.
 * Bundles a slice with its action creators for the registry.
 */
export function createRegisteredSlice<
  TState,
  TAction extends BaseAction,
  TActions extends Record<string, (...args: never[]) => TAction>,
>(slice: Slice<TState, TAction>, actions: TActions): RegisteredSlice<TState, TAction, TActions> {
  return { slice, actions };
}

/**
 * Central registry of all application slices.
 * This is the single source of truth for state management.
 *
 * To add a new slice:
 * 1. Create the slice file (e.g., my-domain.slice.ts)
 * 2. Add it here: myDomain: createRegisteredSlice(myDomainSlice, myDomainActions),
 */
export const sliceRegistry = {
  repositories: createRegisteredSlice(repositoriesSlice, repositoriesActions),
  workspaces: createRegisteredSlice(workspacesSlice, workspacesActions),
  ui: createRegisteredSlice(uiSlice, uiActions),
  persistence: createRegisteredSlice(persistenceSlice, persistenceActions),
  preferences: createRegisteredSlice(preferencesSlice, preferencesActions),
} as const;

/**
 * Type representing the complete slice registry.
 * Used for type inference in the context factory.
 */
export type SliceRegistry = typeof sliceRegistry;
