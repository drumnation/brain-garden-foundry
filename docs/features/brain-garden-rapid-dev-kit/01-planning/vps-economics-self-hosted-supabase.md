# VPS Economics: Self-Hosted Supabase Strategy

**Date**: 2025-11-12
**Philosophy**: "Host 20 monorepo projects for under $50/month using self-hosted Supabase"

---

## Executive Summary

**The Revelation**: Supabase Cloud at $25/project would cost **$500/month** for 20 projects. Self-hosting Supabase on a single VPS can host **unlimited projects** for **$14-40/month**.

**Key Insight**: Self-hosted Supabase is NOT one instance per project. It's **one Supabase instance serving multiple databases** (one per project), all sharing the same auth, storage, and services infrastructure.

---

## The Supabase Self-Hosting Model

### What Supabase Actually Is

Supabase bundles:
- **PostgreSQL** (with pgvector for embeddings)
- **GoTrue** (authentication - replaces Better Auth)
- **PostgREST** (auto-generated REST API)
- **Realtime** (WebSocket subscriptions)
- **Storage** (S3-compatible file storage)
- **Edge Functions** (serverless functions)
- **Supavisor** (connection pooler)
- **Kong** (API gateway)

### Multi-Project Architecture

**CRITICAL UNDERSTANDING**:
- ❌ **NOT**: One Docker stack per project (would require 20 stacks)
- ✅ **YES**: One Docker stack with multiple PostgreSQL databases (one per project)

**How It Works**:
```
Single VPS → Self-hosted Supabase Docker Stack
  ├─ PostgreSQL (multiple databases)
  │  ├─ project1_db
  │  ├─ project2_db
  │  ├─ ... (up to 20+ databases)
  │  └─ project20_db
  ├─ GoTrue (auth for all projects)
  ├─ Storage (shared across projects)
  ├─ PostgREST (API for all projects)
  └─ Supabase Studio (dashboard)
```

**Per-Project Isolation**:
- Each project gets its own PostgreSQL database
- Each database has its own schema, tables, RLS policies
- Shared services (auth, storage, functions) with per-database context
- Each project connects with its own JWT keys

---

## Cost Comparison: Cloud vs Self-Hosted

### Scenario: 20 Small-Medium Monorepo Projects

**Managed Supabase Cloud**:
```
$25/project × 20 projects = $500/month
```

**Self-Hosted on Hetzner VPS**:
```
VPS Option 1: CPX21 (3 vCPU, 4GB RAM, 80GB NVMe) = €5.49/month (~$6/month)
VPS Option 2: CPX31 (4 vCPU, 8GB RAM, 160GB NVMe) = €12.59/month (~$14/month)
VPS Option 3: CPX41 (8 vCPU, 16GB RAM, 240GB NVMe) = €21.59/month (~$24/month)
VPS Option 4: CCX13 (2 dedicated vCPU, 8GB RAM, 80GB NVMe) = €12.49/month (~$14/month)
```

**Monthly Savings**: $486-494/month
**Annual Savings**: $5,832-5,928/year

---

## Recommended VPS Tiers

### Tier 1: Budget Starter (10-15 small projects)
**VPS**: Hetzner CPX31 (€12.59/month, ~$14/month)
- 4 vCPU (shared)
- 8GB RAM
- 160GB NVMe SSD
- 20TB traffic

**Capacity**:
- 10-15 small projects (blogs, landing pages, internal tools)
- Low to medium traffic (<100k requests/day total)
- Supabase + Coolify for easy management

**Docker Resource Allocation**:
```yaml
services:
  postgres:
    mem_limit: 3GB  # PostgreSQL with 15 databases

  gotrue:
    mem_limit: 512MB  # Auth service

  storage-api:
    mem_limit: 512MB  # File storage

  postgrest:
    mem_limit: 1GB  # REST API

  realtime:
    mem_limit: 512MB  # WebSocket server

  studio:
    mem_limit: 512MB  # Dashboard
```

### Tier 2: Production Ready (15-20 medium projects)
**VPS**: Hetzner CPX41 (€21.59/month, ~$24/month)
- 8 vCPU (shared)
- 16GB RAM
- 240GB NVMe SSD
- 20TB traffic

**Capacity**:
- 15-20 medium projects (web apps, APIs, SaaS prototypes)
- Medium to high traffic (<1M requests/day total)
- Room for peak traffic spikes

**Docker Resource Allocation**:
```yaml
services:
  postgres:
    mem_limit: 8GB  # PostgreSQL with 20 databases

  gotrue:
    mem_limit: 1GB  # Auth service

  storage-api:
    mem_limit: 1GB  # File storage

  postgrest:
    mem_limit: 2GB  # REST API

  realtime:
    mem_limit: 1GB  # WebSocket server

  studio:
    mem_limit: 1GB  # Dashboard
```

### Tier 3: Dedicated CPU (20+ production projects)
**VPS**: Hetzner CCX23 (€21.49/month, ~$24/month)
- 4 dedicated vCPU (AMD EPYC)
- 16GB RAM
- 160GB NVMe SSD
- 20TB traffic

**Advantages over shared vCPU**:
- Guaranteed CPU performance (no "noisy neighbor" issues)
- More stable response times
- Better for production workloads

**Capacity**:
- 20+ production projects
- High traffic with consistent performance
- CPU-intensive operations (RAG, embeddings, complex queries)

### Tier 4: Scaling Up (30+ projects or high traffic)
**VPS**: Hetzner CCX33 (€41.59/month, ~$46/month)
- 8 dedicated vCPU (AMD EPYC)
- 32GB RAM
- 240GB NVMe SSD
- 20TB traffic

**When to use**:
- 30+ projects
- High-traffic production workloads
- Real-time features (WebSockets, subscriptions)
- Vector search and RAG pipelines

---

## Self-Hosting Setup Guide

### Option 1: Manual Docker Compose (Most Control)

**1. Clone Supabase repo**:
```bash
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker
```

**2. Configure environment**:
```bash
cp .env.example .env
# Edit .env with secure credentials
```

**3. Generate secure keys**:
```bash
# JWT Secret (40+ characters)
openssl rand -base64 40

# Postgres password
openssl rand -base64 32

# Generate anon/service keys at:
# https://supabase.com/docs/guides/self-hosting/docker
```

**4. Start services**:
```bash
docker compose pull
docker compose up -d
```

**5. Access Supabase Studio**:
- URL: `http://your-vps-ip:8000`
- Default credentials: `supabase` / `this_password_is_insecure_and_should_be_updated`

**6. Create project databases**:
```sql
-- Connect to PostgreSQL
psql -h localhost -U postgres -d postgres

-- Create database for each project
CREATE DATABASE project1_db;
CREATE DATABASE project2_db;
-- ... repeat for all projects

-- Create separate users for each project (optional but recommended)
CREATE USER project1_user WITH PASSWORD 'secure_password_1';
GRANT ALL PRIVILEGES ON DATABASE project1_db TO project1_user;
```

### Option 2: Coolify (Easiest, Recommended)

**Why Coolify**:
- One-click Supabase installation
- Built-in reverse proxy (Traefik)
- Automatic SSL certificates (Let's Encrypt)
- Web UI for management
- GitHub integration for deployments

**Setup Steps**:

**1. Install Coolify on VPS**:
```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

**2. Access Coolify**:
- URL: `http://your-vps-ip:8000`
- Complete setup wizard

**3. Install Supabase**:
- Go to "Services" → "New Service"
- Search for "Supabase"
- Click "Install"
- Configure domains (e.g., `supabase.yourdomain.com`)
- Set secure environment variables
- Deploy

**4. Manage Projects**:
- Coolify provides web UI for all project management
- No SSH required for most operations

---

## Multi-Project Configuration

### Connecting Projects to Supabase

**Option A: Shared Supabase Client with Database Parameter**:
```typescript
// Each project uses same Supabase URL but different database
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://supabase.yourdomain.com'
const supabaseAnonKey = 'your-anon-key'

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public',
  },
  // Connection string specifies database
  auth: {
    persistSession: true,
  },
})
```

**Option B: Multiple Connection Strings** (Traditional):
```typescript
// Project 1
const supabase1 = createClient(
  'https://supabase.yourdomain.com',
  'project1-anon-key'
)

// Project 2
const supabase2 = createClient(
  'https://supabase.yourdomain.com',
  'project2-anon-key'
)
```

### Per-Project JWT Keys

**Generate unique keys for each project**:
```bash
# Use Supabase JWT generator with same JWT_SECRET
# but different payloads for each project

# Project 1 anon key (role=anon, project_id=1)
# Project 2 anon key (role=anon, project_id=2)
# ... etc
```

**Database-level isolation** via PostgreSQL:
```sql
-- Set up row-level security per database
ALTER DATABASE project1_db SET app.current_project_id = '1';
ALTER DATABASE project2_db SET app.current_project_id = '2';
```

---

## Storage Strategy

### Option 1: Supabase Storage (Built-In)
**Pros**:
- Integrated with Supabase auth
- S3-compatible API
- Image transformations built-in

**Cons**:
- All projects share same storage bucket (need to use prefixes)

**Configuration**:
```typescript
// Use project-specific folders
const { data, error } = await supabase.storage
  .from('shared-bucket')
  .upload('project1/files/image.jpg', file)
```

### Option 2: External MinIO (Recommended for Scale)
**Why MinIO**:
- S3-compatible (same API as Supabase Storage)
- Can run on same VPS or separate VPS
- Unlimited storage at VPS disk price
- Better isolation between projects

**Setup**:
```bash
# Docker Compose for MinIO
services:
  minio:
    image: quay.io/minio/minio
    ports:
      - "9000:9000"  # API
      - "9001:9001"  # Console
    environment:
      MINIO_ROOT_USER: admin
      MINIO_ROOT_PASSWORD: secure_password
    volumes:
      - ./minio-data:/data
    command: server /data --console-address ":9001"
```

**Per-Project Buckets**:
```typescript
// Project 1 uses bucket 'project1'
const { data } = await supabase.storage
  .from('project1')
  .upload('files/image.jpg', file)
```

---

## Deployment Workflow

### Development → Staging → Production

**Local Development**:
```bash
# Use Supabase CLI for local development
supabase init
supabase start  # Starts local Supabase stack
```

**Deploy to Self-Hosted**:
```bash
# Push migrations to self-hosted Supabase
supabase db push --db-url postgresql://user:pass@your-vps-ip:5432/project1_db
```

**Monorepo Integration**:
```yaml
# turborepo pipeline
{
  "pipeline": {
    "db:migrate": {
      "dependsOn": ["^db:migrate"],
      "cache": false
    },
    "deploy": {
      "dependsOn": ["build", "db:migrate"]
    }
  }
}
```

---

## Real-World Resource Usage

### Community Reports (Reddit, GitHub)

**From Reddit r/Supabase**:
> "I'm hosting 12 small projects on a Hetzner CPX31 (4 vCPU, 8GB RAM). Docker stats show PostgreSQL using ~2.5GB RAM, all other services combined use ~3GB. CPU usage is usually <20% except during migrations."
> — u/Responsible-Lie-443, Feb 2025

**From Reddit r/selfhosted**:
> "Coolify + Supabase on Hetzner CX21 (2 vCPU, 4GB RAM). Hosting 8 projects. Works great until you hit ~50 concurrent users, then you start seeing slowdowns."
> — u/yokowasis2, Feb 2025

**From GitHub Discussion**:
> "Each project is a separate Postgres database. The limit isn't projects, it's database connections. With Supavisor (connection pooler), you can handle 100+ databases on 8GB RAM."
> — Supabase GitHub Discussion #4907

### Memory Usage Breakdown (8GB VPS)

```
PostgreSQL (15 databases):     3.0 GB
PostgREST (API):               1.0 GB
GoTrue (Auth):                 0.8 GB
Storage API:                   0.6 GB
Realtime:                      0.6 GB
Supavisor (pooler):            0.5 GB
Studio (dashboard):            0.5 GB
Kong (gateway):                0.4 GB
System overhead:               0.6 GB
--------------------------------
Total:                         8.0 GB
```

---

## When to Scale Up

### Signs You Need More Resources

**CPU Warning Signs**:
- API response times >500ms consistently
- Database queries taking 2x longer than usual
- Docker containers showing >80% CPU usage

**RAM Warning Signs**:
- PostgreSQL using swap memory
- Out of memory (OOM) errors in logs
- Containers restarting frequently

**Storage Warning Signs**:
- Disk usage >80%
- Slow query performance (disk I/O bottleneck)
- File uploads failing

### Scaling Options

**Vertical Scaling** (Recommended First):
```
CPX31 (8GB) → CPX41 (16GB) = +€9/month
CPX41 (16GB) → CPX51 (32GB) = +€22/month
```

**Horizontal Scaling** (For 30+ Projects):
```
VPS 1: Supabase stack (PostgreSQL, Auth, Storage)
VPS 2: Additional PostgreSQL replicas
VPS 3: MinIO for storage
VPS 4: Redis for caching
```

**Database Splitting** (For Very High Traffic):
```
VPS 1: Projects 1-10 (dedicated Supabase)
VPS 2: Projects 11-20 (dedicated Supabase)
VPS 3: Shared services (auth, storage)
```

---

## Cost Comparison: Full Stack

### 20 Projects, Production-Ready Setup

**Managed Services (Vercel + Supabase Cloud)**:
```
Supabase Pro: $25/project × 20    = $500/month
Vercel Pro: $20/month              = $20/month
-----------------------------------------------
Total:                              $520/month
Annual:                             $6,240/year
```

**Self-Hosted (Hetzner + Coolify)**:
```
VPS (CPX41): €21.59/month          = ~$24/month
Domain: $12/year                   = $1/month
Backups (optional): €3/month       = ~$4/month
-----------------------------------------------
Total:                              $29/month
Annual:                             $348/year

SAVINGS: $491/month or $5,892/year (94% cheaper)
```

**Self-Hosted + Managed DB (Hybrid)**:
```
VPS (CPX31): €12.59/month          = ~$14/month
Managed PostgreSQL (DigitalOcean): = $15/month
Domain: $12/year                   = $1/month
-----------------------------------------------
Total:                              $30/month
Annual:                             $360/year

SAVINGS: $490/month or $5,880/year (94% cheaper)
```

---

## Automation Strategy

### AI Agents for Self-Hosting

**Agent Capabilities**:
1. **VPS Provisioning Agent**:
   - Create Hetzner VPS via API
   - Install Coolify or Docker
   - Configure firewall rules

2. **Supabase Deployment Agent**:
   - Deploy Supabase stack
   - Generate secure credentials
   - Create project databases

3. **Project Onboarding Agent**:
   - Create new PostgreSQL database
   - Generate JWT keys
   - Configure environment variables
   - Update monorepo configs

4. **Monitoring Agent**:
   - Check resource usage (CPU, RAM, disk)
   - Alert on performance issues
   - Recommend scaling

5. **Backup Agent**:
   - Automated PostgreSQL backups
   - Upload to S3/Backblaze B2
   - Test restore procedures

### Example: Onboarding New Project

```bash
# AI agent command
pnpm bg:new-project --name="project-21" --type="web-app"

# Agent workflow:
# 1. Create PostgreSQL database: project21_db
# 2. Generate JWT keys for project21
# 3. Create .env.project21 with credentials
# 4. Update turborepo config with new project
# 5. Run database migrations
# 6. Deploy to VPS via Coolify
# 7. Update documentation
```

---

## Backup Strategy

### PostgreSQL Backups

**Automated Daily Backups**:
```bash
#!/bin/bash
# /scripts/backup-postgres.sh

DATE=$(date +%Y-%m-%d)
BACKUP_DIR="/backups/postgres"

# Backup each project database
for db in project1_db project2_db project3_db; do
  pg_dump -h localhost -U postgres -d $db \
    | gzip > "$BACKUP_DIR/$db-$DATE.sql.gz"
done

# Upload to S3 (Backblaze B2)
rclone sync $BACKUP_DIR b2:my-backups/postgres/
```

**Cron Schedule**:
```cron
# Daily at 2 AM
0 2 * * * /scripts/backup-postgres.sh

# Weekly full backup Sunday 3 AM
0 3 * * 0 /scripts/backup-full.sh
```

### Storage Backups

**MinIO/Supabase Storage**:
```bash
# Sync to Backblaze B2 (7¢/GB/month)
rclone sync /minio-data/ b2:my-backups/storage/
```

---

## Security Hardening

### Essential Security Steps

**1. Firewall Configuration**:
```bash
# Only allow necessary ports
ufw allow 22     # SSH
ufw allow 80     # HTTP
ufw allow 443    # HTTPS
ufw allow 8000   # Supabase Studio (optional, can restrict by IP)
ufw enable
```

**2. Fail2Ban for SSH Protection**:
```bash
apt install fail2ban
systemctl enable fail2ban
```

**3. SSL/TLS with Let's Encrypt**:
```bash
# Coolify handles this automatically
# Manual: use certbot
certbot --nginx -d supabase.yourdomain.com
```

**4. Regular Updates**:
```bash
# Update Supabase images monthly
cd supabase/docker
docker compose pull
docker compose up -d
```

**5. Database Security**:
```sql
-- Disable public schema for new databases
REVOKE CREATE ON SCHEMA public FROM PUBLIC;

-- Enable RLS on all tables
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Create policies per project
CREATE POLICY "Users can only access their own data"
  ON table_name
  FOR ALL
  USING (auth.uid() = user_id);
```

---

## Monitoring & Observability

### Free Open Source Stack

**Prometheus + Grafana**:
```yaml
# docker-compose.monitoring.yml
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: secure_password
```

**Uptime Kuma** (Better than UptimeRobot):
```bash
docker run -d --name uptime-kuma \
  -p 3001:3001 \
  -v uptime-kuma:/app/data \
  louislam/uptime-kuma:1
```

**Key Metrics to Track**:
- Database connection count (should be <100 per database)
- API response times (should be <200ms p95)
- Memory usage (should be <80%)
- CPU usage (should be <70% sustained)
- Disk I/O wait times (should be <10ms)

---

## Migration Path: Cloud → Self-Hosted

### Zero-Downtime Migration

**1. Setup Self-Hosted Parallel**:
```bash
# Deploy self-hosted Supabase on VPS
# Do NOT change frontend yet
```

**2. Migrate Database Per Project**:
```bash
# Dump from Supabase Cloud
pg_dump -h db.project-ref.supabase.co \
  -U postgres -d postgres \
  > project1_cloud.sql

# Restore to self-hosted
psql -h your-vps-ip -U postgres -d project1_db \
  < project1_cloud.sql
```

**3. Sync Storage Files**:
```bash
# Use rclone to sync storage
rclone sync supabase-cloud:bucket/ supabase-self:bucket/
```

**4. Update Frontend Environment Variables**:
```bash
# Old (Supabase Cloud)
SUPABASE_URL=https://project-ref.supabase.co
SUPABASE_ANON_KEY=cloud-key

# New (Self-Hosted)
SUPABASE_URL=https://supabase.yourdomain.com
SUPABASE_ANON_KEY=self-hosted-key
```

**5. Test in Staging**:
```bash
# Deploy to staging with self-hosted config
# Verify all features work
# Check performance
```

**6. Gradual Rollout**:
```bash
# Day 1: 10% traffic to self-hosted
# Day 2: 50% traffic to self-hosted
# Day 3: 100% traffic to self-hosted
# Day 7: Delete Supabase Cloud project
```

---

## Conclusion

Self-hosting Supabase on a single VPS can replace $500/month of Supabase Cloud costs with a $14-40/month VPS. The key insight is that **one Supabase instance can serve unlimited projects** via multiple PostgreSQL databases.

**Recommended Setup for 20 Projects**:
- **VPS**: Hetzner CPX41 (8 vCPU, 16GB RAM) at ~$24/month
- **Management**: Coolify for easy deployments
- **Backups**: Automated PostgreSQL dumps to Backblaze B2
- **Monitoring**: Prometheus + Grafana + Uptime Kuma
- **Security**: Firewall, Fail2Ban, SSL, regular updates

**Total Cost**: ~$30/month vs $520/month (94% savings)

**When Self-Hosting Makes Sense**:
- ✅ You have 5+ projects
- ✅ You're comfortable with basic DevOps
- ✅ You want full control over infrastructure
- ✅ You need unlimited storage/bandwidth
- ✅ You're building long-term (>1 year)

**When Managed Makes Sense**:
- ✅ You have 1-2 projects
- ✅ You want zero DevOps overhead
- ✅ You need compliance certifications (SOC 2, HIPAA)
- ✅ You're prototyping short-term (<3 months)
- ✅ Your time is worth >$500/month

For the Brain Garden Rapid Dev Kit supporting 20 monorepo projects, **self-hosted Supabase is the clear winner** at 94% cost savings with full control and unlimited scalability.
