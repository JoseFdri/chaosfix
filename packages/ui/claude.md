# Description
This directory contains the components used throughout the application. Components are implemented as functional React components and can accept props for customization and styling.

## Guidelines for Components

- **Functional Components**: All components must be implemented as functional React components.
- **Composition**: Components should be designed to be composable and reusable.
- **Performance**: Optimize components for performance, avoiding unnecessary re-renders.
- **Accessibility**: Ensure all components meet accessibility standards.
- **React Imports**: Avoid importing React types and functions from `"React"`. Instead, use direct imports from `"react"`.
- **Testing**: Write unit tests for all components to ensure they function as expected.
- **Documentation**: Provide clear documentation for all components, including usage examples and prop descriptions.
- **Types**: Define and export prop types for all components to improve type safety and developer experience.
- **Styling**: Use Tailwind CSS for styling components, adhering to the project's design system.
- **UI Library**: Leverage existing UI libraries (e.g., Radix UI) to accelerate development and ensure consistency.
- **Good practices**: Component names and file names are CamelCase, Use SOLID principles.
- **Theme**: Implement a consistent theme using Tailwind CSS.

## Component Categories

### Atoms (atoms/<name>.tsx)
- Basic, reusable UI building blocks
- Pure presentational components
- No business logic or API calls
- Maximum reusability
- Atoms do not import each other

### Molecules (molecules/<name>.tsx)
- Simple combinations of atoms (2-5 components)
- Handle simple local state
- No external API calls
- Reusable across contexts
- Molecules do not import each other

### Organisms (organisms/<name>.tsx)
- Complex UI sections combining molecules and atoms
- Handle layout and presentation logic
- Consume data via props or context
- Not responsible for data fetching
- Organisms do not import each other

### Business Components (.business.tsx)
- Handle business logic and data management
- Manage API calls and application state
- Implement business rules and validation
- May render other components or return data
- Business components do not import each other

## Naming Conventions

### Files
- PascalCase component names
- Descriptive suffixes: `.atom.tsx`, `.molecule.tsx`, `.organism.tsx`, `.business.tsx`
- Action-oriented names for business components

### Imports/Exports
- Use barrel exports in `index.ts`
- Clean imports: `import { Button, UserManager } from '@/components'`
- Specific imports when needed: `import { Button } from '@/components/Button.atom'`

## 🚨 MANDATORY RULES (NEVER BREAK THESE):

### Unit Tests
 **MANDATORY**: Write unit tests for ALL new features using Node.js built-in test runner
- Testing files placed in SAME directory as component being tested
- Add `.test` suffix to filename (e.g., `Component.tsx` → `Component.test.tsx`)
- Extension MUST match the file being tested (`.ts` → `.test.ts`)
- Test business logic in business components
- Test UI rendering and interactions in atoms, molecules, organisms

### 1. CUSTOM HOOKS USAGE - ABSOLUTE REQUIREMENT
 **ALWAYS extract stateful logic into custom hooks** - NOT optional, REQUIRED
- **API calls MUST be in custom hooks** - NEVER put fetch/API logic in components
- **Form state MUST be in custom hooks** - NEVER manage form state directly in components
- **ALL useState/useEffect logic MUST be in custom hooks**
- Hooks prefixed with `use` and placed in `src/hooks/`
- Current hooks: `useReducedMotion`, `useLogin`, `useFormValidation`, `useRequests`, `useDashboard`, `usePasswordStrength`, `useForgotPassword`, `useResetPassword`
- **🚫 RULE VIOLATION**: If you see useState, useEffect, or fetch in a component, it MUST be extracted to a hook

### 2. IMPORT PATHS - ABSOLUTE REQUIREMENT  
- **React Imports**: NEVER import React types and functions from `"React"`. ALWAYS use direct imports from `"react"`
- **Import Extensions**: NEVER include `.js` or `.ts` file extensions in imports - TypeScript/bundler handles this automatically
⚠️ **ALWAYS use alias imports** - NEVER use relative paths
- **Frontend aliases**: `@components`, `@hooks`, `@icons`, `@styles`, `@utils`
- **Backend aliases**: `@server` (for src/server/*), `@shared` (for src/shared/*)
- **General src alias**: `@/` (for any folder within src/*)
- ✅ Correct: `import { Button } from '@components'`
- ✅ Correct: `import { UserModel } from '@server/database/models/User'`
- ✅ Correct: `import { env } from '@shared/config/env'`
- ✅ Correct: `import { SomeType } from '@/types'`
- ❌ Wrong: `import { Button } from '../components'`
- ❌ Wrong: `import { UserModel } from '../../server/database/models/User'`

### 5. COMPONENT SIZE LIMITS - STRICT ENFORCEMENT
⚠️ **Components MAX 150 lines of code**
- If longer: extract smaller components or custom hooks
- Break complex logic into custom hooks in `src/hooks/` (NOT `src/app/hooks/`)