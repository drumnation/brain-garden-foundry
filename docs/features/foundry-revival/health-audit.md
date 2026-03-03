# Foundry Package Health Audit

**Date**: 2026-03-03
**Auditor**: Grove Steward (PROP-030/S1)
**Monorepo**: brain-garden-foundry

## Executive Summary

| Status | Count | Packages |
|--------|-------|----------|
| 🟢 Healthy | 4 | core-appwrite, core-responsive, shared-utils, design-system |
| 🟡 Needs Updates | 8 | auth-ui-components, appwrite-auth, appwrite-deployment, appwrite-migrations, deploy-cli, core-scanner, core-db, ui-components |
| 🔴 Stubs (no source) | 3 | core-crud, core-layouts, core-panels |
| ⚪ Meta-package | 1 | scheduling-api (contains calendar + tasks sub-packages) |
| 🔵 Empty shells | 2 | shared-types, shared-ui |

## Health Matrix

### 🟢 Healthy Packages

| Package | Deps | Build | Tests | Notes |
|---------|------|-------|-------|-------|
| core-appwrite | ✅ Consistent | ✅ Has config | 1 test | Clean, minimal |
| core-responsive | ✅ Consistent | ✅ Has config | 2 tests | Most tested |
| shared-utils | ✅ Minimal | ✅ Has config | 1 test | Good utility base |
| design-system | ✅ Updated (Mantine 7.15) | ✅ Has config | 0 tests | Vitest 3.2.4 |

### 🟡 Needs Updates

| Package | Issue | Priority Fix |
|---------|-------|--------------|
| auth-ui-components | Vitest 2.1.3, TS 5.5.4, Mantine 7.3.2 | Update all 3 |
| appwrite-auth | Vitest 2.1.8 | Update to 3.x |
| appwrite-deployment | Vitest 2.1.4, TS 5.7.2, ESLint 8 | Update all, ESLint 9 migration |
| appwrite-migrations | Vitest 2.1.8, no tests | Update, add tests |
| deploy-cli | Vitest 2.1.8 | Update to 3.x |
| core-scanner | Vitest unspecified, no tests | Add vitest, add tests |
| core-db | better-sqlite3 native module | **Blocker for bun** |
| ui-components | Vitest 3.2.4 but mixed React 18.0/18.3 | Fix React version consistency |

### 🔴 Stubs (No Source Code)

| Package | Files | Recommendation |
|---------|-------|----------------|
| core-crud | package.json, tsconfig.json | Implement or remove |
| core-layouts | package.json, tsconfig.json | Implement or remove |
| core-panels | package.json, tsconfig.json | Implement or remove |

### ⚪ Meta/Empty

| Package | Structure | Notes |
|---------|-----------|-------|
| scheduling-api | calendar/ + tasks/ sub-packages | No root package.json - intentional? |
| shared-types | 4 files, no deps | Type-only package, OK |
| shared-ui | 8 files, no deps | Likely re-export shell |

## Version Fragmentation Analysis

### Vitest (Critical)
```
3.2.4: 3 packages (design-system, ui-components, core-responsive)
2.1.8: 5 packages
2.1.4: 1 package
2.1.3: 1 package
Unspecified: 9 packages (via @kit/testing or missing)
```
**Action**: Standardize to Vitest 3.2.4 across all packages

### TypeScript
```
5.7.2: 1 package (appwrite-deployment)
5.5.4: 1 package (auth-ui-components)
Root: 5.7.3 (most inherit this)
```
**Action**: Remove explicit versions, inherit from root 5.7.3 → update root to 5.8.x

### Mantine
```
7.15.1: 4 packages
7.3.2: 3 packages
```
**Action**: Update 7.3.2 → 7.15.1 for consistency

### React
```
18.3.1: Most packages
18.0.0: Some devDependencies (peer dep range)
```
**Action**: Consistent - no change needed

## Bun Migration Assessment

### Blockers
1. **better-sqlite3** in core-db - Native module, may not work with bun
2. **pnpm workspace protocol** - bun has different workspace handling
3. **No bun.lockb** - need to test `bun install` compatibility

### Compatible Packages (likely)
- All appwrite-* packages (no native deps)
- All @emotion packages
- All @mantine packages
- design-system, ui-components, shared-*

### Needs Testing
- core-db (better-sqlite3)
- Packages with vitest (different test runner?)

## Priority Order

1. **P0 - Clean up stubs**
   - Remove or implement core-crud, core-layouts, core-panels
   
2. **P1 - Standardize versions**
   - Update all Vitest to 3.2.4
   - Update all Mantine to 7.15.1
   - Remove explicit TypeScript versions (inherit from root)
   
3. **P2 - Update root**
   - TypeScript 5.7.3 → 5.8.x
   - Run npm audit / pnpm audit
   
4. **P3 - Add missing tests**
   - 12 packages have 0 tests
   - Target: minimum 1 test per package

5. **P4 - Bun exploration**
   - Test bun install on clean clone
   - Investigate better-sqlite3 alternatives (bun:sqlite?)

## Test Coverage Summary

| Tests | Packages |
|-------|----------|
| 2 | core-responsive |
| 1 | appwrite-auth, appwrite-deployment, core-appwrite, shared-utils |
| 0 | 12 packages |

**Total tests found**: 6 test files across 18 packages

## Files Analyzed

- 18 package.json files
- 18 tsconfig.json files
- Root package.json with devDependencies
- pnpm-workspace.yaml
- pnpm-lock.yaml (500KB)

## Recommendations for Next Stories

1. **S2 Security Audit** - Run `npm audit` equivalent, check for CVEs
2. **S5 Dependency Updates** - Use this matrix as input for what to update
3. **S6 Bun Migration** - core-db is the key blocker to investigate

---

## WHAT
Audited all 18 packages in brain-garden-foundry monorepo, analyzing dependency versions, build configs, test coverage, and identifying stubs/empty packages.

## HOW
- Extracted all package.json dependencies via jq/grep
- Counted test files per package (*.test.ts, *.spec.ts)
- Identified build configs (tsconfig.json, vite.config.ts)
- Analyzed version fragmentation across Vitest, TypeScript, Mantine, React
- Assessed bun migration blockers (native modules)

## DECISIONS
- Categorized 3 packages as stubs (core-crud, core-layouts, core-panels) - recommend removal or implementation
- Identified better-sqlite3 as bun migration blocker before testing
- Chose Vitest 3.2.4 as target version (already used by 3 packages)
- Did not run npm audit (no pnpm in environment) - deferring to S2

## LANDMINES
- scheduling-api has sub-packages but no root package.json - may confuse tooling
- Some packages have React in both dependencies AND devDependencies with different versions
- @kit/testing workspace package may hide vitest version inconsistencies
- better-sqlite3 requires compilation - will fail on systems without build tools
