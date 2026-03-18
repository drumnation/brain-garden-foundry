# Arbor Planning Workflows

**Version**: 2.0
**Last Updated**: 2025-11-12

## Overview

Arbor is the automated planning workflow system for Brain Garden. ALL planning activities MUST use Arbor-based workflows. NO work may proceed to implementation without Arbor-verified planning artifacts.

## Mandatory Arbor Planning (RULES.md Directive 7)

**CRITICAL**: This is a non-negotiable requirement.

| Work Type | Planning Skill | Verification Skill | Quality Threshold | Implementation Allowed |
|-----------|---------------|-------------------|-------------------|----------------------|
| **Feature** | `arbor-phase-planning` + `arbor-plan-generation` | `arbor-verification` | ≥85/100 | After verification |
| **Bug** | `arbor-bug-planning` | `arbor-bug-verification` | ≥80/100 | After verification |
| **Enhancement** | `arbor-enhancement-planning` | `arbor-enhancement-verification` | ≥75/100 | After verification |
| **Maintenance** | `arbor-maintenance-planning` | `arbor-maintenance-verification` | 75-90/100 | After verification |
| **Borg** | `arbor-borg-planning` | `arbor-borg-verification` | ≥80/100 | After verification |

## Feature Planning Workflow

### 3-Step Process

#### 1. Phase Planning
**Skill**: `arbor-phase-planning`
**Input**: PRD in `01-planning/PRD.md`
**Output**: Phase overview in `03-implementation-planning/{feature}.phases.md`

**What it does**:
- Analyzes PRD requirements
- Breaks work into logical phases
- Estimates effort per phase
- Identifies dependencies and risks

#### 2. Plan Generation (per phase)
**Skill**: `arbor-plan-generation`
**Input**: Phase from phase overview
**Output**: Detailed checkbox plan in `03-implementation-planning/phase-plans/{n}-{name}.plan.md`

**What it does**:
- Generates actionable checkboxes
- Breaks phase into granular tasks
- Identifies parallelization opportunities
- Creates MECE task breakdown

#### 3. Verification (quality gate)
**Skill**: `arbor-verification`
**Input**: Complete feature folder structure
**Output**: Verification report in `01-planning/quality-gates/arbor-verification.md`

**Quality Score Calculation** (100 points total):
- **Structure**: 20 points (9 phase folders exist)
- **Artifact Placement**: 10 points (files in correct locations)
- **Required Artifacts**: 40 points (PRD, design, stories present)
- **Content Quality**: 60 points (artifacts complete and clear)
- **Phase Transitions**: 10 points (.complete markers, gate validation)

**Passing**: ≥85/100

### Example Feature Workflow

```bash
# 1. Create feature structure
mkdir -p /docs/features/user-authentication

# 2. Write PRD
# Create /docs/features/user-authentication/01-planning/PRD.md

# 3. Run phase planning
/skill arbor-phase-planning

# 4. Review phase overview
# Check /docs/features/user-authentication/03-implementation-planning/user-authentication.phases.md

# 5. Generate phase plans
/skill arbor-plan-generation

# 6. Run verification
/skill arbor-verification

# 7. Check quality score
# Read /docs/features/user-authentication/01-planning/quality-gates/arbor-verification.md

# 8. If score ≥85: Proceed to implementation
# 9. If score <85: Improve planning, re-verify
```

## Bug Planning Workflow

### Skill: `arbor-bug-planning`
**Input**: Bug investigation artifacts in `00-investigation/`
**Output**: 5 planning artifacts in `01-planning/`

**Planning Artifacts**:
1. `fix-strategy.md` - Detailed fix approach
2. `risk-assessment.md` - Risks and mitigation
3. `test-plan.md` - Validation strategy
4. `rollback-plan.md` - Backup plan
5. `impact-analysis.md` - Downstream effects

**Quality Verification**: `arbor-bug-verification` (≥80/100)

### Example Bug Workflow

```bash
# 1. Create bug directory
mkdir -p /docs/bugs/active/BUG-001-login-failure

# 2. Complete investigation
# Create investigation artifacts in 00-investigation/

# 3. Run bug planning
/skill arbor-bug-planning

# 4. Verify planning quality
/skill arbor-bug-verification

# 5. Check score ≥80
# 6. Proceed to implementation (Phase 02)
```

## Enhancement Planning Workflow

### Skill: `arbor-enhancement-planning`
**Input**: Enhancement request in `00-request/`
**Output**: 4 planning artifacts in `01-planning/`

**Planning Artifacts**:
1. `enhancement-plan.md` - Implementation strategy
2. `parent-feature-integration.md` - How it fits into parent
3. `acceptance-criteria.md` - Success criteria
4. `risk-assessment.md` - Risks and mitigation

**Quality Verification**: `arbor-enhancement-verification` (≥75/100)

**Requirements**:
- Parent feature MUST be Phase 06+ (post-launch)
- Enhancement MUST be feature-scoped

### Example Enhancement Workflow

```bash
# 1. Verify parent feature is post-launch (Phase 06+)
ls /docs/features/dashboard/06-documentation/.complete

# 2. Create enhancement directory
mkdir -p /docs/features/dashboard/09-enhancements/ENH-001-dark-mode

# 3. Write enhancement request
# Create 00-request/request.md

# 4. Run enhancement planning
/skill arbor-enhancement-planning

# 5. Verify planning quality
/skill arbor-enhancement-verification

# 6. Check score ≥75
# 7. Proceed to implementation (Phase 02)
```

## Maintenance Planning Workflow

### Skill: `arbor-maintenance-planning`
**Input**: Maintenance assessment artifacts in `00-{type-specific}/`
**Output**: Type-specific planning artifacts in `01-planning/`

**Quality Thresholds by Type**:
- Refactoring: ≥80/100
- Dependencies: ≥75/100
- Performance: ≥85/100
- Documentation: ≥75/100
- Security: ≥90/100 (highest standard)
- Testing: ≥80/100

**Type Detection**: Keywords trigger automatic type classification
- "refactor" → Refactoring
- "upgrade", "update", "dependency" → Dependencies
- "optimize", "performance" → Performance
- "document", "docs" → Documentation
- "security", "vulnerability" → Security
- "test coverage", "testing" → Testing

### Example Maintenance Workflow

```bash
# 1. Create maintenance directory
mkdir -p /docs/maintenance/security/active/MAINT-SEC-001-jwt-vulnerability

# 2. Complete security assessment
# Create 00-assessment/ artifacts

# 3. Run maintenance planning
/skill arbor-maintenance-planning

# 4. Verify planning quality
/skill arbor-maintenance-verification

# 5. Check score ≥90 (security threshold)
# 6. Proceed to remediation (Phase 02)
```

## Borg Planning Workflow

### Skill: `arbor-borg-planning`
**Input**: Borg assessment artifacts from `/borg` command in `00-assessment/`
**Output**: 5 planning artifacts in `01-planning/`

**Planning Artifacts**:
1. `integration-plan.md` - Complete integration strategy
2. `dependency-mapping.md` - External dependencies analysis
3. `customization-requirements.md` - Modifications needed
4. `migration-strategy.md` - Step-by-step migration
5. `risk-mitigation.md` - Risk assessment and mitigation

**Quality Verification**: `arbor-borg-verification` (≥80/100)

**Integration Strategies**:
- **Library**: Standard npm install
- **Fork**: Git fork + customizations
- **Copy-Adapt**: Copy source + modify

### Example Borg Workflow

```bash
# 1. Run Borg assessment
/borg https://github.com/expressjs/express

# 2. Create Borg directory
mkdir -p /docs/borg/assimilations/active/BORG-001-express

# 3. Move assessment artifacts
mv /docs/borg/.borg-analyses/BORG-001-express/*.md /docs/borg/assimilations/active/BORG-001-express/00-assessment/

# 4. Run Borg planning
/skill arbor-borg-planning

# 5. Verify planning quality
/skill arbor-borg-verification

# 6. Check score ≥80
# 7. Proceed to integration (Phase 02)
```

## Auto-Triggering

Arbor skills auto-trigger based on work type detection:

```typescript
// ORCHESTRATOR.md Detection Engine

if (workType === "feature" && phase === "01-planning") {
  await Skill("arbor-phase-planning");
  await Skill("arbor-plan-generation");
  await Skill("arbor-verification");

  if (qualityScore < 85) {
    blockImplementation();
    showRecommendations();
  }
}

if (workType === "bug" && phase === "01-planning") {
  await Skill("arbor-bug-planning");
  await Skill("arbor-bug-verification");

  if (qualityScore < 80) {
    blockImplementation();
  }
}

// ... similar for enhancement, maintenance, borg
```

## Quality Gate Enforcement

**Implementation Blocking**:

```
BEFORE Phase 04 (Development) or Phase 02 (Bugs/Enhancements/Maintenance/Borg):

1. Read verification report
2. Extract quality score
3. IF score < threshold:
   - ❌ BLOCK implementation
   - Display score and category breakdowns
   - Show actionable recommendations
   - Request planning improvements
   - Re-run verification after improvements

4. IF score ≥ threshold:
   - ✅ ALLOW implementation
   - Update lane config to next phase
   - Set nextCheckbox to first task
   - Proceed with implementation
```

**Emergency Bypass** (use ONLY for critical production issues):

```bash
# 1. Request justification
cat > {workPath}/.ephemeral/quality-gate-bypass.log << EOF
Date: $(date)
Feature: {feature-name}
Score: {X}/100 (threshold: {threshold})
Justification: {detailed reason}
Risk Assessment: {what could go wrong}
Mitigation: {how to address risks}
Approval: {who authorized}
EOF

# 2. Proceed with warnings
echo "⚠️ BYPASS ACTIVE - Quality gate bypassed for emergency"

# 3. Require retroactive improvement within 24 hours
```

## Verification Timing - CRITICAL

**Plan Quality Verification** (Automatic):
- Runs AUTOMATICALLY after plan generation
- Checks if PLANS are good quality (≥threshold)
- NO user prompt - automatic quality gate
- Blocks implementation if score too low

**Execution Verification** (Manual):
- Happens AFTER implementation complete
- Checks if WORK matches plan
- Separate process from plan quality verification
- User may be prompted when phase done

**NEVER prompt users for verification immediately after plan generation** - this confuses plan quality verification (automatic, checks plans) with execution verification (manual, checks work).

## Related Documentation

- **Feature Lifecycle**: `/FEATURE_LIFECYCLE.md`
- **Work Lifecycle**: `/docs/WORK_LIFECYCLE.md`
- **Bug System**: `/docs/bugs/README.md`
- **Borg System**: `/docs/borg/README.md`
- **RULES.md**: Prime Directive 7 (Arbor Mandatory)

---

**Scope**: All planning activities, mandatory compliance
