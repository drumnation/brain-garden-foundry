# AGENTS.md - For Agents Working in Foundry

Welcome to Brain Garden Foundry. This file tells you what you need to know.

## Quick Start

1. Read `MEMORY.md` - curated long-term memory
2. Read today's log in `memory/YYYY-MM-DD.md` (create if needed)
3. Check `~/.claude/agents/grove-steward.md` for your role
4. Query context before starting work
5. Record to memory after completion

## Memory System

### Where Memory Lives

| Type | Location | Purpose |
|------|----------|---------|
| Long-term | `.claude/memory/MEMORY.md` | Curated wisdom |
| Daily | `.claude/memory/YYYY-MM-DD.md` | Today's log |
| Domain | `~/clawd/state/domain-stores/grove-execution/` | JSON store |
| Graph | `bolt://100.83.33.65:7687` | Neo4j on Hetzner |

### How to Query Context

```python
from grove_memory import get_context_for_task

context = get_context_for_task("security vulnerabilities")
# Returns: similar past work, decisions, landmines
```

### How to Record Completion

```python
from grove_memory import GroveMemory

mem = GroveMemory()
mem.record_story(
    proposal="PROP-030",
    story="SX",
    what="Description of what was built",
    how="Approach used",
    decisions=["Non-obvious choice 1", "Choice 2"],
    landmines=["Warning 1", "Assumption 2"],
    score=95,
    executed_by="your-agent-name",
    domain="domain-you-learned"
)
```

## Agent XP System

You gain experience when you complete stories:

| Level | Stories | Title |
|-------|---------|-------|
| 1-2 | Trainee | New agent |
| 3-5 | Junior | Learning |
| 6-9 | Senior | Competent |
| 10+ | Expert | Master |

Your XP is tracked in the DomainStore. Check your stats:

```python
from grove_memory import get_agent_experience
print(get_agent_experience("your-agent-name"))
```

## Project State

**Current Phase**: PROP-030 Foundry Revival

- ✅ S1: Package health audit
- ✅ S2: Security scan (30 vulns found)
- ✅ S3: Agent definition created
- ⏳ S4: Memory structure (this!)
- ⏳ S5: Dependency updates
- ⏳ S6: Bun migration audit
- ⏳ S7: Verify Neo4j writes

## Key Files

```
.claude/
├── agents/
│   └── grove-steward.md    # Agent definition
├── memory/
│   ├── MEMORY.md           # Long-term memory
│   └── YYYY-MM-DD.md       # Daily logs
├── logs/                   # Execution logs
└── plugins/                # Claude plugins

packages/                   # 18 packages
docs/features/foundry-revival/
├── plan.yaml              # Grove pipeline plan
├── health-audit.md        # S1 output
└── security-audit.md      # S2 output
```

## Known Issues

- **better-sqlite3** blocks bun migration (native module)
- **Vitest** fragmented between 2.1.x and 3.2.4
- **3 stub packages** need removal (core-crud, core-layouts, core-panels)
- **30 vulnerabilities** in dev deps (fix in S5)

## Communication

When you complete work:
1. Write WHAT/HOW/DECISIONS/LANDMINES
2. Include your agent name and domain
3. Record to memory
4. Update daily log if significant

---

_More details in MEMORY.md_
