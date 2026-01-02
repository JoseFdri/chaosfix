# Terminal Architecture

This document describes the files responsible for terminal handling in the ChaosFix desktop application.

## Overview

The terminal system follows a split architecture where rendering happens in the renderer process using xterm.js and pseudo-terminal management happens in the main process using node-pty. Communication between processes uses typed IPC channels.

---

## Terminal Bridge Package

Located in packages/terminal-bridge/, this package provides the core terminal infrastructure shared between processes.

### Type Definitions

| File                        | Purpose                                                                    |
| --------------------------- | -------------------------------------------------------------------------- |
| src/types/pty.types.ts      | Defines PTY creation options and instance interface for node-pty           |
| src/types/terminal.types.ts | Defines xterm.js terminal configuration, theme, and controller interface   |
| src/types/ipc.types.ts      | Defines IPC channel constants for terminal communication between processes |
| src/types/index.ts          | Re-exports all type definitions from the types folder                      |

### Main Process Services

| File                                | Purpose                                                                                                        |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| src/services/pty-manager.service.ts | Central PTY lifecycle management using node-pty with methods for create, write, resize, and destroy operations |
| src/services/index.ts               | Exports the PTYManager class and singleton instance                                                            |

### Renderer Process Libraries

| File                             | Purpose                                                                                                  |
| -------------------------------- | -------------------------------------------------------------------------------------------------------- |
| src/libs/terminal-factory.lib.ts | Factory function that creates xterm.js terminal instances with addons for fitting, search, and web links |
| src/libs/index.ts                | Exports the terminal factory function                                                                    |

### Entry Points

| File            | Purpose                                                 |
| --------------- | ------------------------------------------------------- |
| src/index.ts    | Main process entry that exports services and types      |
| src/renderer.ts | Renderer process entry that exports libraries and types |

---

## Core Package Types

Located in packages/core/, these types define the domain model for terminal sessions.

| File                        | Purpose                                                                                                        |
| --------------------------- | -------------------------------------------------------------------------------------------------------------- |
| src/types/terminal.types.ts | Defines TerminalSession type with properties for id, workspaceId, pid, title, status, and createdAt            |
| src/types/ipc.types.ts      | Contains IPC channel constants for terminal, dialog, state, and workspace communication across the application |

---

## Desktop App Main Process

Located in apps/desktop/src/main/, these files handle terminal operations in Electron's main process.

| File            | Purpose                                                                                              |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| ipc/terminal.ts | Registers IPC handlers for terminal operations including create, write, resize, and destroy channels |
| ipc/index.ts    | Orchestrates all IPC setup and passes dependencies to terminal handlers                              |
| index.ts        | Application entry point that initializes the PTYManager singleton                                    |

---

## Desktop App Preload

Located in apps/desktop/src/preload/, these files expose terminal APIs to the renderer process safely.

| File            | Purpose                                                                       |
| --------------- | ----------------------------------------------------------------------------- |
| terminal-api.ts | Factory that creates the terminal API with invoke methods and event listeners |
| index.ts        | Exposes the terminal API via contextBridge as window.terminal                 |

---

## Desktop App Types

Located in apps/desktop/src/types/, these files define type contracts for the desktop application.

| File              | Purpose                                                               |
| ----------------- | --------------------------------------------------------------------- |
| terminal.types.ts | Defines TerminalAPI interface, PTY options, results, and event types  |
| window.types.ts   | Declares global Window interface extension for window.terminal access |

---

## Desktop App Renderer

Located in apps/desktop/src/renderer/, these files handle terminal UI rendering and state management.

### Components

| File                         | Purpose                                                                                                |
| ---------------------------- | ------------------------------------------------------------------------------------------------------ |
| components/terminal-view.tsx | React component that mounts xterm.js terminal in the DOM, accepting workspaceId and worktreePath props |

### Hooks

| File                        | Purpose                                                                                                                |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| hooks/use-terminal.ts       | Custom hook managing complete terminal lifecycle including creation, input/output wiring, resize handling, and cleanup |
| hooks/use-workspace-tabs.ts | Custom hook managing terminal tabs UI with selection, closure, and creation                                            |
| hooks/index.ts              | Exports all renderer hooks                                                                                             |

### State Management

| File                                | Purpose                                                                                                                                                                                |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| contexts/slices/workspaces.slice.ts | State slice managing terminal sessions within workspaces with actions for add, remove, setActive, updateStatus, addTerminal, removeTerminal, setActiveTerminal, and removeByRepository |

### App Integration

| File    | Purpose                                                                                  |
| ------- | ---------------------------------------------------------------------------------------- |
| app.tsx | Main application component that orchestrates terminal selection and renders TerminalView |

---

## Desktop App Constants

Located in apps/desktop/src/constants/.

| File                  | Purpose                                                                             |
| --------------------- | ----------------------------------------------------------------------------------- |
| terminal.constants.ts | Default values for terminal configuration including default CWD, labels, and status |

---

## Data Flow

The terminal system follows this data flow pattern:

### User Input Flow

1. User types in xterm.js terminal in renderer process
2. useTerminal hook captures input via onData listener
3. Input sent to main process via window.terminal.write IPC call
4. Main process handler calls ptyManager.write to send to PTY
5. PTY processes the input

### Output Display Flow

1. PTY generates output in main process
2. PTYManager onData listener triggers
3. Output sent to renderer via webContents.send IPC event
4. Renderer receives via window.terminal.onData listener
5. Terminal controller writes output to xterm.js display

---

## Use Case Reference

### Creating a New Terminal

Read these files in order:

1. hooks/use-terminal.ts - Entry point for terminal lifecycle
2. terminal-bridge/src/libs/terminal-factory.lib.ts - xterm.js instance creation
3. preload/terminal-api.ts - IPC API for PTY creation
4. main/ipc/terminal.ts - Main process handler
5. terminal-bridge/src/services/pty-manager.service.ts - PTY spawn logic

### Handling Terminal Input

Read these files:

1. hooks/use-terminal.ts - Input capture setup
2. preload/terminal-api.ts - Write method
3. main/ipc/terminal.ts - Write handler
4. terminal-bridge/src/services/pty-manager.service.ts - PTY write method

### Handling Terminal Output

Read these files:

1. terminal-bridge/src/services/pty-manager.service.ts - Data event emission
2. main/ipc/terminal.ts - Data broadcast to renderer
3. preload/terminal-api.ts - onData listener setup
4. hooks/use-terminal.ts - Output display wiring

### Resizing Terminal

Read these files:

1. hooks/use-terminal.ts - Resize observer setup
2. terminal-bridge/src/libs/terminal-factory.lib.ts - FitAddon usage
3. preload/terminal-api.ts - Resize method
4. main/ipc/terminal.ts - Resize handler
5. terminal-bridge/src/services/pty-manager.service.ts - PTY resize method

### Managing Terminal Tabs

Read these files:

1. hooks/use-workspace-tabs.ts - Tab UI logic
2. contexts/slices/workspaces.slice.ts - Terminal session state
3. components/terminal-view.tsx - Terminal component mounting

### Terminal Session Lifecycle

Read these files:

1. contexts/slices/workspaces.slice.ts - Session state management
2. hooks/use-terminal.ts - Lifecycle orchestration
3. terminal-bridge/src/services/pty-manager.service.ts - PTY cleanup
4. main/ipc/terminal.ts - Exit event handling

---

## IPC Channel Import Note

The terminal IPC channel constants are defined in both `@chaosfix/terminal-bridge` and `@chaosfix/core` packages with identical values. By convention:

- **Main process** (`main/ipc/terminal.ts`) imports from `@chaosfix/terminal-bridge`
- **Preload scripts** (`preload/terminal-api.ts`) imports from `@chaosfix/core`

Both packages export the same `TERMINAL_IPC_CHANNELS` constant, ensuring compatibility.

---

## Architecture Summary

| Layer              | Location                             | Responsibility                              |
| ------------------ | ------------------------------------ | ------------------------------------------- |
| Type Contracts     | terminal-bridge/src/types            | Shared interfaces for xterm.js and node-pty |
| PTY Service        | terminal-bridge/src/services         | node-pty lifecycle in main process          |
| Terminal Factory   | terminal-bridge/src/libs             | xterm.js creation in renderer process       |
| IPC Handlers       | desktop/src/main/ipc                 | Main process request handling               |
| Preload API        | desktop/src/preload                  | Renderer facing terminal API                |
| Terminal Hook      | desktop/src/renderer/hooks           | Terminal lifecycle orchestration            |
| Terminal Component | desktop/src/renderer/components      | DOM mounting for xterm.js                   |
| State Management   | desktop/src/renderer/contexts/slices | Terminal session state                      |
