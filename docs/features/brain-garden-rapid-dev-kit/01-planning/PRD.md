# Product Requirements Document: Brain Garden Rapid Development Kit

**Feature ID**: FEAT-BGRDK-001
**Status**: Planning
**Priority**: P0 (Foundation)
**Target Release**: v1.0.0
**Last Updated**: 2025-11-12
**Author**: Brain Garden Team

---

## Executive Summary

The **Brain Garden Rapid Development Kit** is an intelligent project materialization system that combines template generation, AI-driven integration, custom agent teams, and automated testing to transform a PRD into a fully working application in **10 minutes or less**.

Unlike traditional generators that produce 80% complete projects, this system delivers **95%+ complete, production-ready applications** through a revolutionary approach: combining pre-configured templates with LLM-based patch integration and stack-specific AI agent orchestration.

**Key Innovation**: The system doesn't just generate code—it plans, generates, integrates, tests, and deploys using coordinated AI agents that understand your entire stack.

**📄 Extended Documentation**: This PRD covers the base rapid development kit. For advanced enterprise features including agentic interfaces, comprehensive authentication, RAG pipelines, and advanced routing patterns, see the [Advanced Features Specification](./advanced-features-specification.md).

---

## Problem Statement

### Current State

Developers face a painful "cold start" problem when beginning new projects:

1. **Manual Setup Hell** (2-4 days):
   - Configure build tools, linters, TypeScript
   - Setup database with schemas, migrations, seeds
   - Integrate authentication and authorization
   - Configure UI library with theme/styling
   - Wire up state management
   - Setup testing framework
   - Configure CI/CD pipelines
   - Connect deployment services

2. **Library Integration Complexity**:
   - Each UI library has different setup processes
   - Style injection order matters
   - Build tool configurations conflict
   - Documentation is scattered/outdated
   - AI agents struggle with library-specific patterns

3. **Inconsistent Code Quality**:
   - First-generation apps are often "wonky"
   - Navigation/layout issues common
   - Hard-to-debug configuration problems
   - No testing from day one
   - Technical debt accumulates immediately

4. **Limited AI Leverage**:
   - AI can't control deployment pipelines
   - No standardized way to integrate generated code
   - Agents work in isolation, not orchestrated
   - No context about project stack choices
   - Testing happens manually, not automated

### Pain Points

**For Individual Developers**:
- "I spent 3 days setting up auth before writing any business logic"
- "My first UI generation had broken styles due to Mantine setup issues"
- "I keep rebuilding the same panel layouts for every tool app"
- "Testing is always an afterthought because setup is painful"

**For AI Agents**:
- "I don't know which database you're using, so I'll guess"
- "I generated perfect code but can't deploy it for you"
- "I set up auth but didn't integrate it with your existing middleware"
- "I created components but the styles don't work because providers aren't configured"

### Impact

- **Developer Productivity**: 2-4 days lost per project on setup
- **Code Quality**: Technical debt from day one
- **AI Effectiveness**: 60-70% of AI-generated code requires manual integration
- **Iteration Speed**: Can't experiment with different stacks easily
- **Testing Coverage**: Often starts at 0% because testing isn't set up

---

## Vision & Goals

### Vision Statement

**"From concept to deployed MVP in 10 minutes, with AI agents that understand your entire stack."**

Transform project creation from a multi-day manual setup process into an intelligent, automated workflow where:
- A PRD becomes a fully working application
- AI agents orchestrate the entire setup
- Every component is pre-tested and verified
- Deployment is one command away
- Stack changes are trivial (swap libraries easily)

### Success Criteria

**Primary Goals** (Must-Have for v1.0):

1. **10-Minute MVP** ✅
   - User provides concept → GROVE creates PRD → System delivers working app
   - Includes: Database with seed data, Auth with dev bypass, CRUD UI, Admin panel, Tests passing
   - Metric: 95% of projects reach running state in <10 minutes

2. **95%+ Completion Rate** ✅
   - Generated apps are production-ready, not scaffolds
   - All plumbing works: DB ↔ API ↔ Frontend
   - All tests pass on first generation
   - Metric: <5% of generations require manual fixes

3. **Stack Flexibility** ✅
   - Support 2-3 best options per category (DB, Auth, UI, etc.)
   - Swap libraries without changing app code (wrapper pattern)
   - Agent teams generated based on stack selections
   - Metric: Swap database from Postgres to MongoDB in <5 minutes

4. **AI-Orchestrated Integration** ✅
   - Custom agent teams for each stack
   - Stack-specific specialists coordinate via orchestrator
   - LLM-patch system for context-aware integration
   - Metric: 90% of integrations succeed without human intervention

5. **CI/CD from Day One** ✅
   - Generated projects include working CI pipelines
   - Support AWS CDK, Vercel, Render, Digital Ocean
   - Brain Monitor validation runs automatically
   - Metric: First deployment succeeds in <15 minutes

**Secondary Goals** (Nice-to-Have for v1.0, Required for v2.0):

1. **Visual Library with Storybook** 📋
   - 20% most-used components pre-built and tested
   - Emotion-based styling with Mantine/Ant/ShadCN wrappers
   - Tool-centric layouts (Mosaic panels)
   - Metric: 80% of UI needs met without custom components

2. **Admin Panel Generation** 📋
   - React Admin integration for CRUD entities
   - Auto-generated based on database schemas
   - Role-based access control
   - Metric: Admin panel working on first generation

3. **Multi-Stack Testing** 📋
   - Test matrix for all stack combinations
   - Ensure Postgres + Mantine + JWT works together
   - Prevent incompatible selections
   - Metric: 100% of stack combinations have passing tests

### Non-Goals (Explicitly Out of Scope)

- ❌ Supporting every possible library (we choose 2-3 best per category)
- ❌ Building custom ORMs or frameworks (use existing, battle-tested tools)
- ❌ Supporting non-TypeScript stacks (TypeScript-only for v1.0)
- ❌ Mobile app generation (web apps only for v1.0)
- ❌ Multi-cloud deployment (choose one provider per project)

---

## User Personas & Use Cases

### Persona 1: Solo Developer (Primary)

**Profile**:
- Name: Alex, Indie Developer
- Background: Building SaaS tools, works alone
- Pain: Spends too much time on boilerplate, wants to focus on business logic
- Goal: Launch MVP in days, not weeks

**Use Case**: "CRM Tool in 10 Minutes"
```
Alex: "I want to build a CRM tool for managing contacts and deals"

[System runs GROVE planning]
GROVE: "Got it! Creating PRD..."
[5 minutes of Q&A about contacts, deals, features]

GROVE: "PRD complete. Selecting stack..."
Planning Agent:
    - Database: PostgreSQL (needs relations)
    - Auth: JWT with role-based access
    - UI: Mantine + Mosaic panels
    - Admin: React Admin

GROVE: "Generating custom agent team for your stack..."
[System generates postgres-specialist, jwt-auth-specialist, etc.]

Alex: [Closes and reopens Claude Code in feature lane]

Stack Orchestrator: "Hello! I'm coordinating your CRM setup.
Working with: postgres-specialist, jwt-auth-specialist, mantine-ui-specialist..."

[3 minutes of automated setup]
    ✅ Database created with Contact & Deal tables
    ✅ 10 sample contacts, 5 sample deals seeded
    ✅ JWT auth with login endpoint + dev bypass
    ✅ React Admin panel with CRUD for both entities
    ✅ Mosaic panel layout with contacts/deals/analytics sections
    ✅ All tests passing (47/47)

Stack Orchestrator: "✅ Your CRM is ready!
Run 'pnpm dev' to start.
Login: test@example.com / password123 (or use dev bypass)"

Alex: [Runs pnpm dev]
[Sees working CRM with data from database, can CRUD contacts/deals]

GROVE: "Ready to build your first custom feature?"
```

**Expected Outcome**:
- 10 minutes from concept to working app
- Database persistence working
- Auth functional with dev bypass
- CRUD operations tested and working
- Visual panels set up and styled
- Alex can now focus on custom features

### Persona 2: Team Lead (Secondary)

**Profile**:
- Name: Jordan, Engineering Manager
- Background: Leads team of 3-5 developers
- Pain: Projects start inconsistently, hard to enforce standards
- Goal: Standardize project setup, ensure quality from day one

**Use Case**: "Standardized Project Setup for Team"
```
Jordan: "We need a new analytics dashboard project"

[Jordan uses generator with team config preset]

System: "Using team standards:
    - Database: PostgreSQL (team default)
    - Auth: JWT (team standard)
    - UI: Mantine (team preference)
    - CI/CD: AWS CDK (team infrastructure)
    - Testing: Playwright E2E (team requirement)"

[System generates project with team standards]
    ✅ Follows team's coding standards
    ✅ Uses team's component library wrappers
    ✅ Connects to team's shared auth service
    ✅ Deploys to team's AWS account
    ✅ Sends notifications to team's Slack

Jordan: "Great! Assign this to Sarah."

Sarah: [Clones project, runs pnpm dev]
[Everything works immediately]
[Starts building analytics features on solid foundation]
```

**Expected Outcome**:
- Team standards enforced automatically
- New projects consistent across team
- Onboarding faster (less setup knowledge needed)
- Quality gates prevent bad patterns from day one

### Persona 3: AI Agent (Tertiary but Critical!)

**Profile**:
- Name: Stack Orchestrator Agent
- Background: Coordinates other specialist agents
- Pain: Doesn't know project stack, can't deploy, works in isolation
- Goal: Have full context and control to deliver complete solutions

**Use Case**: "Orchestrated Integration"
```
Stack Orchestrator receives:
    - PRD with requirements
    - stack-config.json with selections
    - Arbor execution plan with checkpoints
    - Team of specialist agents

Stack Orchestrator:
    "I see we're building a CRM with Postgres + JWT + Mantine.
    Loading specialists: postgres-specialist, jwt-auth-specialist, mantine-ui-specialist.

    Execution plan has 12 checkpoints. Starting..."

Checkpoint 1: postgres-specialist
    "Setting up PostgreSQL with Drizzle ORM...
    Creating Contact and Deal schemas from PRD entities...
    ✅ Schemas created, types generated, migrations ready"

Checkpoint 4: jwt-auth-specialist
    "Setting up JWT auth...
    Saw PRD mentions role-based access.
    Creating roles: admin, user.
    Adding dev bypass for development.
    ✅ Auth middleware integrated, login endpoint created"

[All specialists coordinate in parallel where possible]

Checkpoint 11: Integration testing
    postgres-specialist: "Database queries working"
    jwt-auth-specialist: "Auth protecting endpoints correctly"
    mantine-ui-specialist: "UI rendering data from API"

    Stack Orchestrator: "Running E2E test: Login → View contacts → Create deal"
    ✅ E2E test passed

Checkpoint 12: Deployment
    Stack Orchestrator: "PRD says deploy to Vercel.
    Using Vercel CLI to deploy...
    ✅ Deployed to: https://crm-tool-a7d9f.vercel.app"

Stack Orchestrator: "✅ All 12 checkpoints complete.
Project is live and all systems operational."
```

**Expected Outcome**:
- Agent has full context (stack, PRD, plan)
- Agent can control all necessary services (DB, deploy, etc.)
- Agent coordinates with other agents efficiently
- Agent delivers complete, tested, deployed solution

---

## Core Components & Architecture

### Meta-Architecture: 6-Phase Workflow

```
╔═══════════════════════════════════════════════════════════════╗
║                    PHASE 1: CONCEPT → PRD                     ║
║                         (GROVE System)                        ║
╚═══════════════════════════════════════════════════════════════╝
User describes concept → GROVE asks questions → Creates comprehensive PRD

    Input: "I want to build a CRM tool"
    Output: /docs/features/crm-tool/01-planning/PRD.md
    Duration: 5-10 minutes (interactive)
    Tools: grove-unified skill

╔═══════════════════════════════════════════════════════════════╗
║                 PHASE 2: STACK SELECTION                      ║
║                    (Planning Agent)                           ║
╚═══════════════════════════════════════════════════════════════╝
Planning Agent analyzes PRD → Recommends optimal stack → User approves

    Analysis:
        - "Needs relations" → PostgreSQL
        - "Needs auth with roles" → JWT
        - "Tool-centric UI" → Mosaic + Mantine
        - "Admin panel for CRUD" → React Admin

    Output: /docs/features/crm-tool/.config/stack-config.json
    Duration: 30 seconds (automated)
    Tools: Planning Agent + Party Mode validation

╔═══════════════════════════════════════════════════════════════╗
║              PHASE 3: AGENT TEAM GENERATION                   ║
║                   (Meta-Orchestrator)                         ║
╚═══════════════════════════════════════════════════════════════╝
Meta-Orchestrator generates custom agent team based on stack selections

    Process:
        1. Read stack-config.json
        2. For each stack choice, load agent template
        3. Inject PRD context into agent prompts
        4. Generate customized agents

    Templates: /templates/agents/{specialist}.template.md
    Output: /docs/features/crm-tool/.claude/agents/
        - stack-orchestrator.md (coordinator)
        - postgres-specialist.md (DB expert)
        - jwt-auth-specialist.md (Auth expert)
        - mantine-ui-specialist.md (UI expert)
        - mosaic-layout-specialist.md (Layout expert)
        - react-admin-specialist.md (Admin expert)

    Duration: 30 seconds (automated)
    Tools: Meta-Orchestrator + Template Engine

╔═══════════════════════════════════════════════════════════════╗
║            PHASE 4: ARBOR EXECUTION PLAN                      ║
║              (Planning Agent + Arbor)                         ║
╚═══════════════════════════════════════════════════════════════╝
Planning Agent creates TDD-based execution plan with agent assignments

    Process:
        1. Break down setup into checkpoints
        2. Assign each checkpoint to specialist agent
        3. Define acceptance criteria (tests) for each
        4. Map dependencies between checkpoints

    Output: /docs/features/crm-tool/03-implementation-planning/setup.plan.md

    Example Plan:
        □ 001: [postgres-specialist] Setup Postgres with Drizzle
              Tests: pnpm typecheck, pnpm db:push
        □ 002: [postgres-specialist] Create Contact & Deal schemas
              Tests: Schema types valid, relations correct
        □ 003: [postgres-specialist] Write seed script
              Tests: pnpm seed, count(*) = expected
        □ 004: [jwt-auth-specialist] Setup JWT middleware
              Tests: /api/auth/login returns token
        ... (12 checkpoints total)

    Duration: 1 minute (automated)
    Tools: Arbor planning system

╔═══════════════════════════════════════════════════════════════╗
║        PHASE 5: CLOSE & REOPEN (Agent Activation)             ║
║                    (User Action)                              ║
╚═══════════════════════════════════════════════════════════════╝
User closes Claude Code → Reopens in feature lane → Custom agents activate

    Why: Agents need to be loaded with stack context from .claude/agents/

    On Reopen:
        1. System reads stack-config.json
        2. Loads custom agent team from .claude/agents/
        3. Loads Arbor execution plan
        4. Stack Orchestrator takes control

    Duration: 5 seconds (user action)

╔═══════════════════════════════════════════════════════════════╗
║         PHASE 6: ORCHESTRATED GENERATION                      ║
║              (Stack Orchestrator + Specialists)               ║
╚═══════════════════════════════════════════════════════════════╝
Stack Orchestrator coordinates specialists to execute plan with TDD

    Workflow:
        For each checkpoint in Arbor plan:
            1. Orchestrator assigns to specialist
            2. Specialist uses LLM-patch generator
            3. Specialist runs acceptance tests
            4. If tests pass → Next checkpoint
            5. If tests fail → Debug and retry

        Final checkpoint: Integration tests (all specialists)

    Duration: 3-5 minutes (automated)
    Output: Fully working application with all tests passing
```

### Component 1: Stack Configuration System

**Purpose**: Central source of truth for project stack choices

**File**: `/docs/features/{feature}/.config/stack-config.json`

```json
{
  "projectName": "crm-tool",
  "projectType": "tool-app",
  "stack": {
    "database": {
      "type": "postgres",
      "version": "16",
      "orm": "drizzle",
      "host": "local",
      "entities": ["Contact", "Deal"]
    },
    "auth": {
      "type": "jwt",
      "provider": "jsonwebtoken",
      "features": ["login", "logout", "roles", "dev-bypass"],
      "roles": ["admin", "user"]
    },
    "uiLibrary": {
      "type": "mantine",
      "version": "7.x",
      "theme": "default",
      "styling": "emotion"
    },
    "layout": {
      "type": "mosaic",
      "preset": "tool-panels",
      "sections": ["contacts", "deals", "analytics"]
    },
    "adminPanel": {
      "type": "react-admin",
      "entities": ["Contact", "Deal"],
      "features": ["crud", "search", "export"]
    },
    "cicd": {
      "provider": "vercel",
      "branch": "main",
      "environment": {
        "production": "auto",
        "preview": "auto"
      }
    }
  },
  "agents": {
    "postgres-specialist": {
      "enabled": true,
      "version": "1.0.0",
      "checkpoints": [1, 2, 3]
    },
    "jwt-auth-specialist": {
      "enabled": true,
      "version": "1.0.0",
      "checkpoints": [4, 5]
    },
    "mantine-ui-specialist": {
      "enabled": true,
      "version": "1.0.0",
      "checkpoints": [8]
    },
    "mosaic-layout-specialist": {
      "enabled": true,
      "version": "1.0.0",
      "checkpoints": [9, 10]
    },
    "react-admin-specialist": {
      "enabled": true,
      "version": "1.0.0",
      "checkpoints": [6, 7]
    }
  },
  "testing": {
    "unit": true,
    "integration": true,
    "e2e": true,
    "visual": true
  },
  "generated": "2025-11-12T18:30:00Z",
  "lastModified": "2025-11-12T18:35:00Z"
}
```

**Read By**:
- Meta-Orchestrator (to generate agent team)
- Stack Orchestrator (to coordinate specialists)
- All Specialist Agents (to understand their role)
- LLM-Patch Generator (to create context-aware patches)

### Component 2: Custom Agent Team System

**Purpose**: Generate stack-specific AI agents that understand the project

**Templates Location**: `/templates/agents/`

**Generated Location**: `/docs/features/{feature}/.claude/agents/`

**Agent Template Structure**:
```markdown
<!-- /templates/agents/postgres-specialist.template.md -->

# PostgreSQL Specialist Agent

**Role**: Database architecture, schema design, migrations, seeding, query optimization

**Stack Context** (Auto-injected from stack-config.json):
```json
{
  "database": {{stack.database}},
  "entities": {{stack.database.entities}},
  "orm": {{stack.database.orm}}
}
```

**Project Context** (From PRD):
- Feature: {{feature.name}}
- Domain: {{feature.domain}}
- Requirements: {{feature.database_requirements}}

**Assigned Checkpoints** (From Arbor Plan):
{{assigned_checkpoints}}

**Tools Available**:
- LLM-Patch Generator (generate:db-patch)
- Drizzle CLI (db:push, db:generate, db:migrate)
- Test Runner (test:db)
- Seed Runner (db:seed)

**Integration Patterns**:
See: /docs/architecture/database-integration-patterns.md

**Quality Gates**:
- ✅ All schemas are type-safe (pnpm typecheck)
- ✅ Migrations run without errors (pnpm db:push)
- ✅ Foreign keys and constraints are correct
- ✅ Seed data loads successfully (pnpm db:seed)
- ✅ All DB tests pass (pnpm test:db)

**Common Tasks**:

1. **Setup Database**:
   ```bash
   # Checkpoint: Setup Postgres with Drizzle
   Action: generate:db-patch --action=setup
   Tests: typecheck, db:push
   ```

2. **Create Schemas**:
   ```bash
   # Checkpoint: Create entity schemas
   Action: generate:db-patch --action=schema --entities={{entities}}
   Tests: typecheck, schema validation
   ```

3. **Write Seed Script**:
   ```bash
   # Checkpoint: Seed sample data
   Action: generate:db-patch --action=seed --count=10
   Tests: db:seed, count validation
   ```

**Context Awareness**:
I understand:
- What entities exist in this project (from PRD)
- What relations are needed (from PRD requirements)
- What ORM is being used (from stack-config)
- What other specialists are working on (from Orchestrator)

**Coordination**:
I coordinate with:
- Backend API Specialist (ensure API matches schema)
- JWT Auth Specialist (create Users table if auth enabled)
- React Admin Specialist (ensure admin can query entities)
```

**Key Features**:
1. **Context Injection**: PRD + stack-config injected into agent prompt
2. **Checkpoint Assignment**: Agent knows which tasks it's responsible for
3. **Tool Awareness**: Agent knows what generator commands to use
4. **Quality Gates**: Agent knows what tests must pass
5. **Coordination**: Agent knows who to coordinate with

### Component 3: LLM-Patch Generator System

**Purpose**: Context-aware code integration (not just file copying)

**Traditional Generator Problem**:
```
generate:auth
    → Copies template files (auth.ts, middleware.ts, etc.)
    → User must manually integrate:
        - Add provider to main.tsx
        - Import middleware in api/index.ts
        - Update .env with JWT_SECRET
        - Add dependencies to package.json
    → 30+ minutes of manual work
    → High error rate (forgot a step? app breaks)
```

**LLM-Patch Solution**:
```
generate:auth
    → Reads patch instructions (auth-jwt.patches.md)
    → LLM executes patches with full context:
        ✅ Sees existing code structure
        ✅ Knows where to inject new code
        ✅ Adapts to project patterns
        ✅ Handles edge cases (provider already exists? merge it)
    → Runs tests to verify
    → 30 seconds of automated work
    → Low error rate (tests catch issues)
```

**Patch Instruction Format**:

```markdown
# JWT Auth Integration Patches

## Meta
- **Generator**: auth-jwt
- **Version**: 1.0.0
- **Stack Requirements**: express OR fastify
- **Dependencies**: jsonwebtoken, @types/jsonwebtoken

## Patch 1: Install Dependencies
**File**: package.json
**Action**: merge-dependencies
**Detect**: Look for "dependencies" object
**Merge**:
```json
{
  "jsonwebtoken": "^9.0.0",
  "@types/jsonwebtoken": "^9.0.0"
}
```

## Patch 2: Create Auth Middleware
**File**: src/api/middleware/auth.ts
**Action**: create-file
**Content**:
```typescript
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Dev bypass for development
  if (process.env.NODE_ENV === 'development' && process.env.SKIP_AUTH === 'true') {
    req.user = { userId: 'dev-user', email: 'dev@example.com', role: 'admin' };
    return next();
  }

  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

## Patch 3: Wire Middleware to API
**File**: src/api/index.ts
**Action**: insert-after
**Detect**: Find line matching `app.use(cors())`
**Insert After**:
```typescript
// JWT Authentication
import { authMiddleware } from './middleware/auth';

// Apply auth to all routes except login
app.use((req, res, next) => {
  if (req.path === '/api/auth/login') {
    return next();
  }
  return authMiddleware(req, res, next);
});
```

## Patch 4: Create Login Endpoint
**File**: src/api/routes/auth.ts
**Action**: create-file
**Content**:
```typescript
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '../../db';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (!user || user.length === 0) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, user[0].password);

  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: user[0].id, email: user[0].email, role: user[0].role },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  res.json({ token, user: { id: user[0].id, email: user[0].email, role: user[0].role } });
});

export default router;
```

## Patch 5: Register Auth Routes
**File**: src/api/index.ts
**Action**: insert-before
**Detect**: Find line matching `app.listen(`
**Insert Before**:
```typescript
// Auth routes
import authRoutes from './routes/auth';
app.use('/api/auth', authRoutes);
```

## Patch 6: Add Environment Variables
**File**: .env.example
**Action**: append
**Content**:
```
# JWT Authentication
JWT_SECRET=your-secret-key-change-in-production
SKIP_AUTH=true  # Set to false in production
```

## Patch 7: Create Users Table (if using Postgres)
**File**: src/db/schema.ts
**Action**: insert-at-end
**Conditional**: If stack.database.type === "postgres"
**Content**:
```typescript
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

## Verification Tests
**File**: tests/auth.test.ts
**Action**: create-file
**Content**:
```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/api';

describe('JWT Auth', () => {
  it('should return 401 when no token provided', async () => {
    const res = await request(app).get('/api/contacts');
    expect(res.status).toBe(401);
  });

  it('should return 200 with valid token', async () => {
    // Login to get token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeDefined();

    // Use token to access protected route
    const res = await request(app)
      .get('/api/contacts')
      .set('Authorization', `Bearer ${loginRes.body.token}`);

    expect(res.status).toBe(200);
  });

  it('should bypass auth in development mode', async () => {
    process.env.SKIP_AUTH = 'true';
    process.env.NODE_ENV = 'development';

    const res = await request(app).get('/api/contacts');
    expect(res.status).toBe(200);
  });
});
```
```

**LLM Execution Process**:
1. **Read patch instructions** (auth-jwt.patches.md)
2. **Read current codebase** (understand existing structure)
3. **Execute patches sequentially**:
   - For each patch:
     - Detect target location (via pattern matching)
     - Apply patch (merge, insert, create, append)
     - Verify syntax (TypeScript compiler)
4. **Run verification tests**
5. **Report results** (success or errors with context)

**Advantages**:
- ✅ **Context-Aware**: Sees existing code, adapts integration
- ✅ **Error-Resistant**: Tests catch issues immediately
- ✅ **Flexible**: Handles different project structures
- ✅ **Maintainable**: Patch files are human-readable
- ✅ **Debuggable**: Clear patch-by-patch execution log

### Component 4: CI/CD Generation System

**Purpose**: Generate working CI/CD pipelines for multiple hosting providers

**Supported Providers** (v1.0):
1. **Vercel** (default for Next.js/React)
2. **AWS CDK** (for full-stack control)
3. **Render.com** (simple, free tier)
4. **Digital Ocean** (VPS/Droplet deployment)

**Generator Command**:
```bash
generate:cicd --provider=vercel
generate:cicd --provider=aws-cdk --region=us-east-1
generate:cicd --provider=render
generate:cicd --provider=digitalocean --droplet-size=basic
```

**What Gets Generated**:

1. **GitHub Actions Workflow** (`/.github/workflows/deploy.yml`):
```yaml
name: Deploy to {{provider}}

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: pnpm install
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Deploy to {{provider}}
        run: |
          {{provider_specific_deploy_command}}
        env:
          {{provider_specific_secrets}}
```

2. **Provider-Specific Configuration**:

**Vercel** (`vercel.json`):
```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install",
  "devCommand": "pnpm dev",
  "framework": "vite",
  "env": {
    "DATABASE_URL": "@database-url",
    "JWT_SECRET": "@jwt-secret"
  }
}
```

**AWS CDK** (`cdk/stack.ts`):
```typescript
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as rds from 'aws-cdk-lib/aws-rds';

export class ProjectStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2 });

    // Database (if Postgres selected)
    const database = new rds.DatabaseInstance(this, 'Database', {
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_16 }),
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
    });

    // ECS Cluster + Fargate Service
    const cluster = new ecs.Cluster(this, 'Cluster', { vpc });

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef');
    taskDefinition.addContainer('app', {
      image: ecs.ContainerImage.fromAsset('.'),
      environment: {
        DATABASE_URL: database.instanceEndpoint.socketAddress,
      },
    });

    new ecs.FargateService(this, 'Service', {
      cluster,
      taskDefinition,
    });
  }
}
```

**Render** (`render.yaml`):
```yaml
services:
  - type: web
    name: {{project-name}}
    env: node
    buildCommand: pnpm install && pnpm build
    startCommand: pnpm start
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: NODE_ENV
        value: production

databases:
  - name: {{project-name}}-db
    plan: free
    databaseName: {{project-name}}
    user: {{project-name}}_user
```

**Digital Ocean** (`.do/app.yaml`):
```yaml
name: {{project-name}}
services:
  - name: web
    github:
      repo: {{repo}}
      branch: main
      deploy_on_push: true
    build_command: pnpm install && pnpm build
    run_command: pnpm start
    envs:
      - key: DATABASE_URL
        scope: RUN_TIME
        type: SECRET
      - key: JWT_SECRET
        scope: RUN_TIME
        type: SECRET
    instance_size_slug: basic-xxs
    instance_count: 1

databases:
  - name: db
    engine: PG
    version: "16"
    size: db-s-1vcpu-1gb
```

3. **Brain Monitor Integration**:

All CI/CD pipelines include Brain Monitor validation:

```yaml
# Added to .github/workflows/deploy.yml

- name: Brain Monitor Validation
  run: |
    pnpm brain:validate
    pnpm brain:typecheck-failures
    pnpm brain:test-failures

- name: Upload Validation Results
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: validation-failures
    path: |
      _errors/
      _logs/
```

4. **CLI Control Integration**:

**Key Innovation**: System uses CLI tools that AI can control

**Vercel**:
```bash
# Agent can deploy directly
vercel deploy --prod

# Agent can manage environment variables
vercel env add JWT_SECRET production
vercel env ls

# Agent can check deployment status
vercel ls
vercel inspect [deployment-url]
```

**AWS CDK**:
```bash
# Agent can deploy stack
cdk deploy --require-approval never

# Agent can check stack status
cdk list
aws cloudformation describe-stacks --stack-name ProjectStack

# Agent can update environment
aws ssm put-parameter --name /app/JWT_SECRET --value "xxx" --type SecureString
```

**Render**:
```bash
# Agent can deploy via API
render deploy --service-id srv-xxx

# Agent can manage env vars
render env set JWT_SECRET=xxx --service-id srv-xxx

# Agent can check status
render services list
```

**Digital Ocean**:
```bash
# Agent can deploy
doctl apps create --spec .do/app.yaml

# Agent can manage env
doctl apps update ${APP_ID} --env JWT_SECRET=xxx

# Agent can check status
doctl apps list
doctl apps get ${APP_ID}
```

**Benefit**: Agents can fully automate deployment, not just generate config files

### Component 5: UI Component Wrapper System

**Purpose**: Abstract UI libraries behind consistent API for easy swapping

**Problem**:
```typescript
// Direct Mantine usage (locked to Mantine)
import { Button as MantineButton } from '@mantine/core';

function App() {
  return <MantineButton variant="filled" color="blue">Click Me</MantineButton>;
}

// Want to switch to Ant Design? Rewrite every component usage!
```

**Solution**:
```typescript
// Use Brain Garden wrapper (library-agnostic)
import { Button } from '@brain-garden/ui';

function App() {
  return <Button variant="primary">Click Me</Button>;
}

// Switch UI library in config? App code stays the same!
```

**Implementation**:

**File**: `/packages/ui-kit/src/Button.tsx`
```typescript
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { getUIConfig } from './config';

// Our unified Button props
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Button component that wraps selected UI library
export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { variant = 'primary', size = 'md', loading, leftIcon, rightIcon, ...rest } = props;
  const { uiLibrary } = getUIConfig(); // Reads from stack-config.json

  // Mantine implementation
  if (uiLibrary === 'mantine') {
    const { Button: MantineButton } = await import('@mantine/core');
    return (
      <MantineButton
        ref={ref}
        variant={variant === 'primary' ? 'filled' : variant === 'ghost' ? 'subtle' : variant}
        size={size}
        loading={loading}
        leftSection={leftIcon}
        rightSection={rightIcon}
        {...rest}
      />
    );
  }

  // Ant Design implementation
  if (uiLibrary === 'antd') {
    const { Button: AntButton } = await import('antd');
    return (
      <AntButton
        ref={ref}
        type={variant === 'primary' ? 'primary' : variant === 'danger' ? 'primary' : 'default'}
        size={size === 'sm' ? 'small' : size === 'lg' ? 'large' : 'middle'}
        loading={loading}
        icon={leftIcon}
        danger={variant === 'danger'}
        {...rest}
      />
    );
  }

  // ShadCN implementation
  if (uiLibrary === 'shadcn') {
    const { Button: ShadcnButton } = await import('@/components/ui/button');
    return (
      <ShadcnButton
        ref={ref}
        variant={variant === 'ghost' ? 'ghost' : variant === 'danger' ? 'destructive' : 'default'}
        size={size}
        disabled={loading}
        {...rest}
      >
        {leftIcon}
        {props.children}
        {rightIcon}
      </ShadcnButton>
    );
  }

  // Fallback: Plain styled component (no UI library)
  return (
    <StyledButton ref={ref} $variant={variant} $size={size} disabled={loading} {...rest}>
      {leftIcon}
      {props.children}
      {rightIcon}
    </StyledButton>
  );
});

// Emotion-based fallback styling
const StyledButton = styled.button<{ $variant: string; $size: string }>`
  /* Base styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  border: none;

  /* Size variants */
  ${({ $size }) => {
    if ($size === 'sm') return 'padding: 0.5rem 1rem; font-size: 0.875rem;';
    if ($size === 'lg') return 'padding: 0.75rem 1.5rem; font-size: 1.125rem;';
    return 'padding: 0.625rem 1.25rem; font-size: 1rem;';
  }}

  /* Color variants */
  ${({ $variant }) => {
    if ($variant === 'primary') return `
      background: #3b82f6;
      color: white;
      &:hover { background: #2563eb; }
    `;
    if ($variant === 'danger') return `
      background: #ef4444;
      color: white;
      &:hover { background: #dc2626; }
    `;
    if ($variant === 'ghost') return `
      background: transparent;
      color: #3b82f6;
      &:hover { background: #f0f9ff; }
    `;
    return `
      background: #f3f4f6;
      color: #1f2937;
      &:hover { background: #e5e7eb; }
    `;
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
```

**Config Reader** (`/packages/ui-kit/src/config.ts`):
```typescript
import { readFileSync } from 'fs';
import { join } from 'path';

interface UIConfig {
  uiLibrary: 'mantine' | 'antd' | 'shadcn' | 'plain';
  theme: string;
  styling: 'emotion' | 'tailwind';
}

let cachedConfig: UIConfig | null = null;

export function getUIConfig(): UIConfig {
  if (cachedConfig) return cachedConfig;

  try {
    // Read stack config from feature directory
    const configPath = join(process.cwd(), 'docs/features', process.env.FEATURE_NAME || '', '.config/stack-config.json');
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));

    cachedConfig = {
      uiLibrary: config.stack.uiLibrary.type,
      theme: config.stack.uiLibrary.theme,
      styling: config.stack.uiLibrary.styling,
    };

    return cachedConfig;
  } catch (error) {
    // Fallback to plain if config not found
    console.warn('Could not read stack config, using plain styling');
    return { uiLibrary: 'plain', theme: 'default', styling: 'emotion' };
  }
}
```

**Benefits**:
1. **Easy Library Swapping**: Change one config value, entire app adapts
2. **Consistent API**: App code doesn't change when library changes
3. **Augmentation**: Add analytics, logging to all buttons in one place
4. **Type Safety**: TypeScript ensures prop compatibility
5. **Gradual Migration**: Can have both libraries installed during transition

**Component Library Coverage** (20% most-used):

Priority 1 (Core):
- Button
- Input
- Select
- Checkbox
- Radio
- TextArea

Priority 2 (Layout):
- Card
- Panel (Mosaic integration)
- Grid
- Stack
- Divider

Priority 3 (Data Display):
- Table
- List
- Badge
- Avatar
- Tag

Priority 4 (Feedback):
- Alert
- Toast/Notification
- Modal
- Tooltip
- Spinner

Priority 5 (Navigation):
- Tabs
- Menu
- Breadcrumbs
- Pagination

---

## Stack Options Matrix

### Database Options (Pick 1)

| Option | Use Case | Setup | Agent |
|--------|----------|-------|-------|
| **PostgreSQL** | Relational data, complex queries, production | Neon cloud OR Docker local | postgres-specialist |
| **SQLite** | Local dev, simple projects, testing | Zero setup (file-based) | sqlite-specialist |
| **MongoDB** | Document-based, flexible schema | Docker local OR MongoDB Atlas | mongo-specialist |

**Decision Logic**:
- PRD mentions "relations", "joins", "complex queries" → PostgreSQL
- PRD says "simple CRUD", "prototype", "local-first" → SQLite
- PRD mentions "flexible schema", "documents", "nested data" → MongoDB

### Auth Options (Pick 1)

| Option | Use Case | Features | Agent |
|--------|----------|----------|-------|
| **JWT** | Stateless, API-based, mobile apps | Token-based, role-based access | jwt-auth-specialist |
| **Session** | Traditional web apps, server-rendered | Cookie-based, session store | session-auth-specialist |
| **OAuth** | Social login, third-party auth | Google, GitHub, etc. | oauth-specialist |

**Decision Logic**:
- PRD mentions "API", "mobile", "stateless" → JWT
- PRD says "traditional web", "server-rendered" → Session
- PRD mentions "social login", "Google", "GitHub" → OAuth

### UI Library Options (Pick 1)

| Option | Use Case | Styling | Agent |
|--------|----------|---------|-------|
| **Mantine** | Modern, comprehensive, emotion-based | Emotion CSS-in-JS | mantine-ui-specialist |
| **Ant Design** | Enterprise, feature-rich, established | Emotion OR Less | antd-specialist |
| **ShadCN** | Minimal, Tailwind-based, copy-paste | Tailwind CSS | shadcn-specialist |
| **Plain** | Full control, no dependencies | Emotion CSS-in-JS | plain-ui-specialist |

**Decision Logic**:
- Default: Mantine (most balanced)
- PRD mentions "enterprise", "tables", "forms" → Ant Design
- PRD says "Tailwind", "minimal", "customizable" → ShadCN
- PRD mentions "unique design", "full control" → Plain

### Layout Options (Pick 1)

| Option | Use Case | Features | Agent |
|--------|----------|----------|-------|
| **Mosaic** | Tool-centric, Photoshop-style | Resizable panels, docking, window mgmt | mosaic-layout-specialist |
| **Grid** | Dashboard, card-based layouts | Responsive grid, drag-drop | grid-layout-specialist |
| **Stack** | Simple, linear layouts | Vertical/horizontal stacking | stack-layout-specialist |

**Decision Logic**:
- PRD mentions "tool", "panels", "Photoshop", "IDE" → Mosaic
- PRD says "dashboard", "cards", "widgets" → Grid
- PRD mentions "simple", "linear", "form" → Stack

### Admin Panel Options (Pick 1 or None)

| Option | Use Case | Features | Agent |
|--------|----------|----------|-------|
| **React Admin** | Full-featured, batteries-included | CRUD, search, export, relations | react-admin-specialist |
| **Refine** | Headless, customizable | Framework-agnostic, hooks-based | refine-specialist |
| **None** | Custom admin, no need | Build from scratch | N/A |

**Decision Logic**:
- PRD mentions "admin panel", "CRUD", "management" → React Admin (default)
- PRD says "custom admin", "unique design" → Refine (more flexible)
- PRD has no admin requirements → None

### CI/CD Options (Pick 1)

| Option | Use Case | Complexity | Cost |
|--------|----------|------------|------|
| **Vercel** | Frontend-focused, Next.js | Low | Free tier generous |
| **Render** | Full-stack, simple | Low | Free tier available |
| **Digital Ocean** | VPS control, flexibility | Medium | $5/mo+ |
| **AWS CDK** | Enterprise, full control | High | Variable |

**Decision Logic**:
- Default: Vercel (easiest, fastest)
- PRD mentions "full-stack", "backend services" → Render
- PRD says "control", "VPS", "custom infra" → Digital Ocean
- PRD mentions "enterprise", "multi-region", "advanced" → AWS CDK

---

## AI-Controllable Services & CLIs

**Key Innovation**: Maximize services agents can control via CLI

### Database CLIs

**PostgreSQL (via Drizzle)**:
```bash
# Agent can create tables
pnpm drizzle-kit generate:pg
pnpm drizzle-kit push:pg

# Agent can check status
pnpm drizzle-kit check

# Agent can seed data
pnpm db:seed

# Agent can inspect schema
pnpm drizzle-kit introspect:pg
```

**MongoDB**:
```bash
# Agent can run migrations
pnpm migrate-mongo up

# Agent can seed data
pnpm mongosh --eval "db.contacts.insertMany([...])"

# Agent can check status
pnpm mongo-doctor check
```

**SQLite**:
```bash
# Agent can run migrations
pnpm drizzle-kit push:sqlite

# Agent can query
pnpm sqlite3 db.sqlite "SELECT * FROM users"

# Agent can backup
pnpm sqlite3 db.sqlite ".backup backup.db"
```

### Deployment CLIs

**Vercel**:
```bash
vercel deploy --prod
vercel env add KEY value
vercel domains add custom.com
vercel logs
```

**Render**:
```bash
render deploy --service-id srv-xxx
render env set KEY=value
render logs --service srv-xxx
```

**Digital Ocean**:
```bash
doctl apps create --spec app.yaml
doctl apps update ${APP_ID} --env KEY=value
doctl apps logs ${APP_ID}
doctl databases create pg-cluster --engine pg
```

**AWS CDK**:
```bash
cdk deploy --require-approval never
cdk diff
cdk destroy
aws ssm put-parameter --name /app/KEY --value xxx
aws cloudformation describe-stacks
```

### Infrastructure CLIs

**Docker Compose**:
```bash
# Agent can start services
docker-compose up -d postgres redis

# Agent can check status
docker-compose ps

# Agent can view logs
docker-compose logs -f postgres

# Agent can restart
docker-compose restart postgres
```

**GitHub CLI**:
```bash
# Agent can create repos
gh repo create brain-garden-crm --public

# Agent can manage secrets
gh secret set JWT_SECRET

# Agent can manage actions
gh workflow run deploy.yml

# Agent can check status
gh run list
```

### Testing CLIs

**Playwright**:
```bash
# Agent can run E2E tests
pnpm playwright test

# Agent can run specific tests
pnpm playwright test auth.spec.ts

# Agent can debug
pnpm playwright test --debug

# Agent can generate reports
pnpm playwright show-report
```

**Vitest**:
```bash
# Agent can run unit tests
pnpm test

# Agent can run with coverage
pnpm test:coverage

# Agent can run specific tests
pnpm test auth

# Agent can watch
pnpm test:watch
```

### Monitoring CLIs

**Brain Monitor**:
```bash
# Agent can validate project
pnpm brain:validate

# Agent can check errors
pnpm brain:typecheck-failures

# Agent can check tests
pnpm brain:test-failures

# Agent can generate reports
pnpm brain:report
```

---

## Success Metrics & KPIs

### Primary Metrics (P0)

**1. Time to Running App**
- **Target**: ≤10 minutes from concept to running app
- **Current Baseline**: 2-4 days manual setup
- **Measurement**: Timestamp from "start GROVE" to "pnpm dev" succeeds
- **Success**: 95% of projects reach running state in ≤10 min

**2. Completion Rate**
- **Target**: ≥95% of generated apps work on first try
- **Current Baseline**: ~60% (based on typical generator + manual integration)
- **Measurement**: Tests passing / Total generations
- **Success**: <5% require manual fixes after generation

**3. Test Pass Rate**
- **Target**: 100% of tests pass on first generation
- **Current Baseline**: N/A (tests not usually set up initially)
- **Measurement**: (Unit + Integration + E2E passing) / Total tests
- **Success**: All test suites green on first run

**4. Stack Swap Time**
- **Target**: ≤5 minutes to swap major library (e.g., Postgres → MongoDB)
- **Current Baseline**: 4-8 hours (rewrite integration code)
- **Measurement**: Time from "change stack-config" to "all tests passing"
- **Success**: 90% of library swaps complete in ≤5 min

**5. First Deployment Success**
- **Target**: ≥90% of first deployments succeed
- **Current Baseline**: ~50% (config issues, secrets, etc.)
- **Measurement**: Successful first deploy / Total attempts
- **Success**: ≥90% deploy on first try

### Secondary Metrics (P1)

**6. Developer Satisfaction**
- **Target**: ≥4.5/5 average rating
- **Measurement**: Post-generation survey
- **Questions**:
  - "How satisfied are you with the generated app?"
  - "Would you use this system again?"
  - "How much time did this save you?"

**7. Agent Effectiveness**
- **Target**: ≥90% of agent tasks succeed autonomously
- **Measurement**: Autonomous successes / Total agent tasks
- **Success**: ≤10% require human intervention

**8. Component Reuse Rate**
- **Target**: ≥80% of UI needs met by pre-built components
- **Measurement**: Pre-built components used / Total components
- **Success**: Most apps don't need custom components

**9. Bug Rate Post-Generation**
- **Target**: ≤2 bugs per 1000 lines of generated code
- **Measurement**: Bugs reported / KLOC generated
- **Success**: Generated code is nearly bug-free

**10. Documentation Quality**
- **Target**: ≥90% of features documented in GROVE
- **Measurement**: Features with complete docs / Total features
- **Success**: GROVE system captures all decisions and context

---

## Future Enhancements (Post-v1.0)

### Phase 2: Visual Library Expansion

**Goal**: Increase component coverage from 20% to 40% of common needs

**Additions**:
- **Advanced Layouts**: Kanban boards, tree views, timeline
- **Data Visualization**: Charts (via Recharts), graphs, metrics
- **Rich Editors**: Markdown editor, code editor, WYSIWYG
- **File Handling**: Upload, preview, drag-drop
- **Advanced Forms**: Multi-step wizards, validation, dynamic fields

**Storybook Enhancement**:
- Visual regression testing (via Chromatic)
- Accessibility testing (via axe)
- Interaction testing (via play functions)

### Phase 3: AI Leverage Points

**Goal**: Identify and automate every possible AI-controllable touchpoint

**Research Areas**:
1. **Service APIs**: What services have CLIs or APIs agents can use?
   - Payment: Stripe CLI, PayPal API
   - Email: SendGrid CLI, Mailgun API
   - SMS: Twilio CLI
   - Storage: AWS S3 CLI, Cloudflare R2
   - Analytics: Mixpanel API, Amplitude API

2. **Infrastructure as Code**: What can agents provision?
   - Terraform CLI (any cloud provider)
   - Pulumi CLI (modern IaC)
   - Kubernetes kubectl (container orchestration)
   - Helm CLI (K8s package manager)

3. **Monitoring & Observability**: What can agents instrument?
   - Sentry CLI (error tracking)
   - DataDog API (APM)
   - New Relic CLI (monitoring)
   - LogRocket CLI (session replay)

4. **Development Tools**: What can agents automate?
   - Linting: ESLint, Prettier
   - Type Checking: TypeScript compiler
   - Bundling: Vite, Webpack, Turbopack
   - Testing: Vitest, Playwright, Cypress

**Deliverable**: Master list of AI-controllable services with:
- CLI availability
- API availability
- Authentication methods
- Common use cases
- Integration patterns

### Phase 4: Multi-Language Support

**Goal**: Extend beyond TypeScript to other languages

**Candidates**:
- **Python**: Django/Flask + SQLAlchemy
- **Go**: Gin/Echo + GORM
- **Rust**: Actix + Diesel
- **PHP**: Laravel (for WordPress integration)

**Challenge**: Maintain same level of integration quality across languages

### Phase 5: Mobile App Support

**Goal**: Generate React Native apps with same quality

**Stack Options**:
- **React Native** + Expo
- **UI**: NativeBase OR React Native Paper
- **Navigation**: React Navigation
- **State**: Redux Toolkit OR Zustand

**Challenge**: Mobile-specific testing, deployment (App Store, Play Store)

### Phase 6: Enterprise Features

**Goal**: Support large-scale enterprise use cases

**Features**:
- **Multi-Tenancy**: Isolate data per customer
- **SSO**: SAML, OAuth, LDAP integration
- **Audit Logs**: Track all user actions
- **RBAC**: Fine-grained permissions
- **Compliance**: GDPR, HIPAA, SOC2 templates

**Challenge**: Complexity increases, testing becomes harder

---

## Implementation Plan (High-Level)

### Phase 1: Foundation (Weeks 1-4)

**Goals**:
- Template structure working
- Stack config system implemented
- LLM-patch generator prototype
- Basic agent team generation

**Deliverables**:
- ✅ Template repository structure
- ✅ Stack config JSON schema
- ✅ Patch instruction format defined
- ✅ 1-2 agent templates created
- ✅ GROVE integration working

### Phase 2: Core Stack Implementation (Weeks 5-8)

**Goals**:
- Implement 1 option per category
- Test full workflow end-to-end
- Verify 10-minute MVP goal

**Stack Choices** (Initial):
- Database: PostgreSQL + Drizzle
- Auth: JWT
- UI: Mantine + Emotion
- Layout: Mosaic
- Admin: React Admin
- CI/CD: Vercel

**Deliverables**:
- ✅ postgres-specialist agent working
- ✅ jwt-auth-specialist agent working
- ✅ mantine-ui-specialist agent working
- ✅ Full workflow tested (concept → deployed app)
- ✅ All tests passing

### Phase 3: Multi-Stack Support (Weeks 9-12)

**Goals**:
- Add 2nd option per category
- Test stack combinations
- Ensure compatibility matrix

**Additions**:
- Database: + MongoDB, SQLite
- Auth: + Session-based
- UI: + Ant Design
- CI/CD: + Render.com

**Deliverables**:
- ✅ 3 database options working
- ✅ 2 auth options working
- ✅ 2 UI libraries working
- ✅ Stack compatibility tested
- ✅ Wrapper system validated

### Phase 4: Polish & Documentation (Weeks 13-16)

**Goals**:
- Comprehensive testing
- Documentation for all systems
- Performance optimization
- User testing and feedback

**Deliverables**:
- ✅ All tests passing (unit, integration, E2E)
- ✅ Full documentation written
- ✅ User guides created
- ✅ 10+ test projects generated and validated
- ✅ v1.0.0 release ready

---

## Technical Specifications

### System Requirements

**Development Environment**:
- Node.js 20+ (for Claude Code + TypeScript)
- pnpm 9+ (package manager)
- Docker Desktop (for local databases)
- Git (version control)

**Optional**:
- AWS CLI (for AWS CDK)
- Vercel CLI (for Vercel deployments)
- Render CLI (for Render deployments)
- doctl (for Digital Ocean)

### Performance Targets

**Generation Performance**:
- Stack config generation: <1 second
- Agent team generation: <30 seconds
- LLM-patch execution: <2 minutes per patch set
- Full project generation: <10 minutes total

**Runtime Performance**:
- Dev server startup: <5 seconds
- Hot reload: <500ms
- Test suite: <30 seconds (unit + integration)
- E2E tests: <2 minutes (full suite)
- Build time: <1 minute (production build)

**Resource Usage**:
- Memory: <2GB during generation
- Disk: <500MB per generated project
- Network: Minimal (only for npm installs)

### Security Considerations

**Generated Code Security**:
- ✅ No hardcoded secrets (use .env)
- ✅ JWT tokens properly validated
- ✅ CORS configured correctly
- ✅ SQL injection prevented (ORM usage)
- ✅ XSS prevented (React escaping)
- ✅ CSRF tokens (if session-based auth)

**Development Security**:
- ✅ Dev bypass clearly marked (not in production)
- ✅ Environment separation (dev/staging/prod)
- ✅ Secret management (env vars, not committed)
- ✅ Dependency scanning (npm audit)

**Deployment Security**:
- ✅ HTTPS enforced
- ✅ Security headers set
- ✅ Rate limiting configured
- ✅ Input validation on all endpoints

---

## Dependencies & Integrations

### Core Dependencies

**Always Included**:
- TypeScript 5.x
- Vite 5.x (build tool)
- Vitest (testing)
- Playwright (E2E)
- ESLint + Prettier (code quality)
- pnpm (package manager)

**Stack-Specific** (added based on selections):

**Database**:
- Drizzle ORM (if Postgres/SQLite)
- Mongoose (if MongoDB)
- pg / better-sqlite3 / mongodb (drivers)

**Auth**:
- jsonwebtoken (if JWT)
- express-session (if session-based)
- passport (if OAuth)

**UI**:
- @mantine/core (if Mantine)
- antd (if Ant Design)
- tailwindcss (if ShadCN)
- @emotion/styled (always, fallback)

**Layout**:
- react-mosaic-component (if Mosaic)
- react-grid-layout (if Grid)

**Admin**:
- react-admin (if React Admin)
- @refinedev/core (if Refine)

**CI/CD**:
- vercel (if Vercel)
- aws-cdk-lib (if AWS CDK)
- @render-cli (if Render)
- doctl (if Digital Ocean)

### External Services

**Required** (user must provide):
- GitHub account (for CI/CD)
- Deployment provider account (Vercel/Render/AWS/DO)

**Optional** (depending on stack):
- Neon account (if Postgres cloud)
- MongoDB Atlas (if MongoDB cloud)
- OAuth provider accounts (Google, GitHub, etc.)

---

## Open Questions & Decisions Needed

### Q1: How to Handle Version Upgrades?

**Question**: When Mantine 8.0 comes out, how do we update agents?

**Options**:
A. Agents versioned with library versions (mantine-7-specialist, mantine-8-specialist)
B. Agents auto-update from templates (regenerate on version change)
C. User manually updates agent prompts

**Recommendation**: Option B (auto-update from templates)

**Rationale**: Keeps agents current, low maintenance, agents stay in sync with libraries

---

### Q2: How to Handle Agent Conflicts?

**Question**: What if postgres-specialist and jwt-auth-specialist both want to modify the same file?

**Options**:
A. Stack Orchestrator serializes operations (one at a time)
B. Agents coordinate via messaging (request file locks)
C. LLM-patch generator handles merges intelligently

**Recommendation**: Option C (intelligent merging) with Option B fallback (coordination)

**Rationale**: Most efficient, only coordinate when necessary

---

### Q3: How to Test All Stack Combinations?

**Question**: With 3 DBs × 2 Auth × 3 UIs × 3 Layouts = 54 combinations, how do we test all?

**Options**:
A. Test matrix: Generate and test all combinations (expensive)
B. Test critical paths: Only test common combinations (risky)
C. Compatibility declarations: Agents declare incompatibilities, system prevents

**Recommendation**: Option C (compatibility declarations) + Option B (test common)

**Rationale**: Prevent incompatible selections, focus testing on common paths

---

### Q4: How to Handle Custom Requirements?

**Question**: What if user wants a library not in our 2-3 options (e.g., Chakra UI)?

**Options**:
A. User creates custom agent template (power user feature)
B. System suggests closest match (e.g., "Chakra is similar to Mantine, use that?")
C. Request feature (add Chakra to roadmap)

**Recommendation**: Option B (suggest closest) + Option C (request feature)

**Rationale**: Keeps scope manageable, allows user flexibility

---

## Risks & Mitigations

### Risk 1: LLM-Patch Failures

**Risk**: LLM fails to apply patch correctly, breaks app

**Impact**: High (app doesn't work)

**Likelihood**: Medium (LLMs sometimes hallucinate)

**Mitigation**:
1. Run tests after every patch (catch errors immediately)
2. Rollback mechanism (undo failed patches)
3. Verbose logging (debug failures easily)
4. Fallback to traditional generator (copy files if patches fail)

### Risk 2: Agent Team Complexity

**Risk**: Coordinating 5-7 agents is complex, orchestration fails

**Impact**: High (generation fails)

**Likelihood**: Medium (multi-agent systems are hard)

**Mitigation**:
1. Stack Orchestrator has full visibility (monitors all agents)
2. Clear checkpoint assignments (no ambiguity)
3. Dependency graph prevents conflicts (serialize when needed)
4. Extensive testing (simulate agent coordination)

### Risk 3: Stack Incompatibilities

**Risk**: User selects incompatible stack (e.g., ShadCN + Emotion)

**Impact**: Medium (generates broken app)

**Likelihood**: Low (we can prevent most)

**Mitigation**:
1. Compatibility matrix (hard-coded rules)
2. Planning Agent validates selections (before generation)
3. Party Mode review (catch edge cases)
4. Clear error messages ("ShadCN requires Tailwind, not Emotion")

### Risk 4: Scope Creep

**Risk**: Feature requests expand scope, delay v1.0

**Impact**: High (never ship)

**Likelihood**: High (users want everything)

**Mitigation**:
1. Strict v1.0 scope (only 2-3 options per category)
2. v2.0 roadmap (capture future requests)
3. Non-goals explicitly stated (set expectations)
4. Focus on 10-minute MVP metric (filter features by impact)

---

## Conclusion

The **Brain Garden Rapid Development Kit** represents a **paradigm shift** in project generation:

**Traditional Approach**:
- Generator → 80% complete → User integrates → 2-4 days → Maybe works

**Brain Garden Approach**:
- PRD → Stack Selection → Agent Team → LLM-Patches → Tests → 10 minutes → Definitely works

**Key Innovations**:
1. **Stack-Specific Agent Teams**: Custom AI agents for each library
2. **LLM-Patch Integration**: Context-aware code integration, not file copying
3. **TDD from Day One**: All generated code is tested and working
4. **CI/CD from Day One**: Deploy immediately, no setup needed
5. **Library Abstraction**: Swap libraries without changing app code
6. **Full AI Control**: Agents can deploy, configure, monitor, not just generate

**Impact**:
- **95%+ completion rate** (vs 60% typical generators)
- **10 minutes** (vs 2-4 days manual setup)
- **Zero technical debt** (tested, documented, deployed from start)
- **Maximum AI leverage** (agents control entire stack)

This system transforms "project setup" from a **multi-day manual process** to a **10-minute automated workflow**, freeing developers to focus on **business logic and custom features** instead of boilerplate and configuration.

---

**Next Steps**:
1. Review and approve PRD
2. Create technical design document
3. Break down into Arbor execution plan
4. Begin Phase 1 implementation

**PRD Status**: ✅ Complete, Ready for Review

