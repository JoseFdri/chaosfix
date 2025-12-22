# @chaosfix/config

Configuration schemas, types, and utilities for ChaosFix.

## Package Structure

```
src/
├── index.ts          # Main entry point - re-exports everything
├── schemas/          # Zod validation schemas
│   ├── index.ts      # Schema exports
│   └── *.schema.ts   # Individual schema definitions
├── types/            # TypeScript type definitions
│   ├── index.ts      # Type exports
│   └── *.types.ts    # Individual type definitions
└── libs/             # Utilities, defaults, and constants
    ├── index.ts      # Utility exports
    ├── defaults.lib.ts   # Default configuration values
    └── constants.lib.ts  # App-wide constants
```

## Conventions

### Naming

- Schemas: `*.schema.ts` - export named schema (e.g., `projectConfigSchema`)
- Types: `*.types.ts` - export named types (e.g., `ProjectConfig`)
- Utilities: `*.lib.ts` - export named utilities/constants

### Adding New Configuration

1. **Create the schema** in `src/schemas/`:

   ```typescript
   // src/schemas/myconfig.schema.ts
   import { z } from "zod";

   export const myConfigSchema = z.object({
     // Use z.record(z.string(), z.string()) for string records (Zod 4 syntax)
   });
   ```

2. **Create the type** in `src/types/`:

   ```typescript
   // src/types/myconfig.types.ts
   import type { z } from "zod";
   import type { myConfigSchema } from "../schemas/myconfig.schema";

   export type MyConfig = z.infer<typeof myConfigSchema>;
   ```

3. **Add defaults** in `src/libs/defaults.lib.ts` if needed

4. **Export from index files**:
   - Add to `src/schemas/index.ts`
   - Add to `src/types/index.ts`

## Zod 4 Notes

- `z.record()` requires two arguments: `z.record(keySchema, valueSchema)`
- Example: `z.record(z.string(), z.string())` for `Record<string, string>`

## Commands

```bash
pnpm --filter @chaosfix/config build      # Build package
pnpm --filter @chaosfix/config typecheck  # Type check
pnpm --filter @chaosfix/config lint       # Lint
```
