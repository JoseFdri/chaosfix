# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ChaosFix is a macOS Electron application for running multiple Claude Code sessions in parallel. Users interact directly with Claude Code CLI in terminal panels, with each workspace isolated in its own git worktree.

## Architecture

### Planned Monorepo Structure (Turborepo + pnpm)

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
```

### UI Model

- **Sidebar**: Repository tree with workspaces nested underneath
- **Main area**: Single full-size terminal view (not a grid)
- **Tabs**: Multiple terminal tabs within each workspace
- Workspaces in sidebar allow switching between parallel Claude Code sessions

### Tech Stack

- Electron + React + TypeScript
- xterm.js (terminal rendering) + node-pty (PTY management)
- Turborepo for monorepo orchestration
- Vite for bundling, Vitest for testing

### Key Design Principles

1. Terminal IS the interface - no abstraction layers over Claude Code CLI
2. Each workspace = isolated git worktree with its own branch
3. Event-driven architecture with central event bus
4. Type-safe IPC between main and renderer processes

## Design Documentation

See `agents-files/main/plans/chaosfix-design-spec.md` for the full design specification.


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
