# ChaosFix - High-Level Design Specification

## Executive Summary

ChaosFix is a macOS Electron application that enables developers to run multiple Claude Code sessions in parallel through a terminal-native interface powered by xterm.js. The terminal is the interface - users interact directly with Claude Code CLI in each terminal panel, maintaining full control and visibility.

---

## Problem Statement

AI-assisted development with Claude Code is powerful but limited to single-session workflows. Developers working on complex features, multi-service architectures, or parallel bug fixes need:

- Multiple isolated Claude Code instances running concurrently
- Visibility into each terminal session in real-time
- Git worktree isolation to prevent code conflicts
- A unified interface to manage, monitor, and merge parallel work streams

**ChaosFix's approach: the terminal IS the interface.** No abstraction layers, no chat wrappers - just multiple terminals with Claude Code running in each.

---

## Core Philosophy

> "Don't hide the terminal. Embrace it."

Each workspace is a terminal. Claude Code runs directly in that terminal. Users see exactly what Claude sees, can type commands, interrupt, and maintain full control.

---

## Target Platform

- **Primary**: macOS (Apple Silicon + Intel)
- **Terminal Emulator**: xterm.js
- **AI Agent**: Claude Code CLI

---

## High-Level Architecture

### Monorepo Structure (Turborepo)

```
chaosfix/
├── apps/
│   └── desktop/              # Electron main application
├── packages/
│   ├── core/                 # Shared business logic & types
│   ├── workspace-manager/    # Git worktree orchestration
│   ├── terminal-bridge/      # xterm.js + node-pty integration
│   ├── ui/                   # Shared React components
│   └── config/               # Shared configuration schemas
├── tools/
│   └── scripts/              # Build and dev tooling
└── turbo.json
```

### Application Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐│
│  │ Repository  │ │ Terminal    │ │ Terminal Instance       ││
│  │ Sidebar     │ │ Tab Bar     │ │ (xterm.js/PTY)          ││
│  └─────────────┘ └─────────────┘ └─────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                    Application Layer                         │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────┐ │
│  │ Session Manager  │ │ Workspace Router │ │ Event Bus    │ │
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
│  │ (xterm.js/PTY)   │ │ (Electron)       │ │ Watcher      │ │
│  └──────────────────┘ └──────────────────┘ └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Features

### 1. Workspace Management

**Purpose**: Create and manage isolated development environments.

- **Git Worktree Isolation**: Each workspace operates in its own git worktree
- **Branch Strategy**: Auto-create feature branches per workspace
- **Setup Scripts**: Execute custom setup scripts (dependency installation, env setup)
- **Workspace Templates**: Pre-configured setups for common project types

### 2. Terminal Interface

**Purpose**: Display and manage terminal sessions within workspaces.

- **Sidebar Navigation**: Repository as parent with nested workspaces underneath
- **Single Terminal View**: Main area displays one terminal at a time (full focus)
- **Workspace Tabs**: Create multiple terminal tabs within a single workspace
- **Activity Indicators**: Visual cues in sidebar showing workspace activity
- **Quick Switching**: Sidebar enables fast navigation between parallel sessions

### 3. Session Management

**Purpose**: Manage terminal sessions across workspaces.

- **Session Lifecycle**: Create, close, and restore terminal sessions
- **Working Directory**: Each terminal starts in its workspace worktree
- **Environment Inheritance**: Pass environment variables to terminals
- **Session Persistence**: Restore sessions after app restart

### 4. Real-Time Monitoring

**Purpose**: Track activity across all terminals.

- **Activity Feed**: Aggregated view of terminal output
- **Status Indicators**: Visual cues for active vs idle terminals
- **Notifications**: Alert when terminals need attention
- **Output History**: Log and search terminal output

### 5. Git Integration

**Purpose**: Manage code changes across parallel workstreams.

- **Diff Viewer**: Review changes made in each workspace
- **Merge Workflow**: Guided merge process for completed work
- **Conflict Resolution**: Visual conflict resolution tools
- **Checkpoint System**: Create snapshots of workspace state

### 6. Configuration System

**Purpose**: Customize behavior per project.

- **Project Config**: `chaosfix.json` for project-specific settings
- **Global Preferences**: App-wide settings and defaults
- **Custom Scripts**: Setup and teardown scripts per workspace

---

## User Interface Concept

### Primary Views

1. **Main View**
   - Sidebar: Repository tree with workspaces nested underneath
   - Terminal area: Full-size terminal display for the selected workspace
   - Tab bar: Multiple terminal tabs within the current workspace
   - Status indicators in sidebar showing workspace activity (active, idle)

2. **Workspace Panel**
   - Click workspace in sidebar to switch sessions
   - Create new tabs for additional terminals within a workspace
   - Command palette for workspace actions (`Cmd+K`)

3. **Diff View**
   - Side-by-side comparison of changes
   - Per-workspace change grouping
   - Merge controls and conflict markers

4. **Settings View**
   - Workspace configuration
   - Global preferences
   - Theme and appearance

### Navigation

- **Keyboard-First**: Full keyboard navigation with vim-style bindings
- **Command Palette**: Quick access to all actions via `Cmd+K`
- **Hotkeys**: Workspace switching, terminal control, view toggling

---

## Technical Considerations

### Terminal Integration (xterm.js)

**Architecture**: xterm.js for rendering + node-pty for process management

- **xterm.js**: Feature-rich terminal emulator for the browser/Electron renderer
- **node-pty**: Native PTY bindings for spawning shell processes in the main process
- **IPC Bridge**: Main process manages PTY, renderer displays via xterm.js
- **Addons**: xterm-addon-fit, xterm-addon-web-links, xterm-addon-search for enhanced functionality

### Process Management

- PTY (pseudo-terminal) management for each terminal session
- Process group isolation for clean termination
- Shell environment configuration per workspace

### Data Flow

- **Event-Driven Architecture**: Central event bus for cross-component communication
- **State Management**: Centralized state with real-time sync across windows
- **IPC Protocol**: Type-safe communication between main and renderer processes

### Performance

- **Lazy Loading**: Load terminal content on-demand
- **Virtual Scrolling**: Handle large terminal output efficiently
- **Background Processing**: Non-blocking workspace operations

---

## Security Considerations

- **Sandboxed Workspaces**: Each workspace runs in isolation
- **File System Access**: Scoped to project directories only
- **Environment Variables**: Secure handling of sensitive env vars

---

## Future Considerations

- **Multi-Agent Types**: Support for other CLI-based AI assistants
- **Cloud Sync**: Workspace state synchronization across machines
- **Team Features**: Shared workspaces and collaborative sessions
- **Web Interface**: Browser-based access to running sessions
- **Plugins/Extensions**: User-defined integrations and automations

---

## Success Metrics

- Time to spawn a new workspace < 3 seconds
- Support for 10+ concurrent terminals without performance degradation
- Terminal rendering at native performance levels
- Sub-100ms response time for UI interactions

---

## Dependencies

### Core

- Electron (latest)
- React + TypeScript
- Turborepo
- xterm.js (terminal emulator)
- node-pty (PTY management)

### Tooling

- pnpm (package manager)
- Vite (bundler)
- Vitest (testing)
- ESLint + Prettier

---

## Development Phases

### Phase 1: Foundation
- Monorepo setup with Turborepo
- Basic Electron app shell
- Terminal integration proof-of-concept
- Single workspace with terminal session

### Phase 2: Multi-Workspace
- Workspace manager with git worktrees
- Multiple terminal panel support
- Basic dashboard view

### Phase 3: Polish
- Full UI implementation
- Diff viewer and merge workflow
- Configuration system
- Performance optimization

### Phase 4: Advanced Features
- Checkpoint system
- Custom scripts support
- Notification system

---

## Open Questions

1. **xterm.js Performance**: Are there any performance optimizations needed for multiple concurrent terminals?
2. **Resource Limits**: What are practical limits for concurrent terminal sessions?
3. **Session Persistence**: How to handle terminal state across app restarts?

---

*Document Version: 1.1*
*Created: December 2024*
*Status: Draft - Pending Review*
