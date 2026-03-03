# MEMORY.md - Brain Garden Foundry

_Long-term memory for agents working in foundry._

## Purpose

This file stores curated learnings from working on brain-garden-foundry. Agents read this on startup to understand what's been learned.

## Project Context

**What is this?** A monorepo template for spawning new projects with multi-agent Claude Code teams.

**Current state (2026-03-03):**
- 18 packages in various states of health
- 3 are stubs (core-crud, core-layouts, core-panels) - need implementation or removal
- 30 security vulnerabilities (all in dev deps)
- Vitest fragmented between 2.1.x and 3.2.4
- better-sqlite3 blocks bun migration

**Goal:** Prove Grove Memory System works - execute stories, accumulate domain knowledge in Neo4j graph.

## Key Decisions

| Decision | Rationale | Date |
|----------|-----------|------|
| Standardize on Vitest 3.2.4 | Already used by 3 packages | 2026-03-03 |
| Remove stubs rather than implement | No clear use case, adds maintenance burden | 2026-03-03 |
| Fix vulns via pnpm update | Safer than manual bumps, can review diff | 2026-03-03 |
| Self-contained agent definitions | No global ~/.claude dependency | 2026-03-03 |
| Agent XP tracking | Game Dev Tycoon model - agents gain domain experience | 2026-03-03 |

## Known Landmines

| Landmine | Impact | Discovered |
|----------|--------|------------|
| scheduling-api has no root package.json | May confuse tooling | S1 |
| React in deps AND devDeps with different versions | Potential resolution issues | S1 |
| @kit/testing hides vitest version fragmentation | Hard to detect inconsistencies | S1 |
| better-sqlite3 needs compilation | Blocks bun, fails on systems without build tools | S1 |
| pnpm not installed by default | Need to install globally first | S2 |
| Storybook ecosystem has many vulns | 21 high severity via transitive deps | S2 |

## Agent Experience

Track which agents have worked here:

| Agent | Stories | Level | Domains |
|-------|---------|-------|---------|
| grove-steward | 3 | Junior | general(3) |
| security-scanner | 1 | Trainee | vulnerability-assessment(1) |
| architect | 1 | Trainee | agent-definition(1) |

## Patterns That Work

1. **Game Dev Tycoon model** - Agents gain XP per story, level up over time
2. **Memory-first** - Query context before starting, record after completion
3. **Evidence-based** - Score ≥90 required before marking complete
4. **Self-contained** - No external dependencies, everything in repo

## Next Steps

1. S4: Create this memory structure ✅
2. S5: Update dependencies (apply security fixes)
3. S6: Audit bun migration feasibility
4. S7: Verify Neo4j writes

## Related Files

- `.claude/agents/grove-steward.md` - Agent definition
- `.claude/memory/` - Daily logs go here
- `~/clawd/state/domain-stores/grove-execution/` - DomainStore files
- `~/clawd/sandbox-lib/grove_memory.py` - Memory integration

---

_This file is curated wisdom. Daily logs go in memory/YYYY-MM-DD.md_
