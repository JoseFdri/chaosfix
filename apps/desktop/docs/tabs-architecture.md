# Tabs Architecture

This document describes the files involved in the tab system for the desktop application.

## Overview

Tabs represent terminal sessions within a workspace. Each workspace can have multiple terminal sessions displayed as tabs in a tab bar.

## File Reference

### UI Components

Located in packages/ui/src/components/

| File                          | Description                                                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------- |
| atoms/TabItem.atom.tsx        | Renders a single tab with label, icon, and close button. Defines the Tab interface and TabItemProps.          |
| molecules/TabBar.molecule.tsx | Combines multiple TabItem components into a horizontal bar with a new tab button. Handles overflow scrolling. |
| atoms/index.ts                | Exports TabItem component and Tab type.                                                                       |
| molecules/index.ts            | Exports TabBar component and TabBarProps type.                                                                |
| index.ts                      | Main barrel export for all UI components including tabs.                                                      |

### Type Definitions

| File                                              | Description                                                                                                                         |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| packages/core/src/types/terminal.types.ts         | Defines TerminalSession interface with id, workspaceId, pid, title, status, and createdAt. Tabs are derived from terminal sessions. |
| packages/ui/src/components/atoms/TabItem.atom.tsx | Defines Tab interface with id, label, icon, and closable properties used by UI components.                                          |

### State Management

Located in apps/desktop/src/renderer/contexts/

| File                          | Description                                                                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| slices/workspaces.slice.ts    | Manages workspace state including terminals array and activeTerminalId. Contains actions for addTerminal, removeTerminal, and setActiveTerminal. |
| app-context.tsx               | Provides useApp hook with typed workspace actions. Handles state persistence and cross-slice logic.                                              |
| slices/create-app-context.tsx | Factory function that creates the React context combining all slices.                                                                            |

### Hooks

Located in apps/desktop/src/renderer/hooks/

| File                  | Description                                                                                                                              |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| use-workspace-tabs.ts | Bridges workspace state to TabBar component. Converts TerminalSession objects to Tab objects and provides handlers for tab interactions. |
| index.ts              | Exports useWorkspaceTabs hook and related types.                                                                                         |

### Constants

Located in apps/desktop/src/constants/

| File                  | Description                                                                                                |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| terminal.constants.ts | Defines DEFAULT_TERMINAL_LABEL, INITIAL_TERMINAL_PID, and DEFAULT_TERMINAL_STATUS used when creating tabs. |
| index.ts              | Barrel export for all constants.                                                                           |

### Application Integration

Located in apps/desktop/src/renderer/

| File                         | Description                                                                                                                                              |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| app.tsx                      | Root component that integrates TabBar with workspace state. Uses useWorkspaceTabs hook and conditionally renders the tab bar when a workspace is active. |
| components/terminal-view.tsx | Renders the terminal content for the currently active tab.                                                                                               |

## Data Flow

1. TerminalSession objects are stored in the workspace state
2. The useWorkspaceTabs hook converts terminal sessions to Tab objects
3. TabBar component renders the tabs from the hook
4. User interactions trigger workspace actions through the hook handlers
5. State updates propagate back through the context to re-render

## Use Cases

### Understanding Tab Rendering

- Start with TabItem.atom.tsx for individual tab appearance
- Review TabBar.molecule.tsx for the complete tab bar layout
- Check app.tsx for how the tab bar integrates with the application layout

### Understanding Tab State

- Review workspaces.slice.ts for how terminals are stored and managed
- Check app-context.tsx for the exposed workspace actions
- Review use-workspace-tabs.ts for how state maps to UI props

### Adding Tab Features

- Modify TabItem.atom.tsx for visual changes to individual tabs
- Update workspaces.slice.ts for new state or actions
- Extend use-workspace-tabs.ts to expose new functionality to the UI

### Understanding Tab Lifecycle

- Check workspaces.slice.ts addTerminal action for tab creation
- Review removeTerminal action for tab closing and auto-switching logic
- See setActiveTerminal action for tab selection behavior
