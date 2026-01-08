# Toolbar Architecture

This document describes the files responsible for the terminal toolbar in the ChaosFix desktop application.

## Overview

The toolbar is a container wrapper around each terminal that provides a dedicated area above the terminal content for future actions and controls. Each terminal instance is wrapped in a TerminalContainer component that includes an empty toolbar div ready for customization.

---

## File Reference

### UI Components

Located in apps/desktop/src/renderer/components/

| File                   | Purpose                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------- |
| terminal-container.tsx | Wrapper component that combines toolbar and terminal. Handles positioning, focus ring, and flex layout. |
| terminal-view.tsx      | Inner terminal component that renders xterm.js. Receives terminal props from TerminalContainer.         |

### Type Definitions

| File                                                        | Purpose                                                                                |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| apps/desktop/src/renderer/components/terminal-container.tsx | Defines TerminalContainerProps interface matching TerminalView props for pass-through. |
| apps/desktop/src/renderer/libs/split.libs.ts                | Defines TerminalBounds interface used for absolute positioning in split layouts.       |

### Constants

| File                                                        | Purpose                                                                  |
| ----------------------------------------------------------- | ------------------------------------------------------------------------ |
| apps/desktop/src/renderer/components/terminal-container.tsx | Defines TOOLBAR_HEIGHT_PX constant (32px) for consistent toolbar sizing. |

### Application Integration

Located in apps/desktop/src/renderer/

| File    | Purpose                                                                                                         |
| ------- | --------------------------------------------------------------------------------------------------------------- |
| app.tsx | Root component that renders TerminalContainer for each terminal session. Passes bounds, focus, and event props. |

---

## Component Structure

The TerminalContainer follows a flex column layout:

```
TerminalContainer (outer wrapper)
├── Toolbar div (fixed height, empty)
└── Terminal wrapper div (flex-1)
    └── TerminalView (xterm.js)
```

### Layout Details

| Element          | Tailwind Classes                       | Purpose                                         |
| ---------------- | -------------------------------------- | ----------------------------------------------- |
| Outer container  | `flex flex-col w-full h-full`          | Vertical flex layout filling available space    |
| Toolbar          | `w-full shrink-0 bg-surface-secondary` | Fixed height bar that doesn't shrink            |
| Terminal wrapper | `flex-1 min-h-0`                       | Fills remaining space, prevents overflow issues |

---

## Props Pass-Through

TerminalContainer accepts and handles these props:

| Prop         | Type                                           | Handling                                                 |
| ------------ | ---------------------------------------------- | -------------------------------------------------------- |
| terminalId   | string                                         | Passed to TerminalView                                   |
| worktreePath | string                                         | Passed to TerminalView                                   |
| isActive     | boolean                                        | Used for container visibility and passed to TerminalView |
| bounds       | TerminalBounds \| null                         | Applied to outer container for split positioning         |
| isFocused    | boolean                                        | Applied to outer container for focus ring                |
| onClick      | () => void                                     | Applied to outer container for pane selection            |
| onExit       | (terminalId: string, exitCode: number) => void | Passed to TerminalView                                   |

---

## Styling

### Focus Ring

The focus ring is applied to the outer TerminalContainer when `isFocused` is true:

| State     | Classes                                 | Visual Effect                       |
| --------- | --------------------------------------- | ----------------------------------- |
| Focused   | `ring-1 ring-accent-primary ring-inset` | Blue/accent border inside container |
| Unfocused | (none)                                  | No ring                             |

### Positioning

When bounds are provided (split view), the container uses absolute positioning:

| Bounds Property | CSS Style      | Purpose             |
| --------------- | -------------- | ------------------- |
| top             | `top: {n}%`    | Vertical position   |
| left            | `left: {n}%`   | Horizontal position |
| width           | `width: {n}%`  | Pane width          |
| height          | `height: {n}%` | Pane height         |

---

## Use Case Reference

### Understanding Toolbar Rendering

Read these files:

1. components/terminal-container.tsx - Main wrapper component
2. components/terminal-view.tsx - Inner terminal component
3. app.tsx - Integration and prop passing

### Adding Toolbar Content

To add buttons, status indicators, or other content to the toolbar:

1. Modify components/terminal-container.tsx
2. Add content inside the toolbar div (currently empty)
3. Consider adding props for toolbar customization if needed

### Understanding Layout

Read these files:

1. components/terminal-container.tsx - Flex layout structure
2. renderer/libs/split.libs.ts - TerminalBounds type for positioning

### Modifying Toolbar Height

1. Update TOOLBAR_HEIGHT_PX constant in terminal-container.tsx
2. Consider making it configurable via props if needed

---

## Architecture Summary

| Layer           | Location                                               | Responsibility                             |
| --------------- | ------------------------------------------------------ | ------------------------------------------ |
| Container       | desktop/src/renderer/components/terminal-container.tsx | Wraps terminal with toolbar area           |
| Terminal        | desktop/src/renderer/components/terminal-view.tsx      | Renders xterm.js terminal                  |
| App Integration | desktop/src/renderer/app.tsx                           | Orchestrates terminal rendering with props |
| Types           | desktop/src/renderer/libs/split.libs.ts                | TerminalBounds for positioning             |
