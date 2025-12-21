---
name: typescript-guidelines
description: Coding guidelines and best practices for TypeScript projects.
---

# Coding guidelines

## General Formatting

- **Line width**: 120 characters maximum
- **Indentation**: 2 spaces (no tabs)
- **Line endings**: LF (Unix-style)
- **Semicolons**: Always required
- **Quotes**: Double quotes for strings and JSX attributes
- **Trailing commas**: Always use trailing commas where valid
- **Arrow functions**: Always use parentheses around parameters
- **Bracket spacing**: Use spaces inside object literal braces
- **JSX bracket placement**: Place closing bracket on new line
- **Do not Over-engineer**: Focus on maintainability and simplicity

## Code Quality Rules

### Style Rules (Error Level)

- **Block statements required**: Always use block statements (braces) for control structures

  ```typescript
  // L Avoid
  if (condition) doSomething();

  //  Correct
  if (condition) {
    doSomething();
  }
  ```

### Complexity Management

- **Cognitive complexity**: Keep functions under 5 complexity points
- Break down complex functions into smaller, more focused functions
- Use early returns to reduce nesting

### Async/Await Best Practices

- **Proper await usage**: Always await async operations properly
- Don't forget to handle promise rejections

### Type Safety

- **Avoid shorthand property overrides**: Be explicit with property definitions
- **Proper assertions**: Use type assertions correctly and sparingly
- **Evolving types**: Maintain stable type definitions
- **Empty blocks**: Avoid empty block statements without comments

### Type Definitions

- Use strict TypeScript configuration
- Prefer interfaces over type aliases for object shapes
- Use proper generic constraints
- Avoid `any` type - use `unknown` or proper typing instead

## Code Organization

### File Structure

- File names MUST be kebab-case
- Use named exports for clarity, avoid use of default exports
- Group related functionality together
- Use barrel exports (`index.ts`) appropriately

### Naming Conventions

- Use camelCase for variables and functions
- Use PascalCase for classes and components
- Use UPPER_SNAKE_CASE for constants
- Use descriptive names that explain intent

### Comments and Documentation

- Write self-documenting code when possible
- Add comments for complex business logic
- Document public APIs and interfaces
- Avoid obvious comments
- When adding comments ensure they are explaining the reasoning

## Testing Guidelines

- Write tests for all public interfaces
- Use Vitest as the testing framework

## Global Variables

- Minimize use of global variables
- Prefer explicit imports over globals when possible

## Comments

- Use comments only when the code is not self-explanatory

## Patterns to Avoid

### Console Logging

- Remove all console.log and console.debug statements
- Use console.error only for genuine error reporting
- Danger pre-commit blocks console.log

### Large Component Files

- Components exceeding 500 lines are hard to maintain and test
- Break into smaller sub-components
- Extract logic to custom hooks
- Examples found: BillingTreeWidget.tsx, ChangeAnalysisModal.tsx, RecommendationImpactEffortBubbleWidget.tsx

### Mixed Responsibilities

- Container components should not mix data fetching, state management, and rendering
- Extract custom hooks for data and state logic
- Keep components focused on rendering only

### Inconsistent Error Handling

- Some API calls have error handling, others silently fail
- Standardize error handling pattern across all API calls
- Always handle loading, error, and success states

### Prop Drilling

- Avoid passing props through multiple component levels
- Use context or composition patterns instead
- Especially problematic in dashboard widget hierarchy

### Magic Numbers and Strings

- Hardcoded values without named constants
- Extract widget sizes, polling intervals, cache times to constants
- Create configuration files for magic values

### Type Assertions Without Guards

- Using `as Type` without runtime checks is unsafe
- Add runtime type guards or validation
- Avoid casting unknown or any types directly

### Incomplete TypeScript

- Eliminate any types where possible
- Define proper interfaces for all data structures
- Widget data should have explicit types, not unknown then cast

### Duplicate Definitions (Types and Constants)

- Types and constants duplicated across files or packages create maintenance burden
- Before adding a new constant or type, check if it already exists or should be shared
- Consolidate shared definitions to a shared package (e.g., `@chaosfix/core`)
- Import from the shared package rather than redefining locally
- If a value is used in more than one file, it belongs in a shared location

### Missing Loading States

- All async operations need loading indicators
- Use skeleton screens or spinners
- Improve perceived performance

### Inconsistent Naming

- Mix of camelCase, PascalCase, kebab-case in file/folder names
- Standardize on kebab-case for folders, PascalCase for components
- Examples: cost-analysis vs cloudAccounts

### God Components and Hooks

- Some hooks do too much (e.g., useCloudAccountsWithSubscriptions)
- Split into smaller, focused, single-responsibility hooks
- Each hook should have one clear purpose

## Imports guidelines
- When importing types re-use the existing import statement and use the keyword "type", example: import { TERMINAL_IPC_CHANNELS, type PTYCreateOptions } from "@chaosfix/terminal-bridge";

## Code Order

- Order code logically within each file:
  1. Imports (external packages first, then internal)
  2. Constants (UPPER_SNAKE_CASE)
  3. Types and interfaces
  4. Utility/helper functions
  5. Main component, class, or exported function
- Never define constants or types in the middle of a file between functions
- Group related definitions together