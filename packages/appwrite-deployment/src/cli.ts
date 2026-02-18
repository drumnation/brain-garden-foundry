#!/usr/bin/env node

import chalk from 'chalk';
import {execSync} from 'child_process';
import {program} from 'commander';
import fs from 'fs';
import ora from 'ora';
import path from 'path';
import {AppwriteDeploymentClient} from './appwrite-client';

/**
 * Brain Garden Appwrite Deployment CLI
 * ONE COMMAND to deploy to REAL infrastructure
 */

program
  .name('brain-garden-deploy')
  .description('Deploy Brain Garden template to Appwrite infrastructure')
  .version('1.0.0');

program
  .command('provision')
  .description('Provision Appwrite resources for a new project')
  .argument('<project-name>', 'Name of your project')
  .option(
    '--api-key <key>',
    'Appwrite API key (or set APPWRITE_API_KEY env var)',
  )
  .action(async (projectName: string, options: any) => {
    console.log(chalk.blue.bold('\n🚀 Brain Garden Deployment System\n'));
    console.log(chalk.gray('━'.repeat(50)));
    console.log(chalk.white(`Project: ${chalk.cyan(projectName)}`));
    console.log(
      chalk.white(`Target: ${chalk.cyan('appwrite.singularity-labs.org')}`),
    );
    console.log(chalk.gray('━'.repeat(50) + '\n'));

    const apiKey = options.apiKey || process.env.APPWRITE_API_KEY;

    if (!apiKey) {
      console.error(chalk.red('\n❌ Error: Appwrite API key required'));
      console.log(chalk.yellow('\nProvide API key via:'));
      console.log(chalk.gray('  --api-key <key>     CLI option'));
      console.log(chalk.gray('  APPWRITE_API_KEY   Environment variable'));
      console.log('\nGet your API key from:');
      console.log(
        chalk.cyan('  https://appwrite.singularity-labs.org/console'),
      );
      process.exit(1);
    }

    const spinner = ora('Connecting to Appwrite...').start();

    try {
      // Create client with real credentials
      const client = new AppwriteDeploymentClient({
        projectName,
        apiKey,
      });

      // Test connection
      spinner.text = 'Testing connection to Appwrite...';
      const connected = await client.testConnection();

      if (!connected) {
        spinner.fail('Failed to connect to Appwrite');
        console.error(chalk.red('\nCheck your API key and network connection'));
        process.exit(1);
      }

      spinner.succeed('Connected to Appwrite');

      // Provision resources
      spinner.start('Provisioning Appwrite resources...');
      const result = await client.provisionDeployment(projectName);

      if (!result.success) {
        spinner.fail('Provisioning failed');
        process.exit(1);
      }

      spinner.succeed('Resources provisioned successfully');

      // Write .env file
      spinner.start('Creating .env file...');
      const envContent = Object.entries(result.envVars)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

      fs.writeFileSync('.env', envContent);
      fs.writeFileSync('.env.local', envContent); // For Vite
      spinner.succeed('Environment variables saved');

      // Save deployment config
      spinner.start('Saving deployment configuration...');
      const configPath = path.join(process.cwd(), 'appwrite-deployment.json');
      fs.writeFileSync(configPath, JSON.stringify(result.config, null, 2));
      spinner.succeed('Configuration saved to appwrite-deployment.json');

      // Success!
      console.log(
        chalk.green.bold('\n✅ Deployment Provisioned Successfully!\n'),
      );
      console.log(chalk.gray('━'.repeat(50)));
      console.log(chalk.white('Resources created:'));
      console.log(chalk.gray(`  Database:  ${result.config.databaseId}`));
      console.log(chalk.gray(`  Storage:   ${result.config.bucketId}`));
      console.log(chalk.gray(`  Endpoint:  ${result.config.endpoint}`));
      console.log(chalk.gray('━'.repeat(50)));

      console.log(chalk.white('\n📝 Next steps:\n'));
      console.log(chalk.gray('  1. Install dependencies:'));
      console.log(chalk.cyan('     pnpm install'));
      console.log(chalk.gray('\n  2. Start development:'));
      console.log(chalk.cyan('     pnpm dev'));
      console.log(chalk.gray('\n  3. Deploy to production:'));
      console.log(chalk.cyan(`     pnpm deploy`));
      console.log(chalk.gray('\n  4. Access Appwrite console:'));
      console.log(
        chalk.cyan('     https://appwrite.singularity-labs.org/console'),
      );
      console.log();
    } catch (error) {
      spinner.fail('Deployment failed');
      console.error(chalk.red('\nError details:'), error);
      process.exit(1);
    }
  });

program
  .command('deploy')
  .description('Deploy application to VPS with GitHub Actions')
  .argument('<project-name>', 'Name of your project')
  .option('--repo <url>', 'GitHub repository URL')
  .action(async (projectName: string, options: any) => {
    console.log(chalk.blue.bold('\n🚀 Deploying to Production\n'));

    const spinner = ora('Setting up deployment...').start();

    try {
      // Check if we're in a git repo
      try {
        execSync('git status', {stdio: 'ignore'});
      } catch {
        spinner.fail('Not a git repository');
        console.log(chalk.yellow('\nInitialize git first:'));
        console.log(chalk.cyan('  git init'));
        console.log(chalk.cyan('  git add .'));
        console.log(chalk.cyan('  git commit -m "Initial commit"'));
        process.exit(1);
      }

      spinner.succeed('Git repository detected');

      // Get repo URL
      let repoUrl = options.repo;
      if (!repoUrl) {
        try {
          repoUrl = execSync('git remote get-url origin', {
            encoding: 'utf-8',
          }).trim();
        } catch {
          spinner.fail('No GitHub remote found');
          console.log(chalk.yellow('\nAdd GitHub remote:'));
          console.log(chalk.cyan('  git remote add origin <github-url>'));
          process.exit(1);
        }
      }

      // Extract repo info
      const repoMatch = repoUrl.match(/github\.com[:/]([^/]+)\/(.+?)(\.git)?$/);
      if (!repoMatch) {
        spinner.fail('Invalid GitHub repository URL');
        process.exit(1);
      }

      const [, owner, repo] = repoMatch;
      const repoFullName = `${owner}/${repo}`;

      spinner.text = 'Creating deployment workflow...';

      // Create GitHub Actions workflow
      const workflowDir = path.join(process.cwd(), '.github', 'workflows');
      fs.mkdirSync(workflowDir, {recursive: true});

      const workflowContent = generateWorkflow(projectName, repoFullName);
      const workflowPath = path.join(workflowDir, 'deploy-appwrite.yml');
      fs.writeFileSync(workflowPath, workflowContent);

      spinner.succeed('Workflow created');

      // Instructions for secrets
      console.log(chalk.green.bold('\n✅ Deployment Setup Complete!\n'));
      console.log(chalk.gray('━'.repeat(50)));
      console.log(chalk.white('Repository: ') + chalk.cyan(repoFullName));
      console.log(chalk.white('Project: ') + chalk.cyan(projectName));
      console.log(chalk.gray('━'.repeat(50)));

      console.log(chalk.white('\n📝 Add GitHub Secrets:\n'));
      console.log(
        chalk.gray('Go to: ') +
          chalk.cyan(
            `https://github.com/${repoFullName}/settings/secrets/actions`,
          ),
      );
      console.log(chalk.gray('\nAdd these secrets:'));
      console.log(
        chalk.yellow('  VPS_SSH_KEY') +
          chalk.gray(' - SSH private key for VPS'),
      );
      console.log(
        chalk.yellow('  CLOUDFLARE_API_TOKEN') +
          chalk.gray(' - Your Cloudflare API token'),
      );
      console.log(
        chalk.yellow('  CLOUDFLARE_ZONE_ID') +
          chalk.gray(' - Zone ID for singularity-labs.org'),
      );

      console.log(chalk.white('\n🚀 Deploy:\n'));
      console.log(chalk.gray('  1. Commit workflow:'));
      console.log(
        chalk.cyan('     git add .github/workflows/deploy-appwrite.yml'),
      );
      console.log(chalk.cyan('     git commit -m "Add deployment workflow"'));
      console.log(chalk.gray('\n  2. Push to GitHub:'));
      console.log(chalk.cyan('     git push origin main'));
      console.log(chalk.gray('\n  3. View deployment:'));
      console.log(
        chalk.cyan(`     https://github.com/${repoFullName}/actions`),
      );
      console.log();
    } catch (error) {
      spinner.fail('Deployment setup failed');
      console.error(chalk.red('\nError:'), error);
      process.exit(1);
    }
  });

program
  .command('test')
  .description('Test Appwrite connection')
  .option('--api-key <key>', 'Appwrite API key')
  .action(async (options: any) => {
    console.log(chalk.blue.bold('\n🔌 Testing Appwrite Connection\n'));

    const apiKey = options.apiKey || process.env.APPWRITE_API_KEY;

    const client = new AppwriteDeploymentClient({
      projectName: 'test',
      apiKey,
    });

    const spinner = ora('Connecting to Appwrite...').start();

    const connected = await client.testConnection();

    if (connected) {
      spinner.succeed('Successfully connected to Appwrite!');
      console.log(
        chalk.gray('\nEndpoint: ') +
          chalk.cyan('https://appwrite.singularity-labs.org'),
      );
      console.log(chalk.gray('Status: ') + chalk.green('Online'));
    } else {
      spinner.fail('Failed to connect to Appwrite');
      console.log(chalk.yellow('\nCheck:'));
      console.log(chalk.gray('  - API key is valid'));
      console.log(chalk.gray('  - Network connection'));
      console.log(chalk.gray('  - Appwrite is running'));
    }
  });

// Helper function to generate workflow
function generateWorkflow(projectName: string, repoFullName: string): string {
  return `name: Deploy to Appwrite Infrastructure

on:
  push:
    branches: [main]
  pull_request:
    types: [opened, synchronize, reopened]

env:
  VPS_HOST: 140.82.14.49
  VPS_USER: root
  PROJECT_NAME: ${projectName}
  APPWRITE_ENDPOINT: https://appwrite.singularity-labs.org/v1
  APPWRITE_PROJECT_ID: 6917d0a50033ebe8d013

jobs:
  deploy:
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

      - name: Build application
        run: pnpm build
        env:
          VITE_APPWRITE_ENDPOINT: \${{ env.APPWRITE_ENDPOINT }}
          VITE_APPWRITE_PROJECT_ID: \${{ env.APPWRITE_PROJECT_ID }}

      - name: Deploy to VPS
        uses: appleboy/scp-action@master
        with:
          host: \${{ env.VPS_HOST }}
          username: \${{ env.VPS_USER }}
          key: \${{ secrets.VPS_SSH_KEY }}
          source: "dist/*"
          target: "/opt/deployments/\${{ env.PROJECT_NAME }}/production/"
          strip_components: 1

      - name: Setup Traefik routing
        uses: appleboy/ssh-action@master
        with:
          host: \${{ env.VPS_HOST }}
          username: \${{ env.VPS_USER }}
          key: \${{ secrets.VPS_SSH_KEY }}
          script: |
            # Create Traefik config
            cat > /opt/deployments/traefik/config/\${{ env.PROJECT_NAME }}.yml <<EOF
            http:
              routers:
                \${{ env.PROJECT_NAME }}:
                  rule: "Host(\\\`\${{ env.PROJECT_NAME }}.singularity-labs.org\\\`)"
                  service: \${{ env.PROJECT_NAME }}
                  entryPoints:
                    - websecure
                  tls:
                    certResolver: letsencrypt
              services:
                \${{ env.PROJECT_NAME }}:
                  loadBalancer:
                    servers:
                      - url: "http://localhost:8080"
            EOF

            # Restart Traefik
            docker restart appwrite-traefik

      - name: Comment deployment status
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          github-token: \${{ secrets.GITHUB_TOKEN }}
          script: |
            const url = 'https://${projectName}.singularity-labs.org';
            github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.payload.pull_request.number,
              body: \`🚀 **Deployed to Appwrite Infrastructure!**\\n\\nURL: **\${url}**\`
            });
`;
}

// Parse CLI arguments
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
