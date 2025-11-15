# Brain Garden Effortless Deployment Architecture

## Mission: Operation Effortless Deploy

Transform template cloning into instant, production-ready deployments with zero manual configuration.

## Architecture Overview

```mermaid
graph TB
    subgraph "Developer Experience"
        Clone[Clone Template]
        Command[pnpm deploy:init]
        Ready[Production Ready App]
    end

    subgraph "Deployment CLI"
        CLI[@brain-garden/deploy-cli]
        Wizard[Interactive Wizard]
        Provision[Auto Provisioning]
    end

    subgraph "Infrastructure Automation"
        Appwrite[Appwrite API]
        GitHub[GitHub API]
        Cloudflare[Cloudflare API]
        CI[CI/CD Pipeline]
    end

    subgraph "Database Management"
        Migrations[@brain-garden/appwrite-migrations]
        Schema[Schema as Code]
        Versioning[Migration Tracking]
    end

    subgraph "Quality Assurance"
        Reviewer[@brain-garden/ci-reviewer]
        Agents[Brain Garden Agents]
        Tests[E2E Deployment Tests]
    end

    Clone --> Command
    Command --> CLI
    CLI --> Wizard
    Wizard --> Provision
    Provision --> Appwrite
    Provision --> GitHub
    Provision --> Cloudflare
    Provision --> CI
    Migrations --> Appwrite
    CI --> Reviewer
    Reviewer --> Agents
    Tests --> Ready
```

## Core Components

### 1. @brain-garden/deploy-cli
**Purpose**: Single-command deployment orchestrator

**Commands**:
- `deploy:init` - Initialize new project deployment
- `deploy:sync` - Sync infrastructure with codebase
- `deploy:status` - Check deployment health
- `deploy:destroy` - Teardown deployment

**Features**:
- Interactive wizard for configuration
- Automatic secret management
- Progress tracking with visual feedback
- Rollback capability
- State management in `.deploy/` directory

### 2. @brain-garden/appwrite-migrations
**Purpose**: Database schema as code with version control

**Structure**:
```
migrations/
├── 001-initial-schema.ts
├── 002-add-auth-tables.ts
├── 003-add-storage-buckets.ts
└── migration.lock.json
```

**Features**:
- TypeScript migration definitions
- Automatic rollback support
- Migration history tracking
- Seed data management
- Schema validation

### 3. @brain-garden/ci-reviewer
**Purpose**: AI-powered PR reviews replacing CodeRabbit

**Features**:
- Automatic PR analysis
- Brain Garden agent reviews
- Security scanning
- Performance impact analysis
- Automated suggestions
- Quality gate enforcement

## Deployment Flow

### Step 1: Clone & Initialize
```bash
git clone https://github.com/user/brain-garden-monorepo-template my-app
cd my-app
pnpm install
pnpm deploy:init --project my-app
```

### Step 2: Interactive Configuration
```
🚀 Brain Garden Deploy CLI v1.0.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Project Name: my-app
Deployment Target:
  ✓ Appwrite (Self-Hosted)
  ○ Cloudflare
  ○ AWS

Appwrite Configuration:
  Endpoint: https://appwrite.singularity-labs.org
  Project ID: [auto-generated]

GitHub Configuration:
  Repository: user/my-app
  Deploy on: main branch

Domain Configuration:
  Production: my-app.singularity-labs.org
  Preview: pr-*.my-app.singularity-labs.org
```

### Step 3: Automatic Provisioning
```
✅ Creating Appwrite project...
✅ Setting up database collections...
✅ Creating storage buckets...
✅ Deploying Appwrite functions...
✅ Configuring GitHub secrets...
✅ Setting up CI/CD pipeline...
✅ Creating DNS records...
✅ Running initial migration...
✅ Deploying to production...
```

### Step 4: Success
```
🎉 Deployment Complete!

Your app is live at:
- Production: https://my-app.singularity-labs.org
- Storybook: https://storybook.my-app.singularity-labs.org
- API: https://api.my-app.singularity-labs.org

GitHub Actions configured for:
- Automatic PR previews
- AI-powered code reviews
- E2E testing on deploy
- Automatic rollback on failure

Next steps:
1. git push to deploy updates
2. Create PR for preview deployments
3. Check deployment status: pnpm deploy:status
```

## Infrastructure as Code

### Appwrite Collections (migrations/001-initial-schema.ts)
```typescript
export const up = async (client: AppwriteClient) => {
  // Users collection
  await client.database.createCollection({
    name: 'users',
    attributes: [
      { key: 'email', type: 'email', required: true, unique: true },
      { key: 'name', type: 'string', size: 255 },
      { key: 'avatar', type: 'url' },
      { key: 'role', type: 'enum', values: ['user', 'admin'] },
    ],
    indexes: [
      { key: 'email_index', type: 'unique', attributes: ['email'] }
    ]
  });

  // Sessions collection
  await client.database.createCollection({
    name: 'sessions',
    attributes: [
      { key: 'userId', type: 'string', required: true },
      { key: 'token', type: 'string', required: true },
      { key: 'expiresAt', type: 'datetime', required: true }
    ]
  });
};

export const down = async (client: AppwriteClient) => {
  await client.database.deleteCollection('sessions');
  await client.database.deleteCollection('users');
};
```

### Storage Buckets (migrations/002-storage.ts)
```typescript
export const up = async (client: AppwriteClient) => {
  // Profile pictures bucket
  await client.storage.createBucket({
    bucketId: 'profile-pictures',
    name: 'Profile Pictures',
    maximumFileSize: 5242880, // 5MB
    allowedFileExtensions: ['jpg', 'jpeg', 'png', 'webp'],
    permissions: ['read("any")', 'write("users")']
  });

  // Documents bucket
  await client.storage.createBucket({
    bucketId: 'documents',
    name: 'Documents',
    maximumFileSize: 10485760, // 10MB
    permissions: ['read("users")', 'write("users")']
  });
};
```

## CI/CD Pipeline

### GitHub Actions Workflow
```yaml
name: Deploy
on:
  push:
    branches: [main]
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: brain-garden/ci-reviewer@v1
        with:
          agents: ['security', 'performance', 'architecture']

  deploy:
    needs: review
    runs-on: ubuntu-latest
    steps:
      - uses: brain-garden/deploy-action@v1
        with:
          environment: ${{ github.event_name == 'push' && 'production' || 'preview' }}
          appwrite-endpoint: ${{ secrets.APPWRITE_ENDPOINT }}
          appwrite-key: ${{ secrets.APPWRITE_KEY }}
```

## State Management

### .deploy/config.json
```json
{
  "project": "my-app",
  "environment": "production",
  "appwrite": {
    "endpoint": "https://appwrite.singularity-labs.org",
    "projectId": "abc123",
    "collections": ["users", "sessions"],
    "buckets": ["profile-pictures", "documents"],
    "functions": ["auth-webhook", "email-sender"]
  },
  "github": {
    "repository": "user/my-app",
    "secretsConfigured": true,
    "actionsEnabled": true
  },
  "domains": {
    "production": "my-app.singularity-labs.org",
    "preview": "pr-*.my-app.singularity-labs.org"
  },
  "migrations": {
    "current": "003",
    "history": [
      { "id": "001", "name": "initial-schema", "appliedAt": "2025-01-15T10:00:00Z" },
      { "id": "002", "name": "storage", "appliedAt": "2025-01-15T10:01:00Z" },
      { "id": "003", "name": "auth-tables", "appliedAt": "2025-01-15T10:02:00Z" }
    ]
  }
}
```

## E2E Test Strategy

### test/e2e/deployment.spec.ts
```typescript
describe('Effortless Deployment', () => {
  it('should deploy from template clone to production', async () => {
    // Clone template
    await exec('git clone template test-app');

    // Run deploy command
    const result = await exec('pnpm deploy:init --project test-app --no-interactive');

    // Verify Appwrite resources
    const project = await appwrite.projects.get('test-app');
    expect(project).toBeDefined();

    // Verify database
    const collections = await appwrite.database.listCollections();
    expect(collections).toContainEqual(expect.objectContaining({ name: 'users' }));

    // Verify storage
    const buckets = await appwrite.storage.listBuckets();
    expect(buckets).toContainEqual(expect.objectContaining({ name: 'profile-pictures' }));

    // Verify deployment is accessible
    const response = await fetch('https://test-app.singularity-labs.org');
    expect(response.status).toBe(200);

    // Cleanup
    await exec('pnpm deploy:destroy --project test-app --force');
  });
});
```

## Success Metrics

- **Time to Deploy**: < 5 minutes from clone to production
- **Manual Steps**: 0 (fully automated)
- **Success Rate**: > 95% first-time deployments
- **Rollback Time**: < 30 seconds
- **PR Preview Time**: < 2 minutes from PR creation

## Security Considerations

- All secrets stored in GitHub Secrets
- Appwrite API keys scoped to minimum permissions
- Automatic HTTPS via Cloudflare
- PR deployments isolated from production
- Automated security scanning in CI

## Next Evolution

1. **Multi-cloud support**: AWS, Azure, GCP
2. **Kubernetes deployment**: Helm charts generation
3. **Monitoring integration**: Automatic observability setup
4. **Cost optimization**: Resource usage analysis
5. **Multi-region deployment**: Global distribution