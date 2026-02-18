# Biome Migration Guide

## Current Status: Side-by-Side (Phase 1)

Biome runs **alongside** ESLint + Prettier — not replacing them. Both toolchains are available.

### Why Side-by-Side?

Biome lacks equivalents for these ESLint plugins we rely on:

| ESLint Plugin | What It Does | Biome Status |
|---------------|-------------|--------------|
| `sort-keys-fix` | Auto-sort object keys | ❌ No equivalent |
| `typescript-sort-keys` | Sort interface/enum keys | ❌ No equivalent |
| `styled-components-a11y` | a11y rules for CSS-in-JS | ❌ No equivalent |
| `better-styled-components` | Sort CSS declarations | ❌ No equivalent |
| `eslint-config-turbo` | Turborepo env var safety | ❌ No equivalent |
| `import/no-cycle` | Circular dependency detection | ❌ No equivalent |
| `eslint-plugin-storybook` | Storybook best practices | ❌ No equivalent |

Until Biome covers these, ESLint stays.

## What Biome Handles Now

**Formatting** (replaces Prettier for speed):
- `pnpm biome:format` — 10-50x faster than Prettier

**Linting** (subset that overlaps ESLint):
- Unused imports/variables (auto-fixable)
- Import type enforcement
- Import organization
- React hooks rules
- a11y checks
- General code quality (useless catch, etc.)

## Running Both

```bash
# ESLint (existing — full rule coverage)
pnpm lint

# Biome (new — fast subset)
pnpm biome:check        # Check only
pnpm biome:fix          # Auto-fix safe issues
pnpm biome:format       # Format only
pnpm biome:ci           # CI mode (errors on issues)
```

## Biome Config Tuning

The `biome.json` is tuned to match our existing ESLint/Prettier config:

| Setting | Value | Matches |
|---------|-------|---------|
| `lineWidth` | 80 | Prettier `printWidth: 80` |
| `indentStyle` | space | Prettier `useTabs: false` |
| `indentWidth` | 2 | Prettier `tabWidth: 2` |
| `quoteStyle` | single | Prettier `singleQuote: true` |
| `semicolons` | always | Prettier `semi: true` |
| `trailingCommas` | all | Prettier `trailingComma: 'all'` |
| `bracketSpacing` | false | Prettier `bracketSpacing: false` |
| `noExplicitAny` | off | Matches ESLint `no-explicit-any: off` |
| `noConsole` | off | Matches ESLint overrides |
| `noUnusedFunctionParameters` | off | Not enforced by ESLint |

### Dry Run Results (148 files)

| Stage | Diagnostics |
|-------|------------|
| Biome defaults (untuned) | ❌ 550 |
| After matching ESLint rules | 249 (102 auto-fixable) |
| After auto-fix | ✅ 63 (real code quality catches) |

The 63 remaining are legitimate issues ESLint wasn't catching:
- 25 unused vars/imports (need manual review)
- 12 a11y: invalid anchors
- 10 useless catch blocks
- 16 misc (button types, fragments, etc.)

## Migration Plan (When Ready)

### Phase 2: Replace Prettier with Biome Formatter
- Remove Prettier dependency
- Keep ESLint for lint rules
- Use Biome for formatting only (10-50x faster)

### Phase 3: Replace Overlapping ESLint Rules
- Disable ESLint rules that Biome covers
- Keep ESLint only for plugin-specific rules (styled-components, sort-keys, turbo, storybook)

### Phase 4: Full Migration (blocked)
- Only when Biome adds CSS-in-JS support and key-sorting
- Track: https://github.com/biomejs/biome/issues

## Rule Mapping Reference

| ESLint Rule | Biome Equivalent | Status |
|-------------|-----------------|--------|
| `no-unused-vars` | `correctness/noUnusedVariables` | ✅ |
| `no-console` | `suspicious/noConsole` | ✅ |
| `prefer-const` | `style/useConst` | ✅ |
| `react-hooks/exhaustive-deps` | `correctness/useExhaustiveDependencies` | ✅ |
| `react-hooks/rules-of-hooks` | `correctness/useHookAtTopLevel` | ✅ |
| `import/order` | `assist/source/organizeImports` | ✅ |
| `@typescript-eslint/no-explicit-any` | `suspicious/noExplicitAny` | ✅ |
| `@typescript-eslint/no-unused-vars` | `correctness/noUnusedVariables` | ✅ |
| `import/no-cycle` | — | ❌ Not available |
| `sort-keys-fix` | — | ❌ Not available |
| `typescript-sort-keys` | — | ❌ Not available |
| `styled-components-a11y/*` | — | ❌ Not available |
| `better-styled-components/*` | — | ❌ Not available |

## Emotion Migration Note

The template is migrating from `styled-components` to `@emotion/styled` (styled-components is deprecated). The a11y and sorting lint rules for CSS-in-JS will need emotion-compatible equivalents — this is tracked separately.
