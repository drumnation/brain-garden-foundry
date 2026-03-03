```
 ___  ___  ___   _____  __  ________   ___  ___  _____  __
  / _ )/ _ \/ _ | /  _/ |/ / / ___/ _ | / _ \/ _ \/ __/ |/ /
 / _  / , _/ __ |_/ //    / / (_ / __ |/ , _/ // / _//    /
/____/_/|_/_/ |_/___/_/|_/  \___/_/ |_/_/|_/____/___/_/|_/

   ________  __  ___  _____  _____  __
  / __/ __ \/ / / / |/ / _ \/ _ \ \/ /
 / _// /_/ / /_/ /    / // / , _/\  /
/_/  \____/\____/_/|_/____/_/|_| /_/

                        [▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] MEMORY_PERSISTENT
                        [▓▓▓▓▓▓▓▓░░░░░░░░░░] AGENT_XP_TRACKING
                        [▓▓▓▓▓▓░░░░░░░░░░░░] NEO4J_GRAPH_READY
                        [▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] BIOME_FORMATTER
```

# Brain Garden Foundry

**A self-contained monorepo template for multi-agent Claude Code teams with persistent memory.**

> *Clone this repo → Your agents gain domain knowledge from day one.*

## What This Is

Brain Garden Foundry is a template for spawning new projects where **agents learn and remember**. Every execution writes to Neo4j + DomainStore, building cumulative domain knowledge over time.

**The Game Dev Tycoon model:**
- Agents complete stories → gain domain XP
- Each project teaches patterns that compound
- New projects query past learnings before starting
- Your team gets smarter with every execution

## Quick Start

```bash
# Clone the template
git clone https://github.com/drumnation/brain-garden-foundry.git my-project
cd my-project

# Remove git history (start fresh)
rm -rf .git && git init

# Install dependencies
pnpm install

# Check code quality (Biome - 10-50x faster than ESLint)
pnpm check

# Auto-fix issues
pnpm check:fix

# Start developing
# Your agents read .claude/AGENTS.md and .claude/memory/MEMORY.md
```

## What's Included

### Agent System
- **`.claude/agents/grove-steward.md`** - Self-contained orchestrator with borged Cortex patterns
- **No global dependency** - Everything lives in the repo

### Memory System
- **`.claude/memory/MEMORY.md`** - Curated long-term wisdom
- **`.claude/memory/YYYY-MM-DD.md`** - Daily logs
- **`~/clawd/state/domain-stores/grove-execution/`** - JSON DomainStore
- **Neo4j on Hetzner** - Graph memory for pattern queries

### 17 Packages

| Package | Status | Purpose |
|---------|--------|---------|
| core-db | 🟢 | SQLite + Drizzle adapter |
| core-appwrite | 🟢 | Appwrite SDK wrapper |
| core-responsive | 🟢 | Responsive design utilities |
| design-system | 🟢 | Mantine-based design system |
| ui-components | 🟢 | Shared UI components |
| appwrite-auth | 🟡 | Authentication flows |
| appwrite-deployment | 🟡 | CLI for Appwrite deployment |
| appwrite-migrations | 🟡 | Database migrations |
| auth-ui-components | 🟡 | Auth UI components |
| core-scanner | 🟡 | Project scanning |
| deploy-cli | 🟡 | Deployment CLI |
| shared-types | 🟢 | Type definitions |
| shared-ui | 🟢 | UI primitives |
| shared-utils | 🟢 | Utility functions |
| core-crud | 🔴 | Stub - needs implementation or removal |
| core-layouts | 🔴 | Stub - needs implementation or removal |
| core-panels | 🔴 | Stub - needs implementation or removal |

### Rust-Based Tooling

| Tool | Replaces | Speedup |
|------|----------|---------|
| [Biome](https://biomejs.dev) | ESLint + Prettier | 10-50x |
| Rolldown (via Vite 8) | esbuild/Rollup | Planned |

## Scripts

```bash
# Development
pnpm dev              # Start all apps in dev mode
pnpm build            # Build all packages
pnpm test             # Run all tests

# Biome (Rust-based linting/formatting)
pnpm check            # Lint + format check
pnpm check:fix        # Auto-fix all issues
pnpm biome:format     # Format only
pnpm biome:lint       # Lint only

# Generators
pnpm gen:library      # Create new library package
pnpm gen:react-web    # Create React web app
pnpm gen:express-api  # Create Express API
```

## Agent Experience System

Agents gain XP when they complete stories:

| Level | Stories | Title |
|-------|---------|-------|
| 1-2 | Trainee | New agent, learning |
| 3-5 | Junior | Gaining competence |
| 6-9 | Senior | Domain expert |
| 10+ | Expert | Master |

Track agent stats:
```python
from grove_memory import get_agent_experience
print(get_agent_experience("architect"))
# {'agent': 'architect', 'stories': 2, 'domains': {'agent-definition': 1, 'memory-systems': 1}}
```

## Known Issues

| Issue | Impact | Landmine |
|-------|--------|----------|
| better-sqlite3 | Blocks bun migration | Native module, investigating alternatives |
| Vitest fragmentation | 2.1.x vs 3.2.4 | Standardize to 3.2.4 |
| 3 stub packages | Dead weight | core-crud, core-layouts, core-panels |

## Architecture

```
brain-garden-foundry/
├── .claude/
│   ├── agents/           # Agent definitions
│   │   └── grove-steward.md
│   ├── memory/           # Persistent memory
│   │   ├── MEMORY.md     # Long-term wisdom
│   │   └── YYYY-MM-DD.md # Daily logs
│   └── AGENTS.md         # Quick start for agents
├── packages/             # 17 shared packages
├── docs/
│   ├── features/         # Feature documentation
│   └── rust-toolchain/   # Biome migration docs
├── tooling/
│   └── generators/       # Package generators
├── biome.json            # Biome config (Rust-based linting)
└── scripts/              # Utility scripts
```

## Grove Memory Integration

Every story execution writes to memory:

```python
from grove_memory import GroveMemory

mem = GroveMemory()
mem.record_story(
    proposal="PROP-XXX",
    story="SX",
    what="Description of deliverable",
    how="Approach used",
    decisions=["Non-obvious choice 1", "Choice 2"],
    landmines=["Warning for future"],
    score=95,
    executed_by="agent-name",
    domain="domain-expertise"
)
```

Query context before starting:
```python
from grove_memory import get_context_for_task
context = get_context_for_task("migrate from pnpm to bun")
# Returns: similar past work, decisions, landmines
```

## Philosophy

1. **Memory over restarts** - Agents remember across sessions
2. **XP compounds** - Each project makes your team smarter
3. **Self-contained** - No external dependencies on global config
4. **Evidence-based** - Stories require proof of completion (score ≥90)
5. **Game Dev Tycoon model** - Agents level up through work
6. **Rust tooling** - Biome for 10-50x faster linting/formatting

## Origin

Borged from Brain Garden Cortex (7.5GB accumulated patterns on Mac). Extracted:
- 7 core patterns embedded in grove-steward.md
- 5-tier task sizing framework
- Evidence-based completion protocol
- Agent XP tracking system

## Related Projects

- **OpenClaw** - The runtime that hosts these agents
- **Grove Pipeline** - Story execution orchestrator
- **DomainStore** - JSON-based memory layer
- **Neo4j on Hetzner** - Graph memory backend

## License

MIT

---

**Built with ❤️ by the Brain Garden team**

*Provenance: PROP-030 (Foundry Revival) + rust-toolchain-biome-rolldown merge*
*Graph state: 6 StoryExecutions, 34 Decisions, 12 Landmines, 5 Agents*
