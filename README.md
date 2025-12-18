# ChaosFix

A macOS Electron application for running multiple Claude Code sessions in parallel. Each workspace is isolated in its own git worktree, allowing you to work on multiple features or experiments simultaneously.

## Core Philosophy

**"The terminal IS the interface"** - Users interact directly with the Claude Code CLI in terminal panels. No abstraction layers, no magic. You see exactly what Claude sees.

## Architecture

ChaosFix is built as a Turborepo monorepo with the following structure:

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
└── docs/                     # Design documentation
```

### Tech Stack

- **Runtime**: Electron + React + TypeScript
- **Terminal**: xterm.js (rendering) + node-pty (PTY management)
- **Build**: Turborepo, tsup (packages), Vite (renderer)
- **State**: Zustand
- **Validation**: Zod

## Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- macOS (primary target platform)
- Claude Code CLI installed

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development mode
pnpm dev

# Build all packages
pnpm build
```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm dev` | Start development mode with hot reload |
| `pnpm build` | Build all packages for production |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm lint` | Run ESLint across all packages |
| `pnpm lint:fix` | Fix auto-fixable lint issues |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check code formatting |
| `pnpm test` | Run all tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm clean` | Clean build artifacts and node_modules |

## Documentation

For detailed design documentation, see [`docs/chaosfix-design-spec.md`](./docs/chaosfix-design-spec.md).

## License

MIT
