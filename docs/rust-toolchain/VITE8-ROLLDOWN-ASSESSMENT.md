# Vite 8 / Rolldown Assessment

## Current State

- **Vite version in use:** 5.x (some packages), 6.x (Storybook/generators reference)
- **Bundler:** esbuild (dev) + Rollup (build) — the default Vite stack
- **Storybook:** 8.6.x uses `@storybook/react-vite`

## What is Rolldown?

[Rolldown](https://rolldown.rs) is a Rust-based JavaScript bundler designed as a drop-in Rollup replacement. It's being built by the Vite team to unify the dev/build pipeline.

## Vite Roadmap

| Version | Bundler | Status |
|---------|---------|--------|
| Vite 5 | esbuild + Rollup | Current (in some packages) |
| Vite 6 | esbuild + Rollup | Current stable |
| Vite 7 | Rolldown (opt-in) | Expected mid-2025 |
| Vite 8 | Rolldown (default) | Expected late 2025 |

## Upgrade Path

### Phase 1: Standardize on Vite 6 (now)
- Update all packages from Vite 5 to Vite 6
- Ensure Storybook compatibility (8.6+ supports Vite 6)

### Phase 2: Vite 7 with Rolldown opt-in (when available)
- `npm install vite@7`
- Test with `experimental.rolldown: true` in vite.config
- Verify all plugins are compatible

### Phase 3: Vite 8 with Rolldown default (when stable)
- Straightforward upgrade if Phase 2 was validated
- Remove any Rollup-specific plugins
- Expected benefits: faster builds, unified dev/build behavior

## Risks & Considerations

1. **Plugin compatibility** — Some Rollup plugins may not work with Rolldown initially
2. **Storybook** — Must wait for Storybook to officially support Vite 7/8
3. **React Native (Expo)** — Uses Metro bundler, not affected by Vite changes
4. **Electron** — Vite-electron plugins need to support the new bundler

## Recommendation

**Do not upgrade now.** Wait for:
1. Vite 7 stable release with Rolldown opt-in
2. Storybook 9.x with Vite 7 support
3. Community validation of the Rolldown migration path

When ready, the upgrade should be mechanical — Rolldown is designed as a drop-in replacement.
