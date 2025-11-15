# Managed vs Self-Hosted: Complete Cost Comparison

**Date**: 2025-11-12
**Scenario**: 20 Monorepo Projects (Brain Garden Rapid Dev Kit Use Case)

---

## Executive Summary

**The Big Question**: What's the real cost of hosting 20 small-medium monorepo projects?

**The Answer**:
- **Managed Services**: $390-520/month ($4,680-6,240/year)
- **Self-Hosted Supabase**: $24-30/month ($288-360/year)
- **Savings**: $4,392-5,952/year (92-94% cheaper)

---

## Managed Services Breakdown

### Option 1: Vercel + Supabase Cloud (Premium Stack)

**Vercel Pro** ($20/month base + usage):
- 1 deploying seat included in $20 base fee
- $20 in monthly usage credit
- Includes: 1TB bandwidth, 10M edge requests
- Additional usage billed on-demand

**Per-Project Costs on Vercel**:
```
Small project (static site, low traffic):
  - Base: $0 (within included limits)
  - Typical monthly cost: $0-2

Medium project (Next.js app, moderate traffic):
  - Base: $0 (within included limits)
  - Typical monthly cost: $2-5

High-traffic project (API + frontend, heavy usage):
  - Edge requests overage: $2-5
  - Bandwidth overage: $3-8
  - Functions compute: $5-15
  - Typical monthly cost: $10-28
```

**Realistic 20-Project Mix** on Vercel:
```
10 small projects: $0-20/month
8 medium projects: $16-40/month
2 high-traffic projects: $20-56/month
--------------------------------
Subtotal Vercel: $56-116/month
(But let's be conservative: ~$20-40/month for typical usage)
```

**Supabase Pro** ($25/project):
```
$25/project × 20 projects = $500/month
```

**Total Option 1**: ~$520-556/month ($6,240-6,672/year)

---

### Option 2: Render + Supabase Cloud (Mid-Tier)

**Render Professional** ($19/user + compute):
- $19/month per deploying user
- 500GB bandwidth included
- Compute charged per instance

**Per-Service Costs on Render**:
```
Web Service Starter: $9/month (512MB RAM, 0.5 CPU)
Web Service Standard: $25/month (2GB RAM, 1 CPU)
Web Service Pro: $85/month (4GB RAM, 2 CPU)

Postgres Basic-1gb: $19/month (1GB RAM)
Redis Starter: $10/month (256MB RAM)
```

**Realistic 20-Project Setup**:
```
20 web services (Starter): $180/month
2 shared Postgres databases: $38/month
1 shared Redis: $10/month
Professional plan (1 user): $19/month
--------------------------------
Subtotal Render: $247/month
```

**Supabase Pro** ($25/project):
```
$25/project × 20 projects = $500/month
```

**Total Option 2**: ~$747/month ($8,964/year)

**Wait, that's MORE expensive than Vercel!**
Reality check: If you're using Render, you probably DON'T need Supabase for every project since Render gives you direct database access.

**More Realistic Render Scenario** (using Render DBs):
```
20 web services (Starter): $180/month
5 shared Postgres databases: $95/month (each DB hosts 4 projects)
2 Redis instances: $20/month
Professional plan: $19/month
--------------------------------
Total Render (self-managed DBs): $314/month ($3,768/year)
```

---

### Option 3: Hybrid Managed (Vercel + Managed Postgres)

**Vercel Pro** + **Neon/Supabase** (selective):
```
Vercel Pro plan: $20/month
Vercel usage (20 projects): $20-40/month

Shared Postgres (Neon Serverless): $0-19/month
  (Free tier: 0.5GB, then $19/month for Scale plan)

Shared Redis (Upstash): $10-30/month
  (Pay-as-you-go, ~$10 for moderate usage)

Storage (Cloudflare R2): $15/TB/month
--------------------------------
Total Hybrid: $65-109/month ($780-1,308/year)
```

This is the "smart developer" approach: Use Vercel's free hosting where possible, pay only for what you need.

---

## Self-Hosted Supabase Breakdown

### Option 1: Budget Starter (Hetzner CPX31)

**VPS**: Hetzner CPX31
- **Specs**: 4 vCPU (shared), 8GB RAM, 160GB NVMe SSD, 20TB bandwidth
- **Cost**: €12.59/month (~$14/month)
- **Capacity**: 10-15 small projects comfortably

**Setup**:
- One Supabase Docker stack
- 15 PostgreSQL databases (one per project)
- Shared auth, storage, API services
- Coolify for management (optional, free)

**Additional Costs**:
- Domain: $12/year (~$1/month)
- Backups to Backblaze B2: $0.005/GB (~$3/month for 600GB)
- **Total**: $18/month ($216/year)

**Per-Project Cost**: $1.20/month

---

### Option 2: Production Ready (Hetzner CPX41)

**VPS**: Hetzner CPX41
- **Specs**: 8 vCPU (shared), 16GB RAM, 240GB NVMe SSD, 20TB bandwidth
- **Cost**: €21.59/month (~$24/month)
- **Capacity**: 15-20 medium projects

**Additional Costs**:
- Domain: $1/month
- Backups: $4/month
- **Total**: $29/month ($348/year)

**Per-Project Cost**: $1.45/month

---

### Option 3: Dedicated CPU (Hetzner CCX23)

**VPS**: Hetzner CCX23
- **Specs**: 4 dedicated vCPU (AMD EPYC), 16GB RAM, 160GB NVMe SSD
- **Cost**: €21.49/month (~$24/month)
- **Capacity**: 20+ production projects with guaranteed performance

**Additional Costs**:
- Domain: $1/month
- Backups: $4/month
- **Total**: $29/month ($348/year)

**Per-Project Cost**: $1.45/month

**Why Dedicated CPU?**
- No "noisy neighbor" issues
- Consistent performance
- Better for production workloads

---

### Option 4: High-Scale (Hetzner CCX33)

**VPS**: Hetzner CCX33
- **Specs**: 8 dedicated vCPU (AMD EPYC), 32GB RAM, 240GB NVMe SSD
- **Cost**: €41.59/month (~$46/month)
- **Capacity**: 30+ projects or high-traffic production

**Additional Costs**:
- Domain: $1/month
- Backups: $5/month
- **Total**: $52/month ($624/year)

**Per-Project Cost**: $1.73/month (for 30 projects)

---

## Cost Comparison Table

| Solution | Monthly Cost | Annual Cost | Per-Project Cost | Savings vs Managed |
|----------|-------------|-------------|------------------|-------------------|
| **Managed: Vercel + Supabase** | $520-556 | $6,240-6,672 | $26-28/project | Baseline |
| **Managed: Render + Render DBs** | $314 | $3,768 | $15.70/project | 40% cheaper |
| **Hybrid: Vercel + Neon** | $65-109 | $780-1,308 | $3.25-5.45/project | 83-87% cheaper |
| **Self-Hosted: CPX31 (Budget)** | $18 | $216 | $1.20/project | **96% cheaper** |
| **Self-Hosted: CPX41 (Prod)** | $29 | $348 | $1.45/project | **94% cheaper** |
| **Self-Hosted: CCX23 (Dedicated)** | $29 | $348 | $1.45/project | **94% cheaper** |
| **Self-Hosted: CCX33 (Scale)** | $52 | $624 | $1.73/project | **90% cheaper** |

---

## Break-Even Analysis

### Self-Hosted vs Vercel + Supabase

**Monthly Savings**: $491-527
**Time to Break Even**: Immediate (first month)
**5-Year Savings**: $29,460-31,620

**DevOps Time Cost**:
```
Initial setup: 8-16 hours (one-time)
Monthly maintenance: 2-4 hours

Assuming $100/hour DevOps rate:
- Setup cost: $800-1,600 (one-time)
- Monthly cost: $200-400

First-year total: $3,200-6,400 (setup + 12 months maintenance)

Break-even: Month 7-13
After break-even: Pure savings of $5,892/year
```

### Self-Hosted vs Render (with Render DBs)

**Monthly Savings**: $285-306
**Annual Savings**: $3,420-3,672
**5-Year Savings**: $17,100-18,360

**Break-even**: Month 11-22 (accounting for DevOps time)

### Self-Hosted vs Hybrid (Vercel + Neon)

**Monthly Savings**: $36-91
**Annual Savings**: $432-1,092
**5-Year Savings**: $2,160-5,460

**Break-even**: Month 18-44 (accounting for DevOps time)

---

## Hidden Costs Analysis

### Managed Services Hidden Costs

**Vercel**:
- ❌ Bandwidth overages: $0.15/GB after 1TB
- ❌ Edge function compute: Can spike with traffic
- ❌ Per-seat pricing: $20/additional developer
- ❌ Build minutes: Can accumulate on frequent deploys
- ❌ Enterprise features locked: SAML SSO ($300/mo), DDoS protection, etc.

**Supabase Cloud**:
- ❌ Per-project pricing: No multi-tenancy option
- ❌ Database size limits: Free tier 500MB, Pro 8GB (then $0.125/GB)
- ❌ Bandwidth limits: Pro includes 50GB, then $0.09/GB
- ❌ Egress charges: Data transfer can add up
- ❌ Compute limits: Can't run long background jobs

**Render**:
- ❌ Per-service pricing: Each app is a separate $7-9 charge
- ❌ Per-database pricing: Each DB is $19-75/month
- ❌ Build minutes: 500/month limit, then blocked
- ❌ Per-user pricing: $19/month per team member
- ❌ Memory-based pricing: Upgrading RAM = big jump in cost

### Self-Hosted Hidden Costs

**Infrastructure**:
- ✅ Backups: $3-5/month (Backblaze B2)
- ✅ Monitoring: $0 (Prometheus + Grafana, self-hosted)
- ✅ SSL certificates: $0 (Let's Encrypt via Coolify)
- ✅ Domain: $12/year ($1/month)

**Time Costs**:
- ⚠️ Initial setup: 8-16 hours (one-time)
- ⚠️ Monthly maintenance: 2-4 hours
  - Security updates
  - Backup verification
  - Performance monitoring
  - Occasional troubleshooting

**Risk Costs**:
- ⚠️ Downtime: You're responsible for uptime
- ⚠️ Data loss: Backup strategy is critical
- ⚠️ Security: Must stay on top of patches

---

## When Each Option Makes Sense

### Choose Managed Services If:

**Vercel + Supabase**:
- ✅ You have 1-3 projects (not 20)
- ✅ Your time is worth >$200/hour
- ✅ You need SOC 2 / HIPAA compliance
- ✅ You're prototyping short-term (<6 months)
- ✅ You need global edge performance
- ✅ You have a funded startup with investor money

**Render**:
- ✅ You want managed databases with direct access
- ✅ You prefer predictable flat-rate pricing
- ✅ You need Docker support for legacy apps
- ✅ You're migrating from Heroku
- ✅ You have 1-5 projects

**Hybrid (Vercel + Neon)**:
- ✅ You're experienced with DevOps
- ✅ You want best-in-class frontend hosting
- ✅ You're comfortable managing databases separately
- ✅ You have 5-15 projects

### Choose Self-Hosted If:

**Hetzner + Self-Hosted Supabase**:
- ✅ You have 5+ projects (economies of scale)
- ✅ You're comfortable with DevOps fundamentals
- ✅ You want full control over infrastructure
- ✅ You're building long-term (>1 year)
- ✅ You want to learn infrastructure management
- ✅ You need unlimited storage/bandwidth
- ✅ You want to save 92-96% on hosting costs

---

## Real-World Use Cases

### Use Case 1: Solo Developer (10 Projects)

**Managed (Hybrid)**:
```
Vercel Pro: $20/month
Neon Scale: $19/month
Upstash Redis: $10/month
--------------------------
Total: $49/month ($588/year)
```

**Self-Hosted**:
```
Hetzner CPX31: $14/month
Domain + Backups: $4/month
--------------------------
Total: $18/month ($216/year)

Savings: $372/year (63%)
```

**Recommendation**: Hybrid if you value managed DBs, Self-hosted if you want max savings.

---

### Use Case 2: Small Team (20 Projects, 3 Developers)

**Managed (Vercel + Supabase)**:
```
Vercel Pro: $20/month (1 seat)
Additional seats: $40/month (2 × $20)
Vercel usage: $30/month (estimate)
Supabase Pro: $500/month (20 × $25)
--------------------------
Total: $590/month ($7,080/year)
```

**Self-Hosted**:
```
Hetzner CPX41: $24/month
Domain + Backups: $5/month
--------------------------
Total: $29/month ($348/year)

Savings: $6,732/year (95%)
```

**Recommendation**: Self-hosted. The savings alone justify hiring a part-time DevOps person.

---

### Use Case 3: Growing Startup (30 Projects, 5 Developers)

**Managed (Render)**:
```
Professional plan: $95/month (5 × $19)
30 web services: $270/month (30 × $9)
8 Postgres DBs: $152/month (8 × $19)
3 Redis instances: $30/month (3 × $10)
--------------------------
Total: $547/month ($6,564/year)
```

**Self-Hosted**:
```
Hetzner CCX33: $46/month
Domain + Backups: $6/month
--------------------------
Total: $52/month ($624/year)

Savings: $5,940/year (90%)
```

**Recommendation**: Self-hosted. Use savings to hire a dedicated DevOps engineer.

---

## Migration Path: Managed → Self-Hosted

### Phase 1: Setup (Week 1)
1. Provision Hetzner VPS
2. Install Coolify
3. Deploy self-hosted Supabase
4. Test with 1 non-critical project

### Phase 2: Gradual Migration (Weeks 2-4)
1. Migrate 5 projects per week
2. Run in parallel (managed + self-hosted)
3. Monitor performance and uptime
4. Keep managed services as backup

### Phase 3: Full Cutover (Week 5)
1. Migrate remaining projects
2. Verify all features working
3. Set up monitoring and alerts
4. Delete managed service projects

### Phase 4: Optimization (Week 6+)
1. Fine-tune resource allocation
2. Implement automated backups
3. Set up staging environments
4. Document runbooks

**Total Migration Time**: 6-8 weeks
**Risk**: Low (parallel running reduces risk)
**Downtime**: Zero (blue-green deployment)

---

## Automation & AI Agents

### Self-Hosting Automation Strategy

**Agent 1: VPS Provisioner**
```bash
# AI agent creates VPS via Hetzner API
pnpm bg:provision-vps --size=cpx41 --location=us-east
```

**Agent 2: Supabase Deployer**
```bash
# AI agent deploys Supabase stack via Coolify API
pnpm bg:deploy-supabase --vps=cpx41-prod
```

**Agent 3: Project Onboarder**
```bash
# AI agent creates new project database
pnpm bg:new-project --name=project-21 --env=production

# Agent workflow:
# 1. Create PostgreSQL database
# 2. Generate JWT keys
# 3. Run migrations
# 4. Update monorepo config
# 5. Deploy via Coolify
```

**Agent 4: Monitoring & Alerting**
```bash
# AI agent monitors resources and alerts
pnpm bg:monitor --threshold=80

# Checks:
# - CPU usage >80%
# - RAM usage >85%
# - Disk usage >90%
# - Response times >500ms
```

**Agent 5: Backup Manager**
```bash
# AI agent handles automated backups
pnpm bg:backup --schedule=daily --retention=30days

# Workflow:
# 1. Dump all PostgreSQL databases
# 2. Compress with gzip
# 3. Upload to Backblaze B2
# 4. Verify backup integrity
# 5. Prune old backups
```

---

## Conclusion

For the Brain Garden Rapid Dev Kit hosting **20 monorepo projects**, the economics are clear:

**Self-hosted Supabase is 92-96% cheaper** than managed services, saving $5,000-6,000/year.

### Recommended Setup for 20 Projects:

**Infrastructure**:
- **VPS**: Hetzner CPX41 or CCX23 (~$24/month)
- **Management**: Coolify (free)
- **Backups**: Automated to Backblaze B2 ($4/month)
- **Monitoring**: Prometheus + Grafana (self-hosted, free)
- **Total**: ~$29/month ($348/year)

**Capacity**:
- 20 PostgreSQL databases (one per project)
- Shared auth, storage, realtime services
- Unlimited bandwidth (20TB included)
- Always-on services

**Cost Per Project**: $1.45/month vs $26-28/month (95% savings)

### When to Stick with Managed:

- You have <3 projects
- Your time is worth >$200/hour AND you don't want to learn DevOps
- You need SOC 2 / HIPAA immediately
- You're prototyping short-term (<6 months)

### When to Go Self-Hosted:

- ✅ You have 5+ projects (economies of scale kick in)
- ✅ You're building long-term (>1 year)
- ✅ You want full infrastructure control
- ✅ You're comfortable with basic DevOps (or willing to learn)
- ✅ You want to save 90-96% on hosting costs

**For 20 projects, self-hosting isn't just cheaper—it's 20x cheaper.** The question isn't "Can I afford to self-host?" but rather "Can I afford NOT to?"
