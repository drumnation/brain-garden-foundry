# Brain Garden Monorepo Template - Appwrite Deployment Guide

**Last Updated**: 2025-11-15
**Status**: Ready for Self-Hosted Deployment

---

## 🎯 Purpose

This guide enables **instant deployment** of projects created from this template to your self-hosted Appwrite infrastructure at `appwrite.singularity-labs.org`.

**Why Deploy the Template?**
- 🎨 **Showcase**: Live demo of what the template produces
- 📚 **Documentation**: Visual reference for template capabilities
- 🚀 **Validation**: Prove deployment automation works
- 🔧 **Testing**: Experiment with Appwrite integration patterns

---

## 🏗️ Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│     GitHub Repository: monorepo-template         │
│     - Generators for React, Electron, API        │
│     - Storybook component library                │
│     - Brain Monitor validation                   │
└─────────────────────────────────────────────────┘
                      │
                      │ git push / PR created
                      ▼
┌─────────────────────────────────────────────────┐
│            GitHub Actions Workflow              │
│  - Build Storybook static site                  │
│  - Run generators (create sample apps)          │
│  - Deploy to VPS                                │
│  - Update Traefik routing                       │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│      Vultr VPS (140.82.14.49)                   │
│  /opt/deployments/monorepo-template/            │
│    ├── production/ (Storybook static site)      │
│    ├── pr-<N>/ (PR previews)                    │
│    └── demo/ (Generated apps showcase)          │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│            Cloudflare DNS                       │
│  monorepo-template.singularity-labs.org         │
│  pr-<N>.monorepo-template.singularity-labs.org  │
│  demo.monorepo-template.singularity-labs.org    │
└─────────────────────────────────────────────────┘
```

---

## 📦 What Gets Deployed

### Production (`monorepo-template.singularity-labs.org`)

**Storybook Site** - Interactive component showcase:
- All React components with live examples
- Accessibility tests (axe-core integration)
- Component interactions and variations
- Documentation and usage guides

### Demo Site (`demo.monorepo-template.singularity-labs.org`)

**Generated Apps Showcase** - Live examples of what template produces:
- Sample React web app
- Sample Express API (connected to Appwrite)
- Component library examples
- Generator output examples

### PR Previews (`pr-<N>.monorepo-template.singularity-labs.org`)

**Automatic PR Deployments**:
- Every PR gets its own URL
- Test Storybook changes before merging
- Validate generator updates
- Review documentation updates

---

## 🚀 Deployment Options

### Option 1: Storybook-Only (Fastest)

Deploy just the Storybook static site - perfect for showcasing components.

**Build Command**:
```bash
pnpm build-storybook
```

**Output**: `storybook-static/` (static HTML/CSS/JS)

**Deploy Time**: ~2 minutes

**Use Case**: Component library showcase, design system documentation

### Option 2: Demo Site with Generated Apps (Comprehensive)

Run generators, build sample apps, deploy everything.

**Build Commands**:
```bash
# Generate sample apps
pnpm generate:all-apps

# Build Storybook
pnpm build-storybook

# Build generated apps (if any have build steps)
pnpm build
```

**Output**:
- `storybook-static/` - Storybook site
- `apps/*/dist/` - Generated app builds

**Deploy Time**: ~5-7 minutes

**Use Case**: Full template capabilities showcase

### Option 3: PR Previews (Automated)

Automatic deployment on PR creation - validates changes before merge.

**Trigger**: Pull request opened/updated

**Deploy Time**: ~3 minutes

**Use Case**: Testing template changes, reviewing generator updates

---

## 📋 GitHub Actions Workflow

Create `.github/workflows/deploy-monorepo-template.yml`:

```yaml
name: Deploy Monorepo Template

on:
  push:
    branches: [main]
  pull_request:
    types: [opened, synchronize, reopened]
  pull_request_target:
    types: [closed]

env:
  VPS_HOST: 140.82.14.49
  VPS_USER: root
  PROJECT_NAME: monorepo-template
  APPWRITE_ENDPOINT: https://appwrite.singularity-labs.org/v1
  APPWRITE_PROJECT_ID: 6917d0a50033ebe8d013

jobs:
  deploy-production:
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build Storybook
        run: pnpm build-storybook

      - name: Deploy to VPS
        uses: appleboy/scp-action@master
        with:
          host: ${{ env.VPS_HOST }}
          username: ${{ env.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          source: "storybook-static/*"
          target: "/opt/deployments/${{ env.PROJECT_NAME }}/production/"
          strip_components: 1

      - name: Setup Nginx config
        uses: appleboy/ssh-action@master
        with:
          host: ${{ env.VPS_HOST }}
          username: ${{ env.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cat > /opt/deployments/traefik/config/${{ env.PROJECT_NAME }}-production.yml <<EOF
            http:
              routers:
                ${{ env.PROJECT_NAME }}-prod:
                  rule: "Host(\`${{ env.PROJECT_NAME }}.singularity-labs.org\`)"
                  service: ${{ env.PROJECT_NAME }}-prod
                  entryPoints:
                    - web
                    - websecure
                  tls:
                    certResolver: letsencrypt
              services:
                ${{ env.PROJECT_NAME }}-prod:
                  loadBalancer:
                    servers:
                      - url: "http://localhost:8002"
            EOF

            # Restart Traefik to pick up config
            docker restart appwrite-traefik

      - name: Start Nginx container
        uses: appleboy/ssh-action@master
        with:
          host: ${{ env.VPS_HOST }}
          username: ${{ env.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/deployments/${{ env.PROJECT_NAME }}/production

            # Stop existing container if any
            docker stop ${{ env.PROJECT_NAME }}-prod 2>/dev/null || true
            docker rm ${{ env.PROJECT_NAME }}-prod 2>/dev/null || true

            # Start new container
            docker run -d \
              --name ${{ env.PROJECT_NAME }}-prod \
              --restart unless-stopped \
              -v $(pwd):/usr/share/nginx/html:ro \
              -p 8002:80 \
              nginx:alpine

  deploy-pr-preview:
    if: github.event.action != 'closed'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build Storybook
        run: pnpm build-storybook

      - name: Deploy to VPS
        uses: appleboy/scp-action@master
        with:
          host: ${{ env.VPS_HOST }}
          username: ${{ env.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          source: "storybook-static/*"
          target: "/opt/deployments/${{ env.PROJECT_NAME }}/pr-${{ github.event.pull_request.number }}/"
          strip_components: 1

      - name: Create Cloudflare DNS record
        run: |
          curl -X POST "https://api.cloudflare.com/client/v4/zones/${{ secrets.CLOUDFLARE_ZONE_ID }}/dns_records" \
            -H "Authorization: Bearer ${{ secrets.CLOUDFLARE_API_TOKEN }}" \
            -H "Content-Type: application/json" \
            --data '{
              "type":"A",
              "name":"pr-${{ github.event.pull_request.number }}.${{ env.PROJECT_NAME }}",
              "content":"${{ env.VPS_HOST }}",
              "ttl":120,
              "proxied":false
            }'

      - name: Setup Traefik routing
        uses: appleboy/ssh-action@master
        with:
          host: ${{ env.VPS_HOST }}
          username: ${{ env.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            PR_NUMBER=${{ github.event.pull_request.number }}
            PORT=$((9000 + PR_NUMBER))

            cat > /opt/deployments/traefik/config/${{ env.PROJECT_NAME }}-pr-${PR_NUMBER}.yml <<EOF
            http:
              routers:
                ${{ env.PROJECT_NAME }}-pr-${PR_NUMBER}:
                  rule: "Host(\`pr-${PR_NUMBER}.${{ env.PROJECT_NAME }}.singularity-labs.org\`)"
                  service: ${{ env.PROJECT_NAME }}-pr-${PR_NUMBER}
                  entryPoints:
                    - web
                    - websecure
                  tls:
                    certResolver: letsencrypt
              services:
                ${{ env.PROJECT_NAME }}-pr-${PR_NUMBER}:
                  loadBalancer:
                    servers:
                      - url: "http://localhost:${PORT}"
            EOF

            # Start container
            cd /opt/deployments/${{ env.PROJECT_NAME }}/pr-${PR_NUMBER}
            docker stop ${{ env.PROJECT_NAME }}-pr-${PR_NUMBER} 2>/dev/null || true
            docker rm ${{ env.PROJECT_NAME }}-pr-${PR_NUMBER} 2>/dev/null || true

            docker run -d \
              --name ${{ env.PROJECT_NAME }}-pr-${PR_NUMBER} \
              --restart unless-stopped \
              -v $(pwd):/usr/share/nginx/html:ro \
              -p ${PORT}:80 \
              nginx:alpine

            # Restart Traefik
            docker restart appwrite-traefik

      - name: Comment on PR
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: |
            const prNumber = context.payload.pull_request.number;
            const previewUrl = `https://pr-${prNumber}.${{ env.PROJECT_NAME }}.singularity-labs.org`;

            github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: prNumber,
              body: `🚀 **Storybook Preview Deployed!**\n\n` +
                    `✅ Preview URL: **${previewUrl}**\n\n` +
                    `📊 Build Info:\n` +
                    `- Commit: ${context.sha.substring(0, 7)}\n` +
                    `- Branch: ${context.payload.pull_request.head.ref}\n` +
                    `- Type: Storybook Component Showcase\n\n` +
                    `⚡ Updates automatically on new commits`
            });

  cleanup-pr-preview:
    if: github.event.action == 'closed'
    runs-on: ubuntu-latest
    steps:
      - name: Remove deployment
        uses: appleboy/ssh-action@master
        with:
          host: ${{ env.VPS_HOST }}
          username: ${{ env.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            PR_NUMBER=${{ github.event.pull_request.number }}

            # Stop and remove container
            docker stop ${{ env.PROJECT_NAME }}-pr-${PR_NUMBER} || true
            docker rm ${{ env.PROJECT_NAME }}-pr-${PR_NUMBER} || true

            # Remove files
            rm -rf /opt/deployments/${{ env.PROJECT_NAME }}/pr-${PR_NUMBER}

            # Remove Traefik config
            rm -f /opt/deployments/traefik/config/${{ env.PROJECT_NAME }}-pr-${PR_NUMBER}.yml
            docker restart appwrite-traefik

      - name: Delete DNS record
        run: |
          RECORD_ID=$(curl -s -X GET \
            "https://api.cloudflare.com/client/v4/zones/${{ secrets.CLOUDFLARE_ZONE_ID }}/dns_records?name=pr-${{ github.event.pull_request.number }}.${{ env.PROJECT_NAME }}.singularity-labs.org" \
            -H "Authorization: Bearer ${{ secrets.CLOUDFLARE_API_TOKEN }}" | jq -r '.result[0].id')

          curl -X DELETE \
            "https://api.cloudflare.com/client/v4/zones/${{ secrets.CLOUDFLARE_ZONE_ID }}/dns_records/$RECORD_ID" \
            -H "Authorization: Bearer ${{ secrets.CLOUDFLARE_API_TOKEN }}"
```

---

## 🔐 Required GitHub Secrets

Add these to repository settings (Settings → Secrets → Actions):

```bash
VPS_SSH_KEY                 # Private SSH key for VPS access
CLOUDFLARE_API_TOKEN        # Cloudflare API token
CLOUDFLARE_ZONE_ID          # singularity-labs.org zone ID
```

---

## 🌐 Expected URLs

After deployment, access your template showcase at:

- **Production Storybook**: https://monorepo-template.singularity-labs.org
- **PR #42 Preview**: https://pr-42.monorepo-template.singularity-labs.org
- **Demo Apps**: https://demo.monorepo-template.singularity-labs.org (future)

---

## 🔗 Appwrite Integration (Future)

Add Appwrite backend to demonstrate template capabilities:

### 1. Create Appwrite Database

```bash
# Via MCP in Claude Code
Create database "monorepo-template-demo"
Create collection "generated-apps" with fields:
  - id (string, unique)
  - name (string)
  - type (string: "react-web" | "react-native" | "electron" | "express-api")
  - generated_at (datetime)
  - config (json)
```

### 2. Update Template Generators

Add Appwrite SDK to generated apps:

```bash
pnpm add appwrite
```

### 3. Environment Variables

```bash
VITE_APPWRITE_ENDPOINT=https://appwrite.singularity-labs.org/v1
VITE_APPWRITE_PROJECT_ID=6917d0a50033ebe8d013
VITE_APPWRITE_DATABASE_ID=monorepo-template-demo
```

---

## 📊 Resource Requirements

**Per Deployment**:
- RAM: ~20MB (static Nginx serving)
- Disk: ~50MB (Storybook build)
- CPU: Minimal (static content)

**VPS Capacity**:
- Available: ~4GB RAM, ~140GB disk
- Max Concurrent PRs: ~200 (assuming 20MB each)

**Verdict**: ✅ Plenty of capacity for template showcase + PRs

---

## 🧪 Testing Checklist

Before going live:

- [ ] Test Storybook build locally (`pnpm build-storybook`)
- [ ] Verify static site works (`npx http-server storybook-static`)
- [ ] Create test PR to validate workflow
- [ ] Verify DNS resolution
- [ ] Check SSL certificate generation
- [ ] Test Traefik routing
- [ ] Verify cleanup on PR close

---

## 🚀 Deployment Steps

### Step 1: Setup VPS Directories

```bash
ssh root@140.82.14.49

# Create deployment directories
mkdir -p /opt/deployments/monorepo-template/{production,demo}
mkdir -p /opt/deployments/traefik/config
```

### Step 2: Add GitHub Secrets

(See "Required GitHub Secrets" section above)

### Step 3: Create Workflow File

Copy the workflow YAML above to `.github/workflows/deploy-monorepo-template.yml`

### Step 4: Test with PR

1. Create a test branch
2. Make a small change (e.g., update README)
3. Open a PR
4. Verify workflow runs successfully
5. Check preview URL works

### Step 5: Merge to Main

1. Merge PR
2. Verify production deployment
3. Check https://monorepo-template.singularity-labs.org

---

## 💡 Future Enhancements

1. **Generator Showcase Page**
   - Interactive form to configure generators
   - Download generated app as ZIP
   - Preview generated code

2. **Template Metrics Dashboard**
   - Track template usage
   - Popular generator combinations
   - Community contributions

3. **Live Code Editor**
   - Edit components in Storybook
   - See changes in real-time
   - Export modified code

---

**Status**: Ready for Implementation ✅
**Estimated Setup Time**: 30 minutes
**Maintenance**: Zero (automated)
