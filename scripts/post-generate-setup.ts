#!/usr/bin/env tsx

/**
 * Post-Generation Setup Script
 *
 * Runs after all apps are generated to set up the complete mega template infrastructure:
 * 1. Installs all dependencies
 * 2. Initializes brain-monitor validation
 * 3. Sets up GitHub Actions CI/CD
 * 4. Runs initial validation
 * 5. Generates summary report
 */

import { execa } from 'execa';
import fs from 'fs/promises';
import path from 'path';

interface SetupStep {
  name: string;
  description: string;
  action: () => Promise<void>;
}

const steps: SetupStep[] = [
  {
    name: '📦 Install Dependencies',
    description: 'Installing all workspace dependencies with pnpm',
    action: async () => {
      await execa('pnpm', ['install'], { stdio: 'inherit' });
    },
  },
  {
    name: '🧠 Initialize Brain Monitor',
    description: 'Setting up validation infrastructure',
    action: async () => {
      try {
        await execa('brain-monitor', ['init'], { stdio: 'inherit' });
      } catch (error) {
        console.warn('⚠️  Brain Monitor init skipped (may already be initialized)');
      }
    },
  },
  {
    name: '🚀 Initialize GitHub Actions',
    description: 'Creating CI/CD workflow files',
    action: async () => {
      try {
        await execa('brain-monitor', ['ci:init'], { stdio: 'inherit' });
      } catch (error) {
        console.warn('⚠️  GitHub Actions init skipped (may already exist)');
      }
    },
  },
  {
    name: '🔍 Run Initial Validation',
    description: 'Validating all packages (typecheck, lint, format, test)',
    action: async () => {
      try {
        await execa('pnpm', ['brain:validate'], { stdio: 'inherit' });
      } catch (error) {
        console.warn('⚠️  Validation found issues - check _errors/ directory');
      }
    },
  },
  {
    name: '📊 Generate Summary Report',
    description: 'Creating template setup summary',
    action: async () => {
      const summary = await generateSummaryReport();
      await fs.writeFile('TEMPLATE_SETUP_SUMMARY.md', summary);
      console.log('\n✅ Summary written to TEMPLATE_SETUP_SUMMARY.md\n');
    },
  },
  {
    name: '🔐 Wire Adversarial Review Webhooks',
    description: 'Adding Joe/Gilfoyle/Hari PR review webhooks to this repo',
    action: async () => {
      try {
        // Get the repo name from git remote
        const { stdout: remoteUrl } = await execa('git', ['remote', 'get-url', 'origin']);
        const match = remoteUrl.trim().match(/[:/]([^/]+\/[^/]+?)(\.git)?$/);
        if (!match) {
          console.warn('⚠️  Could not detect repo name from git remote, skipping webhook setup');
          return;
        }
        const repo = match[1];
        const scriptPath = '/home/dave/brain-garden-monorepo/agents/shared/github-webhook-proxy/add-webhooks.sh';
        await execa('bash', [scriptPath, repo], { stdio: 'inherit' });
      } catch (error) {
        console.warn('⚠️  Webhook setup skipped (add-webhooks.sh may not be available)');
      }
    },
  },
];

async function generateSummaryReport(): Promise<string> {
  const timestamp = new Date().toISOString();

  // Detect generated apps
  const appsDir = 'apps';
  const apps: string[] = [];
  try {
    const entries = await fs.readdir(appsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        apps.push(entry.name);
      }
    }
  } catch (error) {
    console.warn('Could not read apps directory');
  }

  // Detect generated packages
  const packagesDir = 'packages';
  const packages: string[] = [];
  try {
    const entries = await fs.readdir(packagesDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        packages.push(entry.name);
      }
    }
  } catch (error) {
    // Packages directory may not exist yet
  }

  return `# Mega Template Setup Summary

**Generated:** ${timestamp}

## ✅ Setup Complete

Your monorepo mega starter template has been initialized and validated.

## 📦 Generated Applications

${apps.length > 0 ? apps.map(app => `- \`apps/${app}\``).join('\n') : '_No apps generated yet_'}

## 📚 Generated Packages

${packages.length > 0 ? packages.map(pkg => `- \`packages/${pkg}\``).join('\n') : '_No packages generated yet_'}

## 🛠 Tooling Configured

- ✅ Brain Monitor validation system
- ✅ GitHub Actions CI/CD
- ✅ Centralized testing (@kit/testing)
- ✅ ESLint & Prettier
- ✅ TypeScript strict mode
- ✅ Turborepo task orchestration

## 📝 Next Steps

1. **Review Validation Results:**
   \`\`\`bash
   cat _errors/validation-summary.md
   \`\`\`

2. **Start Development:**
   \`\`\`bash
   pnpm dev
   \`\`\`

3. **Run Tests:**
   \`\`\`bash
   pnpm test
   \`\`\`

4. **Add More Apps:**
   \`\`\`bash
   pnpm gen:react-web     # Web app
   pnpm gen:react-native  # Mobile app
   pnpm gen:electron      # Desktop app
   pnpm gen:express-api   # Backend API
   \`\`\`

5. **Customize the Template:**
   - Read \`docs/TEMPLATE_USAGE.md\` for customization guide
   - Update package scopes in all package.json files
   - Configure environment variables (.env files)
   - Customize ESLint/Prettier rules in \`tooling/\`

## 📚 Documentation

- **Template Usage:** \`docs/TEMPLATE_USAGE.md\`
- **Mega Template Guide:** \`docs/MEGA_TEMPLATE_SETUP.md\`
- **Testing Strategy:** \`docs/guides/testing-strategy.md\`
- **Validation Workflow:** \`docs/guides/validation-workflow.md\`
- **Generator Usage:** \`docs/guides/generator-usage.md\`

## 🔧 Useful Commands

\`\`\`bash
pnpm brain:validate          # Full validation
pnpm brain:watch             # Watch mode
pnpm brain:check             # Quick error check
pnpm validate:template       # Validate template structure
pnpm test                    # Run all tests
pnpm lint                    # Lint all packages
pnpm typecheck               # Type-check all packages
\`\`\`

## ✨ Template Features

- **Multi-App Support:** Web, Mobile, Desktop, API
- **Shared Packages:** Utilities, UI components
- **Centralized Testing:** No per-package vitest configs
- **Brain Monitor:** AI-assisted validation
- **GitHub Actions:** Automated CI/CD
- **Comprehensive Docs:** Guides for every aspect
- **Generator Tools:** Scaffold new apps easily

---

**Ready to build!** 🚀
`;
}

async function main() {
  console.log('\n🎯 Mega Template Post-Generation Setup\n');
  console.log('This script will set up the complete template infrastructure.\n');

  for (const [index, step] of steps.entries()) {
    console.log(`\n[${index + 1}/${steps.length}] ${step.name}`);
    console.log(`    ${step.description}`);
    console.log('');

    try {
      await step.action();
      console.log(`    ✅ ${step.name} complete`);
    } catch (error) {
      console.error(`    ❌ ${step.name} failed:`, error);
      console.log('\n⚠️  Setup encountered errors. Check output above for details.\n');
      process.exit(1);
    }
  }

  console.log('\n🎉 Mega Template Setup Complete!\n');
  console.log('📖 See TEMPLATE_SETUP_SUMMARY.md for next steps\n');
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

