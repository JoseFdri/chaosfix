# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ChaosFix is a macOS Electron application for running multiple Claude Code sessions in parallel. Users interact directly with Claude Code CLI in terminal panels, with each workspace isolated in its own git worktree.

**Core Philosophy**: "The terminal IS the interface" - no abstraction layers over Claude Code CLI. Users see exactly what Claude sees.

## Architecture

### Monorepo Structure (Turborepo + pnpm)

```
chaosfix/
├── apps/
│   └── desktop/              # Electron main application
├── packages/
│   ├── core/                 # Shared types, events, utilities
│   ├── config/               # Zod schemas for configuration
│   ├── terminal-bridge/      # xterm.js + node-pty integration
│   ├── ui/                   # Shared React components
│   └── workspace-manager/    # Git worktree orchestration
├── tools/
│   └── scripts/              # Build and dev tooling
└── docs/                     # Design documentation
```

### Application Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐│
│  │ Repository  │ │ Terminal    │ │ Terminal Instance       ││
│  │ Sidebar     │ │ Tab Bar     │ │ (xterm.js)              ││
│  └─────────────┘ └─────────────┘ └─────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                    Application Layer                         │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────┐ │
│  │ Session Manager  │ │ Workspace Router │ │ State Store  │ │
│  └──────────────────┘ └──────────────────┘ └──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    Domain Layer                              │
│  ┌─────────────────────────────┐ ┌─────────────────────────┐│
│  │ Worktree Manager            │ │ Git Service             ││
│  └─────────────────────────────┘ └─────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                    Infrastructure Layer                      │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────┐ │
│  │ Terminal Bridge  │ │ IPC Handler      │ │ File System  │ │
│  │ (node-pty)       │ │ (Electron)       │ │ Watcher      │ │
│  └──────────────────┘ └──────────────────┘ └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Package Guide

### `@chaosfix/core` - Shared Types & Utilities

**Location**: `packages/core/`

**Purpose**: Central types, event definitions, and utility functions shared across all packages.

**When to READ**: Understanding data structures, checking available types
**When to WRITE**: Adding new shared types, events, or utilities that multiple packages need

---

### `@chaosfix/config` - Configuration Schemas

**Location**: `packages/config/`

**Purpose**: Zod schemas for validating configuration files and settings.

**Key exports**:

- `projectConfigSchema`, `appPreferencesSchema` - Core Zod schemas
- `workspaceStateSchema`, `appStateSchema` - Persistence schemas
- `ProjectConfig`, `AppPreferences`, `WorkspaceState`, `AppState` - Inferred types
- `DEFAULT_PROJECT_CONFIG`, `DEFAULT_APP_PREFERENCES` - Default values

**When to READ**: Understanding config structure, adding new settings
**When to WRITE**: Adding new configuration options, modifying validation rules

---

### `@chaosfix/terminal-bridge` - Terminal Integration

**Location**: `packages/terminal-bridge/`

**Purpose**: Bridges xterm.js (renderer) with node-pty (main process) for terminal functionality.

**Key exports**:

- Main process: `PTYManager`, `ptyManager` - PTY lifecycle management
- Renderer: `createTerminal()`, `TerminalController` - xterm.js wrapper

**Architecture**:

```
Renderer Process          Main Process
┌─────────────┐          ┌─────────────┐
│ xterm.js    │◄──IPC───►│ node-pty    │
│ (display)   │          │ (PTY mgmt)  │
└─────────────┘          └─────────────┘
```

**When to READ**: Terminal behavior issues, adding terminal features
**When to WRITE**: Terminal rendering changes, PTY lifecycle modifications, adding terminal addons

---

### `@chaosfix/ui` - React Components

**Location**: `packages/ui/`

**Purpose**: Shared React components for the desktop application.

**Key exports**:

- `Sidebar`, `SidebarSection`, `SidebarItem` - Navigation components
- `TabBar` - Tab management
- `ActivityIndicator` - Status display
- `Button`, `IconButton` - Base components
- `useResizeObserver` - Utility hooks

**When to READ**: Checking available components, understanding component APIs
**When to WRITE**: Adding new shared UI components, modifying component styles

---

### `@chaosfix/workspace-manager` - Git Worktree Orchestration

**Location**: `packages/workspace-manager/`

**Purpose**: Manages git worktrees for isolated workspace environments.

**Key exports**:

- `WorktreeManager` - Create, list, remove worktrees
- `GitService` - Git operations (branch, status, diff)

**When to READ**: Understanding workspace isolation, git integration
**When to WRITE**: Adding git features, modifying worktree lifecycle

---

### `@chaosfix/desktop` - Electron Application

**Location**: `apps/desktop/`

**Purpose**: The main Electron application that ties everything together.

**Structure**:

```
src/
├── main/           # Electron main process
│   └── index.ts    # App entry, window management, IPC handlers
├── preload/        # Electron preload scripts
│   └── index.ts    # Exposes safe APIs to renderer
└── renderer/       # React application
    ├── app.tsx           # Root component
    ├── components/       # App-specific components
    └── stores/           # Zustand state management
```

**Build outputs**:

- `dist/main/` - Main process (tsup → CJS)
- `dist/preload/` - Preload scripts (tsup → CJS)
- `dist/renderer/` - React app (Vite → ESM)

**When to READ**: Application flow, IPC communication, state management
**When to WRITE**: Adding features, modifying UI, changing IPC handlers

---

## Key Design Principles

1. **Terminal IS the interface** - No abstraction layers over Claude Code CLI
2. **Workspace isolation** - Each workspace = isolated git worktree with its own branch
3. **Event-driven architecture** - Typed event definitions for cross-component communication
4. **Type-safe IPC** - Typed communication between main and renderer processes
5. **Package boundaries** - Each package has a single responsibility
6. **No long constant files** - When creating new constants, types or any logic that can grow over time, create a folder for it with index.ts and split logic into multiple files as needed, using a suffix for the file category (e.g. `type.payments.ts`)

## Tech Stack

- **Runtime**: Electron + React + TypeScript
- **Terminal**: xterm.js (rendering) + node-pty (PTY management)
- **Build**: Turborepo, tsup (packages), Vite (renderer)
- **State**: Zustand
- **Validation**: Zod
- **Testing**: Vitest

## Common Commands

```bash
pnpm install          # Install dependencies
pnpm build            # Build all packages
pnpm dev              # Start development mode
pnpm typecheck        # Run TypeScript checks
pnpm lint             # Run ESLint
pnpm test             # Run tests
```

## Design Documentation

See `docs/chaosfix-design-spec.md` for the full design specification.

## Skill usage

For coding or code review use the react-guidelines and typescript-guidelines skills accordingly.

## Memory management

1. When creating a markdown plan or design document, save the file in `agents-files/main/plans/` and display the file path in your response.

2. **Task Tracking:** When starting a task, create a markdown file in `agents-files/main/tasks/` with suffix `.pending.md` using this structure:

```markdown
# Task: [Task Name]

## Status: IN_PROGRESS | BLOCKED | DONE

## Goal

[Clear description of what needs to be accomplished]

## Progress

- [x] Completed step 1
- [x] Completed step 2
- [ ] Current step (mark what you're working on)
- [ ] Pending step

## Current State

[Describe where you left off, what file you were editing, what decision you were about to make]

## Files Modified

- `path/to/file.ts` - [brief description of changes]

## Blockers / Questions

- [Any issues preventing progress or questions needing answers]

## Next Steps

1. [Immediate next action to take]
2. [Following action]
```

3. **Updating Progress:** Update the task file frequently as you work:
   - Check off completed steps in the Progress section
   - Update "Current State" before stopping or switching context
   - Add new files to "Files Modified" as you touch them
   - Log any blockers or questions that arise

4. **Continuing a Task:** When asked to continue a task, find the matching `.pending.md` file in `agents-files/main/tasks/`, read it to restore context, and resume from the "Current State" and "Next Steps" sections.

5. **Completing a Task:** When done, update the task file status to `DONE`, check off all progress items, and rename the file from `.pending.md` to `.done.md`.

6. **Memory Capture:** After finishing a task, create a JSON summary in `agents-files/main/memories/` with a date-based directory structure like `agents-files/main/memories/2025-12-31/task-name.json`:

```json
{
  "task_name": "Name of the task",
  "summary": "A brief summary of what was accomplished",
  "time_taken": "total time taken to complete the task",
  "files_read": ["list", "of", "file", "paths"],
  "tips": [
    "Actionable tips to speed up similar tasks in the future",
    "Gotchas or pitfalls to avoid",
    "Shortcuts or patterns that worked well",
    "Key files or functions to check first for this type of task"
  ]
}
```

7. **Load Context:** When starting any task, read `agents-files/main/learning.md` to load additional context and lessons learned.
8. Plans do not include code snippets unless explicitly requested.

## CRITICAL: Plan Execution Guidelines

**MANDATORY: When a plan is approved and you exit plan mode, you MUST follow these steps. Do NOT make changes directly.**

### Execution Process

1. **Use Sub-Agents for Each Phase**: Launch a separate Task agent for each phase of the plan. Do NOT implement phases directly yourself.

2. **Invoke Skills**: Each sub-agent MUST use the `typescript-guidelines` and `react-guidelines` skills before making changes.

3. **Code Review**: After implementation, launch a separate review agent that uses the skills to validate the code.

4. **Orchestration**: Your role is to orchestrate sub-agents, not to write code directly. You:
   - Launch implementation agents (one per phase)
   - Launch review agents after each phase
   - Consolidate results and report to user

### Example Execution Flow

```
Plan Approved → Exit Plan Mode
    ↓
Phase 1: Launch Task agent with typescript-guidelines skill
    ↓
Phase 1 Complete: Launch Review agent with react-guidelines skill
    ↓
Phase 2: Launch Task agent with typescript-guidelines skill
    ↓
... repeat for each phase ...
    ↓
Final: Report consolidated results
```

**REMINDER: Never write implementation code directly after plan approval. Always delegate to sub-agents.**
