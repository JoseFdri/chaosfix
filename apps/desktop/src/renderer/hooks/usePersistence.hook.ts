import { useEffect, useRef, useCallback } from "react";

import { DEFAULT_APP_PREFERENCES, type AppState } from "@chaosfix/config";
import type { SerializableState } from "../contexts/slices";

// Current app state version
const APP_STATE_VERSION = "1.0";

// Debounce delay for auto-save (milliseconds)
const SAVE_DEBOUNCE_MS = 1000;

export interface UsePersistenceOptions {
  repositories: unknown[];
  workspaces: unknown[];
  hydrateState: (appState: AppState) => void;
  getSerializableState: () => SerializableState;
  setPersistenceLoading: (isLoading: boolean) => void;
  setPersistenceSaved: (timestamp: string) => void;
  setPersistenceError: (error: string | null) => void;
}

/**
 * Custom hook that manages state persistence.
 * - Loads state from disk on mount and hydrates the app state
 * - Debounces saves to disk when state changes
 */
export function usePersistence({
  repositories,
  workspaces,
  hydrateState,
  getSerializableState,
  setPersistenceLoading,
  setPersistenceSaved,
  setPersistenceError,
}: UsePersistenceOptions): void {
  // Track whether initial hydration is complete (prevents saving during initial load)
  const isHydratedRef = useRef(false);
  // Track debounce timer
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track if component is mounted (prevents state updates after unmount)
  const isMountedRef = useRef(true);

  // Load state on mount
  useEffect(() => {
    const loadState = async (): Promise<void> => {
      setPersistenceLoading(true);
      setPersistenceError(null);

      try {
        const loadedState = await window.state.load();

        if (!isMountedRef.current) {
          return;
        }

        if (loadedState) {
          hydrateState(loadedState);
        }

        isHydratedRef.current = true;
        setPersistenceLoading(false);
      } catch (error) {
        if (!isMountedRef.current) {
          return;
        }

        const errorMessage = error instanceof Error ? error.message : "Failed to load state";
        setPersistenceError(errorMessage);
        setPersistenceLoading(false);
        isHydratedRef.current = true;
      }
    };

    loadState();

    return (): void => {
      isMountedRef.current = false;
    };
  }, [hydrateState, setPersistenceLoading, setPersistenceError]);

  // Debounced save function
  const debouncedSave = useCallback((): void => {
    // Clear any existing timer
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(async () => {
      if (!isMountedRef.current) {
        return;
      }

      try {
        const serializableState = getSerializableState();
        const appState: AppState = {
          version: APP_STATE_VERSION,
          repositories: serializableState.repositories,
          workspaces: serializableState.workspaces,
          activeWorkspaceId: serializableState.activeWorkspaceId,
          preferences: DEFAULT_APP_PREFERENCES,
        };

        const success = await window.state.save(appState);

        if (!isMountedRef.current) {
          return;
        }

        if (success) {
          setPersistenceSaved(new Date().toISOString());
          setPersistenceError(null);
        } else {
          setPersistenceError("Failed to save state");
        }
      } catch (error) {
        if (!isMountedRef.current) {
          return;
        }

        const errorMessage = error instanceof Error ? error.message : "Failed to save state";
        setPersistenceError(errorMessage);
      }
    }, SAVE_DEBOUNCE_MS);
  }, [getSerializableState, setPersistenceSaved, setPersistenceError]);

  // Watch for state changes and trigger debounced save
  useEffect(() => {
    // Skip saving if not yet hydrated (prevents saving initial/empty state)
    if (!isHydratedRef.current) {
      return;
    }

    debouncedSave();

    return (): void => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [repositories, workspaces, debouncedSave]);
}
