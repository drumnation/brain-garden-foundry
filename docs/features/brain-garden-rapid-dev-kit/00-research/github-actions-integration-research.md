# GitHub Actions Integration Research

**Checkpoint 014: GitHub Actions Templates for Automated Component Publishing**

## Executive Summary

GitHub Actions provides robust CI/CD capabilities for automating npm package publishing workflows, with native support for npm authentication, version detection, and multi-registry publishing. The platform excels at single-package automation but requires additional tooling (changesets, pnpm, nx) for comprehensive monorepo support.

**Key Findings:**
- ✅ **Native npm Integration**: First-class `setup-node` action with built-in `.npmrc` generation
- ✅ **Granular Token Security**: Supports npm granular tokens (scoped, time-limited, package-specific)
- ✅ **Multiple Registry Support**: Can publish to npm, GitHub Packages, private registries simultaneously
- ⚠️ **Monorepo Complexity**: Requires external tools (changesets) for dependency-aware multi-package publishing
- ⚠️ **Manual Version Management**: No built-in version detection; requires changesets, semantic-release, or manual bumps

---

## 1. GitHub Actions Core Capabilities

### Workflow Structure

GitHub Actions workflows execute as YAML files in `.github/workflows/` directory. Key components:

**Triggers:**
```yaml
on:
  release:
    types: [published]      # Trigger on GitHub Release
  push:
    branches: [main]        # Trigger on push to main
    paths:
      - 'packages/**'       # Only when packages change
  workflow_dispatch:        # Manual trigger
```

**Jobs and Steps:**
```yaml
jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:            # Granular permissions control
      contents: read
      packages: write       # For GitHub Packages
      id-token: write       # For provenance
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v3
        with:
          node-version: '20.x'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm test
      - run: npm publish --provenance --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Authentication Mechanisms

**npm Granular Tokens (Recommended):**
- **Security**: Package-scoped, time-limited, read/write permissions
- **Setup**: Create at npmjs.com → Profile → Access Tokens → Granular Access Token
- **Storage**: GitHub repository secrets (`NPM_TOKEN`)
- **Usage**: Injected via `NODE_AUTH_TOKEN` environment variable

**Token Prefix:** All npm granular tokens start with `npm_` (vs legacy tokens without prefix).

**Best Practice:** Enable npm account setting *"Require two-factor authentication or an automation or granular access token"* to prevent automation token bypass of 2FA.

### Registry Configuration

The `setup-node` action auto-generates `.npmrc` files:

```yaml
- uses: actions/setup-node@v3
  with:
    registry-url: 'https://registry.npmjs.org'
    scope: '@brain-garden'  # For scoped packages
```

**Generated `.npmrc` (npm Registry):**
```ini
//registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN}
registry=https://registry.npmjs.org/
always-auth=true
```

**Generated `.npmrc` (GitHub Packages):**
```yaml
- uses: actions/setup-node@v3
  with:
    registry-url: 'https://npm.pkg.github.com'
    scope: '@username'
```

```ini
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
registry=https://npm.pkg.github.com/
always-auth=true
```

---

## 2. Publishing Patterns

### Pattern 1: Simple Package Publishing (Single Package)

**Use Case:** Publish a single package on every release.

**Workflow: `.github/workflows/publish-npm.yml`**
```yaml
name: Publish to npm

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20.x'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Publish to npm
        run: npm publish --provenance --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Provenance:** The `--provenance` flag generates cryptographic attestations linking published packages to their source code and build process (SLSA compliance).

### Pattern 2: Version Detection Publishing

**Use Case:** Only publish when `package.json` version changes.

**Workflow: `.github/workflows/publish-on-version-change.yml`**
```yaml
name: Publish on Version Change

on:
  push:
    branches: [main]

jobs:
  check-version:
    runs-on: ubuntu-latest
    outputs:
      changed: ${{ steps.version-check.outputs.changed }}
      version: ${{ steps.version-check.outputs.version }}

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2  # Need previous commit for comparison

      - name: Check version change
        id: version-check
        run: |
          CURRENT_VERSION=$(node -p "require('./package.json').version")
          git checkout HEAD~1
          PREVIOUS_VERSION=$(node -p "require('./package.json').version")

          if [ "$CURRENT_VERSION" != "$PREVIOUS_VERSION" ]; then
            echo "changed=true" >> $GITHUB_OUTPUT
            echo "version=$CURRENT_VERSION" >> $GITHUB_OUTPUT
          else
            echo "changed=false" >> $GITHUB_OUTPUT
          fi

  publish:
    needs: check-version
    if: needs.check-version.outputs.changed == 'true'
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v3
        with:
          node-version: '20.x'
          registry-url: 'https://registry.npmjs.org'

      - run: npm ci
      - run: npm test

      - name: Publish v${{ needs.check-version.outputs.version }}
        run: npm publish --provenance --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Pattern 3: Multi-Registry Publishing

**Use Case:** Publish to both npm and GitHub Packages simultaneously.

**Workflow: `.github/workflows/publish-multi-registry.yml`**
```yaml
name: Publish to Multiple Registries

on:
  release:
    types: [published]

jobs:
  publish-npm:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v3
        with:
          node-version: '20.x'
          registry-url: 'https://registry.npmjs.org'

      - run: npm ci
      - run: npm test

      - name: Publish to npm
        run: npm publish --provenance --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

  publish-github:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v3
        with:
          node-version: '20.x'
          registry-url: 'https://npm.pkg.github.com'
          scope: '@username'

      - run: npm ci

      # GitHub Packages requires scoped package name
      - name: Update package name for GitHub Packages
        run: |
          node -e "
            const pkg = require('./package.json');
            pkg.name = '@username/' + pkg.name.replace('@', '').replace('/', '-');
            require('fs').writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
          "

      - name: Publish to GitHub Packages
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## 3. Monorepo Publishing with Changesets

### Changesets Workflow Architecture

**Changesets** is the industry-standard tool for managing multi-package versioning and publishing in monorepos. Used by Astro, Chakra UI, Remix, Apollo Client, Firebase SDK, and many others.

**Core Concepts:**
- **Changeset**: Intent to release packages at specific semver bump types with change summaries
- **Version Command**: Consumes changesets, updates package versions, generates CHANGELOGs
- **Publish Command**: Publishes all updated packages with correct dependency versions
- **Dependency Awareness**: Automatically bumps dependent packages when dependencies update

### Installation and Setup

```bash
# Install changesets CLI
pnpm add -D @changesets/cli

# Initialize changesets
pnpm changeset init
```

**Generated `.changeset/config.json`:**
```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

### Developer Workflow

**1. Developer creates changeset when making changes:**
```bash
pnpm changeset
```

**Interactive prompt:**
```
What packages would you like to include?
  ✔ @brain-garden/button
  ✔ @brain-garden/input

What kind of change is this for @brain-garden/button?
  ○ patch - bug fixes
  ● minor - new features (backward compatible)
  ○ major - breaking changes

What kind of change is this for @brain-garden/input?
  ● patch - bug fixes
  ○ minor - new features
  ○ major - breaking changes

Please enter a summary for this changeset (this will be in the changelogs):
> Added dark mode support to button and input components
```

**Generated `.changeset/[unique-id].md`:**
```markdown
---
"@brain-garden/button": minor
"@brain-garden/input": patch
---

Added dark mode support to button and input components
```

**2. Commit changeset alongside code:**
```bash
git add .changeset/[unique-id].md src/
git commit -m "feat: add dark mode support"
```

**3. CI creates version PR:**

GitHub Actions detects changesets and creates a PR that:
- Consumes all pending changesets
- Updates package versions (respecting semver)
- Updates CHANGELOG.md files
- Bumps dependent packages automatically

**4. Merge version PR:**

When version PR is merged, GitHub Actions publishes all updated packages to npm.

### GitHub Actions Integration

**Workflow: `.github/workflows/publish-changesets.yml`**
```yaml
name: Publish with Changesets

on:
  push:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: write      # Create version PR
      pull-requests: write # Create/update PR
      id-token: write      # Provenance

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history for changelogs

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20.x'
          registry-url: 'https://registry.npmjs.org'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build packages
        run: pnpm build

      - name: Create Release Pull Request or Publish
        uses: changesets/action@v1
        with:
          # Creates version PR if changesets pending
          # Publishes packages if version PR merged
          version: pnpm changeset version
          publish: pnpm changeset publish
          title: 'chore: version packages'
          commit: 'chore: version packages'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**How It Works:**

1. **Changesets Pending:**
   - Action detects `.changeset/*.md` files
   - Creates/updates "Version Packages" PR
   - PR contains version bumps + CHANGELOG updates

2. **Version PR Merged:**
   - Action detects no pending changesets
   - Runs `pnpm changeset publish`
   - Publishes all updated packages to npm
   - Creates GitHub releases with changelogs

### Advanced Monorepo Patterns

**Pattern: Linked Packages (Always Version Together)**

Use `linked` in `.changeset/config.json` to group packages that should always version together:

```json
{
  "linked": [
    ["@brain-garden/core", "@brain-garden/utils"],
    ["@brain-garden/ui-*"]
  ]
}
```

**Pattern: Fixed Versioning (Monolithic Versioning)**

Use `fixed` to force all packages to share the same version:

```json
{
  "fixed": [
    ["@brain-garden/*"]
  ]
}
```

**Pattern: Internal Dependency Bumping**

Control how internal dependencies are updated:

```json
{
  "updateInternalDependencies": "patch"  // "minor" | "major"
}
```

When `@brain-garden/button@2.0.0` is released, all packages depending on it get a `patch` bump.

---

## 4. Alternative Tools

### Semantic Release

**Pros:**
- Fully automated versioning (no manual changeset creation)
- Conventional commit parsing (`feat:`, `fix:`, `BREAKING:`)
- Zero-config for simple cases

**Cons:**
- Less control over version bumps
- Difficult to coordinate multi-package releases
- Harder to review version changes before publish

**Not Recommended for Brain Garden:** Requires strict conventional commit discipline; changesets provide better control for monorepo coordination.

### Lerna

**Status:** Maintenance mode (replaced by pnpm + changesets + nx)

**Pros:**
- All-in-one monorepo tool (versioning + publishing + workspace management)

**Cons:**
- Development stalled (Nrwl transferred to community in 2022)
- Heavy, opinionated tooling
- Changesets provides better versioning workflow

**Not Recommended:** Use pnpm workspaces + changesets instead.

### pnpm Publish Recursive

**Command:** `pnpm -r publish`

**Pros:**
- Simple, built into pnpm
- No additional tooling

**Cons:**
- No automatic versioning
- No dependency-aware publishing
- No changelog generation
- Manual coordination required

**Use Case:** Only if you have a single package or very simple multi-package repo.

---

## 5. Brain Garden Integration Architecture

### Recommended Workflow

**Phase 1: Component Discovery (Already Researched)**
- Search npm registry before generating
- Prevent duplicate work

**Phase 2: Component Generation**
- Claude Code (primary, unlimited)
- v0.dev (optional, 4-5/day for demos)

**Phase 3: Component Publishing (NEW - GitHub Actions)**
- Developer generates component via Brain Garden
- Brain Garden creates changeset automatically
- Developer reviews and commits changeset
- CI creates version PR
- Developer merges version PR
- CI publishes to npm

### Automated Changeset Creation

**Brain Garden Service: `packages/core-publish/src/changeset.service.ts`**
```typescript
interface ChangesetOptions {
  packages: Array<{
    name: string;          // @brain-garden/button
    bumpType: 'major' | 'minor' | 'patch';
  }>;
  summary: string;         // User-provided or AI-generated
  generator: 'claude-code' | 'v0-dev';
}

export const makeChangesetService = (deps: {
  fs: FileSystem;
  crypto: CryptoService;
}) => ({
  createChangeset: async (options: ChangesetOptions) => {
    // Generate unique changeset ID
    const changesetId = deps.crypto.randomBytes(8).toString('hex');

    // Build frontmatter
    const frontmatter = options.packages
      .map(pkg => `"${pkg.name}": ${pkg.bumpType}`)
      .join('\n');

    // Build changeset file
    const changesetContent = `---\n${frontmatter}\n---\n\n${options.summary}\n\nGenerated by Brain Garden (${options.generator})\n`;

    // Write to .changeset/
    const changesetPath = `.changeset/${changesetId}.md`;
    await deps.fs.writeFile(changesetPath, changesetContent);

    return {
      changesetId,
      changesetPath,
      packages: options.packages,
    };
  },
});
```

**Brain Garden CLI Integration:**
```bash
# After component generation
brain-garden generate button --output packages/ui/components/

# Brain Garden prompts:
# "Component @brain-garden/button generated successfully!"
# "This is a new component. Create changeset?"
#   [Yes] [No] [Customize]

# If "Yes":
# Changeset created: .changeset/a3f2c8d1.md
# - @brain-garden/button: minor (new feature)
#
# Summary: "Add Button component with variants and sizes support"
#
# Next steps:
#   1. Review generated code in packages/ui/components/button/
#   2. Run tests: pnpm test
#   3. Commit changes: git add . && git commit -m "feat: add button component"
#   4. Push to GitHub - CI will create version PR
```

### Publishing Configuration

**Root `package.json` Scripts:**
```json
{
  "scripts": {
    "changeset": "changeset",
    "changeset:version": "changeset version",
    "changeset:publish": "changeset publish",
    "changeset:status": "changeset status"
  }
}
```

**Package-Level `package.json` Publishing Config:**
```json
{
  "name": "@brain-garden/button",
  "version": "1.0.0",
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org"
  },
  "files": [
    "dist",
    "README.md",
    "CHANGELOG.md",
    "package.json"
  ]
}
```

### CI/CD Pipeline

**Full Pipeline: `.github/workflows/ci-cd.yml`**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v3
        with:
          node-version: '20.x'
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build

  publish:
    needs: test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      id-token: write

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: pnpm/action-setup@v2
        with:
          version: 9

      - uses: actions/setup-node@v3
        with:
          node-version: '20.x'
          registry-url: 'https://registry.npmjs.org'
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm build

      - name: Create Release PR or Publish
        uses: changesets/action@v1
        with:
          version: pnpm changeset version
          publish: pnpm changeset publish
          title: 'chore: version packages'
          commit: 'chore: version packages'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## 6. Security Best Practices

### Token Security

**DO:**
- ✅ Use npm granular tokens (package-scoped, time-limited)
- ✅ Store tokens in GitHub Actions secrets (encrypted at rest)
- ✅ Set token expiration to 1 year maximum
- ✅ Enable npm account setting: "Require 2FA or automation token"
- ✅ Use `NODE_AUTH_TOKEN` environment variable (never hardcode)
- ✅ Rotate tokens annually

**DON'T:**
- ❌ Use legacy npm tokens (no scoping, no expiration)
- ❌ Disable 2FA on npm account for automation
- ❌ Store tokens in `.npmrc` files committed to git
- ❌ Share tokens across multiple repositories
- ❌ Use personal tokens for org-wide publishing

### Workflow Security

**Permissions Principle:**
```yaml
permissions:
  contents: read       # Default: read-only
  packages: write      # Only if publishing to GitHub Packages
  pull-requests: write # Only if creating version PRs
  id-token: write      # Only if using provenance
```

**Branch Protection:**
- Require PR reviews before merging to main
- Require status checks (tests, lint, typecheck)
- Prevent force pushes to main
- Enable "Require branches to be up to date before merging"

**Provenance Attestations:**
```yaml
- run: npm publish --provenance --access public
```

Generates cryptographic proof linking published package to:
- Source repository
- Commit SHA
- GitHub Actions workflow
- Build logs

**Verify Provenance:**
```bash
npm info @brain-garden/button --json | jq .dist.integrity
```

---

## 7. Cost Analysis

### GitHub Actions Minutes

**Free Tier:**
- Public repositories: Unlimited minutes
- Private repositories: 2,000 minutes/month

**Paid Tiers:**
- Team: $4/user/month (3,000 minutes)
- Enterprise: $21/user/month (50,000 minutes)

**Brain Garden Usage Estimate:**

Assume:
- 10 component generations per day
- 50% result in npm publish (5/day)
- Each publish workflow takes 5 minutes

**Monthly Usage:**
- 5 publishes/day × 30 days = 150 publishes/month
- 150 publishes × 5 minutes = 750 minutes/month

**Verdict:** Well within free tier (2,000 minutes) for private repos, unlimited for public.

### npm Publishing Costs

**Public Packages:**
- Free (unlimited)

**Scoped Private Packages:**
- $7/user/month for unlimited private packages
- Organization-level billing

**Brain Garden Cost:**
- Public components: $0
- Private team components: $7/user/month

---

## 8. Recommended Architecture for Brain Garden

### Component Publishing Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Developer generates component via Brain Garden CLI       │
│    $ brain-garden generate button                           │
│    → Generates code in packages/ui/components/button/       │
│    → Creates changeset in .changeset/                       │
│    → Prompts: "Review changeset? [Yes] [Edit] [Cancel]"    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Developer reviews generated code & changeset             │
│    $ cat .changeset/a3f2c8d1.md                             │
│    $ git add .                                              │
│    $ git commit -m "feat: add button component"            │
│    $ git push origin feature/button-component               │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. CI runs tests on PR                                      │
│    GitHub Actions: .github/workflows/ci-cd.yml              │
│    → pnpm install                                           │
│    → pnpm lint                                              │
│    → pnpm typecheck                                         │
│    → pnpm test                                              │
│    → pnpm build                                             │
│    Status: ✅ All checks passed                             │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Developer merges PR to main                              │
│    Merge button in GitHub UI                                │
│    → Feature branch merged into main                        │
│    → Triggers publish workflow                              │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Changesets Action creates "Version Packages" PR          │
│    GitHub Actions: changesets/action@v1                     │
│    → Detects pending changeset                              │
│    → Runs `pnpm changeset version`                          │
│    → Updates package.json versions                          │
│    → Updates CHANGELOG.md files                             │
│    → Creates PR: "chore: version packages"                  │
│    PR shows:                                                │
│      - @brain-garden/button: 1.0.0 → 1.1.0                  │
│      - CHANGELOG entry with summary                         │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Maintainer reviews and merges Version PR                 │
│    Review:                                                   │
│    - Version bumps correct?                                 │
│    - CHANGELOG accurate?                                    │
│    - No unintended side effects?                            │
│    Merge: "Version Packages" PR → main                      │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Changesets Action publishes to npm                       │
│    GitHub Actions: changesets/action@v1                     │
│    → No pending changesets detected                         │
│    → Runs `pnpm changeset publish`                          │
│    → Publishes updated packages to npm:                     │
│      - @brain-garden/button@1.1.0                           │
│    → Creates GitHub Release:                                │
│      - Tag: @brain-garden/button@1.1.0                      │
│      - Release notes from CHANGELOG                         │
│    Status: ✅ Published successfully                         │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. Component available on npm                               │
│    Users can now:                                           │
│    $ npm install @brain-garden/button@1.1.0                 │
│    $ pnpm add @brain-garden/button@1.1.0                    │
│                                                             │
│    Brain Garden can discover:                               │
│    $ brain-garden search button                             │
│    Found: @brain-garden/button@1.1.0 (published 2 min ago) │
└─────────────────────────────────────────────────────────────┘
```

### Configuration Files

**`.changeset/config.json`:**
```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["@brain-garden/docs", "@brain-garden/playground"]
}
```

**`.github/workflows/publish.yml`:**
```yaml
name: Publish

on:
  push:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v3
        with:
          node-version: '20.x'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build

  publish:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      id-token: write

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: pnpm/action-setup@v2
        with:
          version: 9

      - uses: actions/setup-node@v3
        with:
          node-version: '20.x'
          registry-url: 'https://registry.npmjs.org'
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm build

      - name: Create Release PR or Publish
        uses: changesets/action@v1
        with:
          version: pnpm changeset version
          publish: pnpm changeset publish
          title: 'chore: version packages'
          commit: 'chore: version packages'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Package `package.json` (publishable):**
```json
{
  "name": "@brain-garden/button",
  "version": "1.0.0",
  "description": "AI-generated button component with variants and sizes",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "README.md",
    "CHANGELOG.md"
  ],
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org",
    "provenance": true
  },
  "keywords": [
    "brain-garden",
    "ai-generated",
    "react",
    "button",
    "component"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/brain-garden/monorepo",
    "directory": "packages/ui/components/button"
  },
  "bugs": "https://github.com/brain-garden/monorepo/issues",
  "homepage": "https://github.com/brain-garden/monorepo/tree/main/packages/ui/components/button"
}
```

---

## 9. Testing Strategy

### Local Testing (Before Pushing)

**1. Test Changeset Creation:**
```bash
# Create test changeset
pnpm changeset

# Verify changeset file
cat .changeset/*.md

# Test version command (dry run)
pnpm changeset version

# Verify package.json and CHANGELOG updates
git diff
```

**2. Test Publishing (Dry Run):**
```bash
# Build packages
pnpm build

# Test publish (without actually publishing)
pnpm changeset publish --dry-run

# Expected output:
# 🦋  info npm info @brain-garden/button
# 🦋  info Publishing "@brain-garden/button" at "1.1.0"
# 🦋  success packages published successfully (dry run)
```

**3. Revert Test Changes:**
```bash
git reset --hard HEAD
rm .changeset/*.md
```

### CI Testing (GitHub Actions)

**Test Workflow in Fork:**
1. Fork Brain Garden monorepo to personal account
2. Add `NPM_TOKEN` secret (create test npm org: `@your-username-test`)
3. Push test branch
4. Verify CI runs successfully
5. Verify version PR created
6. Merge version PR
7. Verify publish succeeds

**Expected CI Behavior:**

**PR to Main:**
```
✅ Run tests (5 min)
   - Lint: passed
   - Typecheck: passed
   - Unit tests: passed
   - Build: passed
```

**Merge to Main (with changeset):**
```
✅ Run tests (5 min)
✅ Create version PR (1 min)
   - PR title: "chore: version packages"
   - Files changed: package.json, CHANGELOG.md, .changeset/*.md (deleted)
```

**Merge Version PR:**
```
✅ Run tests (5 min)
✅ Publish to npm (2 min)
   - Published: @brain-garden/button@1.1.0
   - Created GitHub Release
   - Status: Success
```

---

## 10. Troubleshooting

### Common Issues

**Issue 1: Version PR Not Created**

**Symptoms:**
- Changesets exist in `.changeset/` folder
- Pushed to main branch
- GitHub Actions workflow runs but no PR created

**Diagnosis:**
```bash
# Check changeset status
pnpm changeset status

# Expected output:
# 🦋  info The following packages are set to be published:
# 🦋  info  - @brain-garden/button@minor
```

**Solution:**
1. Verify `GITHUB_TOKEN` has `contents: write` and `pull-requests: write` permissions
2. Check workflow logs for permission errors
3. Ensure changesets action version is `v1` (not `v0`)

**Issue 2: Publish Fails with "Cannot publish over existing version"**

**Symptoms:**
- Version PR merged successfully
- Publish step fails with error:
  ```
  npm ERR! code E403
  npm ERR! 403 403 Forbidden - PUT https://registry.npmjs.org/@brain-garden%2fbutton - You cannot publish over the previously published versions: 1.1.0.
  ```

**Diagnosis:**
Package was already published at this version (possibly manual publish or duplicate workflow run).

**Solution:**
1. Check npm registry: `npm view @brain-garden/button`
2. If version already exists, manually bump version in `package.json`
3. Create new changeset: `pnpm changeset`
4. Commit and push

**Issue 3: NPM_TOKEN Invalid or Expired**

**Symptoms:**
```
npm ERR! code E401
npm ERR! 401 Unauthorized - PUT https://registry.npmjs.org/@brain-garden%2fbutton
```

**Diagnosis:**
Token expired, revoked, or has insufficient permissions.

**Solution:**
1. Log into npmjs.com
2. Navigate to Access Tokens → Granular Access Tokens
3. Check token expiration date
4. Regenerate token with:
   - **Expiration**: 1 year from now
   - **Permissions**: Read and write
   - **Packages**: Select specific package or "All packages"
5. Update GitHub Actions secret `NPM_TOKEN`
6. Re-run workflow

**Issue 4: Build Failures Before Publish**

**Symptoms:**
```
✅ Run tests
❌ Create Release PR or Publish
   Error: Command failed: pnpm build
```

**Diagnosis:**
Build step fails during changesets action.

**Solution:**
1. Ensure all packages have `build` script in `package.json`
2. OR remove `pnpm build` from changesets action if packages don't require build step
3. Verify build works locally: `pnpm build`

---

## 11. Migration Guide

### From Manual Publishing to Changesets + GitHub Actions

**Step 1: Install Changesets**
```bash
pnpm add -D @changesets/cli
pnpm changeset init
```

**Step 2: Configure Changesets**

Edit `.changeset/config.json`:
```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

**Step 3: Add Package Scripts**

In root `package.json`:
```json
{
  "scripts": {
    "changeset": "changeset",
    "changeset:version": "changeset version",
    "changeset:publish": "changeset publish"
  }
}
```

**Step 4: Create npm Token**

1. Go to npmjs.com → Profile → Access Tokens → Generate New Token → Granular Access Token
2. Configure:
   - **Name**: "Brain Garden GitHub Actions"
   - **Expiration**: 1 year from now
   - **Permissions**: Read and write
   - **Packages**: Select organization packages
3. Copy token (starts with `npm_`)
4. Store in GitHub Actions secrets as `NPM_TOKEN`

**Step 5: Create GitHub Actions Workflow**

Create `.github/workflows/publish.yml` (see full workflow in Section 8).

**Step 6: Test Locally**
```bash
# Create test changeset
pnpm changeset

# Version packages (dry run)
pnpm changeset version
git diff

# Publish (dry run)
pnpm changeset publish --dry-run

# Cleanup
git reset --hard HEAD
```

**Step 7: Test in CI**

1. Create test branch with changeset
2. Push to GitHub
3. Verify workflow runs
4. Merge PR to main
5. Verify version PR created
6. Merge version PR
7. Verify publish succeeds

**Step 8: Document Workflow**

Add to `CONTRIBUTING.md`:
```markdown
## Publishing Workflow

1. Make your changes
2. Create changeset: `pnpm changeset`
3. Commit changeset alongside code
4. Push to GitHub and create PR
5. After PR merged, CI creates version PR automatically
6. Review and merge version PR
7. CI publishes packages to npm automatically
```

---

## 12. Conclusion

### Summary

GitHub Actions provides production-ready CI/CD for npm package publishing with:
- ✅ **Native npm Integration**: First-class support via `setup-node` action
- ✅ **Granular Security**: Package-scoped, time-limited npm tokens
- ✅ **Provenance**: Cryptographic attestations linking packages to source
- ✅ **Multi-Registry**: Publish to npm, GitHub Packages, private registries
- ✅ **Monorepo Support**: Excellent via changesets (industry-standard)
- ✅ **Zero Cost**: Unlimited minutes for public repos, 2,000 min/month for private

### Recommended Stack for Brain Garden

**Versioning & Publishing:**
- **@changesets/cli**: Manage versions, changelogs, publishing
- **changesets/action**: GitHub Actions integration

**CI/CD:**
- **GitHub Actions**: Automated testing, versioning, publishing
- **pnpm**: Fast, efficient package manager

**Security:**
- **npm Granular Tokens**: Package-scoped, expiring, read/write permissions
- **Provenance**: `--provenance` flag for supply chain security
- **Branch Protection**: PR reviews, status checks, up-to-date requirements

**Developer Experience:**
- **Automated Version PRs**: No manual version bumping
- **Automated Publishing**: Merge version PR → auto-publish
- **Clear Changelog**: Generated from changeset summaries
- **GitHub Releases**: Auto-created with changelogs

### Next Steps

**Proceed to Checkpoint 015:**
- Research Vercel/Netlify deployment APIs for automated component demo deployments
- Integrate with v0.dev live demo URLs
- Enable one-click deployment of generated components

**Status:** GitHub Actions validated as excellent CI/CD foundation for Brain Garden component publishing. Changesets provides industry-standard monorepo versioning workflow. Recommend implementing automated changeset creation in Brain Garden CLI (see Section 5 code examples).

---

**Related Documents:**
- Checkpoint 010: [v0.dev API Access Research](./v0-dev-api-test-results.md)
- Checkpoint 011: [v0.dev Component Generation](./v0-dev-api-test-results.md)
- Checkpoint 012: [v0.dev Performance Results](./v0-dev-api-performance-results.md)
- Checkpoint 013: [npm Registry Integration](./npm-registry-integration-research.md)

**External References:**
- [GitHub Actions: Publishing Node.js Packages](https://docs.github.com/actions/publishing-packages/publishing-nodejs-packages)
- [Changesets Documentation](https://github.com/changesets/changesets)
- [npm Granular Tokens](https://docs.npmjs.com/about-access-tokens)
- [Provenance Attestations](https://docs.npmjs.com/generating-provenance-statements)
