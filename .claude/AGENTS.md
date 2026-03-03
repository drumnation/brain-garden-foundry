# Agent Quick Reference

This repository has 7 specialized agents. Each can be called for their expertise.

## How to Call an Agent

In Claude Code, reference an agent by their definition file:

```
"You are the architect. Read .claude/agents/architect.md and [task]"
"You are the validator. Read .claude/agents/validator.md and [task]"
```

Or spawn them as subagents:

```python
sessions_spawn(
    task="Run security audit",
    runtime="subagent",
    agentId="security-scanner"
)
```

## Agent Roster

| Agent | Role | XP | Best For |
|-------|------|----|----|
| **architect** | System design | 3 stories [Junior] | Architecture decisions, abstractions, design patterns |
| **validator** | Quality checks | 2 stories [Junior] | Linting, tests, build verification |
| **grove-steward** | Orchestration | 1 story [Trainee] | Running pipelines, coordinating agents |
| **integrator** | Merging work | 1 story [Trainee] | Resolving conflicts, combining branches |
| **maintainer** | Cleanup | 1 story [Trainee] | Documentation, dead code removal |
| **security-scanner** | Security | 1 story [Trainee] | Vulnerability scanning, dependency audits |
| **researcher** | Analysis | 0 stories [Trainee] | Comparing options, decision matrices |

## Example Tasks by Agent

**architect:**
- "Design a database abstraction layer"
- "What's the best way to structure X"
- "Create an interface for..."

**validator:**
- "Run all tests and fix failures"
- "Check if linting passes"
- "Validate the build"

**security-scanner:**
- "Scan for vulnerabilities"
- "Audit these dependencies"
- "Is this package safe?"

**integrator:**
- "Merge branch X into Y"
- "Resolve these conflicts"
- "Combine these two approaches"

**maintainer:**
- "Clean up the repo"
- "Remove dead code"
- "Update documentation"

**researcher:**
- "Compare X vs Y"
- "What are the alternatives to..."
- "Research best options for..."

## Agent Memory

Each agent:
- Queries Neo4j for context before starting
- Writes decisions/landmines to memory after completing
- Gains XP per story completed
- Levels up: Trainee → Junior → Senior → Expert

## Current Graph State

- StoryExecutions: 10
- Decisions: 51
- Landmines: 24
- Agents: 7

Every task benefits from past learnings.
