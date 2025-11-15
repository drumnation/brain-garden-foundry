# AI-Controllable Services and CLIs

**Version**: 1.0
**Last Updated**: 2025-11-12
**Status**: Planning Phase

---

## Executive Summary

This document catalogs all services, tools, and CLIs that AI agents can control programmatically. The Brain Garden Rapid Development Kit focuses exclusively on **AI-controllable** technologies to enable full automation from development to deployment.

**Selection Criteria**:
- ✅ CLI available for all operations
- ✅ REST API for programmatic control
- ✅ Exit codes and structured output
- ✅ Non-interactive mode supported
- ❌ No GUI-only tools
- ❌ No manual-only workflows

---

## Table of Contents

1. [Deployment & Hosting](#deployment--hosting)
2. [Databases](#databases)
3. [Authentication & Identity](#authentication--identity)
4. [Development Tools](#development-tools)
5. [Testing & QA](#testing--qa)
6. [Monitoring & Logging](#monitoring--logging)
7. [Package Management](#package-management)
8. [Version Control](#version-control)
9. [Infrastructure as Code](#infrastructure-as-code)
10. [CI/CD Platforms](#cicd-platforms)

---

## Deployment & Hosting

### Vercel
**AI Control**: ✅ CLI + API
**Use Case**: Next.js, frontend, serverless

**CLI Commands**:
```bash
vercel deploy                      # Deploy
vercel deploy --prod               # Production deploy
vercel env add KEY production      # Add environment variable
vercel env pull .env.local         # Pull all environment variables
vercel logs                        # View logs
vercel domains add example.com     # Add domain
vercel inspect <url>               # Get deployment info
```

**API Endpoints**:
```bash
# Get deployments
curl "https://api.vercel.com/v6/deployments" \
  -H "Authorization: Bearer $VERCEL_TOKEN"

# Create deployment
curl -X POST "https://api.vercel.com/v13/deployments" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -d '{"name":"my-app","gitSource":{"type":"github","repoId":123}}'
```

---

### Render.com
**AI Control**: ✅ API only
**Use Case**: Full-stack, managed databases

**API Endpoints**:
```bash
# Trigger deploy
curl -X POST "https://api.render.com/deploy/srv-xxx" \
  -H "Authorization: Bearer $RENDER_API_KEY"

# Get service info
curl "https://api.render.com/v1/services/srv-xxx" \
  -H "Authorization: Bearer $RENDER_API_KEY"

# List deployments
curl "https://api.render.com/v1/services/srv-xxx/deploys" \
  -H "Authorization: Bearer $RENDER_API_KEY"

# Set environment variable
curl -X POST "https://api.render.com/v1/services/srv-xxx/env-vars" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -d '{"key":"API_KEY","value":"secret"}'
```

---

### Digital Ocean App Platform
**AI Control**: ✅ CLI + API
**Use Case**: Full-stack, managed infrastructure

**CLI Commands**:
```bash
doctl apps create --spec .do/app.yaml           # Create app
doctl apps update $APP_ID --spec .do/app.yaml  # Update app
doctl apps get $APP_ID                          # Get app info
doctl apps list-deployments $APP_ID            # List deployments
doctl apps logs $APP_ID --follow               # Stream logs
doctl apps get $APP_ID --format DefaultIngress # Get app URL
```

**API Endpoints**:
```bash
# Create app
curl -X POST "https://api.digitalocean.com/v2/apps" \
  -H "Authorization: Bearer $DO_TOKEN" \
  -H "Content-Type: application/json" \
  -d @app-spec.json

# Get app
curl "https://api.digitalocean.com/v2/apps/$APP_ID" \
  -H "Authorization: Bearer $DO_TOKEN"
```

---

### AWS (via CDK)
**AI Control**: ✅ CLI
**Use Case**: Enterprise, full AWS ecosystem

**CLI Commands**:
```bash
cdk init app --language typescript    # Initialize CDK project
cdk synth                             # Synthesize CloudFormation
cdk deploy --require-approval never   # Deploy stack
cdk diff                              # Compare with deployed
cdk destroy --force                   # Destroy stack
cdk outputs --format json             # Get stack outputs

# AWS CLI (infrastructure management)
aws cloudformation describe-stacks    # List stacks
aws ecs describe-services             # List ECS services
aws rds describe-db-instances         # List databases
aws secretsmanager get-secret-value   # Get secret
```

---

### Netlify
**AI Control**: ✅ CLI + API
**Use Case**: Static sites, JAMstack

**CLI Commands**:
```bash
netlify deploy                        # Deploy
netlify deploy --prod                 # Production deploy
netlify env:set KEY value             # Set environment variable
netlify env:list                      # List environment variables
netlify logs                          # View logs
netlify status                        # Get site status
```

---

### Railway
**AI Control**: ✅ CLI
**Use Case**: Full-stack, databases included

**CLI Commands**:
```bash
railway up                            # Deploy
railway logs                          # View logs
railway variables set KEY=value       # Set environment variable
railway link                          # Link to project
railway status                        # Get project status
```

---

## Databases

### PostgreSQL
**AI Control**: ✅ CLI
**Use Case**: Production relational database

**CLI Commands**:
```bash
# psql - PostgreSQL CLI
psql -h localhost -U user -d dbname              # Connect
psql -c "SELECT * FROM customers;"               # Execute query
pg_dump dbname > backup.sql                      # Backup
psql dbname < backup.sql                         # Restore
psql -c "CREATE DATABASE newdb;"                 # Create database

# Programmatic access (via node-postgres)
# All operations via SQL queries in application code
```

---

### Drizzle ORM
**AI Control**: ✅ CLI
**Use Case**: Type-safe ORM for PostgreSQL/SQLite

**CLI Commands**:
```bash
drizzle-kit generate             # Generate migrations from schema
drizzle-kit push                 # Push schema to database
drizzle-kit studio               # Launch DB browser (GUI but also exposes data)
drizzle-kit introspect           # Generate schema from existing DB
drizzle-kit drop                 # Drop all tables
```

**Programmatic API**:
```typescript
// All database operations in TypeScript
import { db } from './db';
import { customersTable } from './schema';

// Insert
await db.insert(customersTable).values({ name: 'John' });

// Query
const customers = await db.select().from(customersTable);

// Update
await db.update(customersTable).set({ name: 'Jane' }).where(eq(customersTable.id, 1));

// Delete
await db.delete(customersTable).where(eq(customersTable.id, 1));
```

---

### MongoDB
**AI Control**: ✅ CLI + API
**Use Case**: Document database

**CLI Commands**:
```bash
mongosh                                          # MongoDB shell
mongosh --eval "db.customers.find()"            # Execute command
mongodump --db mydb --out /backup               # Backup
mongorestore --db mydb /backup/mydb             # Restore
mongosh --eval "db.customers.insertOne({name:'John'})"  # Insert
```

**Programmatic API** (via Mongoose):
```typescript
import mongoose from 'mongoose';

// All operations via Mongoose models
const customer = await Customer.create({ name: 'John' });
const customers = await Customer.find();
await Customer.updateOne({ _id: id }, { name: 'Jane' });
await Customer.deleteOne({ _id: id });
```

---

### Redis
**AI Control**: ✅ CLI + API
**Use Case**: Caching, sessions, pub/sub

**CLI Commands**:
```bash
redis-cli                                        # Redis CLI
redis-cli KEYS "*"                               # List all keys
redis-cli GET key                                # Get value
redis-cli SET key value                          # Set value
redis-cli DEL key                                # Delete key
redis-cli FLUSHDB                                # Clear database
```

**Programmatic API** (via ioredis):
```typescript
import Redis from 'ioredis';

const redis = new Redis();

await redis.set('key', 'value');
const value = await redis.get('key');
await redis.del('key');
```

---

### Neon (Serverless Postgres)
**AI Control**: ✅ CLI + API
**Use Case**: Serverless Postgres with branching

**CLI Commands**:
```bash
neonctl projects list                            # List projects
neonctl databases create --project-id $ID mydb   # Create database
neonctl branches create --project-id $ID main    # Create branch
neonctl connection-string $BRANCH_ID             # Get connection string
```

**API Endpoints**:
```bash
# Create project
curl -X POST "https://console.neon.tech/api/v2/projects" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -d '{"name":"my-project"}'

# Create database
curl -X POST "https://console.neon.tech/api/v2/projects/$PROJECT_ID/databases" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -d '{"name":"mydb"}'
```

---

### Supabase
**AI Control**: ✅ CLI + API
**Use Case**: Backend-as-a-service (Postgres + Auth + Storage)

**CLI Commands**:
```bash
supabase init                                    # Initialize project
supabase start                                   # Start local instance
supabase db reset                                # Reset database
supabase db push                                 # Push migrations
supabase functions deploy function-name          # Deploy edge function
supabase gen types typescript                    # Generate TypeScript types
```

**API Endpoints** (via client library):
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key);

// Database operations
const { data } = await supabase.from('customers').select('*');
await supabase.from('customers').insert({ name: 'John' });

// Auth operations
await supabase.auth.signUp({ email, password });
await supabase.auth.signIn({ email, password });

// Storage operations
await supabase.storage.from('avatars').upload('path', file);
```

---

## Authentication & Identity

### JSON Web Tokens (JWT)
**AI Control**: ✅ Library (programmatic)
**Use Case**: Stateless authentication

**Programmatic API**:
```typescript
import jwt from 'jsonwebtoken';

// Sign token
const token = jwt.sign(
  { userId: '123', email: 'user@example.com' },
  process.env.JWT_SECRET!,
  { expiresIn: '15m' }
);

// Verify token
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  console.log(decoded); // { userId: '123', email: '...' }
} catch (error) {
  console.error('Invalid token');
}
```

---

### Auth0
**AI Control**: ✅ API
**Use Case**: Enterprise authentication, OAuth

**API Endpoints**:
```bash
# Get access token
curl -X POST "https://$DOMAIN/oauth/token" \
  -d grant_type=client_credentials \
  -d client_id=$CLIENT_ID \
  -d client_secret=$CLIENT_SECRET

# Create user
curl -X POST "https://$DOMAIN/api/v2/users" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"email":"user@example.com","password":"secret","connection":"Username-Password-Authentication"}'

# Get users
curl "https://$DOMAIN/api/v2/users" \
  -H "Authorization: Bearer $TOKEN"
```

---

### Clerk
**AI Control**: ✅ API
**Use Case**: Modern authentication for web apps

**API Endpoints**:
```bash
# Create user
curl -X POST "https://api.clerk.dev/v1/users" \
  -H "Authorization: Bearer $CLERK_SECRET_KEY" \
  -d '{"email_address":["user@example.com"],"password":"secret"}'

# Get users
curl "https://api.clerk.dev/v1/users" \
  -H "Authorization: Bearer $CLERK_SECRET_KEY"

# Delete user
curl -X DELETE "https://api.clerk.dev/v1/users/$USER_ID" \
  -H "Authorization: Bearer $CLERK_SECRET_KEY"
```

---

## Development Tools

### Node.js / pnpm
**AI Control**: ✅ CLI
**Use Case**: Package management, scripting

**CLI Commands**:
```bash
pnpm install                     # Install dependencies
pnpm add package                 # Add package
pnpm remove package              # Remove package
pnpm run build                   # Run build script
pnpm run test                    # Run test script
pnpm exec command                # Execute command
pnpm list                        # List installed packages
```

---

### TypeScript
**AI Control**: ✅ CLI
**Use Case**: Type checking, compilation

**CLI Commands**:
```bash
tsc                              # Compile TypeScript
tsc --noEmit                     # Type check only
tsc --watch                      # Watch mode
tsc --project tsconfig.json      # Use specific config
```

---

### ESLint
**AI Control**: ✅ CLI
**Use Case**: Linting, code quality

**CLI Commands**:
```bash
eslint src/                      # Lint directory
eslint src/ --fix                # Lint and auto-fix
eslint src/ --format json        # JSON output for parsing
eslint src/ --quiet              # Only errors, no warnings
```

---

### Prettier
**AI Control**: ✅ CLI
**Use Case**: Code formatting

**CLI Commands**:
```bash
prettier --write "src/**/*.ts"   # Format files
prettier --check "src/**/*.ts"   # Check formatting
prettier --list-different "src/**/*.ts"  # List unformatted files
```

---

### Storybook
**AI Control**: ✅ CLI
**Use Case**: Component development, documentation

**CLI Commands**:
```bash
storybook dev                    # Start dev server
storybook build                  # Build static site
npx sb init                      # Initialize Storybook
```

---

### Vite
**AI Control**: ✅ CLI
**Use Case**: Build tool, dev server

**CLI Commands**:
```bash
vite                             # Start dev server
vite build                       # Build for production
vite preview                     # Preview production build
```

---

## Testing & QA

### Vitest
**AI Control**: ✅ CLI
**Use Case**: Unit testing (Vite-native)

**CLI Commands**:
```bash
vitest                           # Run tests in watch mode
vitest run                       # Run tests once
vitest run --coverage            # Run with coverage
vitest --reporter=json           # JSON output for parsing
```

---

### Playwright
**AI Control**: ✅ CLI + API
**Use Case**: E2E testing, browser automation

**CLI Commands**:
```bash
playwright test                  # Run E2E tests
playwright test --headed         # Run with browser visible
playwright codegen               # Generate test code
playwright show-report           # Show test report
```

**Programmatic API**:
```typescript
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto('https://example.com');
await page.click('button#submit');
await page.screenshot({ path: 'screenshot.png' });

await browser.close();
```

---

### Cypress
**AI Control**: ✅ CLI
**Use Case**: E2E testing

**CLI Commands**:
```bash
cypress run                      # Run tests headless
cypress run --headed             # Run with browser visible
cypress open                     # Open Cypress GUI
cypress run --spec "**/*.spec.ts"  # Run specific tests
```

---

## Monitoring & Logging

### Sentry
**AI Control**: ✅ CLI + API
**Use Case**: Error tracking, performance monitoring

**CLI Commands**:
```bash
sentry-cli releases new $VERSION              # Create release
sentry-cli releases files $VERSION upload-sourcemaps ./build  # Upload sourcemaps
sentry-cli releases finalize $VERSION         # Finalize release
sentry-cli releases deploys $VERSION new      # Track deployment
```

**API Endpoints**:
```bash
# Get issues
curl "https://sentry.io/api/0/projects/$ORG/$PROJECT/issues/" \
  -H "Authorization: Bearer $SENTRY_TOKEN"

# Get events
curl "https://sentry.io/api/0/projects/$ORG/$PROJECT/events/" \
  -H "Authorization: Bearer $SENTRY_TOKEN"
```

---

### LogRocket
**AI Control**: ✅ API
**Use Case**: Session replay, logging

**API Endpoints**:
```bash
# Get sessions
curl "https://api.logrocket.com/v1/sessions" \
  -H "Authorization: Bearer $LOGROCKET_TOKEN"
```

---

### Datadog
**AI Control**: ✅ CLI + API
**Use Case**: Infrastructure monitoring, logs, APM

**CLI Commands**:
```bash
datadog-ci synthetics run-tests              # Run synthetic tests
datadog-ci git-metadata upload               # Upload Git metadata
```

**API Endpoints**:
```bash
# Get logs
curl "https://api.datadoghq.com/api/v2/logs/events/search" \
  -H "DD-API-KEY: $DD_API_KEY" \
  -d '{"filter":{"query":"service:my-app"}}'

# Submit metrics
curl -X POST "https://api.datadoghq.com/api/v2/series" \
  -H "DD-API-KEY: $DD_API_KEY" \
  -d '{"series":[{"metric":"my.metric","points":[[1234567890,123]]}]}'
```

---

## Package Management

### npm / pnpm / yarn
**AI Control**: ✅ CLI
**Use Case**: JavaScript package management

**CLI Commands**:
```bash
# pnpm (recommended)
pnpm install                     # Install dependencies
pnpm add package                 # Add package
pnpm remove package              # Remove package
pnpm update                      # Update dependencies
pnpm outdated                    # Check for updates

# npm
npm install
npm install package
npm uninstall package
npm update

# yarn
yarn install
yarn add package
yarn remove package
yarn upgrade
```

---

### Docker
**AI Control**: ✅ CLI
**Use Case**: Containerization

**CLI Commands**:
```bash
docker build -t app:latest .     # Build image
docker run -p 3000:3000 app:latest  # Run container
docker ps                        # List running containers
docker logs $CONTAINER_ID        # View logs
docker exec -it $CONTAINER_ID sh # Execute command in container
docker-compose up                # Start services
docker-compose down              # Stop services
```

---

## Version Control

### Git
**AI Control**: ✅ CLI
**Use Case**: Version control

**CLI Commands**:
```bash
git init                         # Initialize repository
git add .                        # Stage all changes
git commit -m "message"          # Commit changes
git push origin main             # Push to remote
git pull origin main             # Pull from remote
git branch feature-name          # Create branch
git checkout feature-name        # Switch branch
git merge feature-name           # Merge branch
git status                       # Check status
git log                          # View commit history
```

---

### GitHub CLI
**AI Control**: ✅ CLI + API
**Use Case**: GitHub operations

**CLI Commands**:
```bash
gh repo create                   # Create repository
gh pr create                     # Create pull request
gh pr list                       # List pull requests
gh pr merge                      # Merge pull request
gh issue create                  # Create issue
gh issue list                    # List issues
gh workflow run                  # Trigger workflow
gh release create                # Create release
```

**API Endpoints**:
```bash
# Create repository
curl -X POST "https://api.github.com/user/repos" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -d '{"name":"my-repo","private":false}'

# Create pull request
curl -X POST "https://api.github.com/repos/$OWNER/$REPO/pulls" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -d '{"title":"My PR","head":"feature","base":"main"}'
```

---

## Infrastructure as Code

### Terraform
**AI Control**: ✅ CLI
**Use Case**: Multi-cloud infrastructure

**CLI Commands**:
```bash
terraform init                   # Initialize Terraform
terraform plan                   # Plan changes
terraform apply                  # Apply changes
terraform destroy                # Destroy infrastructure
terraform output                 # Get outputs
terraform state list             # List resources
```

---

### Pulumi
**AI Control**: ✅ CLI
**Use Case**: Infrastructure as code (TypeScript, Python, Go)

**CLI Commands**:
```bash
pulumi up                        # Deploy infrastructure
pulumi destroy                   # Destroy infrastructure
pulumi stack output              # Get stack outputs
pulumi preview                   # Preview changes
pulumi refresh                   # Refresh state
```

---

## CI/CD Platforms

### GitHub Actions
**AI Control**: ✅ CLI + API
**Use Case**: CI/CD on GitHub

**CLI Commands**:
```bash
gh workflow list                 # List workflows
gh workflow run workflow-name    # Trigger workflow
gh run list                      # List workflow runs
gh run view $RUN_ID              # View run details
gh run rerun $RUN_ID             # Rerun workflow
```

**Workflow File** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test
      - run: vercel deploy --prod
```

---

### GitLab CI
**AI Control**: ✅ CLI + API
**Use Case**: CI/CD on GitLab

**CLI Commands**:
```bash
gitlab-runner register           # Register runner
gitlab-runner run                # Run runner
```

**Pipeline File** (`.gitlab-ci.yml`):
```yaml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - pnpm install
    - pnpm build

test:
  stage: test
  script:
    - pnpm test

deploy:
  stage: deploy
  script:
    - vercel deploy --prod
  only:
    - main
```

---

### CircleCI
**AI Control**: ✅ CLI + API
**Use Case**: CI/CD platform

**CLI Commands**:
```bash
circleci config validate         # Validate config
circleci local execute           # Run locally
```

**Config File** (`.circleci/config.yml`):
```yaml
version: 2.1
jobs:
  build:
    docker:
      - image: cimg/node:18.0
    steps:
      - checkout
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test
workflows:
  build-and-deploy:
    jobs:
      - build
```

---

## Summary Table

| Category | Service | AI Control | CLI | API |
|----------|---------|------------|-----|-----|
| **Hosting** | Vercel | ✅ | ✅ | ✅ |
| | Render | ✅ | ❌ | ✅ |
| | Digital Ocean | ✅ | ✅ | ✅ |
| | AWS CDK | ✅ | ✅ | ❌ |
| | Netlify | ✅ | ✅ | ✅ |
| | Railway | ✅ | ✅ | ❌ |
| **Database** | PostgreSQL | ✅ | ✅ | ❌ |
| | MongoDB | ✅ | ✅ | ❌ |
| | Redis | ✅ | ✅ | ❌ |
| | Drizzle ORM | ✅ | ✅ | ❌ |
| | Neon | ✅ | ✅ | ✅ |
| | Supabase | ✅ | ✅ | ✅ |
| **Auth** | JWT | ✅ | ❌ | ❌ |
| | Auth0 | ✅ | ❌ | ✅ |
| | Clerk | ✅ | ❌ | ✅ |
| **Dev Tools** | pnpm | ✅ | ✅ | ❌ |
| | TypeScript | ✅ | ✅ | ❌ |
| | ESLint | ✅ | ✅ | ❌ |
| | Prettier | ✅ | ✅ | ❌ |
| | Storybook | ✅ | ✅ | ❌ |
| **Testing** | Vitest | ✅ | ✅ | ❌ |
| | Playwright | ✅ | ✅ | ✅ |
| | Cypress | ✅ | ✅ | ❌ |
| **Monitoring** | Sentry | ✅ | ✅ | ✅ |
| | Datadog | ✅ | ✅ | ✅ |
| **Version Control** | Git | ✅ | ✅ | ❌ |
| | GitHub CLI | ✅ | ✅ | ✅ |
| **IaC** | Terraform | ✅ | ✅ | ❌ |
| | Pulumi | ✅ | ✅ | ❌ |
| **CI/CD** | GitHub Actions | ✅ | ✅ | ✅ |
| | GitLab CI | ✅ | ✅ | ✅ |
| | CircleCI | ✅ | ✅ | ✅ |

---

## Selection Principles

When choosing technologies for the Brain Garden Rapid Development Kit:

1. **CLI First**: Prefer tools with comprehensive CLI over GUI-only
2. **Exit Codes**: Must use standard exit codes (0 = success, non-zero = failure)
3. **Structured Output**: Support JSON output for parsing
4. **Non-Interactive**: Must support non-interactive mode for automation
5. **Documented API**: If no CLI, must have well-documented REST API
6. **Active Maintenance**: Must be actively maintained and supported

---

## Future Additions

Services being considered for inclusion:

- **Stripe** (API only) - Payment processing
- **SendGrid** (API only) - Email delivery
- **Twilio** (API only) - SMS/phone
- **Algolia** (API + CLI) - Search
- **Cloudflare** (CLI + API) - CDN, DNS
- **Fly.io** (CLI + API) - Global deployment

---

## End of AI-Controllable Services Document
