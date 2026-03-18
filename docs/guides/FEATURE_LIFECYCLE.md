# Feature Lifecycle Documentation

**Version**: 2.0
**Last Updated**: 2025-11-12

## Overview

This document defines the **mandatory phase-based structure** for all features in the Brain Garden monorepo. Every feature MUST follow this 10-phase lifecycle from research to maturity.

## Quick Reference

```
/docs/features/{feature-name}/
  ├── 00-research/           # Discovery & validation
  ├── 01-planning/           # GROVE artifacts (PRD, design, stories)
  ├── 02-architecture/       # System design & component architecture
  ├── 03-implementation-planning/  # Phase plans with checkboxes
  ├── 04-development/        # Implementation work
  ├── 05-testing/           # Test plans & QA
  ├── 06-documentation/     # User guides & API docs
  ├── 07-deployment/        # Deployment plans & rollout
  ├── 08-post-launch/       # Retrospectives & metrics
  └── 09-enhancements/      # Post-launch improvements (Maturity Phase)
```

## Two-Phase Lifecycle Model

### MVP Phase (v0.x.x → v1.0.0)

**Goal**: Prove the feature works and delivers value
**Progress**: Linear progression through phases 00-08
**Version**: Starts at v0.1.0, progresses to v1.0.0

**Quality Gates** (severity-based blocking):
- **Critical bugs**: Block phase progression immediately
- **High bugs**: Must be resolved by Phase 05 (Testing)
- **Medium bugs**: Must be resolved by Phase 07 (Deployment)
- **Low/Trivial bugs**: Can be deferred to maturity phase

**Bug Tracking (MVP Phase)**:
- Create bugs in current phase: `{phase}/.issues/BUG-{NNN}-{short-name}.md`
- Bug collector runs at Phase 05: Moves all issues to `05-testing/issue-resolution/`
- Creates symlinks in original locations for historical context

**Transition to Maturity**: When Phase 08 completes, run `mvp-complete.sh` script

### Maturity Phase (v1.0.0+)

**Goal**: Continuous evolution and excellence
**Progress**: Semantic versioning (v1.1.0, v1.2.0, v2.0.0)

**Required Files** (created at v1.0.0 transition):
- `README.md` - Feature dashboard (maturity template)
- `CHANGELOG.md` - Version history
- `version.json` - Metadata and predictions

**Required Folders**:
- `09-enhancements/` - Feature enhancements (ENH-{NNN}-{name})
- `10-bugs/` - Post-launch bugs (BUG-{NNN}-{name})
- `11-maintenance/` - Maintenance work (MAINT-{TYPE}-{NNN})

**SemVer Rules**:
- **MAJOR** (v2.0.0): Breaking changes, major rearchitecture
- **MINOR** (v1.1.0): New features, enhancements (backward compatible)
- **PATCH** (v1.0.1): Bug fixes, minor improvements

**Quarterly Rollup**: Archive completed work to `archive/YYYY-QN/`

## Phase Descriptions

### Phase 00: Research
**Purpose**: Discovery and validation
**Deliverables**:
- Market research
- Competitive analysis
- User research
- Technical feasibility study

### Phase 01: Planning
**Purpose**: GROVE planning artifacts
**Deliverables**:
- `PRD.md` - Product Requirements Document
- `design.md` - Technical design
- `stories/` - User stories (INVEST-compliant)
- `quality-gates/` - Planning verification reports

**Quality Threshold**: ≥85/100 via `arbor-verification`

### Phase 02: Architecture
**Purpose**: System design and component architecture
**Deliverables**:
- Component architecture documents
- API contracts and specifications
- Data models and schemas
- Integration patterns

### Phase 03: Implementation Planning
**Purpose**: Detailed implementation roadmap
**Deliverables**:
- Phase plans with checkboxes (`phase-plans/{n}-{name}.plan.md`)
- Parallelization strategy
- Resource allocation
- Risk mitigation plans

### Phase 04: Development
**Purpose**: Implementation work
**Deliverables**:
- Source code
- Sub-agent work artifacts (`sub-agent-work/lane-{n}-{name}/`)
- Code reviews
- Technical documentation

### Phase 05: Testing
**Purpose**: Quality assurance and validation
**Deliverables**:
- Test plans
- Test results
- QA reports
- Bug resolution tracking (`issue-resolution/`)

### Phase 06: Documentation
**Purpose**: User-facing documentation
**Deliverables**:
- User guides
- API documentation
- Tutorial content
- FAQ

### Phase 07: Deployment
**Purpose**: Production rollout
**Deliverables**:
- Deployment plans
- Migration guides
- Rollout strategy
- Monitoring setup

### Phase 08: Post-Launch
**Purpose**: Completion and retrospective
**Deliverables**:
- Completion reports
- Retrospective analysis
- Metrics and KPIs
- Lessons learned

### Phase 09: Enhancements (Maturity Phase Only)
**Purpose**: Post-launch improvements
**Structure**: `ENH-{NNN}-{name}/` with 4-phase lifecycle (00-request → 03-validation)

## Artifact Placement Rules

**CRITICAL**: Always use the correct phase folder for artifacts.

| Artifact Type | Correct Location | Wrong Location |
|--------------|------------------|----------------|
| PRD | `01-planning/PRD.md` | `/bmad/prds/` ❌ |
| Design | `01-planning/design.md` | `/bmad/designs/` ❌ |
| Stories | `01-planning/stories/` | `/bmad/stories/` ❌ |
| Phase Plans | `03-implementation-planning/phase-plans/` | Root folder ❌ |
| Sub-agent Work | `04-development/sub-agent-work/` | Scattered ❌ |

## Helper Functions

### Get Artifact Path
```typescript
function getArtifactPath(featureName: string, artifactType: string): string {
  const basePath = `/docs/features/${featureName}`;

  switch (artifactType) {
    case 'prd': return `${basePath}/01-planning/PRD.md`;
    case 'design': return `${basePath}/01-planning/design.md`;
    case 'stories': return `${basePath}/01-planning/stories/`;
    case 'phase-plan': return `${basePath}/03-implementation-planning/phase-plans/`;
    case 'code': return `${basePath}/04-development/`;
    case 'tests': return `${basePath}/05-testing/`;
    default: throw new Error(`Unknown artifact type: ${artifactType}`);
  }
}
```

### Initialize Feature Structure
```typescript
function initializeFeatureStructure(featureName: string): void {
  const basePath = `/docs/features/${featureName}`;
  const phases = [
    '00-research',
    '01-planning',
    '02-architecture',
    '03-implementation-planning',
    '04-development',
    '05-testing',
    '06-documentation',
    '07-deployment',
    '08-post-launch'
  ];

  phases.forEach(phase => {
    createDirectory(`${basePath}/${phase}`);
  });

  // Create subdirectories
  createDirectory(`${basePath}/01-planning/stories`);
  createDirectory(`${basePath}/01-planning/quality-gates`);
  createDirectory(`${basePath}/03-implementation-planning/phase-plans`);
  createDirectory(`${basePath}/04-development/sub-agent-work`);
}
```

### Can Transition to Next Phase
```typescript
function canTransitionToNextPhase(featureName: string, currentPhase: number): boolean {
  const basePath = `/docs/features/${featureName}`;
  const phasePath = `${basePath}/0${currentPhase}-${getPhaseNameByNumber(currentPhase)}`;

  // Check for .complete marker
  if (!fileExists(`${phasePath}/.complete`)) {
    return false;
  }

  // Phase-specific validation
  if (currentPhase === 1) {
    // Phase 01: Must have PRD, design, stories, and quality ≥85
    const hasPRD = fileExists(`${basePath}/01-planning/PRD.md`);
    const hasDesign = fileExists(`${basePath}/01-planning/design.md`);
    const hasStories = directoryExists(`${basePath}/01-planning/stories`);
    const qualityReport = readFile(`${basePath}/01-planning/quality-gates/arbor-verification.md`);
    const qualityScore = extractQualityScore(qualityReport);

    return hasPRD && hasDesign && hasStories && qualityScore >= 85;
  }

  return true;
}
```

## MVP → Maturity Transition

**Trigger**: Phase 08 complete
**Tool**: `mvp-complete.sh` script

**Automated Steps**:
1. Validate all phases 00-08 complete
2. Create v1.0.0 release tag in git
3. Generate initial CHANGELOG.md from phase history
4. Create maturity folders (09-enhancements, 10-bugs, 11-maintenance)
5. Update README.md to maturity template
6. Initialize version.json with baseline metrics
7. Move feature from MVP tracking to maturity tracking

## Integration with Arbor

**Arbor Skills**: Automated planning workflow enforcement

| Skill | Purpose | Quality Threshold |
|-------|---------|-------------------|
| `arbor-phase-planning` | Generate phase overview | Pre-planning |
| `arbor-plan-generation` | Create detailed phase plans | Per-phase |
| `arbor-verification` | Validate planning quality | ≥85/100 |

**Auto-Triggering**: When new feature detected → Invoke Arbor planning workflow

## Best Practices

1. **Always start with comprehensive PRD** - Clear goals, features, success metrics
2. **Use Arbor in order** - phase-planning → plan-generation → verification
3. **Validate early and often** - After each skill invocation
4. **Let auto-correction work** - Don't manually fix structure issues
5. **Document decisions** - Capture reasoning in phase folders
6. **Quality gate enforcement** - Never bypass ≥85 threshold without documented emergency bypass

## Related Documentation

- **Arbor Workflows**: `/ARBOR_WORKFLOWS.md`
- **Work Lifecycle**: `/docs/WORK_LIFECYCLE.md`
- **Bug System**: `/docs/bugs/README.md`
- **Enhancement System**: Enhancement workflow documentation
- **Maintenance System**: Maintenance workflow documentation

---

**Established**: 2025-11-08 (v4 monorepo structure)
**Scope**: All features, mandatory compliance
