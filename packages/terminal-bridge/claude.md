# @chaosfix/terminal-bridge

Bridges xterm.js (renderer) with node-pty (main process) for terminal functionality.

## Architecture

```
src/
├── index.ts      # Main process entry - exports services and types
├── renderer.ts   # Renderer process entry - exports libs and types
├── types/        # TypeScript type definitions
├── services/     # Main process classes (PTY management)
└── libs/         # Renderer process utilities (terminal creation)
```

### Folder Responsibilities

| Folder      | Purpose                | Contains                                                              |
| ----------- | ---------------------- | --------------------------------------------------------------------- |
| `types/`    | Type definitions       | Interfaces, type aliases, and IPC channel constants                   |
| `services/` | Main process logic     | Classes that manage node-pty instances. Runs in Electron main process |
| `libs/`     | Renderer process logic | Factory functions for xterm.js terminals. Runs in Electron renderer   |

### Entry Points

| File          | Process  | Exports                  |
| ------------- | -------- | ------------------------ |
| `index.ts`    | Main     | `services/*` + `types/*` |
| `renderer.ts` | Renderer | `libs/*` + `types/*`     |

## File Naming Conventions

| Category | Suffix         | Example                   |
| -------- | -------------- | ------------------------- |
| Types    | `*.types.ts`   | `pty.types.ts`            |
| Services | `*.service.ts` | `pty-manager.service.ts`  |
| Libs     | `*.lib.ts`     | `terminal-factory.lib.ts` |

## Writing Guidelines

### Adding New Types

1. Create or update a file in `src/types/` with the `.types.ts` suffix
2. Group related types together (e.g., all PTY types in `pty.types.ts`)
3. Export from `src/types/index.ts`

### Adding New Services (Main Process)

1. Create a file in `src/services/` with the `.service.ts` suffix
2. Services run in the main process - they can use Node.js APIs and native modules
3. Export from `src/services/index.ts`

### Adding New Libs (Renderer Process)

1. Create a file in `src/libs/` with the `.lib.ts` suffix
2. Libs run in the renderer process - they can use DOM APIs and xterm.js
3. Export from `src/libs/index.ts`

### Process Boundary Rules

- **Never import from `services/` in renderer code** - services use node-pty which is Node.js only
- **Never import from `libs/` in main process code** - libs use xterm.js which requires DOM
- **Types can be shared** - both processes can import from `types/`

## Dependencies

- `node-pty` - Pseudo-terminal bindings for Node.js (main process)
- `@xterm/xterm` - Terminal emulator for the browser (renderer process)
- `@xterm/addon-fit` - Auto-fit terminal to container
- `@xterm/addon-search` - Search functionality
- `@xterm/addon-web-links` - Clickable links

## Commands

```bash
pnpm --filter @chaosfix/terminal-bridge build      # Build package
pnpm --filter @chaosfix/terminal-bridge typecheck  # Type check
pnpm --filter @chaosfix/terminal-bridge lint       # Lint
pnpm --filter @chaosfix/terminal-bridge test       # Run tests
```
