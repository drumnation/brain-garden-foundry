# Rust-Based Toolchain

## What

Brain Garden Foundry now uses **Rust-based development tools** where possible, replacing slower JavaScript-based equivalents:

| Tool | Replaces | Language | Speedup |
|------|----------|----------|---------|
| [Biome](https://biomejs.dev) | ESLint + Prettier | Rust | 10-40x |
| [Rolldown](https://rolldown.rs) (via Vite 8) | esbuild/Rollup (via Vite) | Rust | Planned |

## Why

1. **Speed** — Biome processes thousands of files in milliseconds. CI lint/format steps drop from minutes to seconds.
2. **Simplicity** — One tool replaces two (ESLint + Prettier), eliminating config conflicts and plugin sprawl.
3. **Zero config per package** — Single `biome.json` at the root. No per-package eslint/prettier configs needed.
4. **Better defaults** — Biome ships with sensible rules out of the box. No plugin ecosystem to manage.

## Current State

### ✅ Biome (Active)
- Root `biome.json` configures linting, formatting, and import sorting
- All packages inherit from root config
- Generators create packages that use Biome

### 🔮 Rolldown via Vite 8 (Planned)
- See [VITE8-ROLLDOWN-ASSESSMENT.md](./VITE8-ROLLDOWN-ASSESSMENT.md)
- Current: Vite 6 with esbuild/Rollup
- Future: Vite 8 will use Rolldown (Rust bundler) internally

## Usage

```bash
# Check everything (lint + format + imports)
pnpm check

# Auto-fix everything
pnpm check:fix

# Just lint
pnpm lint

# Just check formatting
pnpm format

# Auto-fix formatting
pnpm format:fix
```

## Editor Setup

Install the [Biome VS Code extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) for:
- Format on save
- Inline lint errors
- Import organization on save

### VS Code Settings (recommended)
```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports.biome": "explicit"
  }
}
```
