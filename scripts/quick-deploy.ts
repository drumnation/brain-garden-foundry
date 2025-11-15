#!/usr/bin/env tsx
/**
 * Quick Deploy Script - One command deployment for Brain Garden template
 *
 * Usage:
 *   pnpm deploy:quick
 *
 * This script:
 * 1. Checks prerequisites
 * 2. Runs deploy:init with smart defaults
 * 3. Runs initial migration
 * 4. Shows success message with URLs
 */

import { execSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import ora from 'ora';

// ASCII Art Banner
const banner = `
${chalk.cyan('╔══════════════════════════════════════════════════════╗')}
${chalk.cyan('║')}                                                      ${chalk.cyan('║')}
${chalk.cyan('║')}    🚀 ${chalk.bold.white('BRAIN GARDEN QUICK DEPLOY')}                  ${chalk.cyan('║')}
${chalk.cyan('║')}       Zero to Production in 5 Minutes               ${chalk.cyan('║')}
${chalk.cyan('║')}                                                      ${chalk.cyan('║')}
${chalk.cyan('╚══════════════════════════════════════════════════════╝')}
`;

async function main() {
  console.clear();
  console.log(banner);

  const projectName = path.basename(process.cwd());
  const deployConfigPath = path.join(process.cwd(), '.deploy', 'config.json');

  // Check if already deployed
  const alreadyDeployed = await fs.access(deployConfigPath).then(() => true).catch(() => false);

  if (alreadyDeployed) {
    console.log(chalk.yellow('\n⚠️  Project already deployed!\n'));
    console.log(chalk.gray('Run these commands to manage your deployment:'));
    console.log(chalk.cyan('  pnpm deploy:status') + '  - Check deployment health');
    console.log(chalk.cyan('  pnpm deploy:sync') + '    - Sync with latest code');
    console.log(chalk.cyan('  pnpm deploy:destroy') + ' - Teardown deployment\n');
    process.exit(0);
  }

  console.log(chalk.bold('\n📋 Pre-flight Checks\n'));

  // Check Node.js version
  const nodeSpinner = ora('Checking Node.js version').start();
  const nodeVersion = process.versions.node;
  const majorVersion = parseInt(nodeVersion.split('.')[0]);
  if (majorVersion >= 18) {
    nodeSpinner.succeed(`Node.js ${nodeVersion} ✓`);
  } else {
    nodeSpinner.fail(`Node.js ${nodeVersion} (requires 18+)`);
    process.exit(1);
  }

  // Check pnpm
  const pnpmSpinner = ora('Checking pnpm').start();
  try {
    execSync('pnpm --version', { stdio: 'ignore' });
    pnpmSpinner.succeed('pnpm installed ✓');
  } catch {
    pnpmSpinner.fail('pnpm not found');
    console.log(chalk.gray('\nInstall pnpm: npm install -g pnpm'));
    process.exit(1);
  }

  // Check git
  const gitSpinner = ora('Checking git').start();
  try {
    execSync('git --version', { stdio: 'ignore' });
    gitSpinner.succeed('git installed ✓');
  } catch {
    gitSpinner.fail('git not found');
    process.exit(1);
  }

  console.log(chalk.bold('\n🎯 Deployment Configuration\n'));
  console.log(chalk.gray(`  Project Name:    ${chalk.white(projectName)}`));
  console.log(chalk.gray(`  Environment:     ${chalk.white('production')}`));
  console.log(chalk.gray(`  Appwrite:        ${chalk.white('https://appwrite.singularity-labs.org')}`));
  console.log(chalk.gray(`  Production URL:  ${chalk.white(`https://${projectName}.singularity-labs.org`)}`));
  console.log(chalk.gray(`  Preview URLs:    ${chalk.white(`https://pr-*.${projectName}.singularity-labs.org`)}`));

  console.log(chalk.bold('\n🚀 Starting Deployment\n'));

  const steps = [
    {
      name: 'Installing dependencies',
      command: 'pnpm install --silent',
      essential: true,
    },
    {
      name: 'Initializing deployment',
      command: `pnpm deploy:init --project ${projectName} --no-interactive`,
      essential: true,
    },
    {
      name: 'Running database migrations',
      command: 'pnpm deploy:sync --migrations',
      essential: true,
    },
    {
      name: 'Setting up GitHub Actions',
      command: 'git add .github/workflows && git commit -m "feat: add deployment workflow" || true',
      essential: false,
    },
    {
      name: 'Checking deployment status',
      command: 'pnpm deploy:status',
      essential: false,
    },
  ];

  let failed = false;

  for (const step of steps) {
    const spinner = ora(step.name).start();
    try {
      execSync(step.command, {
        cwd: process.cwd(),
        stdio: 'ignore',
        env: {
          ...process.env,
          CI: 'true', // Suppress interactive prompts
        },
      });
      spinner.succeed();
    } catch (error) {
      if (step.essential) {
        spinner.fail();
        console.error(chalk.red(`\n❌ Deployment failed at: ${step.name}`));
        console.error(chalk.gray('\nRun with verbose output for details:'));
        console.error(chalk.cyan(`  ${step.command}`));
        failed = true;
        break;
      } else {
        spinner.warn(`${step.name} (non-critical)`);
      }
    }
  }

  if (failed) {
    console.log(chalk.red.bold('\n❌ Deployment Failed\n'));
    console.log(chalk.gray('Troubleshooting:'));
    console.log(chalk.gray('  1. Check your internet connection'));
    console.log(chalk.gray('  2. Ensure Appwrite is accessible'));
    console.log(chalk.gray('  3. Try running: pnpm deploy:init'));
    process.exit(1);
  }

  // Success!
  console.log(chalk.green.bold('\n🎉 Deployment Complete!\n'));

  // Load config to show actual URLs
  try {
    const config = JSON.parse(await fs.readFile(deployConfigPath, 'utf-8'));

    console.log(chalk.bold('📍 Your Application URLs:'));
    console.log(chalk.gray('  Production:  ') + chalk.cyan(`https://${config.domains.production}`));
    console.log(chalk.gray('  Preview:     ') + chalk.cyan(`https://${config.domains.preview}`));
    console.log(chalk.gray('  Appwrite:    ') + chalk.cyan(config.appwrite.endpoint));
    console.log(chalk.gray('  Project ID:  ') + chalk.white(config.appwrite.projectId));

    console.log(chalk.bold('\n📚 Next Steps:'));
    console.log(chalk.gray('  1. ' + chalk.cyan('git push') + ' to deploy your code'));
    console.log(chalk.gray('  2. Create a PR to see preview deployments'));
    console.log(chalk.gray('  3. Visit your Appwrite console to manage data'));

    console.log(chalk.bold('\n🔧 Useful Commands:'));
    console.log(chalk.gray('  ' + chalk.cyan('pnpm deploy:status') + '  - Check deployment health'));
    console.log(chalk.gray('  ' + chalk.cyan('pnpm deploy:sync') + '    - Sync database schema'));
    console.log(chalk.gray('  ' + chalk.cyan('pnpm dev') + '            - Start local development'));
    console.log(chalk.gray('  ' + chalk.cyan('pnpm storybook') + '      - Open component library'));
  } catch (error) {
    // Config might not be fully written yet
    console.log(chalk.bold('📚 Next Steps:'));
    console.log(chalk.gray('  1. Run ' + chalk.cyan('pnpm deploy:status') + ' to verify deployment'));
    console.log(chalk.gray('  2. Run ' + chalk.cyan('git push') + ' to trigger CI/CD'));
    console.log(chalk.gray('  3. Create a PR to test preview deployments'));
  }

  console.log(chalk.dim('\n─'.repeat(56)));
  console.log(chalk.dim.italic('  Built with Brain Garden - AI-Powered DevOps'));
  console.log(chalk.dim('─'.repeat(56) + '\n'));
}

// Run the script
main().catch(error => {
  console.error(chalk.red('Unexpected error:'), error);
  process.exit(1);
});