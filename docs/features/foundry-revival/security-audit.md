# Foundry Security Audit

**Date**: 2026-03-03
**Auditor**: Security-Scanner (PROP-030/S2)
**Monorepo**: brain-garden-foundry

## Executive Summary

| Severity | Count | Immediate Action Required |
|----------|-------|---------------------------|
| High | 21 | ⚠️ Update affected packages |
| Moderate | 7 | Schedule updates |
| Low | 2 | Low priority |
| **Total** | **30** | Run `pnpm update` |

**No exposed secrets found.** No .env files with sensitive data.

## Critical Vulnerabilities

### High Severity (21)

| Package | Issue | Fix | Paths Affected |
|---------|-------|-----|----------------|
| esbuild | Via vite-plugin-istanbul | Update transitive | @storybook/addon-coverage |
| axios | SSRF vulnerability | Update to 1.13.6+ | wait-on, jest-process-manager |
| rollup | Via vite chain | Update transitive | @storybook/addon-coverage |
| ajv | Via schema-utils | Update to 6.14.0+ | @storybook/addon-coverage |

### Moderate Severity (7)

| Package | Issue | Fix | Note |
|---------|-------|-----|------|
| qs | DoS via arrayLimit bypass | Update to 6.15.0+ | Via http-server/union |
| postcss | Review recommended | - | Via eslint-plugin-better-styled |
| js-yaml | Via istanbul config | Update transitive | @storybook/addon-coverage |

### Low Severity (2)

| Package | Issue | Fix |
|---------|-------|-----|
| diff | DoS in parsePatch | Update to 5.2.2+ |
| glob | Various issues | Review |

## Fix Commands

```bash
# Update affected direct dependencies
pnpm update lodash@4.17.23 diff@5.2.2 qs@6.15.0 axios@1.13.6

# Update transitive dependencies
pnpm update --latest

# Full audit fix (review changes first)
pnpm audit --fix
```

## Secrets Check

| Check | Status |
|-------|--------|
| Hardcoded passwords | ✅ None found |
| API keys in code | ✅ None found |
| .env files | ✅ None (only .env.example) |
| .env.example contents | ✅ Safe (no real values) |

## Dependency Risk Assessment

### High Risk (dev dependencies with vulns)
- **@storybook/addon-coverage** - pulls in vulnerable vite chain
- **@storybook/test-runner** - axios SSRF
- **http-server** - qs DoS

### Medium Risk
- **eslint-plugin-better-styled-components** - postcss issues
- **@vscode/test-cli** - mocha → diff DoS

### Low Risk
- **glob** - minimatch issues (low severity)

## Recommended Actions

### P0 - Immediate
1. Run `pnpm update axios@1.13.6 qs@6.15.0 lodash@4.17.23 diff@5.2.2`
2. Consider removing unused storybook addons if not needed

### P1 - This Sprint
1. Run `pnpm audit --fix` and verify tests pass
2. Update http-server to latest (fixes qs issue)

### P2 - Backlog
1. Review storybook addon usage - remove @storybook/addon-coverage if not actively used
2. Consider replacing eslint-plugin-better-styled-components with maintained alternative

## Context from S1 (Package Health Audit)

S1 identified:
- 3 stub packages (core-crud, core-layouts, core-panels)
- Vitest version fragmentation (2.1.x vs 3.2.4)
- better-sqlite3 as bun blocker

This audit adds:
- 30 security vulnerabilities to fix
- All are in dev dependencies (no production risk)
- Most are transitive via storybook ecosystem

## Files Analyzed

- pnpm-lock.yaml (500KB)
- Root package.json
- 18 package package.json files
- All .ts/.js files (secrets scan)

---

## WHAT
Ran pnpm audit on brain-garden-foundry monorepo, identified 30 vulnerabilities (21 high, 7 moderate, 2 low), scanned for exposed secrets, and provided fix commands.

## HOW
- Installed pnpm globally (was missing)
- Ran `pnpm audit --json` for structured output
- Parsed vulnerability list by severity
- Grep'd for hardcoded passwords/API keys
- Checked for .env files with sensitive data
- Cross-referenced with S1 package health findings

## DECISIONS
- All vulnerabilities are in dev dependencies - no immediate production risk
- Will fix via `pnpm update` rather than manual version bumps
- Storybook ecosystem is the main source of vulnerabilities
- Did not run `pnpm audit --fix` automatically - want to review changes first (deferred to S5)

## LANDMINES
- pnpm was not installed on this machine (installed globally via npm)
- axios SSRF affects test-runner, not production code
- qs DoS affects http-server which may be used in CI
- @storybook/addon-coverage pulls in entire vite chain with known vulns

## EXECUTED BY
security-scanner

## DOMAIN
vulnerability-assessment
