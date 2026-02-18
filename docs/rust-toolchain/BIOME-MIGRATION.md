# Migrating Existing Repos to Biome

This guide covers migrating an existing Brain Garden project (created before the Biome switch) from ESLint + Prettier to Biome.

## Quick Migration (< 5 minutes)

### 1. Install Biome

```bash
pnpm add -Dw @biomejs/biome
```

### 2. Copy biome.json

Copy `biome.json` from the foundry template root into your project root.

### 3. Remove ESLint + Prettier

```bash
# Remove config files
rm -f eslint.config.* .eslintrc* .prettierrc* prettier.config.*
find . -name "eslint.config.*" -not -path "*/node_modules/*" -delete
find . -name "prettier.config.*" -not -path "*/node_modules/*" -delete

# Remove tooling packages
rm -rf tooling/eslint tooling/prettier
```

### 4. Clean package.json files

For each `package.json` in your monorepo:

1. Remove these devDependencies:
   - `eslint`, `prettier`, and all `eslint-*`, `prettier-*`, `@eslint/*` packages
   - `@kit/eslint-config`, `@kit/prettier-config`

2. Remove these keys:
   - `eslintConfig`
   - `prettier`

3. Update scripts:
   - `"lint": "biome lint ."`
   - `"format": "biome format . --check"`

### 5. Update root package.json

```json
{
  "scripts": {
    "lint": "biome lint .",
    "format": "biome format . --check",
    "format:fix": "biome format . --write",
    "check": "biome check .",
    "check:fix": "biome check . --write"
  }
}
```

### 6. Auto-fix

```bash
# Fix all formatting + lint auto-fixable issues
pnpm biome check . --write
```

### 7. Update VS Code

Replace ESLint + Prettier extensions with the Biome extension (`biomejs.biome`).

## Rule Mapping

| ESLint Rule | Biome Equivalent |
|-------------|-----------------|
| `no-unused-vars` | `correctness/noUnusedVariables` |
| `no-console` | `suspicious/noConsoleLog` |
| `prefer-const` | `style/useConst` |
| `react-hooks/exhaustive-deps` | `correctness/useExhaustiveDependencies` |
| `react-hooks/rules-of-hooks` | `correctness/useHookAtTopLevel` |
| `import/order` | Built-in import sorting (`organizeImports`) |
| `@typescript-eslint/no-explicit-any` | `suspicious/noExplicitAny` |
| `@typescript-eslint/no-unused-vars` | `correctness/noUnusedVariables` |

## Prettier → Biome Formatting

Biome's formatter is compatible with Prettier. The `biome.json` in the template configures:
- 2-space indent
- Single quotes
- Trailing commas
- Semicolons always
- 100 char line width

These match the previous Prettier config.
