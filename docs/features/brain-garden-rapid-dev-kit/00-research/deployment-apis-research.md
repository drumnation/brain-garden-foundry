# Deployment APIs Research - Checkpoints 015

**Date**: 2025-11-15
**Objective**: Research Vercel and Netlify deployment APIs for automated project deployment
**Status**: ✅ COMPLETE

---

## Executive Summary

Both Vercel and Netlify provide comprehensive APIs for automated deployment with excellent developer experience. Vercel has tighter Next.js integration while Netlify offers more flexibility for various frameworks.

**Recommendation**: Support both platforms with Vercel as primary (Next.js optimization) and Netlify as secondary (broader framework support).

---

## Vercel API

### Overview
- **REST API**: `https://api.vercel.com`
- **Authentication**: Bearer token (Personal or OAuth)
- **SDK**: `@vercel/client` npm package
- **Rate Limits**:
  - Hobby: 100 req/min
  - Pro: 300 req/min
  - Enterprise: Custom

### Key Capabilities

| Feature | Availability | Use Case |
|---------|-------------|----------|
| **Deployments** | ✅ Full API | Create, list, delete deployments |
| **Projects** | ✅ Full API | Create projects, configure settings |
| **Domains** | ✅ Full API | Add custom domains, SSL certs |
| **Environment Variables** | ✅ Full API | Manage env vars per environment |
| **Build Hooks** | ✅ Supported | Trigger deployments via webhook |
| **Preview Deployments** | ✅ Automatic | Every push gets preview URL |
| **Serverless Functions** | ✅ Native | API routes auto-deployed |
| **Edge Functions** | ✅ Native | Edge runtime support |

### Authentication Setup

```bash
# Create token at https://vercel.com/account/tokens
export VERCEL_TOKEN="your_token_here"
```

### Deployment Example

```javascript
// Using Vercel CLI programmatically
import { createDeployment } from '@vercel/client';

const deployment = await createDeployment({
  token: process.env.VERCEL_TOKEN,
  path: './dist',
  project: 'my-project',
  target: 'production'
});

console.log(`Deployed to: ${deployment.url}`);
```

### CLI Integration

```bash
# Install globally
npm i -g vercel

# Deploy with zero config
vercel --token=$VERCEL_TOKEN

# Deploy to production
vercel --prod --token=$VERCEL_TOKEN
```

### Pricing
- **Hobby**: Free (personal projects)
- **Pro**: $20/month per member
- **Enterprise**: Custom pricing

### Strengths
- ✅ Zero-config Next.js deployment
- ✅ Automatic preview URLs
- ✅ Built-in analytics
- ✅ Edge function support
- ✅ Excellent DX

### Limitations
- ⚠️ Optimized for Next.js/React
- ⚠️ Build time limits (45min Hobby, 6hr Pro)
- ⚠️ Bandwidth limits apply

---

## Netlify API

### Overview
- **REST API**: `https://api.netlify.com/api/v1`
- **Authentication**: Personal Access Token or OAuth
- **SDK**: `netlify` npm package (official)
- **Rate Limits**:
  - Free: 3 req/sec, 500 req/min
  - Pro: Higher limits (not specified)

### Key Capabilities

| Feature | Availability | Use Case |
|---------|-------------|----------|
| **Deployments** | ✅ Full API | Deploy via API or Git |
| **Sites** | ✅ Full API | Create, configure sites |
| **Forms** | ✅ Native | Form handling without backend |
| **Functions** | ✅ Native | Serverless functions (AWS Lambda) |
| **Identity** | ✅ Native | User authentication service |
| **Split Testing** | ✅ Supported | A/B testing deployments |
| **Deploy Previews** | ✅ Automatic | PR preview deployments |
| **Build Plugins** | ✅ Extensible | Custom build steps |

### Authentication Setup

```bash
# Create token at https://app.netlify.com/user/applications
export NETLIFY_AUTH_TOKEN="your_token_here"
```

### Deployment Example

```javascript
// Using Netlify SDK
import { NetlifyAPI } from 'netlify';

const client = new NetlifyAPI(process.env.NETLIFY_AUTH_TOKEN);

// Create new site
const site = await client.createSite({
  body: {
    name: 'my-awesome-site',
    custom_domain: 'mysite.com'
  }
});

// Deploy to site
const deployment = await client.createDeployment({
  site_id: site.id,
  title: 'Production deployment',
  draft: false,
  files: {
    '/index.html': 'file_content_here'
  }
});

console.log(`Deployed to: ${deployment.deploy_ssl_url}`);
```

### CLI Integration

```bash
# Install globally
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --auth=$NETLIFY_AUTH_TOKEN

# Create new site and deploy
netlify init
netlify deploy --prod
```

### Pricing
- **Starter**: Free (100GB bandwidth/month)
- **Pro**: $19/month per member
- **Business**: $99/month per member
- **Enterprise**: Custom

### Strengths
- ✅ Framework agnostic
- ✅ Built-in forms
- ✅ Identity/auth service
- ✅ Deploy previews for PRs
- ✅ Generous free tier

### Limitations
- ⚠️ Build time limit (15min free, 45min pro)
- ⚠️ Functions have 10sec timeout
- ⚠️ Bandwidth limits on free tier

---

## Comparison Matrix

| Feature | Vercel | Netlify |
|---------|--------|---------|
| **Next.js Support** | ⭐⭐⭐⭐⭐ Native | ⭐⭐⭐ Good |
| **Framework Flexibility** | ⭐⭐⭐ React-focused | ⭐⭐⭐⭐⭐ Any framework |
| **API Quality** | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐ Very Good |
| **Free Tier** | ⭐⭐⭐⭐ Generous | ⭐⭐⭐⭐⭐ Very Generous |
| **Build Speed** | ⭐⭐⭐⭐⭐ Very Fast | ⭐⭐⭐⭐ Fast |
| **Preview Deployments** | ⭐⭐⭐⭐⭐ Automatic | ⭐⭐⭐⭐⭐ Automatic |
| **Serverless Functions** | ⭐⭐⭐⭐⭐ Native | ⭐⭐⭐⭐ Native |
| **Custom Domains** | ⭐⭐⭐⭐ Good | ⭐⭐⭐⭐⭐ Excellent |
| **Forms** | ❌ Not built-in | ⭐⭐⭐⭐⭐ Native |
| **Identity/Auth** | ❌ Not built-in | ⭐⭐⭐⭐ Native |

---

## Integration Strategy for Brain Garden

### Recommended Approach

1. **Primary Platform**: Vercel
   - Best for Next.js projects
   - Superior performance
   - Better Next.js-specific features

2. **Secondary Platform**: Netlify
   - Fallback option
   - Better for non-Next.js frameworks
   - Forms and Identity features

### Implementation Pattern

```javascript
// brain-garden-deploy.js
export class DeploymentManager {
  async deploy(projectPath, platform = 'vercel') {
    switch(platform) {
      case 'vercel':
        return this.deployToVercel(projectPath);
      case 'netlify':
        return this.deployToNetlify(projectPath);
      default:
        throw new Error(`Unknown platform: ${platform}`);
    }
  }

  async deployToVercel(projectPath) {
    // 1. Check for vercel.json config
    // 2. Run build if needed
    // 3. Deploy using CLI or API
    // 4. Return deployment URL
  }

  async deployToNetlify(projectPath) {
    // 1. Check for netlify.toml config
    // 2. Run build if needed
    // 3. Deploy using CLI or API
    // 4. Return deployment URL
  }
}
```

### Auto-Detection Logic

```javascript
function detectPlatform(projectPath) {
  // Check for platform config files
  if (fs.existsSync(path.join(projectPath, 'vercel.json'))) {
    return 'vercel';
  }
  if (fs.existsSync(path.join(projectPath, 'netlify.toml'))) {
    return 'netlify';
  }

  // Check framework
  const pkg = JSON.parse(fs.readFileSync(path.join(projectPath, 'package.json')));
  if (pkg.dependencies?.next) {
    return 'vercel'; // Next.js → Vercel
  }

  return 'netlify'; // Default for other frameworks
}
```

---

## Authentication Requirements

### For Brain Garden Users

#### Option 1: User Provides Tokens
```bash
# User sets environment variables
export VERCEL_TOKEN="..."
export NETLIFY_AUTH_TOKEN="..."
```

#### Option 2: OAuth Flow
- Implement OAuth for both platforms
- Store tokens securely
- Better UX but more complex

#### Option 3: CLI Delegation
- Rely on user having CLI tools installed
- Use `vercel` and `netlify` commands
- Simpler but requires prerequisites

**Recommendation**: Start with Option 1 (env vars) for MVP, add OAuth later.

---

## Rate Limits & Quotas

### Vercel Limits
| Tier | API Rate | Bandwidth | Build Time |
|------|----------|-----------|------------|
| Hobby | 100/min | 100GB/mo | 45min |
| Pro | 300/min | 1TB/mo | 6hr |

### Netlify Limits
| Tier | API Rate | Bandwidth | Build Time |
|------|----------|-----------|------------|
| Free | 500/min | 100GB/mo | 15min |
| Pro | Higher | 400GB/mo | 45min |

### Mitigation Strategies
1. **Caching**: Cache deployment status
2. **Queuing**: Queue deployments to respect rate limits
3. **Retries**: Exponential backoff for rate limit errors
4. **Monitoring**: Track API usage

---

## Security Considerations

1. **Token Storage**: Never commit tokens to git
2. **Token Scopes**: Use minimal required permissions
3. **Token Rotation**: Implement token refresh mechanism
4. **Audit Logs**: Track all deployment activities
5. **Environment Isolation**: Separate tokens for dev/prod

---

## Cost Analysis

### For 100 Projects/Month

**Vercel**:
- Hobby: $0 (if within limits)
- Pro: $20/month (if commercial)

**Netlify**:
- Starter: $0 (if within 100GB bandwidth)
- Pro: $19/month (if commercial)

**Brain Garden Recommendation**:
- Start with free tiers
- Monitor usage
- Upgrade as needed

---

## Fallback Strategies

If deployment APIs are unavailable:

1. **Manual Deployment**: Generate deployment instructions
2. **Git Push**: Configure Git hooks for auto-deploy
3. **Static Hosting**: Fallback to GitHub Pages
4. **Docker**: Generate Docker configs for self-hosting
5. **ZIP Download**: Provide deployable archive

---

## Implementation Priority

1. **Phase 1 (MVP)**: Vercel deployment via CLI
2. **Phase 2**: Netlify support
3. **Phase 3**: API-based deployment
4. **Phase 4**: OAuth authentication
5. **Phase 5**: Advanced features (preview URLs, rollbacks)

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| API rate limits | Medium | Implement queuing and caching |
| Token expiration | Low | Token refresh mechanism |
| Platform downtime | Low | Support multiple platforms |
| Build failures | Medium | Robust error handling |
| Cost overruns | Low | Monitor usage, set alerts |

---

## Conclusion

Both Vercel and Netlify provide excellent deployment APIs suitable for Brain Garden integration. Vercel is recommended as primary platform (Next.js optimization) with Netlify as secondary option (broader framework support).

**Next Steps**:
1. Implement Vercel CLI wrapper
2. Test deployment flow end-to-end
3. Add Netlify support
4. Document setup process

---

**Status**: ✅ Checkpoint 015 COMPLETE
**Quality**: High confidence in deployment strategy
**Time Spent**: 45 minutes