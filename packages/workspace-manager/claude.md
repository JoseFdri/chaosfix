# @chaosfix/workspace-manager

Git worktree orchestration for ChaosFix workspaces.

## Architecture

```
src/
├── index.ts      # Public API - barrel file exporting all public types and services
├── types/        # TypeScript type definitions and custom error classes
├── services/     # Business logic classes for git and worktree operations
└── libs/         # Pure utility functions and parsers
```

### Folder Responsibilities

| Folder      | Purpose          | Contains                                                                                                    |
| ----------- | ---------------- | ----------------------------------------------------------------------------------------------------------- |
| `types/`    | Type definitions | Interfaces, type aliases, custom error classes (e.g., `GitError`), and the `Result<T, E>` pattern types     |
| `services/` | Business logic   | Classes that wrap `simple-git` and orchestrate git/worktree operations. Stateful, uses dependency injection |
| `libs/`     | Utilities        | Pure functions for parsing git output, data transformations, and helpers with no side effects               |

## File Naming Conventions

| Category       | Suffix           | Example                  |
| -------------- | ---------------- | ------------------------ |
| Types          | `*.types.ts`     | `worktree.types.ts`      |
| Services       | `*.service.ts`   | `git.service.ts`         |
| Libs/Utilities | `*.lib.ts`       | `worktree-parser.lib.ts` |
| Constants      | `*.constants.ts` | `worktree.constants.ts`  |

## Where to Find Things

### Types (`src/types/`)

- **worktree.types.ts** - Data structures for worktree info, creation options, and removal options
- **git.types.ts** - Result wrapper types, custom error class, and repository/branch info structures

### Services (`src/services/`)

- **git.service.ts** - High-level git operations: repository info, branch management, status checks
- **worktree-manager.service.ts** - Worktree lifecycle management: create, remove, list, and workspace orchestration

### Libs (`src/libs/`)

- **worktree-parser.lib.ts** - Parses git porcelain output into typed worktree structures

## Writing Guidelines

### Adding New Types

1. Create or update a file in `src/types/` with the `.types.ts` suffix
2. Group related types together (e.g., all worktree types in `worktree.types.ts`)
3. Export from `src/types/index.ts`

### Adding New Services

1. Create a file in `src/services/` with the `.service.ts` suffix
2. Use dependency injection via constructor for testability
3. Return `GitResult<T>` for operations that can fail
4. Export from `src/services/index.ts`

### Adding New Libs/Utilities

1. Create a file in `src/libs/` with the `.lib.ts` suffix
2. Keep functions pure when possible
3. Export from `src/libs/index.ts`

### Error Handling

- Use the `Result<T, E>` pattern from `@chaosfix/core`
- Wrap git operations in try-catch and return `GitError` on failure
- Include relevant context in error messages

```typescript
import { ok, err } from "@chaosfix/core";
import { GitError } from "../types/git.types";

async someOperation(): Promise<GitResult<Data>> {
  try {
    const result = await this.git.someCommand();
    return ok(result);
  } catch (error) {
    return err(new GitError(`Failed to do something: ${error}`));
  }
}
```

## Dependencies

- `@chaosfix/core` - Result type, utility functions
- `simple-git` - Git command wrapper

## Commands

```bash
pnpm --filter @chaosfix/workspace-manager build      # Build package
pnpm --filter @chaosfix/workspace-manager typecheck  # Type check
pnpm --filter @chaosfix/workspace-manager lint       # Lint
pnpm --filter @chaosfix/workspace-manager test       # Run tests
```
