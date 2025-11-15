# npm Registry Integration Research

**Checkpoint 013: npm Registry Integration for Component Sharing and Versioning**

## Executive Summary

The npm Registry provides a robust API for publishing, searching, and retrieving packages programmatically. Brain Garden can leverage this infrastructure to enable component sharing, versioning, and discovery across projects.

### Key Capabilities

| Feature | Availability | Documentation Status | Use Case |
|---------|--------------|---------------------|----------|
| **Package Publishing** | ✅ Public API | Fully documented | Share generated components |
| **Package Search** | ✅ Public API | Fully documented | Discover existing components |
| **Package Metadata** | ✅ Public API | Fully documented | Version management, dependencies |
| **Download Counts** | ✅ Public API | Fully documented | Popularity metrics |
| **Scoped Packages** | ✅ Supported | Fully documented | Namespace isolation |
| **Private Packages** | ✅ Supported | Requires paid plan | Team-private components |

### Critical Findings

**✅ Strong API Foundation:**
- Official REST API at `https://registry.npmjs.org/`
- Comprehensive metadata access
- Well-documented endpoints
- CORS-enabled mirror available: `https://registry.npmjs.cf/`

**⚠️ Authentication Required:**
- Publishing requires access tokens
- Private packages require paid plans ($7/user/month)
- Personal Access Tokens (classic) supported
- Granular access tokens available

**✅ Component Versioning:**
- Full semantic versioning support
- Dist-tags for release management (latest, next, beta)
- Version history and deprecation support
- Package manifests per version

## npm Registry API Overview

### 1. Registry Metadata

**Endpoint:** `GET https://registry.npmjs.org/`

**Purpose:** Get information about the registry itself (database stats, update sequences)

**Example:**
```bash
curl https://registry.npmjs.org/ | jq
```

**Response:**
```json
{
  "db_name": "registry",
  "doc_count": 2226548,
  "update_seq": 5769731,
  "disk_size": 58937123056
}
```

**Use Case:** Health check, monitoring

### 2. Package Metadata (Packument)

**Endpoint:** `GET https://registry.npmjs.org/<package>`

**Purpose:** Get all available information about a package (all versions, maintainers, etc.)

**Examples:**
```bash
# Public package
curl https://registry.npmjs.org/react | jq

# Scoped package
curl https://registry.npmjs.org/@types/node | jq
```

**Response Structure:**
```json
{
  "_id": "react",
  "name": "react",
  "description": "React is a JavaScript library for building user interfaces.",
  "dist-tags": {
    "latest": "18.2.0",
    "next": "18.3.0-next-fecc288b7-20221025"
  },
  "versions": {
    "17.0.2": { /* version manifest */ },
    "18.2.0": { /* version manifest */ }
  },
  "maintainers": [
    { "name": "react-core", "email": "react-core@example.com" }
  ],
  "time": {
    "modified": "2023-05-15T20:00:00.000Z",
    "created": "2011-10-26T17:46:21.942Z",
    "17.0.2": "2021-03-22T21:56:19.536Z"
  },
  "license": "MIT",
  "readme": "# React...",
  "homepage": "https://reactjs.org/"
}
```

**Use Case:** Version discovery, dependency management, maintainer information

### 3. Package Version Manifest

**Endpoint:** `GET https://registry.npmjs.org/<package>/<version>`

**Purpose:** Get information about a specific version of a package

**Examples:**
```bash
curl https://registry.npmjs.org/react/17.0.2 | jq
curl https://registry.npmjs.org/@types/node/15.14.0 | jq
```

**Response Structure:**
```json
{
  "name": "react",
  "version": "17.0.2",
  "description": "React is a JavaScript library...",
  "main": "index.js",
  "license": "MIT",
  "dependencies": {
    "loose-envify": "^1.1.0",
    "object-assign": "^4.1.1"
  },
  "dist": {
    "shasum": "1c...",
    "tarball": "https://registry.npmjs.org/react/-/react-17.0.2.tgz",
    "integrity": "sha512-...",
    "fileCount": 20,
    "unpackedSize": 328100
  },
  "_npmUser": {
    "name": "...",
    "email": "..."
  }
}
```

**Use Case:** Specific version installation, dependency resolution, integrity verification

### 4. Package Search

**Endpoint:** `GET https://registry.npmjs.org/-/v1/search?text=<query>`

**Purpose:** Search packages by text, author, keywords, etc.

**Query Parameters:**
- `text`: Search query (required)
- `size`: Number of results (default: 20, max: 250)
- `from`: Offset for pagination
- `quality`: Weight quality score (0-1)
- `popularity`: Weight popularity score (0-1)
- `maintenance`: Weight maintenance score (0-1)

**Search Keywords:**
- `author:<username>`: Filter by author
- `maintainer:<username>`: Filter by maintainer
- `keywords:<keyword>`: Filter by keywords
- `is:deprecated`: Show deprecated packages
- `is:insecure`: Show packages with vulnerabilities
- `is:unstable`: Show pre-release versions

**Examples:**
```bash
# Simple search
curl 'https://registry.npmjs.org/-/v1/search?text=react' | jq

# Search by author
curl 'https://registry.npmjs.org/-/v1/search?text=author:velut' | jq

# Search with filters
curl 'https://registry.npmjs.org/-/v1/search?text=ui+components&size=5' | jq
```

**Response Structure:**
```json
{
  "objects": [
    {
      "package": {
        "name": "react",
        "version": "18.2.0",
        "description": "React is a JavaScript library...",
        "keywords": ["react"],
        "date": "2023-05-15T20:00:00.000Z",
        "links": {
          "npm": "https://www.npmjs.com/package/react",
          "homepage": "https://reactjs.org/",
          "repository": "https://github.com/facebook/react"
        }
      },
      "score": {
        "final": 0.5866665170132767,
        "detail": {
          "quality": 0.5246016720020373,
          "popularity": 0.8931981392742823,
          "maintenance": 0.3333333333333333
        }
      },
      "searchScore": 100000.63
    }
  ],
  "total": 164637,
  "time": "Fri Jul 02 2021 13:13:14 GMT+0000"
}
```

**Use Case:** Component discovery, finding alternatives, market research

### 5. Download Counts

**Endpoint:** `GET https://api.npmjs.org/downloads/point/<period>/<package>`

**Periods:**
- `last-day`
- `last-week`
- `last-month`
- `last-year`
- Custom range: `YYYY-MM-DD:YYYY-MM-DD`

**Examples:**
```bash
# Last week downloads
curl 'https://api.npmjs.org/downloads/point/last-week/react' | jq

# Custom date range
curl 'https://api.npmjs.org/downloads/point/2023-01-01:2023-12-31/react' | jq
```

**Response:**
```json
{
  "downloads": 10889040,
  "start": "2021-06-25",
  "end": "2021-07-01",
  "package": "react"
}
```

**Use Case:** Popularity metrics, trend analysis

## Authentication & Publishing

### Access Tokens

**Token Types (Legacy - Being Phased Out):**
1. **Read-only:** Download packages only
2. **Automation:** Publish without 2FA (for CI/CD)
3. **Publish:** Full access (download, publish, settings)

**Granular Access Tokens (Recommended):**
- Fine-grained permissions (read, write, admin)
- Expiration dates
- IP allowlist (CIDR)
- Package-specific permissions

**Creating Access Token (CLI):**
```bash
# Interactive token creation
npm login

# Generate automation token
npm token create --read-only
npm token create --cidr=192.168.0.0/24

# List tokens
npm token list

# Revoke token
npm token revoke <token-id>
```

**Using Tokens in CI/CD:**
```yaml
# .github/workflows/publish.yml
- name: Setup Node
  uses: actions/setup-node@v3
  with:
    node-version: '18'
    registry-url: 'https://registry.npmjs.org'

- name: Publish package
  run: npm publish
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Publishing Packages

**Prerequisites:**
- npm user account (free for public packages)
- Package name not taken
- Valid `package.json`

**Publishing Workflow:**

```bash
# 1. Login to npm
npm login

# 2. Create package.json
cat > package.json << EOF
{
  "name": "@brain-garden/button-component",
  "version": "1.0.0",
  "description": "AI-generated Button component",
  "main": "index.js",
  "scripts": {
    "test": "vitest"
  },
  "keywords": ["react", "component", "brain-garden", "ai-generated"],
  "author": "Brain Garden",
  "license": "MIT",
  "peerDependencies": {
    "react": "^18.0.0"
  }
}
EOF

# 3. Review package contents
npm pack --dry-run

# 4. Publish (scoped packages are private by default)
npm publish --access public
```

**Publishing Scoped Packages:**
```bash
# Scoped to user
npm publish @username/package-name

# Scoped to organization
npm publish @brain-garden/component-name

# Private package (requires paid plan)
npm publish @brain-garden/private-component --access restricted
```

## Scoped Packages & Namespacing

### What are Scopes?

Scopes are a way of grouping related packages together, similar to namespaces.

**Format:** `@scope/package-name`

**Benefits:**
- **Namespace Isolation:** Prevent name conflicts (`@brain-garden/button` vs `@shadcn/button`)
- **Organization:** Group related packages (`@brain-garden/ui-components/*`)
- **Access Control:** Private scopes for team-only packages
- **Discoverability:** Easy to find all packages in a scope

**Example Scope Structure:**
```
@brain-garden/button
@brain-garden/input
@brain-garden/card
@brain-garden/dashboard
```

### Creating Scoped Packages

```bash
# Initialize scoped package
npm init --scope=@brain-garden

# Or manually create package.json
{
  "name": "@brain-garden/button",
  "version": "1.0.0",
  ...
}

# Install scoped package
npm install @brain-garden/button

# Import in code
import { Button } from '@brain-garden/button';
```

### Private vs Public Scoped Packages

| Feature | Public Scoped | Private Scoped |
|---------|---------------|----------------|
| **Cost** | Free | $7/user/month (npm Teams) |
| **Visibility** | Anyone can install | Only authorized users |
| **Publishing** | `npm publish --access public` | `npm publish` (default) |
| **Use Case** | Open-source components | Team-internal components |

## Brain Garden Integration Strategy

### Component Publishing Workflow

**Objective:** Automatically publish AI-generated components to npm for reuse across projects

**Architecture:**
```
┌─────────────────────────────────────────────────────────┐
│ Brain Garden Rapid Dev Kit                              │
├─────────────────────────────────────────────────────────┤
│ 1. User requests component generation                   │
│ 2. Claude Code generates component                      │
│ 3. Component tested locally                             │
│ 4. User approves component                              │
│ 5. Brain Garden publishes to npm (optional)             │
│ 6. Component available for reuse via npm install        │
└─────────────────────────────────────────────────────────┘
```

**Implementation:**

```typescript
// Component Publisher Service
interface ComponentPublishOptions {
  componentName: string;
  componentCode: string;
  description: string;
  keywords: string[];
  scope?: string; // @brain-garden or @username
  private?: boolean;
  version?: string; // default: 1.0.0
}

async function publishComponent(options: ComponentPublishOptions) {
  const packageJson = {
    name: options.scope
      ? `@${options.scope}/${options.componentName}`
      : options.componentName,
    version: options.version || '1.0.0',
    description: options.description,
    main: 'index.js',
    keywords: [
      'brain-garden',
      'ai-generated',
      'react',
      ...options.keywords,
    ],
    author: 'Brain Garden',
    license: 'MIT',
    peerDependencies: {
      react: '^18.0.0',
      'react-dom': '^18.0.0',
    },
    metadata: {
      generatedBy: 'brain-garden',
      generatedAt: new Date().toISOString(),
      generator: 'claude-code', // or 'v0-dev'
    },
  };

  // Write files to temporary directory
  const tempDir = await createTempDir();
  await writeFile(path.join(tempDir, 'package.json'), JSON.stringify(packageJson, null, 2));
  await writeFile(path.join(tempDir, 'index.js'), options.componentCode);
  await writeFile(path.join(tempDir, 'README.md'), generateReadme(options));

  // Publish to npm
  const publishCommand = options.private
    ? 'npm publish'
    : 'npm publish --access public';

  const result = await exec(publishCommand, { cwd: tempDir });

  return {
    success: true,
    packageName: packageJson.name,
    registryUrl: `https://www.npmjs.com/package/${packageJson.name}`,
  };
}
```

### Component Discovery Workflow

**Objective:** Search npm for existing components before generating new ones

```typescript
// Component Search Service
interface ComponentSearchOptions {
  query: string;
  scope?: string; // @brain-garden
  minQuality?: number; // 0-1
  maxResults?: number; // default: 10
}

async function searchComponents(options: ComponentSearchOptions): Promise<Component[]> {
  const scopeFilter = options.scope ? `@${options.scope}` : '';
  const query = `${scopeFilter} ${options.query}`;

  const response = await fetch(
    `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}&size=${options.maxResults || 10}`
  );

  const data = await response.json();

  return data.objects
    .filter((pkg: any) => pkg.score.final >= (options.minQuality || 0.5))
    .map((pkg: any) => ({
      name: pkg.package.name,
      version: pkg.package.version,
      description: pkg.package.description,
      score: pkg.score.final,
      qualityScore: pkg.score.detail.quality,
      popularityScore: pkg.score.detail.popularity,
      maintenanceScore: pkg.score.detail.maintenance,
      homepage: pkg.package.links.homepage,
      repository: pkg.package.links.repository,
    }));
}
```

**Usage in Brain Garden:**
```typescript
// Before generating component, search for existing solutions
const existingComponents = await searchComponents({
  query: 'button component',
  scope: 'brain-garden',
  minQuality: 0.7,
  maxResults: 5,
});

if (existingComponents.length > 0) {
  // Show user existing options
  console.log('Found existing components:');
  existingComponents.forEach(comp => {
    console.log(`  - ${comp.name} (score: ${comp.score})`);
  });

  // Ask user: "Install existing component or generate new one?"
  const userChoice = await askUser('Use existing component?');

  if (userChoice === 'yes') {
    await installComponent(existingComponents[0].name);
    return;
  }
}

// User chose to generate new component
const generatedComponent = await claudeCode.generate(prompt);
```

### Version Management

**Semantic Versioning (SemVer):**
- **MAJOR** (`1.0.0 → 2.0.0`): Breaking changes
- **MINOR** (`1.0.0 → 1.1.0`): New features, backward compatible
- **PATCH** (`1.0.0 → 1.0.1`): Bug fixes

**Dist-Tags for Component Variants:**
```bash
# Publish stable version
npm publish --tag latest

# Publish beta variant
npm publish --tag beta

# Publish experimental variant
npm publish --tag next

# Install specific variant
npm install @brain-garden/button@latest
npm install @brain-garden/button@beta
```

**Use Case in Brain Garden:**
- `latest`: Stable, production-ready components
- `beta`: Components generated with experimental features
- `next`: Bleeding-edge components (v0.dev prototypes)

### Download Metrics Integration

**Objective:** Show popularity metrics when choosing components

```typescript
async function getComponentPopularity(packageName: string) {
  const response = await fetch(
    `https://api.npmjs.org/downloads/point/last-month/${packageName}`
  );

  const data = await response.json();

  return {
    downloads: data.downloads,
    period: 'last-month',
    averagePerDay: Math.round(data.downloads / 30),
  };
}

// Usage
const popularity = await getComponentPopularity('@brain-garden/button');
console.log(`${popularity.downloads} downloads last month (${popularity.averagePerDay}/day)`);
```

## Cost Analysis

### Public Packages (Free)

**Costs:**
- **Publishing:** $0 (unlimited public packages)
- **Storage:** $0 (npm hosts packages for free)
- **Bandwidth:** $0 (unlimited downloads)

**Limitations:**
- Package names must be unique globally
- Anyone can install and use

### Private Packages (Paid)

**npm Teams Pricing:**
- **$7/user/month** for private packages
- Unlimited private packages
- Team management
- Access control

**Use Cases:**
- Team-internal components
- Proprietary UI libraries
- Client-specific components

### Recommended Strategy for Brain Garden

**Hybrid Approach:**
```yaml
Free Tier (Public Components):
  scope: @brain-garden
  visibility: public
  cost: $0/month
  use_case: Open-source community components
  example: @brain-garden/button, @brain-garden/card

Pro Tier (Private Components):
  scope: @brain-garden-pro
  visibility: private
  cost: $7/user/month
  use_case: Premium components, client work
  example: @brain-garden-pro/advanced-dashboard

Personal Scope (User-Specific):
  scope: @username
  visibility: public or private
  cost: Free (public) or $7/user/month (private)
  use_case: User's personal component library
  example: @john/button-variants
```

## CORS & Client-Side Access

### Problem: CORS Restrictions

The official npm registry (`https://registry.npmjs.org/`) has CORS restrictions that prevent direct browser access.

**Error:**
```
Access to fetch at 'https://registry.npmjs.org/react' from origin 'http://localhost:3000' has been blocked by CORS policy
```

### Solution: CORS-Enabled Mirror

**Cloudflare Mirror:** `https://registry.npmjs.cf/`
- ✅ CORS enabled
- ✅ Same API endpoints
- ✅ Client-side JavaScript compatible

**Example Usage:**
```typescript
// ❌ WRONG (CORS error in browser)
fetch('https://registry.npmjs.org/react')

// ✅ CORRECT (CORS enabled)
fetch('https://registry.npmjs.cf/react')
```

**Brain Garden UI Integration:**
```typescript
// Component search in frontend
async function searchComponentsClientSide(query: string) {
  const response = await fetch(
    `https://registry.npmjs.cf/-/v1/search?text=${query}`
  );

  return response.json();
}
```

## Security Considerations

### 1. Token Management

**Best Practices:**
- ✅ Store tokens in environment variables (never commit to git)
- ✅ Use granular access tokens (not legacy tokens)
- ✅ Set token expiration dates
- ✅ Use read-only tokens in CI when possible
- ✅ Rotate tokens regularly (every 90 days)

**GitHub Actions Secret:**
```yaml
env:
  NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 2. Package Integrity

**npm provides integrity checks:**
```json
{
  "dist": {
    "integrity": "sha512-gnhPt75i4dxEcSOeIpKVPYkbDmGE5UYCg2i05kzqLMy/bDMVUsLDQhDFN7tNqmQy1gkprE5hGqmNPElJXGjgNfg==",
    "shasum": "1c...",
    "tarball": "https://registry.npmjs.org/react/-/react-17.0.2.tgz"
  }
}
```

**Verification:**
```bash
# Verify package integrity during install
npm install --integrity
```

### 3. Malware & Security Scanning

**npm audit:**
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix
```

**Third-Party Tools:**
- [Snyk](https://snyk.io/): Continuous security monitoring
- [Socket](https://socket.dev/): Real-time malware detection
- [npm provenance](https://docs.npmjs.com/generating-provenance-statements): Verify package authenticity

## Recommended Brain Garden Architecture

### Tier Structure

```yaml
Free Tier (Default):
  publishing: No
  discovery: Yes (search public packages)
  installation: Yes (install from npm)
  cost: $0
  use_case: Discover and reuse existing components

Component Publisher Tier ($7/month):
  publishing: Yes (unlimited public packages)
  discovery: Yes
  installation: Yes
  scope: @brain-garden or @username
  cost: $7/user/month
  use_case: Share AI-generated components publicly

Pro Tier ($7/user/month):
  publishing: Yes (unlimited private packages)
  discovery: Yes (team-private search)
  installation: Yes (authorized users only)
  scope: @brain-garden-pro or @username
  cost: $7/user/month
  use_case: Team-internal components, client work
```

### User Workflow

```typescript
// Brain Garden Component Generator with npm Integration
interface GeneratorOptions {
  // Component generation
  generator: 'claude-code' | 'v0-dev';
  prompt: string;

  // npm integration (optional)
  publish?: {
    enabled: boolean;
    scope?: string; // @brain-garden or @username
    private?: boolean;
    version?: string;
  };

  // Component discovery (before generation)
  searchExisting?: {
    enabled: boolean;
    minQuality?: number; // 0.7 recommended
  };
}

async function generateComponent(options: GeneratorOptions) {
  // Stage 1: Search for existing components (optional)
  if (options.searchExisting?.enabled) {
    const existingComponents = await searchComponents({
      query: options.prompt,
      scope: options.publish?.scope,
      minQuality: options.searchExisting.minQuality || 0.7,
    });

    if (existingComponents.length > 0) {
      // Show user existing options
      const userChoice = await askUser({
        question: 'Found existing components. Use one?',
        options: [
          { label: 'Install existing', value: 'install' },
          { label: 'Generate new', value: 'generate' },
        ],
      });

      if (userChoice === 'install') {
        await installComponent(existingComponents[0].name);
        return { source: 'npm', component: existingComponents[0] };
      }
    }
  }

  // Stage 2: Generate new component
  const component = await options.generator === 'claude-code'
    ? claudeCode.generate(options.prompt)
    : v0dev.generate(options.prompt);

  // Stage 3: Publish to npm (optional)
  if (options.publish?.enabled) {
    const publishResult = await publishComponent({
      componentName: extractComponentName(component),
      componentCode: component.code,
      description: options.prompt,
      keywords: extractKeywords(options.prompt),
      scope: options.publish.scope,
      private: options.publish.private,
      version: options.publish.version || '1.0.0',
    });

    return {
      source: 'generated',
      component,
      published: publishResult,
    };
  }

  return { source: 'generated', component };
}
```

## Next Steps

### Checkpoint 013 Completion

- ✅ Researched npm Registry API endpoints (metadata, search, downloads)
- ✅ Documented authentication methods (access tokens, scopes)
- ✅ Analyzed package publishing workflow
- ✅ Explored scoped packages for namespace isolation
- ✅ Identified CORS-enabled mirror for client-side access
- ✅ Cost analysis (free public vs paid private packages)
- ✅ Designed Brain Garden integration architecture

### Recommendations

**For Brain Garden Rapid Dev Kit:**

1. **Implement Component Discovery:**
   - Search npm before generating components
   - Show popularity metrics (downloads/month)
   - Filter by quality score (≥0.7 recommended)
   - Use CORS-enabled mirror for browser access

2. **Optional Component Publishing:**
   - Free tier: Discovery only
   - Publisher tier: Publish to `@brain-garden` scope
   - Pro tier: Private packages for team work

3. **Integration Points:**
   - Pre-generation search: "Found 5 existing components, install or generate?"
   - Post-generation publish: "Publish to npm for reuse?"
   - Version management: Use dist-tags for variants (stable, beta, experimental)

4. **Security:**
   - Use granular access tokens (not legacy)
   - Store tokens in environment variables
   - Run `npm audit` on installed components
   - Verify package integrity (SHA-512)

### Proceed to Checkpoint 014

**Next:** Research GitHub Actions templates for CI/CD automation of component publishing

**Status:** npm Registry validated as strong foundation for component sharing. Official API well-documented, CORS-enabled mirror available, authentication robust. Recommend implementing discovery first (free), publishing second (optional $7/month).
