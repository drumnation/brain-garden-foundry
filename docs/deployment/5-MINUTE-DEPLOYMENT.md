# 🚀 5-Minute Deployment Guide

**From Zero to Production in Under 5 Minutes**

This guide shows you how to deploy a fully functional application from the Brain Garden template with just ONE command.

---

## The Magic Command ✨

```bash
pnpm deploy:quick
```

That's it. Seriously. This single command:
- ✅ Creates your Appwrite project
- ✅ Sets up database schema
- ✅ Creates storage buckets
- ✅ Configures CI/CD pipeline
- ✅ Sets up GitHub Actions
- ✅ Deploys to production
- ✅ Enables PR preview deployments

---

## Prerequisites (30 seconds)

You need:
- Node.js 18+ ([Download](https://nodejs.org))
- pnpm (`npm install -g pnpm`)
- Git (comes with most systems)

Check you have everything:
```bash
node --version  # Should be 18+
pnpm --version  # Should be 8+
git --version   # Any version
```

---

## Step-by-Step Deployment (4 minutes)

### 1. Clone the Template (30 seconds)

```bash
git clone https://github.com/your-org/brain-garden-monorepo-template my-app
cd my-app
```

### 2. Run the Magic Command (3 minutes)

```bash
pnpm deploy:quick
```

You'll see:
```
╔══════════════════════════════════════════════════════╗
║                                                      ║
║    🚀 BRAIN GARDEN QUICK DEPLOY                     ║
║       Zero to Production in 5 Minutes               ║
║                                                      ║
╚══════════════════════════════════════════════════════╝

📋 Pre-flight Checks

✓ Node.js 20.10.0 ✓
✓ pnpm installed ✓
✓ git installed ✓

🎯 Deployment Configuration

  Project Name:    my-app
  Environment:     production
  Appwrite:        https://appwrite.singularity-labs.org
  Production URL:  https://my-app.singularity-labs.org
  Preview URLs:    https://pr-*.my-app.singularity-labs.org

🚀 Starting Deployment

✓ Installing dependencies
✓ Initializing deployment
✓ Running database migrations
✓ Setting up GitHub Actions
✓ Checking deployment status

🎉 Deployment Complete!
```

### 3. Push to GitHub (30 seconds)

```bash
git remote add origin https://github.com/your-username/my-app
git push -u origin main
```

### 4. You're Live! 🎉

Your app is now deployed at:
- **Production**: `https://my-app.singularity-labs.org`
- **Storybook**: `https://storybook.my-app.singularity-labs.org`
- **API**: `https://api.my-app.singularity-labs.org`

---

## What Just Happened?

The deployment system automatically:

### 1. **Created Appwrite Resources**
- Project with unique ID
- Database with auth collections (users, sessions, teams)
- Storage buckets (profile-pictures, documents, uploads)
- Configured permissions and security

### 2. **Set Up CI/CD**
- GitHub Actions workflow (`.github/workflows/deploy.yml`)
- Automatic deployments on push to main
- PR preview deployments for every pull request
- Automated testing and validation

### 3. **Configured Infrastructure**
- DNS records via Cloudflare
- SSL certificates (automatic HTTPS)
- CDN distribution
- Monitoring and logging

### 4. **Initialized Database**
- Ran migration `001-initial-schema.ts`
- Created user authentication tables
- Set up storage buckets
- Configured indexes for performance

---

## Managing Your Deployment

### Check Status
```bash
pnpm deploy:status
```

Shows:
- Health status (healthy/degraded/error)
- Service availability
- Migration status
- Active URLs

### Sync Changes
```bash
pnpm deploy:sync
```

Updates:
- Database schema changes
- New migrations
- Storage bucket configuration
- Function deployments

### Run Migrations
```bash
pnpm deploy:sync --migrations
```

### Destroy Deployment
```bash
pnpm deploy:destroy
```

**Warning**: This removes all resources and data!

---

## PR Preview Deployments

Every pull request automatically gets:
- Unique preview URL: `https://pr-123.my-app.singularity-labs.org`
- Isolated environment
- Automatic cleanup when PR is closed
- Comments with deployment links

Example PR workflow:
```bash
git checkout -b new-feature
# Make changes
git push origin new-feature
# Create PR on GitHub
# 🎉 Preview deployed automatically!
```

---

## Advanced Configuration

### Custom Domain

Edit `.deploy/config.json`:
```json
{
  "domains": {
    "production": "app.yourdomain.com",
    "preview": "pr-*.preview.yourdomain.com"
  }
}
```

### Environment Variables

Add to Appwrite project settings or use GitHub Secrets:
```bash
gh secret set STRIPE_API_KEY --body "sk_live_..."
gh secret set SENDGRID_API_KEY --body "SG...."
```

### Database Migrations

Create new migration:
```bash
# Create file: migrations/002-add-posts.ts
```

```typescript
export const up = async (client) => {
  // Add your schema changes
};

export const down = async (client) => {
  // Rollback logic
};
```

Run it:
```bash
pnpm deploy:sync --migrations
```

---

## Troubleshooting

### "Project already deployed"
Your project is already set up! Use:
```bash
pnpm deploy:status  # Check health
pnpm deploy:sync    # Update deployment
```

### "Appwrite not accessible"
Check the Appwrite server is running:
```bash
curl https://appwrite.singularity-labs.org/v1/health
```

### "GitHub secrets not configured"
Manually add secrets:
```bash
gh secret set APPWRITE_ENDPOINT --body "https://appwrite.singularity-labs.org"
gh secret set APPWRITE_PROJECT_ID --body "your-project-id"
gh secret set APPWRITE_API_KEY --body "your-api-key"
```

### Clean Slate
Remove everything and start over:
```bash
pnpm deploy:destroy --force
rm -rf .deploy
pnpm deploy:quick
```

---

## Architecture Overview

```
Your Computer          GitHub              Appwrite              Users
     │                   │                    │                   │
     ├─[pnpm deploy]────>│                    │                   │
     │                   ├─[Actions]─────────>│                   │
     │                   │                    ├─[Deploy]────────>│
     │                   │                    │                   │
     │                   ├─[PR Created]───────>│                   │
     │                   │                    ├─[Preview]───────>│
     │                   │                    │                   │
     └─[git push]───────>│                    │                   │
                         └─[Auto Deploy]─────>└─[Production]────>│
```

---

## Quick Reference Card

| Command | What it Does | When to Use |
|---------|--------------|-------------|
| `pnpm deploy:quick` | Complete deployment setup | First time only |
| `pnpm deploy:status` | Check health | Anytime |
| `pnpm deploy:sync` | Update deployment | After schema changes |
| `pnpm dev` | Local development | During development |
| `git push` | Deploy to production | Ready for production |
| `pnpm deploy:destroy` | Remove everything | Starting over |

---

## Success Metrics

Your deployment is successful when:
- ✅ `pnpm deploy:status` shows "healthy"
- ✅ Production URL responds with 200
- ✅ GitHub Actions badge is green
- ✅ PR previews deploy automatically
- ✅ Database migrations apply cleanly

---

## Next Steps

1. **Customize Your App**
   - Edit components in `packages/`
   - Add new migrations
   - Configure environment variables

2. **Set Up Monitoring**
   - Add error tracking (Sentry)
   - Configure analytics
   - Set up alerts

3. **Scale Your Deployment**
   - Add more regions
   - Configure CDN
   - Optimize performance

---

## Support

- **Documentation**: `/docs/deployment/`
- **Discord**: [Brain Garden Community](https://discord.gg/brain-garden)
- **Issues**: [GitHub Issues](https://github.com/your-org/brain-garden-monorepo-template/issues)

---

**Remember**: The entire deployment process is designed to be invisible. You focus on building your app, we handle the infrastructure.

🎉 **Happy Deploying!**