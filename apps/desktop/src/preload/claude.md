# Preload Directory Guidelines

This directory contains the Electron preload scripts that expose safe APIs to the renderer process via `contextBridge`.

## Directory Structure

```
preload/
├── index.ts          # Main entry - imports and exposes all APIs
├── terminal-api.ts   # Terminal/PTY API implementation
├── dialog-api.ts     # Dialog API implementation
├── state-api.ts      # State persistence API implementation
├── workspace-api.ts  # Workspace/git API implementation
└── claude.md         # This file - guidelines for development

../types/             # Shared types directory (outside preload)
├── index.ts          # Re-exports all types
├── terminal.types.ts # Terminal/PTY types
├── dialog.types.ts   # Dialog types
├── state.types.ts    # State API types
├── workspace.types.ts# Workspace API types
├── ipc.types.ts      # IPC handler types
└── window.types.ts   # Global Window declarations
```

## Architecture Rules

### 1. File Organization

- **Keep files focused**: Each API should have its own dedicated file (e.g., `*-api.ts`)
- **Maximum file size**: Files should not exceed 100 lines; split if larger
- **Single responsibility**: Each file handles one API domain only

### 2. Adding a New API

When adding a new API to expose to the renderer:

1. **Create types in `../types/`**:
   - Create a new `new-feature.types.ts` file for the API types
   - Define the API interface (e.g., `NewFeatureAPI`)
   - Define any payload/result types
   - Add to `window.types.ts` global `Window` interface declaration
   - Export from `../types/index.ts`

2. **Create the API file** (e.g., `new-feature-api.ts`):
   - Import `ipcRenderer` from electron
   - Import IPC channels from `@chaosfix/core`
   - Import types from `../types`
   - Export a factory function `createNewFeatureAPI(): NewFeatureAPI`

3. **Register in `index.ts`**:
   - Import the factory function
   - Create the API instance
   - Expose via `contextBridge.exposeInMainWorld()`

### 3. File Templates

#### API File Template (`*-api.ts`)

```typescript
import { ipcRenderer } from "electron";
import { NEW_FEATURE_IPC_CHANNELS } from "@chaosfix/core";

import type { NewFeatureAPI } from "../types";

export function createNewFeatureAPI(): NewFeatureAPI {
  return {
    methodName: (param: ParamType): Promise<ResultType> => {
      return ipcRenderer.invoke(NEW_FEATURE_IPC_CHANNELS.METHOD, param);
    },
  };
}
```

#### Type File Template (`../types/new-feature.types.ts`)

```typescript
/**
 * Result from new feature operation
 */
export interface NewFeatureResult {
  // result fields
}

/**
 * NewFeature API exposed to renderer process
 */
export interface NewFeatureAPI {
  methodName: (param: ParamType) => Promise<NewFeatureResult>;
}
```

Then add to `../types/window.types.ts`:

```typescript
import type { NewFeatureAPI } from "./new-feature.types";

declare global {
  interface Window {
    newFeature: NewFeatureAPI;
  }
}
```

And export from `../types/index.ts`:

```typescript
export type * from "./new-feature.types";
```

### 4. Naming Conventions

- **Files**: Use kebab-case (e.g., `terminal-api.ts`)
- **Interfaces**: Use PascalCase with `API` suffix (e.g., `TerminalAPI`)
- **Factory functions**: Use `create*API` pattern (e.g., `createTerminalAPI`)
- **IPC event handlers**: Use `on*` prefix for event listeners (e.g., `onData`)

### 5. IPC Communication Patterns

- **Invoke (request/response)**: Use `ipcRenderer.invoke()` for async operations
- **Event listeners**: Use `ipcRenderer.on()` with cleanup return function
- **Always return cleanup**: Event listener methods must return an unsubscribe function

### 6. Type Safety

- All IPC payloads must have explicit types
- Use the `IpcEventHandler<T>` utility type for event handlers
- Global `Window` declarations must be updated for new APIs

### 7. Prohibited Practices

- No direct `require()` calls - use ES imports only
- No inline type definitions - all types go in `../types/` directory
- No business logic - preload only bridges main and renderer
- No console.log statements - remove before committing
