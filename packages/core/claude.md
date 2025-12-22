# @chaosfix/core

Shared types, events, and utility functions used across all ChaosFix packages.

## Package Structure

```
src/
├── types/           # Type definitions with .types.ts suffix
├── libs/            # Utility functions with .lib.ts suffix
└── index.ts         # Main entry point (re-exports all)
```

## Folder Conventions

### `types/`

Contains TypeScript type definitions and interfaces. Each file should be domain-specific and use the `.types.ts` suffix.

**Current files:**

- `workspace.types.ts` - Workspace entity types
- `repository.types.ts` - Repository entity types
- `terminal.types.ts` - Terminal session types
- `result.types.ts` - Result monad for error handling
- `event.types.ts` - Application event definitions
- `ipc.types.ts` - IPC channel constants and types

**Adding new types:**

1. Create a new file with `.types.ts` suffix (e.g., `session.types.ts`)
2. Export all types from the file
3. Add `export * from "./session.types";` to `types/index.ts`

### `libs/`

Contains utility functions and helpers. Each file should be focused on a single concern and use the `.lib.ts` suffix.

**Current files:**

- `result.lib.ts` - Result monad helpers
- `branch-name.lib.ts` - Git branch name utilities

**Adding new utilities:**

1. Create a new file with `.lib.ts` suffix (e.g., `string.lib.ts`)
2. Export all functions from the file
3. Add `export * from "./string.lib";` to `libs/index.ts`

## Usage

```typescript
// Import types
import type { Workspace, Repository, Result } from "@chaosfix/core";

// Import utilities
import { ok, err, sanitizeBranchName } from "@chaosfix/core";
```

## File Naming Conventions

| Folder   | Suffix      | Example              |
| -------- | ----------- | -------------------- |
| `types/` | `.types.ts` | `workspace.types.ts` |
| `libs/`  | `.lib.ts`   | `result.lib.ts`      |

## Guidelines

- **No services in core** - This package is for shared types and pure utility functions only
- **Keep it minimal** - Only add types/utilities that are used by multiple packages
- **Pure functions** - Utility functions should be pure with no side effects
- **Domain grouping** - Group related types in the same file by domain
