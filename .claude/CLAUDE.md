# warmup-scaffold

**Version**: 0.1.0 | **Created**: 2026-03-18

---

## Project Overview

warmup-scaffold - A Brain Garden project.

---

## Brain Garden Integration

This project uses the Brain Garden framework with:
- **GROVE Methodology**: Structured planning and documentation
- **Arbor Skills**: AI-assisted development workflows
- **Memory System**: Two-layer memory (file workspace + Neo4j graph via `mind` CLI)
- **Quality Gates**: Automated validation and testing

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Run validation
pnpm brain:validate
```

---

## For AI Agents

This project follows Brain Garden conventions:
- Use GROVE for all planning
- Apply Arbor verification before implementation
- Maintain memory context across sessions
- Follow the established patterns in `.brain/rules/`

---

*Created with Foundry - Brain Garden Code Factory*

---

## System Architecture

This project uses a layered system to keep AI-assisted development organized:

```
Rules (what patterns to follow)
  → Agents (who follows them, scoped by role)
    → Enforcement (hooks that verify compliance)
      → Memory (learnings that compound across sessions)
```

### Architectural Rules

Source: `.brain/rules/` → Synced to: `.cursor/rules/`, `CLAUDE.md`, `.cursorrules` via `pnpm rules:build`

| Rule | What It Enforces |
|------|-----------------|
| **react-bulletproof-component-pattern** | Feature-based folder structure, co-located tests, typed props, barrel exports |
| **monorepo-node-express-architecture** | Hexagonal architecture with ports/adapters, dependency inversion, use-case orchestration |
| **monorepo-structure-and-configuration** | ESM-only, shared tooling via `@kit/*`, workspace protocol, turbo pipeline |
| **node.functional-isolated-concerns** | Pure functions, dependency injection, no side effects in business logic |
| **tdd-workflow** | E2E-first testing, integration > unit, evidence-based completion |
| **database-repository-patterns** | Repository pattern, typed queries, migration-first schema changes |
| **component-design-decision-tree** | When to create new components vs compose existing ones |
| **pr-creation-guidelines** | PR structure, review checklist, conventional commits |

These rules are the same regardless of which AI platform you use. `pnpm rules:build` distributes them.

### Agent Roles

Defined in: `.claude/agents/`

| Agent | Role | Key Rules It Follows |
|-------|------|---------------------|
| **architect** | System design, patterns | bulletproof-react, express-architecture, functional-concerns |
| **grove-steward** | Orchestration, delegation | Delegates to other agents, never implements directly |
| **validator** | Quality checks, tests | tdd-workflow, evidence scoring |
| **researcher** | Investigation, analysis | Reports findings with evidence |
| **maintainer** | Docs, cleanup, deps | documentation-strategy, package-docs |
| **security-scanner** | Vulnerability audits | Security patterns, dependency scanning |
| **integrator** | Merging, conflict resolution | PR guidelines, monorepo-structure |

Agents are roles, not personalities. Any LLM can inhabit them. They describe HOW to work in this monorepo.

### Memory System

Each session's learnings persist for future sessions:

| Layer | Location | Purpose |
|-------|----------|---------|
| **MEMORY.md** | `.claude/memory/MEMORY.md` | Curated long-term wisdom — decisions, landmines, patterns |
| **Daily logs** | `.claude/memory/YYYY-MM-DD.md` | Raw session traces and thinking traces |
| **Graph memory** | Neo4j via `mind` CLI | Searchable decisions and patterns across all sessions |

Agents read MEMORY.md on startup. Key decisions get recorded to the graph. The 10th session on a feature is dramatically more productive than the 1st.

### Quality Gates

Before any work is marked complete:

| Gate | Method | Threshold |
|------|--------|-----------|
| Types | `pnpm typecheck` | Zero errors |
| Lint | `pnpm biome:check` | Zero issues |
| Tests | `pnpm test` | All passing |
| Evidence | File verification + test output | Score ≥90/100 |

### Monorepo Conventions

**ESM-Only** — No CommonJS. Packages export `.ts` directly, no build step for libraries.

**Shared Config** — All tooling centralized in `/tooling` as `@kit/*` packages.

**Turbo Pipeline** — `pnpm build` respects dependency order. `pnpm typecheck` and `pnpm test` are cacheable.

```
/packages          Shared libraries (ESM-only, no build step)
/tooling           Shared config (@kit/* — eslint, prettier, typescript, testing)
/docs              Planning artifacts (GROVE methodology)
/.brain/rules      Source of truth for all architectural rules
/.claude           Agent definitions, memory, project config
/.cursor/rules     Auto-generated Cursor rules (from .brain/rules)
```
