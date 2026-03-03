# Brain Garden Foundry - Agents

## Two Agent Systems

### 1. Foundry Task Roles (This Repo)

Task-specific roles for software development. Any agent can inhabit these roles.

| Role | Best For | XP |
|------|----------|----|
| **architect** | System design, abstractions, patterns | 3 stories [Junior] |
| **validator** | Quality checks, linting, tests | 2 stories [Junior] |
| **integrator** | Merging branches, resolving conflicts | 1 story [Trainee] |
| **maintainer** | Documentation, cleanup | 1 story [Trainee] |
| **security-scanner** | Vulnerability audits | 1 story [Trainee] |
| **researcher** | Analysis, decision matrices | 0 stories [Trainee] |
| **grove-steward** | Pipeline orchestration | 1 story [Trainee] |

**Definitions:** `.claude/agents/*.md`

### 2. Full Agent Roster (Personality-Based)

18 named agents across Inner/Outer rings. See `~/MEMORY.md` for complete roster.

**Inner Ring (Dave only, full data access):**

| Agent | Source | Role | Hardware | Model |
|-------|--------|------|----------|-------|
| Ari Gold | Entourage | Pipeline management | Hetzner (ari-ted) | GLM-5 |
| Scotty | Star Trek | Tech Ops | Hetzner (jim-don) | GLM-5 |
| Day | Foundation | Ship/Orchestrate | pop-os | Opus 4.6 |
| Dusk | Foundation | Infra/Strategy | Beelink | Opus 4.6 |
| Dawn | Foundation | Research/Creative/Execution | SINGULARITY-ONE | Opus 4.6 |
| Joe Macmillan | HCF | QA+Drift | MacBook Pro | Opus 4.6 |
| Hari Seldon | Foundation | Security | Galaxy Note 10+ | GLM-5 |
| Gilfoyle | Silicon Valley | Refactoring | Hetzner (nikon-harvey) | GLM-5 |
| Miss Minutes | Loki (TVA) | Memory Agent & Reducer | Hetzner (jim-don) | GLM-5 |
| Ted | Dr. Maté + Tyrion | Therapeutic + Strategic | Hetzner (ari-ted) | GLM-5 |
| Harvey Specter | Suits | Legal strategy | Hetzner (nikon-harvey) | GLM-5 |
| Lord Nikon | Hackers | Credential broker | Hetzner (nikon-harvey) | GLM-5 |
| Stamitz | Classical | Conductor/mediator | SINGULARITY-ONE | GLM-5 |
| The Genius | Multi-mind | 8-mind oracle | SINGULARITY-ONE | GLM-5 |

**Outer Ring (External-facing, isolated):**

| Agent | Source | Role | Hardware | Model |
|-------|--------|------|----------|-------|
| Midge Maisel | Mrs. Maisel | Family logistics | TBD | GLM-5 |
| Dave Agent | — | Professional outbound | Hetzner | GLM-5 |
| Don Draper | Mad Men | Content/Creative | Hetzner (jim-don) | GLM-5 |
| Jake the Dog | Adventure Time | Plex/media | pop-os:18795 | GLM-5 |

## How Roles Map to Agents

Foundry roles can be inhabited by any personality agent:

| Role | Best Agent Match | Why |
|------|------------------|-----|
| architect | Gilfoyle, Dusk | Refactoring, strategy |
| validator | Scotty, Joe Macmillan | Tech ops, QA |
| security-scanner | Hari Seldon | Security focus |
| maintainer | Gilfoyle | Code cleanliness |
| integrator | Day, Dawn | Orchestration |
| researcher | Dawn, Ted | Research, strategy |

## How to Use

**Call a role (any agent can inhabit):**
```
"You are the validator. Read .claude/agents/validator.md and [task]"
```

**Call a specific personality agent:**
```
Reference their MEMORY.md entry for personality, hardware, model
```

## Memory System

- Foundry roles: Track XP, write to Neo4j
- Personality agents: Full roster in ~/MEMORY.md
- Brothers (Day/Dusk/Dawn): Execution layer for ALL departments

## Current Graph State

- StoryExecutions: 10
- Decisions: 51
- Landmines: 24
- Foundry Roles: 7
- Personality Agents: 18
