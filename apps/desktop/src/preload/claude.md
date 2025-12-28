# Preload Directory Guidelines

This directory contains the Electron preload scripts that expose safe APIs to the renderer process via `contextBridge`.

## Directory Structure

```
preload/
├── index.ts          # Main entry - imports and exposes all APIs
├── types.ts          # Shared types, interfaces, and global declarations
├── terminal-api.ts   # Terminal/PTY API implementation
├── dialog-api.ts     # Dialog API implementation
└── claude.md         # This file - guidelines for development
```

## Architecture Rules

### 1. File Organization

- **Keep files focused**: Each API should have its own dedicated file (e.g., `*-api.ts`)
- **Maximum file size**: Files should not exceed 100 lines; split if larger
- **Single responsibility**: Each file handles one API domain only

### 2. Adding a New API

When adding a new API to expose to the renderer:

1. **Create types in `types.ts`**:
   - Define the API interface (e.g., `NewFeatureAPI`)
   - Define any payload/result types
   - Add to the global `Window` interface declaration

2. **Create the API file** (e.g., `new-feature-api.ts`):
   - Import `ipcRenderer` from electron
   - Import IPC channels from `@chaosfix/core`
   - Import types from `./types`
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

import type { NewFeatureAPI } from "./types";

export function createNewFeatureAPI(): NewFeatureAPI {
  return {
    methodName: (param: ParamType): Promise<ResultType> => {
      return ipcRenderer.invoke(NEW_FEATURE_IPC_CHANNELS.METHOD, param);
    },
  };
}
```

#### Type Additions Template (add to `types.ts`)

```typescript
export interface NewFeatureAPI {
  methodName: (param: ParamType) => Promise<ResultType>;
}

// Add to global Window interface
declare global {
  interface Window {
    newFeature: NewFeatureAPI;
  }
}
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
- No inline type definitions - all types go in `types.ts`
- No business logic - preload only bridges main and renderer
- No console.log statements - remove before committing
