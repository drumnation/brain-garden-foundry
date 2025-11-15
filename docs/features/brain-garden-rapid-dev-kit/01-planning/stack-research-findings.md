# Brain Garden Rapid Dev Kit - Stack Research Findings

**Date**: 2025-11-12
**Research Method**: Parallel.ai Web Search (comprehensive 2024-2025 data)
**Philosophy**: "Narrow and powerful" - fewer options with deeper integration and preset agent capability

---

## Executive Summary

This document presents comprehensive research findings for 5 critical technology areas in the Brain Garden Rapid Dev Kit. The research prioritizes technologies that:

1. **Match existing stack**: pnpm monorepo, Turbo, React, TypeScript, Mantine, shadcn/ui, ESM-only
2. **Enable agent expertise**: Clear documentation, TypeScript-first, excellent developer experience
3. **Balance simplicity and power**: Fewer options with deeper integration rather than supporting everything
4. **Provide "preset capability and access"**: Battle-tested integrations agents can use confidently

---

## 1. Chat UI Libraries

### Winner: Assistant UI

**GitHub**: 7.3k stars, 400k+ monthly downloads
**Stack Alignment**: ⭐⭐⭐⭐⭐ (Perfect Match)

#### Why Assistant UI is the Perfect Match

**Architecture Alignment**:
- Built with **pnpm + Turbo monorepo** (exact match for user's stack)
- TypeScript-first with excellent types
- Based on **shadcn/ui patterns** (user already uses this)
- Composable primitives philosophy
- ESM-only architecture

**Key Features**:
- YC-backed (Winter 2025), production-ready
- Composable primitives: `<Thread>`, `<Assistant>`, `<Message>`, `<Composer>`
- Streaming support built-in
- Built-in markdown rendering with syntax highlighting
- Speech and vision capabilities
- Specific Claude Code SDK integration examples
- React Server Components support

**Agent-Friendly**:
- Excellent documentation at [assistant-ui.com](https://assistant-ui.com)
- TypeScript-first with comprehensive types
- Simple API that agents can learn quickly
- Active community (400k+ downloads/month indicates strong adoption)

**Code Example**:
```typescript
import { Thread } from "@assistant-ui/react";

export default function MyApp() {
  return <Thread />;
}
```

#### Alternative: react-chat-elements

**GitHub**: 1.2k stars
**When to Use**: If you need pre-built message bubbles and chat layouts without the full Assistant UI framework

**Trade-offs**:
- Simpler, more basic components
- Less opinionated architecture
- Not as feature-rich for streaming/real-time updates
- Not as well-aligned with user's monorepo stack

### Recommendation

**Default Choice**: Assistant UI
- Perfect stack alignment (pnpm + Turbo + shadcn/ui)
- Best for cursor-for-X, popup agent, and inline assistant patterns
- Provides "preset capability" through composable primitives

**Use react-chat-elements when**: You need simple chat bubbles without the full Assistant UI framework (rare case)

---

## 2. Authentication Solutions

### Top 2 Options: Better Auth vs Clerk

Both are viable with different trade-offs. Choice depends on control vs convenience preference.

### Option A: Better Auth (Self-Hosted)

**GitHub**: 22.9k stars
**Stack Alignment**: ⭐⭐⭐⭐⭐ (Perfect Match)

#### Why Better Auth Excels

**Architecture Alignment**:
- Built with **pnpm monorepo**
- TypeScript-native
- MIT license (fully open-source)
- Self-hosted = complete data sovereignty

**Key Features**:
- Database ownership (PostgreSQL, MySQL, SQLite, MongoDB)
- Built-in plugins: OAuth (Google, GitHub, Discord, etc.), magic links, 2FA, passkeys
- Session management with JWT or database sessions
- Rate limiting and security features built-in
- Email verification and password reset flows
- RBAC (Role-Based Access Control)
- Middleware for route protection

**Agent-Friendly**:
- Comprehensive TypeScript types
- Clear documentation
- Modular plugin system agents can understand
- Predictable patterns

**Cost**:
- Free (MIT license)
- Infrastructure costs only (database + email service)
- No per-user pricing

**Trade-offs**:
- You manage infrastructure (database, email service, deployment)
- You handle compliance (though you control the implementation)
- You maintain security updates

### Option B: Clerk (Managed Service)

**Pricing**: $0-300 first year, then $25/mo (10k MAUs)
**Stack Alignment**: ⭐⭐⭐⭐ (Good - TypeScript SDK available)

#### Why Clerk Excels

**Managed Convenience**:
- 15-minute setup to production
- SOC 2 Type 2 certified
- GDPR, CCPA, HIPAA-ready
- Built-in compliance

**Key Features**:
- Pre-built React components (`<SignIn>`, `<UserButton>`)
- OAuth providers out of the box
- Magic links, passkeys, 2FA
- User management dashboard
- Webhooks for user lifecycle events
- Organizations and team management
- Session management with JWTs

**Agent-Friendly**:
- Excellent React SDK with TypeScript
- Clear documentation
- Predictable patterns

**Cost**:
- Free: 10k MAUs + 100 organizations
- Pro: $25/mo (up to 10k MAUs)
- First year special: $0-300 total cost
- Enterprise: Custom pricing

**Trade-offs**:
- Vendor lock-in
- Less control over data storage
- Must trust third-party with user data
- Costs scale with usage

### Option C: Auth.js (NextAuth v5)

**Status**: Not recommended
**Reason**: Migration challenges, edge compatibility issues, community reports of complexity in v5

### Option D: Custom JWT

**Status**: Not recommended for initial implementation
**Reason**: High maintenance burden (40-80 hours/month), should only be considered if absolutely necessary for unique requirements

### Recommendation

**For maximum control + cost optimization**: Better Auth
- Perfect when you want complete database ownership
- Ideal for startups optimizing costs
- Best when you have DevOps resources

**For fastest time-to-market + compliance**: Clerk
- Perfect when you need SOC 2, HIPAA compliance immediately
- Best for teams without dedicated security resources
- Excellent for MVPs that need to look professional

**Decision Framework**:
```
Do you need SOC 2/HIPAA immediately?
  YES → Clerk
  NO → Do you have DevOps resources?
    YES → Better Auth (save $300+/year)
    NO → Clerk (worth the cost for time savings)
```

---

## 3. Chart Libraries

### Winner: Recharts (or Mantine Charts)

**GitHub**: 24.8k stars, 3.6M+ weekly downloads
**Stack Alignment**: ⭐⭐⭐⭐⭐ (Perfect - Already integrated in Mantine!)

#### Why Recharts is the Default Choice

**Discovery**: Mantine already has a built-in charts package based on Recharts!

**Architecture Alignment**:
- React-native declarative components
- TypeScript support
- SVG rendering (accessible, responsive)
- D3-based (proven technology)

**Key Features**:
- Line, Bar, Pie, Area, Scatter, Radar charts
- Responsive design built-in
- Composable components (`<LineChart>`, `<XAxis>`, `<YAxis>`, `<Tooltip>`)
- Animation support
- Custom shapes and labels
- Brush component for zooming

**Agent-Friendly**:
- Declarative API (easy for agents to generate)
- Predictable component patterns
- Extensive examples in documentation
- TypeScript types included

**Mantine Integration**:
- `@mantine/charts` package available
- Pre-styled to match Mantine theme
- Already part of user's stack

**Code Example**:
```typescript
import { LineChart } from '@mantine/charts';

function Demo() {
  return (
    <LineChart
      h={300}
      data={data}
      dataKey="date"
      series={[
        { name: 'Apples', color: 'indigo.6' },
        { name: 'Oranges', color: 'blue.6' },
      ]}
    />
  );
}
```

#### Alternative: react-chartjs-2

**GitHub**: 6.8k stars, 1.6M+ weekly downloads
**Stack Alignment**: ⭐⭐⭐⭐

**When to Use**:
- Need Canvas-based rendering (vs SVG)
- Complex custom animations
- Already familiar with Chart.js

**Trade-offs**:
- More imperative API (less agent-friendly)
- Requires more configuration
- Not as well-integrated with Mantine

#### Other Options (Not Recommended)

**Victory**: 11.1k stars, React Native support
- Good for React Native projects
- Overkill for web-only applications

**Nivo**: 13.5k+ stars, versatile rendering
- More complex API
- Better for data visualization specialists

### Recommendation

**Default Choice**: Recharts via `@mantine/charts`
- Already part of Mantine ecosystem
- Perfect stack alignment
- Excellent agent-friendliness
- Community favorite for simplicity

**Use react-chartjs-2 when**: You need Canvas rendering or have existing Chart.js expertise (rare case)

---

## 4. State Management (for MCP Tools Pattern)

### Winner: Zustand

**GitHub**: 148 community votes (vs 75 for Redux)
**Stack Alignment**: ⭐⭐⭐⭐⭐

#### Why Zustand is the Community Favorite

**Simplicity**:
- ~3KB bundle size (vs 14KB for Redux Toolkit)
- Minimal boilerplate
- No providers required
- Direct store access

**TypeScript Excellence**:
- TypeScript-first design
- Excellent type inference
- No need for action creators or reducers

**Perfect for MCP Tools Pattern**:
- Store state maps directly to MCP tools
- Actions become tool functions
- Simple subscription model
- Easy to serialize for AI consumption

**Agent-Friendly**:
- Minimal concepts to learn
- Clear, predictable patterns
- Easy to generate code for

**Code Example**:
```typescript
import create from 'zustand';

interface CustomerStore {
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
  removeCustomer: (id: string) => void;
}

const useCustomerStore = create<CustomerStore>((set) => ({
  customers: [],
  addCustomer: (customer) => set((state) => ({
    customers: [...state.customers, customer]
  })),
  removeCustomer: (id) => set((state) => ({
    customers: state.customers.filter((c) => c.id !== id)
  })),
}));

// MCP Tool Generation
export const customerTools = {
  addCustomer: useCustomerStore.getState().addCustomer,
  removeCustomer: useCustomerStore.getState().removeCustomer,
};
```

**Community Data**:
- 148 votes for Zustand in Reddit poll
- 75 votes for Redux Toolkit
- Strong momentum in 2024-2025

#### Alternative: Redux Toolkit

**GitHub**: 60.2k stars
**Stack Alignment**: ⭐⭐⭐⭐

**When to Use**:
- Large teams needing strict patterns
- Complex state with time-travel debugging
- Already invested in Redux ecosystem

**Trade-offs**:
- ~14KB bundle size
- More boilerplate
- Steeper learning curve
- Requires providers

#### Alternative: Jotai

**GitHub**: 16.5k stars
**Stack Alignment**: ⭐⭐⭐⭐

**When to Use**:
- Prefer atom-based state (like Recoil)
- Need fine-grained reactivity
- Working with derived state

**Trade-offs**:
- Different mental model
- Less familiar to most developers
- Smaller ecosystem

#### Alternative: Valtio

**GitHub**: Proxy-based state
**Stack Alignment**: ⭐⭐⭐

**When to Use**:
- Small projects
- Prefer mutable state API

**Trade-offs**:
- Debugging challenges at scale
- Proxy-based can have edge cases

### Recommendation

**Default Choice**: Zustand
- Best balance of simplicity and power
- Perfect for MCP tools pattern (Redux actions → MCP tools)
- Excellent TypeScript support
- Community overwhelming preference (148 vs 75 votes)
- Minimal bundle size (~3KB)

**Use Redux Toolkit when**: You have a large team that needs strict patterns and time-travel debugging (rare case)

**Use Jotai when**: You specifically need atom-based state and fine-grained reactivity (rare case)

---

## 5. Vector Databases (for RAG)

### Winner: Qdrant (Local Dev) + Choice of Managed Service

**GitHub**: 9,000+ stars (Qdrant), 24.4k stars (Chroma)
**Stack Alignment**: ⭐⭐⭐⭐⭐

#### Recommendation: Two-Tier Strategy

### For Local Development: Qdrant or Chroma

Both are excellent for local development with Docker Compose. Choose based on preference:

#### Option A: Qdrant (Local)

**Why Qdrant for Local Dev**:
- Rust-based (fast, reliable)
- Excellent Docker support
- TypeScript/JavaScript SDK (`@qdrant/js-client-rest`)
- Sub-millisecond p99 latency on small datasets
- Advanced filtering with metadata
- 1GB free tier on cloud (for testing)

**Docker Compose Setup**:
```yaml
services:
  qdrant:
    image: qdrant/qdrant:latest
    restart: always
    ports:
      - "6333:6333"  # HTTP
      - "6334:6334"  # gRPC
    volumes:
      - ./qdrant_data:/qdrant/storage
```

**TypeScript Example**:
```typescript
import { QdrantClient } from '@qdrant/js-client-rest';

const client = new QdrantClient({
  url: 'http://localhost:6333'
});

await client.createCollection('documents', {
  vectors: { size: 1536, distance: 'Cosine' }
});
```

#### Option B: Chroma (Local)

**Why Chroma for Local Dev**:
- Python and TypeScript SDKs
- Simplest setup (embedded mode)
- Great for prototyping
- Apache 2.0 license

**Docker Compose Setup**:
```yaml
services:
  chroma:
    image: chromadb/chroma:latest
    ports:
      - "8000:8000"
    volumes:
      - ./chroma_data:/chroma/chroma
```

**TypeScript Example**:
```typescript
import { ChromaClient } from 'chromadb';

const client = new ChromaClient({
  path: 'http://localhost:8000'
});

const collection = await client.createCollection({
  name: 'documents',
  metadata: { 'hnsw:space': 'cosine' }
});
```

### For Production: Three Tiers Based on Scale

#### Tier 1: Small Scale (<10M vectors) - Qdrant Cloud

**Pricing**: 1GB free forever → $25/month
**Why**: Best free tier, excellent filtering, perfect for startups

**Benefits**:
- No credit card for free tier
- Excellent cost efficiency
- Advanced metadata filtering
- Hybrid cloud option available

#### Tier 2: Medium Scale (10-100M vectors) - Choose Based on Priorities

**Option A: Pinecone (Easiest)**
- **Pricing**: Free (limited) → $70/month → Enterprise
- **Best For**: Teams without DevOps, need SOC 2/HIPAA immediately
- **Trade-offs**: More expensive, vendor lock-in

**Option B: Qdrant Cloud (Best Value)**
- **Pricing**: 1GB free → $25/month → $99/month Hybrid Cloud
- **Best For**: Cost-conscious teams, need self-hosting option
- **Trade-offs**: Smaller ecosystem than Pinecone

**Option C: Weaviate Cloud (Hybrid Search)**
- **Pricing**: $25/month serverless → Enterprise
- **Best For**: Need keyword + semantic search, GraphQL API
- **Trade-offs**: Storage-based pricing can be expensive

#### Tier 3: Large Scale (>100M vectors) - Milvus/Zilliz or Pinecone Serverless

**Milvus/Zilliz Cloud**:
- **Best For**: Billions of vectors, have DevOps resources
- **Benefits**: 70%+ cost savings vs managed, open-source
- **Trade-offs**: Operational complexity

**Pinecone Serverless**:
- **Best For**: Scale without operations, budget available
- **Benefits**: Zero operations, auto-scaling
- **Trade-offs**: Most expensive option

### Research Findings Summary

**Qdrant vs Chroma (Local Dev)**:
- **Qdrant**: Faster (626 QPS at 1M vectors), Rust-based, better filtering
- **Chroma**: Simpler API, better for prototyping, embedded mode

**Qdrant vs Pinecone (Production)**:
- **Qdrant**: 4x cheaper ($25 vs $70), better free tier, self-hosting option
- **Pinecone**: Easier to use, better docs, larger ecosystem, sub-100ms guaranteed

**Qdrant vs Weaviate (Production)**:
- **Qdrant**: Better value, faster for pure vector search
- **Weaviate**: Better hybrid search, GraphQL API, storage-based pricing

**Key Performance Data** (from benchmarks):
- **Weaviate**: 791 QPS
- **Qdrant**: 326 QPS at scale (626 QPS at 1M vectors)
- **Pinecone**: 150 QPS (p2 pods)

**Stack Alignment**:
- All options have excellent TypeScript SDKs
- All support Docker Compose for local dev
- All have pnpm-friendly packaging

### Recommendation

**Local Development**:
- **Primary**: Qdrant (better performance, advanced filtering)
- **Alternative**: Chroma (simpler, great for learning)

**Production Strategy**:
```
Scale < 10M vectors: Qdrant Cloud (1GB free → $25/mo)
Scale 10-50M vectors: Qdrant Cloud or Pinecone (budget vs ease)
Scale 50-100M vectors: Weaviate (if need hybrid) or Qdrant Hybrid Cloud
Scale > 100M vectors: Milvus/Zilliz (if have DevOps) or Pinecone Serverless
```

**Decision Framework**:
```
Need free tier for MVP? → Qdrant Cloud (1GB free)
Need fastest setup? → Pinecone (15-min to production)
Need hybrid search? → Weaviate (keyword + semantic)
Need cheapest at scale? → Qdrant Cloud or self-hosted Milvus
Need enterprise compliance immediately? → Pinecone (SOC 2)
```

---

## Implementation Strategy

### Phase 1: Default Stack (90% of use cases)

**Recommended Defaults** (align with "narrow and powerful" philosophy):

1. **Chat UI**: Assistant UI
   - Perfect stack match (pnpm + Turbo + shadcn/ui)
   - Best agent-friendliness
   - Composable primitives

2. **Authentication**: Better Auth (with Clerk as upgrade path)
   - Start with Better Auth for control + cost
   - Document Clerk migration path for teams needing SOC 2

3. **Charts**: Recharts via `@mantine/charts`
   - Already in Mantine ecosystem
   - Community favorite
   - Excellent agent-friendliness

4. **State Management**: Zustand
   - Community overwhelming preference
   - Perfect for MCP tools pattern
   - Minimal bundle size

5. **Vector Database**: Qdrant (local) → Qdrant Cloud (production)
   - Best free tier
   - Excellent TypeScript SDK
   - Cost-effective scaling path

### Phase 2: Document Alternative Paths

Create clear migration guides for:

**Authentication**: Better Auth → Clerk (when need SOC 2)
**Vector DB**: Qdrant → Pinecone (when need easiest operations)
**Vector DB**: Qdrant → Weaviate (when need hybrid search)
**State**: Zustand → Redux Toolkit (when need strict patterns)

### Phase 3: Agent Training Materials

For each technology, create:

1. **Quick Start Guide** (5-minute setup)
2. **Common Patterns** (copy-paste examples)
3. **Integration Guide** (how it fits with other stack components)
4. **Troubleshooting** (common issues + solutions)

---

## Cost Analysis (Estimated Monthly)

### Minimal MVP (< 1,000 users)
- **Better Auth**: $0 (self-hosted)
- **Qdrant Cloud**: $0 (1GB free tier)
- **Assistant UI**: $0 (open-source)
- **Recharts**: $0 (open-source)
- **Zustand**: $0 (open-source)
- **Total**: $0/month

### Growing Startup (1,000-10,000 users)
- **Better Auth**: $10/month (managed email service)
- **Qdrant Cloud**: $25/month
- **Assistant UI**: $0
- **Recharts**: $0
- **Zustand**: $0
- **Total**: $35/month

### Scale (10,000-100,000 users)
- **Clerk**: $25-100/month (if switched for compliance)
- **Qdrant Hybrid Cloud**: $99/month
- **Assistant UI**: $0
- **Recharts**: $0
- **Zustand**: $0
- **Total**: $124-199/month

### Comparison: Alternative Stack
- **Auth0**: $240/month
- **Pinecone**: $70-500/month
- **Total**: $310-740/month

**Savings**: $186-616/month with recommended stack

### DIY Cloud vs $$ Cloud (Deployment Economics)

#### Self-Hosted Baseline (Hetzner + Coolify)
- **Compute**: Hetzner Cloud CX43 (8 vCPU / 16 GB RAM / 160 GB NVMe, 20 TB traffic) for **€9.49/mo (~$10.59)**.[(Hetzner Cloud Pricing)](https://www.hetzner.com/cloud/)
- **Backups**: Optional Hetzner automated backups add **20% of instance price (~€1.90/mo)**; 50 GB of extra block storage costs **€0.044/GB (~€2.20/mo)**.[(Hetzner Cloud Pricing)](https://www.hetzner.com/cloud/)
- **PaaS Layer**: Coolify is open-source/self-hosted with Git integration, automatic Let's Encrypt SSL, 280+ one-click services, and server automations for zero licensing cost.[(Coolify Features)](https://coolify.io)
- **Ops Model**: Fits "preset capability" philosophy—single VPS agents can manage start/stop, deploy, backup, and monitor via Coolify CLI/API.

#### Managed PaaS Baseline (Render + Vercel)
- **Render**: Professional workspace ($19/user/mo) plus Standard web services (**$25 per service for 2 GB RAM / 1 vCPU**) and managed Postgres (**$19/mo** for 1 GB plan).[(Render Pricing)](https://render.com/pricing)
- **Vercel**: Pro plan **$20/mo** per developer with 1 TB Fast Data Transfer included; overages billed at **$0.15/GB**, Edge requests at **$2 per 1M**, and ISR writes/reads after free tiers.[(Vercel Pricing)](https://vercel.com/pricing)
- **Stack Reality**: Production apps typically need both a runtime (Render/Vercel) and a managed database, so monthly spend scales per service rather than per server.

#### Scenario: 5 Production Apps (Single Developer)
| Line Item | Self-Hosted (Hetzner + Coolify) | Render PaaS | Vercel Pro + Managed DB |
|-----------|---------------------------------|------------|-------------------------|
| Application runtime | 1× CX43 = **€9.49** (~$10.59) | 5× Standard services = **$125** | Pro seat **$20** (runtime) |
| High availability / ops | Backups (20%) + 50 GB volume = **€4.10** (~$4.58) | Professional seat **$19** | Additional Fast Data (500 GB over 1 TB) ≈ **$75** |
| Database | Self-host/Postgres container = **€0** (ops handled via Coolify) | Render Postgres Basic-1GB = **$19** | Managed Postgres (e.g., Supabase Pro) ≈ **$25** |
| **Approx. monthly total** | **€13.59** (~$15) | **$163** | **$120** |

> Self-hosted delivers ~**10× cost efficiency** for this workload while keeping infrastructure under one roof that agents can automate.

#### Open-Source PaaS Options at a Glance
- **Coolify** – GUI + API, multi-server support, push-to-deploy, automatic SSL, monitoring, notifications, 280+ one-click services.[(Coolify Features)](https://coolify.io)
- **CapRover** – Web UI + CLI, Docker Swarm clustering, free automatic Let's Encrypt, one-click apps (Mongo, MySQL, WordPress, etc.), "no lock-in" philosophy.[(CapRover Overview)](https://caprover.com)
- **Dokku** – CLI-first Heroku-compatible workflow, Git push deploys, plugin system, zero vendor lock-in, runs on any VPS.[(Dokku Overview)](https://dokku.com)

These platforms let AI agents own the full deployment pipeline (provision → deploy → monitor) without recurring platform fees.

#### Deployment Tiers (Recommended Framework)
1. **Tier 0 – Local Dev**: Docker Compose (existing).  
2. **Tier 1 – DIY Cloud**: Single VPS (Hetzner, DigitalOcean) + Coolify/CapRover/Dokku for shared hosting of many apps.  
3. **Tier 2 – Hybrid**: VPS for app runtime + managed services where compliance is required (e.g., switch Better Auth → Clerk, Qdrant → Pinecone).  
4. **Tier 3 – Fully Managed**: Vercel/Render + managed databases/CDN for teams prioritizing turnkey compliance and guaranteed SLAs.

This structure keeps the default stack "narrow and powerful" while documenting upgrade paths when compliance, traffic, or team size evolve.

---
## Agent Capability Assessment


Scoring each technology on agent-friendliness (0-10):

| Technology | Documentation | TypeScript | Patterns | Complexity | Score |
|------------|--------------|------------|----------|------------|-------|
| Assistant UI | 9 | 10 | 9 | 8 | 9.0 |
| Better Auth | 8 | 9 | 8 | 7 | 8.0 |
| Clerk | 10 | 9 | 9 | 9 | 9.25 |
| Recharts | 9 | 8 | 9 | 8 | 8.5 |
| Zustand | 10 | 10 | 10 | 9 | 9.75 |
| Qdrant | 8 | 9 | 8 | 7 | 8.0 |
| Chroma | 9 | 8 | 9 | 9 | 8.75 |

**Average Score**: 8.75/10 (Excellent)

All recommended technologies score ≥8.0, ensuring agents can work effectively with the stack.

---

## Next Steps

1. **Update stack-options-and-templates.md** with these findings
2. **Create integration guides** for each technology
3. **Build example applications** showing full stack integration
4. **Generate agent training materials** (patterns, examples, troubleshooting)
5. **Document migration paths** (Better Auth → Clerk, Qdrant → Pinecone, etc.)

---

## References

- Assistant UI: https://assistant-ui.com
- Better Auth: https://github.com/better-auth/better-auth
- Clerk: https://clerk.com
- Recharts: https://recharts.org
- Mantine Charts: https://mantine.dev/charts
- Zustand: https://github.com/pmndrs/zustand
- Qdrant: https://qdrant.tech
- Chroma: https://www.trychroma.com
- Pinecone: https://www.pinecone.io
- Weaviate: https://weaviate.io
- Hetzner Cloud: https://www.hetzner.com/cloud/
- Coolify: https://coolify.io
- CapRover: https://caprover.com
- Dokku: https://dokku.com
- Render: https://render.com/pricing
- Vercel: https://vercel.com/pricing

---

**Philosophy Reminder**: These recommendations follow the "narrow and powerful" philosophy - choosing THE BEST option in each category rather than listing many options. This enables deeper integration and better agent expertise through "preset capability and access."
