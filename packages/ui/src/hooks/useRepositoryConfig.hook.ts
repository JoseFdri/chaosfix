import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Source of the loaded configuration
 */
export type ConfigSource = "repo" | "app" | "default";

/**
 * Result from loading repository configuration
 */
interface LoadConfigResult {
  config: Record<string, unknown>;
  source: ConfigSource;
}

/**
 * Result from saving repository configuration
 */
interface SaveConfigResult {
  success: boolean;
  location: ConfigSource;
  error?: string;
}

/**
 * Repository Config API interface for type-safe window access.
 * This mirrors the RepositoryConfigAPI from the desktop app.
 */
interface RepositoryConfigAPI {
  load: (options: { repositoryId: string; repositoryPath: string }) => Promise<LoadConfigResult>;
  save: (options: {
    repositoryId: string;
    repositoryPath: string;
    config: Record<string, unknown>;
    saveToRepo?: boolean;
  }) => Promise<SaveConfigResult>;
}

/**
 * Type guard to check if window.repositoryConfig is available
 */
function hasRepositoryConfigAPI(
  win: Window & typeof globalThis
): win is Window & typeof globalThis & { repositoryConfig: RepositoryConfigAPI } {
  return (
    "repositoryConfig" in win &&
    win.repositoryConfig !== null &&
    typeof win.repositoryConfig === "object" &&
    "load" in win.repositoryConfig &&
    "save" in win.repositoryConfig
  );
}

export interface UseRepositoryConfigOptions {
  repositoryId: string;
  repositoryPath: string;
  open: boolean;
  /** Whether to save config to repo. Defaults to true. */
  saveToRepo?: boolean;
}

export interface UseRepositoryConfigReturn {
  config: string;
  source: ConfigSource;
  isLoading: boolean;
  error: string | null;
  isDirty: boolean;
  isSaving: boolean;
  isValid: boolean;
  save: () => Promise<boolean>;
  setConfig: (config: string) => void;
  setIsValid: (isValid: boolean) => void;
}

/**
 * Hook for loading and saving repository configuration via IPC
 */
export function useRepositoryConfig({
  repositoryId,
  repositoryPath,
  open,
  saveToRepo = true,
}: UseRepositoryConfigOptions): UseRepositoryConfigReturn {
  const [config, setConfigState] = useState<string>("");
  const [originalConfig, setOriginalConfig] = useState<string>("");
  const [source, setSource] = useState<ConfigSource>("default");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const hasLoadedRef = useRef(false);
  const loadingRepositoryIdRef = useRef<string | null>(null);

  const isDirty = config !== originalConfig;

  const loadConfig = useCallback(async (): Promise<void> => {
    if (!repositoryId || !repositoryPath) {
      return;
    }

    if (typeof window === "undefined" || !hasRepositoryConfigAPI(window)) {
      setError("Repository config API not available");
      setIsLoading(false);
      return;
    }

    if (loadingRepositoryIdRef.current === repositoryId) {
      return;
    }

    loadingRepositoryIdRef.current = repositoryId;
    setIsLoading(true);
    setError(null);

    try {
      const result = await window.repositoryConfig.load({
        repositoryId,
        repositoryPath,
      });

      const configString = JSON.stringify(result.config, null, 2);
      setConfigState(configString);
      setOriginalConfig(configString);
      setSource(result.source);
      hasLoadedRef.current = true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load configuration";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      loadingRepositoryIdRef.current = null;
    }
  }, [repositoryId, repositoryPath]);

  const setConfig = useCallback((newConfig: string): void => {
    setConfigState(newConfig);
    setError(null);
  }, []);

  const save = useCallback(async (): Promise<boolean> => {
    if (!repositoryId || !repositoryPath || !isValid || !isDirty) {
      return false;
    }

    if (typeof window === "undefined" || !hasRepositoryConfigAPI(window)) {
      setError("Repository config API not available");
      return false;
    }

    setIsSaving(true);
    setError(null);

    try {
      const parsedConfig = JSON.parse(config) as Record<string, unknown>;
      const result = await window.repositoryConfig.save({
        repositoryId,
        repositoryPath,
        config: parsedConfig,
        saveToRepo,
      });

      if (result.success) {
        setOriginalConfig(config);
        setSource(result.location);
        return true;
      }

      setError(result.error || "Failed to save configuration");
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save configuration";
      setError(errorMessage);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [repositoryId, repositoryPath, config, isValid, isDirty, saveToRepo]);

  useEffect(() => {
    if (open && !hasLoadedRef.current) {
      void loadConfig();
    }
  }, [open, loadConfig]);

  useEffect(() => {
    hasLoadedRef.current = false;
    setConfigState("");
    setOriginalConfig("");
    setSource("default");
    setError(null);
    setIsValid(true);
  }, [repositoryId]);

  return {
    config,
    source,
    isLoading,
    error,
    isDirty,
    isSaving,
    isValid,
    save,
    setConfig,
    setIsValid,
  };
}
