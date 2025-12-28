# Main Process Architecture Guidelines

This directory contains the Electron main process code. Follow these guidelines to maintain clean, scalable architecture.

## Directory Structure

```
src/main/
├── index.ts           # Entry point - orchestration only, minimal code
├── window.ts          # Window creation and configuration
├── app-lifecycle.ts   # App lifecycle event handlers
└── ipc/
    ├── index.ts       # IPC registration orchestrator
    ├── terminal.ts    # Terminal-related IPC handlers
    └── dialog.ts      # Dialog-related IPC handlers
```

## Core Principles

### 1. Single Responsibility

Each file should have ONE clear purpose:

- `index.ts` - Wire dependencies and start the app (no business logic)
- `window.ts` - Window creation and configuration only
- `ipc/*.ts` - Each file handles one category of IPC communication
- `app-lifecycle.ts` - App-level event handling

### 2. Dependency Injection

Pass dependencies explicitly rather than using global state:

```typescript
// GOOD - Dependencies passed explicitly
export function setupTerminalIPC(deps: TerminalIPCDependencies): void {
  const { getMainWindow, ptyManager } = deps;
  // ...
}

// BAD - Using global state
let mainWindow: BrowserWindow | null = null;
function setupTerminalIPC(): void {
  mainWindow?.webContents.send(...); // Direct global access
}
```

### 3. Getter Functions for Mutable State

When passing references to mutable state (like `mainWindow`), use getter functions:

```typescript
// GOOD - Getter function ensures current value
setupAllIPC({
  getMainWindow: () => mainWindow,
  ptyManager,
});

// BAD - Passes stale reference
setupAllIPC({
  mainWindow, // Will be null at setup time!
  ptyManager,
});
```

## Adding New IPC Handlers

1. Create a new file in `ipc/` directory (e.g., `ipc/file-system.ts`)
2. Define a dependencies interface
3. Export a setup function that takes dependencies
4. Register in `ipc/index.ts`

Example:

```typescript
// ipc/file-system.ts
export interface FileSystemIPCDependencies {
  getMainWindow: () => BrowserWindow | null;
}

export function setupFileSystemIPC(deps: FileSystemIPCDependencies): void {
  ipcMain.handle(FILE_SYSTEM_CHANNELS.READ, async (_event, path: string) => {
    // Implementation
  });
}
```

Then register in `ipc/index.ts`:

```typescript
export function setupAllIPC(deps: IPCDependencies): void {
  setupTerminalIPC({ ... });
  setupDialogIPC({ ... });
  setupFileSystemIPC({ getMainWindow: deps.getMainWindow }); // Add new handler
}
```

## File Size Guidelines

- `index.ts` should stay under 50 lines
- Individual IPC handler files should stay under 100 lines
- If a file grows beyond these limits, consider splitting it further

## Testing Considerations

The dependency injection pattern makes testing easier:

- Mock `getMainWindow` to return a fake BrowserWindow
- Mock `ptyManager` to test terminal handlers in isolation
- Each IPC module can be unit tested independently
