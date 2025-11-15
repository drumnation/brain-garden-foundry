# CI/CD Generation System

**Version**: 1.0
**Last Updated**: 2025-11-12
**Status**: Planning Phase

---

## Executive Summary

The CI/CD Generation System automatically creates provider-specific deployment configurations, environment variable management, and deployment workflows. AI agents can deploy applications via CLI commands, monitor deployments, and manage infrastructure without manual intervention.

**Goal**: Zero-configuration deployment from local development to production in under 2 minutes.

---

## Table of Contents

1. [Supported Providers](#supported-providers)
2. [Configuration Generation](#configuration-generation)
3. [Environment Variable Management](#environment-variable-management)
4. [CLI Control for AI Agents](#cli-control-for-ai-agents)
5. [Deployment Workflows](#deployment-workflows)
6. [Monitoring & Health Checks](#monitoring--health-checks)
7. [Rollback Strategies](#rollback-strategies)

---

## Supported Providers

### Provider Matrix

| Provider | Use Case | AI Control | Cost | Complexity |
|----------|----------|------------|------|------------|
| **Vercel** | Next.js, frontend | ✅ CLI | Free tier | Low |
| **Render.com** | Full-stack, DB included | ⚠️ API only | Free tier | Low |
| **Digital Ocean** | Infrastructure control | ✅ CLI | Paid | Medium |
| **AWS CDK** | Enterprise, full AWS | ✅ CLI | Paid | High |

---

## Configuration Generation

### Vercel Configuration

**Generated Files**:
- `vercel.json` - Deployment configuration
- `.vercelignore` - Files to exclude
- `scripts/deploy-vercel.sh` - Deployment script

**vercel.json**:
```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "pnpm install",
  "devCommand": "pnpm dev",
  "env": {
    "NODE_ENV": "production",
    "DATABASE_URL": "@database-url",
    "JWT_SECRET": "@jwt-secret",
    "NEXT_PUBLIC_API_URL": "https://{{ projectName }}.vercel.app"
  },
  "functions": {
    "api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  },
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ]
}
```

**scripts/deploy-vercel.sh**:
```bash
#!/bin/bash
set -e

echo "🚀 Deploying to Vercel..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    pnpm add -g vercel
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel"
    vercel login
fi

# Production deployment
if [ "$1" == "--prod" ]; then
    echo "Deploying to production..."
    vercel --prod --yes
else
    echo "Deploying preview..."
    vercel --yes
fi

echo "✅ Deployment complete!"
```

---

### Render.com Configuration

**Generated Files**:
- `render.yaml` - Service configuration
- `scripts/deploy-render.sh` - Deployment script

**render.yaml**:
```yaml
services:
  # Web service
  - type: web
    name: {{ projectName }}-api
    runtime: node
    region: oregon
    plan: starter
    buildCommand: pnpm install && pnpm build
    startCommand: pnpm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
      - key: DATABASE_URL
        fromDatabase:
          name: {{ projectName }}-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_EXPIRES_IN
        value: 15m
    healthCheckPath: /api/health
    autoDeploy: true

databases:
  # PostgreSQL database
  - name: {{ projectName }}-db
    databaseName: {{ projectName }}
    user: {{ projectName }}_user
    region: oregon
    plan: starter
    ipAllowList: []
```

**scripts/deploy-render.sh**:
```bash
#!/bin/bash
set -e

echo "🚀 Deploying to Render.com..."

# Render uses git-based deployment
# Push to main branch triggers auto-deploy

git add .
git commit -m "Deploy to Render"
git push origin main

echo "✅ Pushed to Git. Render will auto-deploy."
echo "Monitor deployment: https://dashboard.render.com"
```

---

### Digital Ocean App Platform Configuration

**Generated Files**:
- `.do/app.yaml` - App configuration
- `scripts/deploy-digitalocean.sh` - Deployment script

**.do/app.yaml**:
```yaml
name: {{ projectName }}
region: nyc
services:
  - name: api
    github:
      repo: {{ githubUser }}/{{ projectName }}
      branch: main
      deploy_on_push: true
    build_command: pnpm install && pnpm build
    run_command: pnpm start
    instance_count: 1
    instance_size_slug: basic-xxs
    http_port: 3000
    health_check:
      http_path: /api/health
    envs:
      - key: NODE_ENV
        value: production
        scope: RUN_TIME
        type: GENERAL
      - key: DATABASE_URL
        value: ${db.DATABASE_URL}
        scope: RUN_TIME
        type: SECRET
      - key: JWT_SECRET
        scope: RUN_TIME
        type: SECRET

databases:
  - name: db
    engine: PG
    version: "15"
    size: db-s-1vcpu-1gb
    num_nodes: 1
    production: true
```

**scripts/deploy-digitalocean.sh**:
```bash
#!/bin/bash
set -e

echo "🚀 Deploying to Digital Ocean..."

# Check if doctl CLI is installed
if ! command -v doctl &> /dev/null; then
    echo "Installing doctl CLI..."
    # macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install doctl
    # Linux
    else
        snap install doctl
    fi
fi

# Check if authenticated
if ! doctl auth list &> /dev/null; then
    echo "Please authenticate with Digital Ocean"
    doctl auth init
fi

# Deploy app
if [ -f ".do/app-id.txt" ]; then
    APP_ID=$(cat .do/app-id.txt)
    echo "Updating existing app: $APP_ID"
    doctl apps update $APP_ID --spec .do/app.yaml
else
    echo "Creating new app..."
    doctl apps create --spec .do/app.yaml --format ID --no-header > .do/app-id.txt
    APP_ID=$(cat .do/app-id.txt)
    echo "App created: $APP_ID"
fi

echo "✅ Deployment initiated!"
echo "Monitor: doctl apps logs $APP_ID --follow"
```

---

### AWS CDK Configuration

**Generated Files**:
- `infra/lib/app-stack.ts` - CDK stack definition
- `infra/bin/app.ts` - CDK app entry point
- `infra/cdk.json` - CDK configuration
- `scripts/deploy-aws.sh` - Deployment script

**infra/lib/app-stack.ts**:
```typescript
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    const vpc = new ec2.Vpc(this, 'AppVpc', {
      maxAzs: 2,
      natGateways: 1
    });

    // Database
    const dbSecret = new secretsmanager.Secret(this, 'DBSecret', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'postgres' }),
        generateStringKey: 'password',
        excludePunctuation: true
      }
    });

    const database = new rds.DatabaseInstance(this, 'Database', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_15
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),
      vpc,
      credentials: rds.Credentials.fromSecret(dbSecret),
      databaseName: '{{ projectName }}',
      allocatedStorage: 20,
      maxAllocatedStorage: 100,
      backupRetention: cdk.Duration.days(7),
      deletionProtection: false // Set true for production
    });

    // ECS Cluster
    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc,
      containerInsights: true
    });

    // Application secrets
    const jwtSecret = new secretsmanager.Secret(this, 'JWTSecret', {
      generateSecretString: {
        passwordLength: 32,
        excludePunctuation: true
      }
    });

    // Fargate Service
    const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      'Service',
      {
        cluster,
        cpu: 256,
        memoryLimitMiB: 512,
        desiredCount: 1,
        taskImageOptions: {
          image: ecs.ContainerImage.fromAsset('../'),
          containerPort: 3000,
          environment: {
            NODE_ENV: 'production',
            PORT: '3000'
          },
          secrets: {
            DATABASE_URL: ecs.Secret.fromSecretsManager(dbSecret),
            JWT_SECRET: ecs.Secret.fromSecretsManager(jwtSecret)
          },
          logDriver: ecs.LogDrivers.awsLogs({ streamPrefix: 'app' })
        },
        publicLoadBalancer: true,
        healthCheckGracePeriod: cdk.Duration.seconds(60)
      }
    );

    // Allow Fargate to access RDS
    database.connections.allowFrom(
      fargateService.service,
      ec2.Port.tcp(5432)
    );

    // Health check
    fargateService.targetGroup.configureHealthCheck({
      path: '/api/health',
      interval: cdk.Duration.seconds(30),
      timeout: cdk.Duration.seconds(5),
      healthyThresholdCount: 2,
      unhealthyThresholdCount: 3
    });

    // Outputs
    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: fargateService.loadBalancer.loadBalancerDnsName
    });

    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: database.dbInstanceEndpointAddress
    });
  }
}
```

**scripts/deploy-aws.sh**:
```bash
#!/bin/bash
set -e

echo "🚀 Deploying to AWS via CDK..."

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "Please configure AWS CLI: aws configure"
    exit 1
fi

# Install CDK if not installed
if ! command -v cdk &> /dev/null; then
    echo "Installing AWS CDK..."
    npm install -g aws-cdk
fi

cd infra

# Bootstrap CDK (first time only)
if [ ! -f ".cdk-bootstrapped" ]; then
    echo "Bootstrapping CDK..."
    cdk bootstrap
    touch .cdk-bootstrapped
fi

# Synthesize CloudFormation template
echo "Synthesizing CloudFormation template..."
cdk synth

# Deploy
echo "Deploying stack..."
cdk deploy --require-approval never

echo "✅ Deployment complete!"
echo "Get outputs: cdk outputs"
```

---

## Environment Variable Management

### Vercel Environment Variables

```bash
#!/bin/bash
# scripts/setup-vercel-env.sh

# Set environment variables via CLI
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
vercel env add NEXT_PUBLIC_API_URL production

# Or programmatically
vercel env add DATABASE_URL production --value="postgresql://..."
vercel env add JWT_SECRET production --value="$(openssl rand -base64 32)"
```

### Render.com Environment Variables

```bash
#!/bin/bash
# scripts/setup-render-env.sh

# Render uses render.yaml for env vars
# Secrets are set via dashboard or API

curl -X POST "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "JWT_SECRET",
    "value": "'"$(openssl rand -base64 32)"'"
  }'
```

### Digital Ocean Environment Variables

```bash
#!/bin/bash
# scripts/setup-do-env.sh

APP_ID=$(cat .do/app-id.txt)

# Set environment variable
doctl apps update $APP_ID --spec .do/app.yaml
```

### AWS Secrets Manager

```bash
#!/bin/bash
# scripts/setup-aws-secrets.sh

# Create secret
aws secretsmanager create-secret \
  --name /{{ projectName }}/JWT_SECRET \
  --secret-string "$(openssl rand -base64 32)"

# Update existing secret
aws secretsmanager update-secret \
  --secret-id /{{ projectName }}/JWT_SECRET \
  --secret-string "new-value"

# Get secret value
aws secretsmanager get-secret-value \
  --secret-id /{{ projectName }}/JWT_SECRET \
  --query SecretString \
  --output text
```

---

## CLI Control for AI Agents

AI agents can control deployments via CLI commands. Here's how each provider enables AI control:

### Vercel CLI (AI-Controllable ✅)

```bash
# Deploy
vercel deploy                    # Preview deployment
vercel deploy --prod             # Production deployment

# Environment variables
vercel env add KEY production    # Add variable
vercel env rm KEY production     # Remove variable
vercel env pull .env.local       # Pull all variables

# Logs
vercel logs                      # View logs

# Domains
vercel domains ls                # List domains
vercel domains add example.com   # Add domain

# Inspect deployment
vercel inspect <deployment-url>  # Get deployment details
```

**AI Agent Example**:
```typescript
async function deployToVercel() {
  // Check if logged in
  const whoami = await exec('vercel whoami');
  if (whoami.exitCode !== 0) {
    throw new Error('Not logged in to Vercel');
  }

  // Deploy
  const result = await exec('vercel deploy --prod --yes');
  if (result.exitCode !== 0) {
    throw new Error(`Deployment failed: ${result.stderr}`);
  }

  // Extract deployment URL from output
  const deploymentUrl = extractUrl(result.stdout);

  // Verify deployment
  const health = await fetch(`${deploymentUrl}/api/health`);
  if (health.status !== 200) {
    throw new Error('Health check failed');
  }

  return deploymentUrl;
}
```

---

### Render.com API (AI-Controllable ⚠️)

Render.com doesn't have a CLI, but has a REST API:

```bash
# Deploy (trigger via API)
curl -X POST "https://api.render.com/deploy/srv-xxx" \
  -H "Authorization: Bearer $RENDER_API_KEY"

# Get service info
curl "https://api.render.com/v1/services/srv-xxx" \
  -H "Authorization: Bearer $RENDER_API_KEY"

# Get deploy status
curl "https://api.render.com/v1/services/srv-xxx/deploys" \
  -H "Authorization: Bearer $RENDER_API_KEY"
```

**AI Agent Example**:
```typescript
async function deployToRender(serviceId: string, apiKey: string) {
  // Trigger deploy
  const response = await fetch(`https://api.render.com/deploy/${serviceId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });

  if (!response.ok) {
    throw new Error(`Deploy failed: ${await response.text()}`);
  }

  // Poll for completion
  let deployComplete = false;
  while (!deployComplete) {
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10s

    const statusRes = await fetch(
      `https://api.render.com/v1/services/${serviceId}/deploys`,
      {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      }
    );

    const deploys = await statusRes.json();
    const latestDeploy = deploys[0];

    if (latestDeploy.status === 'live') {
      deployComplete = true;
    } else if (latestDeploy.status === 'build_failed' || latestDeploy.status === 'deploy_failed') {
      throw new Error('Deploy failed');
    }
  }

  return `https://${serviceId}.onrender.com`;
}
```

---

### Digital Ocean CLI (AI-Controllable ✅)

```bash
# Create app
doctl apps create --spec .do/app.yaml

# Update app
doctl apps update $APP_ID --spec .do/app.yaml

# Get app info
doctl apps get $APP_ID

# List deployments
doctl apps list-deployments $APP_ID

# Get logs
doctl apps logs $APP_ID --follow

# Get app URL
doctl apps get $APP_ID --format DefaultIngress --no-header
```

**AI Agent Example**:
```typescript
async function deployToDigitalOcean(appId: string) {
  // Update app
  const result = await exec(`doctl apps update ${appId} --spec .do/app.yaml`);
  if (result.exitCode !== 0) {
    throw new Error(`Deploy failed: ${result.stderr}`);
  }

  // Wait for deployment
  let deployed = false;
  while (!deployed) {
    await new Promise(resolve => setTimeout(resolve, 10000));

    const status = await exec(`doctl apps get ${appId} --format ActiveDeployment.Phase --no-header`);
    const phase = status.stdout.trim();

    if (phase === 'ACTIVE') {
      deployed = true;
    } else if (phase === 'ERROR') {
      throw new Error('Deployment failed');
    }
  }

  // Get app URL
  const urlResult = await exec(`doctl apps get ${appId} --format DefaultIngress --no-header`);
  const appUrl = urlResult.stdout.trim();

  // Verify health
  const health = await fetch(`${appUrl}/api/health`);
  if (health.status !== 200) {
    throw new Error('Health check failed');
  }

  return appUrl;
}
```

---

### AWS CDK CLI (AI-Controllable ✅)

```bash
# Deploy stack
cdk deploy --require-approval never

# Get outputs
cdk outputs --format json

# Destroy stack
cdk destroy --force

# Diff (compare with deployed)
cdk diff

# Synthesize CloudFormation
cdk synth
```

**AI Agent Example**:
```typescript
async function deployToAWS() {
  // Navigate to infra directory
  process.chdir('infra');

  // Deploy
  const result = await exec('cdk deploy --require-approval never --outputs-file outputs.json');
  if (result.exitCode !== 0) {
    throw new Error(`Deploy failed: ${result.stderr}`);
  }

  // Read outputs
  const outputs = JSON.parse(await fs.readFile('outputs.json', 'utf-8'));
  const loadBalancerDns = outputs.AppStack.LoadBalancerDNS;

  // Wait for service to be ready
  let ready = false;
  for (let i = 0; i < 30; i++) {
    try {
      const health = await fetch(`http://${loadBalancerDns}/api/health`);
      if (health.status === 200) {
        ready = true;
        break;
      }
    } catch (error) {
      // Service not ready yet
    }
    await new Promise(resolve => setTimeout(resolve, 10000));
  }

  if (!ready) {
    throw new Error('Service failed to become ready');
  }

  return `http://${loadBalancerDns}`;
}
```

---

## Deployment Workflows

### Agent Deployment Workflow

```typescript
interface DeploymentWorkflow {
  // 1. Pre-deployment checks
  async preDeploymentChecks(): Promise<void> {
    // Type check
    await exec('pnpm typecheck');

    // Run tests
    await exec('pnpm test');

    // Build locally (verify it works)
    await exec('pnpm build');

    // Check environment variables
    await verifyEnvVars();
  }

  // 2. Deploy
  async deploy(provider: string): Promise<DeploymentResult> {
    switch (provider) {
      case 'vercel':
        return await deployToVercel();
      case 'render':
        return await deployToRender();
      case 'digitalocean':
        return await deployToDigitalOcean();
      case 'aws-cdk':
        return await deployToAWS();
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  // 3. Post-deployment verification
  async postDeploymentVerification(url: string): Promise<void> {
    // Health check
    const health = await fetch(`${url}/api/health`);
    if (health.status !== 200) {
      throw new Error('Health check failed');
    }

    // Smoke tests
    await runSmokeTests(url);

    // Performance check
    await checkPerformance(url);
  }

  // 4. Rollback if needed
  async rollbackIfNeeded(provider: string, previousVersion: string): Promise<void> {
    // If verification fails, rollback
    try {
      await this.postDeploymentVerification(url);
    } catch (error) {
      console.error('Verification failed, rolling back...');
      await rollback(provider, previousVersion);
      throw error;
    }
  }
}
```

---

## Monitoring & Health Checks

### Health Endpoint

Generated in every application:

```typescript
// src/api/routes/health.ts
import { Router } from 'express';
import { db } from '../../db';

const router = Router();

router.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: 'unknown',
      memory: 'ok',
      cpu: 'ok'
    }
  };

  // Database check
  try {
    await db.execute('SELECT 1');
    health.checks.database = 'ok';
  } catch (error) {
    health.checks.database = 'error';
    health.status = 'degraded';
  }

  // Memory check
  const memUsage = process.memoryUsage();
  const memPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
  if (memPercent > 90) {
    health.checks.memory = 'warning';
    health.status = 'degraded';
  }

  // CPU check (simplified)
  const cpuUsage = process.cpuUsage();
  if (cpuUsage.system > 1000000000) { // 1 second of system time
    health.checks.cpu = 'warning';
    health.status = 'degraded';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});

export default router;
```

### Agent Monitoring

```typescript
async function monitorDeployment(url: string, durationMinutes: number = 5) {
  const endTime = Date.now() + (durationMinutes * 60 * 1000);
  const checks: HealthCheck[] = [];

  while (Date.now() < endTime) {
    const start = Date.now();

    try {
      const response = await fetch(`${url}/api/health`);
      const data = await response.json();

      checks.push({
        timestamp: new Date(),
        status: response.status,
        responseTime: Date.now() - start,
        health: data
      });

      if (response.status !== 200) {
        console.warn('Health check failed:', data);
      }
    } catch (error) {
      console.error('Health check error:', error);
      checks.push({
        timestamp: new Date(),
        status: 0,
        responseTime: Date.now() - start,
        error: error.message
      });
    }

    await new Promise(resolve => setTimeout(resolve, 30000)); // Check every 30s
  }

  // Analyze results
  const successRate = checks.filter(c => c.status === 200).length / checks.length;
  const avgResponseTime = checks.reduce((sum, c) => sum + c.responseTime, 0) / checks.length;

  return {
    successRate,
    avgResponseTime,
    checks
  };
}
```

---

## Rollback Strategies

### Vercel Rollback

```bash
# List recent deployments
vercel ls

# Rollback to specific deployment
vercel rollback <deployment-url> --yes
```

### Render.com Rollback

```bash
# Render automatically keeps previous deployments
# Rollback via dashboard or API

curl -X POST "https://api.render.com/v1/services/$SERVICE_ID/deploys/$DEPLOY_ID/rollback" \
  -H "Authorization: Bearer $RENDER_API_KEY"
```

### Digital Ocean Rollback

```bash
# List deployments
doctl apps list-deployments $APP_ID

# Redeploy previous version
doctl apps create-deployment $APP_ID --deployment-id $PREVIOUS_DEPLOY_ID
```

### AWS CDK Rollback

```bash
# CloudFormation automatically supports rollback on failure
# Manual rollback: redeploy previous version

git checkout <previous-commit>
cd infra
cdk deploy --require-approval never
```

---

## Summary

The CI/CD Generation System provides:

1. **Zero-config deployment** - Automated configuration generation
2. **AI-controllable** - CLI/API access for all providers
3. **Environment management** - Secure secret handling
4. **Health monitoring** - Automated health checks
5. **Rollback support** - Quick recovery from failures

**Result**: AI agents can deploy applications end-to-end without human intervention, from local development to production in under 2 minutes.

---

## End of CI/CD Generation Document
