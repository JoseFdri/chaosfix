# @chaosfix/ui

Shared React components, hooks, and utilities for ChaosFix applications.

## Package Structure

```
src/
├── components/
│   ├── atoms/       # Basic UI building blocks (.atom.tsx)
│   ├── molecules/   # Combinations of atoms (.molecule.tsx)
│   ├── organisms/   # Complex UI sections (.organism.tsx)
│   └── index.ts     # Barrel export
├── hooks/           # Custom React hooks (.hook.ts)
├── libs/            # Utility functions (.lib.ts)
├── icons/           # Icon re-exports
├── providers/       # React context providers
└── index.ts         # Main entry point
```

## File Naming Standards

| Category  | Suffix          | Folder                  | Example                    |
| --------- | --------------- | ----------------------- | -------------------------- |
| Atoms     | `.atom.tsx`     | `components/atoms/`     | `Button.atom.tsx`          |
| Molecules | `.molecule.tsx` | `components/molecules/` | `TabBar.molecule.tsx`      |
| Organisms | `.organism.tsx` | `components/organisms/` | `Sidebar.organism.tsx`     |
| Business  | `.business.tsx` | `components/`           | `UserManager.business.tsx` |
| Hooks     | `.hook.ts`      | `hooks/`                | `useToast.hook.ts`         |
| Utilities | `.lib.ts`       | `libs/`                 | `cn.lib.ts`                |
| Types     | `.types.ts`     | `types/`                | `button.types.ts`          |
| Constants | `.const.ts`     | `constants/`            | `theme.const.ts`           |
| Tests     | `.test.tsx`     | same as source          | `Button.test.tsx`          |

## File Organization Rules

### Avoid Single-File Aggregations

**Never create generic aggregation files.** Each file should have a specific, focused purpose.

| Avoid          | Instead Use                           |
| -------------- | ------------------------------------- |
| `types.ts`     | `button.types.ts`, `sidebar.types.ts` |
| `utils.ts`     | `cn.lib.ts`, `format.lib.ts`          |
| `constants.ts` | `theme.const.ts`, `sizes.const.ts`    |
| `helpers.ts`   | `string.lib.ts`, `date.lib.ts`        |

### When to Create New Files

- **New type definitions** - Create `<domain>.types.ts` in `types/`
- **New utility functions** - Create `<purpose>.lib.ts` in `libs/`
- **New constants** - Create `<domain>.const.ts` in `constants/`
- **New hook** - Create `use<Name>.hook.ts` in `hooks/`

### Maximum Definitions Per File

- **Types file**: Max 10 related types/interfaces
- **Lib file**: Max 5 related utility functions
- **Constants file**: Max 10 related constants
- **Component file**: Max 150 lines of code

If exceeding limits, split into more specific files.

### Adding New Files

1. Create file with appropriate suffix (e.g., `validation.lib.ts`)
2. Export all public members from the file
3. Add `export * from "./<filename>";` to the folder's `index.ts`

## Component Categories

### Atoms (`components/atoms/*.atom.tsx`)

- Basic, reusable UI building blocks
- Pure presentational components
- No business logic or API calls
- Maximum reusability
- Atoms do not import each other

### Molecules (`components/molecules/*.molecule.tsx`)

- Simple combinations of atoms (2-5 components)
- Handle simple local state
- No external API calls
- Reusable across contexts
- Molecules do not import each other

### Organisms (`components/organisms/*.organism.tsx`)

- Complex UI sections combining molecules and atoms
- Handle layout and presentation logic
- Consume data via props or context
- Not responsible for data fetching
- Organisms do not import each other

### Business Components (`*.business.tsx`)

- Handle business logic and data management
- Manage API calls and application state
- Implement business rules and validation
- May render other components or return data
- Business components do not import each other

## Guidelines for Components

- **Functional Components**: All components must be implemented as functional React components
- **Composition**: Components should be designed to be composable and reusable
- **Performance**: Optimize components for performance, avoiding unnecessary re-renders
- **Accessibility**: Ensure all components meet accessibility standards
- **Types**: Define and export prop types for all components
- **Styling**: Use Tailwind CSS for styling, adhering to the project's design system
- **UI Library**: Leverage existing UI libraries (e.g., Radix UI) for consistency

## MANDATORY RULES

### 1. Custom Hooks Usage

**ALWAYS extract stateful logic into custom hooks** - NOT optional, REQUIRED

- **API calls MUST be in custom hooks** - NEVER put fetch/API logic in components
- **Form state MUST be in custom hooks** - NEVER manage form state directly in components
- **ALL useState/useEffect logic MUST be in custom hooks**
- Hooks use `use<Name>.hook.ts` naming in `src/hooks/`
- If you see useState, useEffect, or fetch in a component, it MUST be extracted to a hook

### 2. Import Paths

- **React Imports**: NEVER import from `"React"`. ALWAYS use `"react"`
- **Import Extensions**: NEVER include `.js` or `.ts` extensions in imports
- **ALWAYS use alias imports** - NEVER use relative paths
- **Frontend aliases**: `@components`, `@hooks`, `@icons`, `@styles`, `@utils`
- **General src alias**: `@/` (for any folder within src/\*)

```typescript
// Correct
import { Button } from "@components";
import { useToast } from "@hooks";
import { cn } from "@/libs";

// Wrong
import { Button } from "../components";
import { useToast } from "./hooks/useToast.hook";
```

### 3. Component Size Limits

**Components MAX 150 lines of code**

- If longer: extract smaller components or custom hooks
- Break complex logic into custom hooks in `src/hooks/`

### 4. Unit Tests

**MANDATORY**: Write unit tests for ALL new features

- Test files placed in SAME directory as source file
- Add `.test` suffix (e.g., `Button.atom.tsx` -> `Button.test.tsx`)
- Test business logic in business components
- Test UI rendering and interactions in atoms, molecules, organisms

### 5. Barrel Exports

Every folder with multiple files MUST have an `index.ts` that re-exports everything.

```typescript
// libs/index.ts
export { cn } from "./cn.lib";
export { formatDate } from "./date.lib";
```
