#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { deployInitCommand } from './commands/deploy-init.js';
import { deploySyncCommand } from './commands/deploy-sync.js';
import { deployStatusCommand } from './commands/deploy-status.js';
import { deployDestroyCommand } from './commands/deploy-destroy.js';

const program = new Command();

// ASCII Art Banner
const banner = `
${chalk.cyan('╔══════════════════════════════════════════╗')}
${chalk.cyan('║')}  🚀 ${chalk.bold('Brain Garden Deploy CLI')}           ${chalk.cyan('║')}
${chalk.cyan('║')}     Effortless Deployment System        ${chalk.cyan('║')}
${chalk.cyan('╚══════════════════════════════════════════╝')}
`;

console.log(banner);

program
  .name('brain-deploy')
  .description('Effortless deployment for Brain Garden monorepo template')
  .version('1.0.0');

// Main deploy:init command
program
  .command('init')
  .description('Initialize a new deployment from template')
  .option('-p, --project <name>', 'Project name')
  .option('-e, --endpoint <url>', 'Appwrite endpoint', 'https://appwrite.singularity-labs.org')
  .option('--no-interactive', 'Skip interactive prompts')
  .option('--dry-run', 'Preview changes without applying')
  .action(deployInitCommand);

// Deploy sync command
program
  .command('sync')
  .description('Sync infrastructure with current codebase')
  .option('--migrations', 'Run pending migrations')
  .option('--force', 'Force sync even with conflicts')
  .action(deploySyncCommand);

// Deploy status command
program
  .command('status')
  .description('Check deployment health and status')
  .option('--verbose', 'Show detailed status information')
  .option('--json', 'Output as JSON')
  .action(deployStatusCommand);

// Deploy destroy command
program
  .command('destroy')
  .description('Teardown deployment and clean up resources')
  .option('--project <name>', 'Project name to destroy')
  .option('--force', 'Skip confirmation prompt')
  .option('--keep-data', 'Preserve database data')
  .action(deployDestroyCommand);

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}