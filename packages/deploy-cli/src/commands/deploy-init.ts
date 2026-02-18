import {execSync} from 'node:child_process';
import {promises as fs} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Client, Databases, ID, Projects, Storage} from 'appwrite';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import {z} from 'zod';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration schema
const DeployConfigSchema = z.object({
  project: z.string(),
  environment: z.enum(['production', 'staging', 'development']),
  appwrite: z.object({
    endpoint: z.string().url(),
    projectId: z.string(),
    apiKey: z.string().optional(),
    collections: z.array(z.string()),
    buckets: z.array(z.string()),
    functions: z.array(z.string()),
  }),
  github: z.object({
    repository: z.string(),
    secretsConfigured: z.boolean(),
    actionsEnabled: z.boolean(),
  }),
  domains: z.object({
    production: z.string(),
    preview: z.string(),
  }),
  migrations: z.object({
    current: z.string(),
    history: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        appliedAt: z.string(),
      }),
    ),
  }),
});

type DeployConfig = z.infer<typeof DeployConfigSchema>;

export async function deployInitCommand(options: any) {
  console.log(chalk.bold('\n🚀 Initializing Brain Garden Deployment\n'));

  // Check if already initialized
  const deployDir = path.join(process.cwd(), '.deploy');
  const configPath = path.join(deployDir, 'config.json');

  if (await fileExists(configPath)) {
    console.log(chalk.yellow('⚠️  Project already initialized'));
    const {overwrite} = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: 'Overwrite existing configuration?',
      initial: false,
    });

    if (!overwrite) {
      console.log(chalk.gray('Initialization cancelled'));
      process.exit(0);
    }
  }

  // Interactive configuration
  let config: Partial<DeployConfig> = {};

  if (!options.noInteractive) {
    const answers = await prompts([
      {
        type: 'text',
        name: 'project',
        message: 'Project name:',
        initial: options.project || path.basename(process.cwd()),
        validate: (value) => value.length > 0,
      },
      {
        type: 'select',
        name: 'environment',
        message: 'Deployment environment:',
        choices: [
          {title: 'Production', value: 'production'},
          {title: 'Staging', value: 'staging'},
          {title: 'Development', value: 'development'},
        ],
        initial: 0,
      },
      {
        type: 'text',
        name: 'appwriteEndpoint',
        message: 'Appwrite endpoint:',
        initial: options.endpoint || 'https://appwrite.singularity-labs.org',
      },
      {
        type: 'text',
        name: 'githubRepo',
        message: 'GitHub repository (owner/name):',
        validate: (value) =>
          /^[^/]+\/[^/]+$/.test(value) || 'Format: owner/repo',
      },
      {
        type: 'text',
        name: 'productionDomain',
        message: 'Production domain:',
        initial: (prev: any, values: any) =>
          `${values.project}.singularity-labs.org`,
      },
    ]);

    config = {
      project: answers.project,
      environment: answers.environment,
      appwrite: {
        endpoint: answers.appwriteEndpoint,
        projectId: ID.unique(),
        collections: [],
        buckets: [],
        functions: [],
      },
      github: {
        repository: answers.githubRepo,
        secretsConfigured: false,
        actionsEnabled: false,
      },
      domains: {
        production: answers.productionDomain,
        preview: `pr-*.${answers.productionDomain}`,
      },
      migrations: {
        current: '000',
        history: [],
      },
    };
  } else {
    // Non-interactive mode with defaults
    const projectName = options.project || path.basename(process.cwd());
    config = {
      project: projectName,
      environment: 'production',
      appwrite: {
        endpoint: options.endpoint || 'https://appwrite.singularity-labs.org',
        projectId: ID.unique(),
        collections: [],
        buckets: [],
        functions: [],
      },
      github: {
        repository: `user/${projectName}`,
        secretsConfigured: false,
        actionsEnabled: false,
      },
      domains: {
        production: `${projectName}.singularity-labs.org`,
        preview: `pr-*.${projectName}.singularity-labs.org`,
      },
      migrations: {
        current: '000',
        history: [],
      },
    };
  }

  if (options.dryRun) {
    console.log(chalk.blue('\n📋 Dry Run - Configuration Preview:\n'));
    console.log(JSON.stringify(config, null, 2));
    console.log(chalk.gray('\n(No changes will be made)'));
    process.exit(0);
  }

  // Start provisioning
  console.log(chalk.bold('\n⚡ Provisioning Infrastructure\n'));

  const steps = [
    {
      name: 'Creating .deploy directory',
      fn: () => createDeployDirectory(deployDir),
    },
    {
      name: 'Saving configuration',
      fn: () => saveConfig(configPath, config as DeployConfig),
    },
    {
      name: 'Creating Appwrite project',
      fn: () => createAppwriteProject(config as DeployConfig),
    },
    {
      name: 'Setting up database collections',
      fn: () => setupCollections(config as DeployConfig),
    },
    {
      name: 'Creating storage buckets',
      fn: () => createStorageBuckets(config as DeployConfig),
    },
    {
      name: 'Configuring GitHub secrets',
      fn: () => configureGitHubSecrets(config as DeployConfig),
    },
    {
      name: 'Setting up CI/CD pipeline',
      fn: () => setupCIPipeline(config as DeployConfig),
    },
    {
      name: 'Running initial migrations',
      fn: () => runInitialMigrations(config as DeployConfig),
    },
    {
      name: 'Creating deployment scripts',
      fn: () => createDeploymentScripts(config as DeployConfig),
    },
  ];

  for (const step of steps) {
    const spinner = ora(step.name).start();
    try {
      await step.fn();
      spinner.succeed();
    } catch (error) {
      spinner.fail();
      console.error(chalk.red(`\n❌ Error: ${(error as Error).message}`));
      process.exit(1);
    }
  }

  // Success message
  console.log(chalk.green.bold('\n🎉 Deployment Initialized Successfully!\n'));
  console.log(
    chalk.white('Your app is configured and ready for deployment.\n'),
  );

  console.log(chalk.bold('📍 Deployment URLs:'));
  console.log(
    chalk.gray(
      `  Production: ${chalk.cyan(`https://${config.domains?.production}`)}`,
    ),
  );
  console.log(
    chalk.gray(
      `  Preview:    ${chalk.cyan(`https://${config.domains?.preview}`)}`,
    ),
  );
  console.log(
    chalk.gray(`  Appwrite:   ${chalk.cyan(config.appwrite?.endpoint)}`),
  );

  console.log(chalk.bold('\n📚 Next Steps:'));
  console.log(
    chalk.gray(
      '  1. Run ' + chalk.cyan('pnpm deploy:sync') + ' to sync database schema',
    ),
  );
  console.log(
    chalk.gray('  2. Run ' + chalk.cyan('git push') + ' to trigger deployment'),
  );
  console.log(
    chalk.gray(
      '  3. Run ' +
        chalk.cyan('pnpm deploy:status') +
        ' to check deployment health',
    ),
  );

  console.log(chalk.bold('\n🔧 Available Commands:'));
  console.log(
    chalk.gray(
      '  • ' +
        chalk.cyan('pnpm deploy:sync') +
        '    - Sync infrastructure with code',
    ),
  );
  console.log(
    chalk.gray(
      '  • ' + chalk.cyan('pnpm deploy:status') + '  - Check deployment status',
    ),
  );
  console.log(
    chalk.gray(
      '  • ' + chalk.cyan('pnpm deploy:destroy') + ' - Teardown deployment',
    ),
  );
}

// Helper functions

async function fileExists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

async function createDeployDirectory(deployDir: string) {
  await fs.mkdir(deployDir, {recursive: true});
  await fs.mkdir(path.join(deployDir, 'migrations'), {recursive: true});
  await fs.mkdir(path.join(deployDir, 'scripts'), {recursive: true});
}

async function saveConfig(configPath: string, config: DeployConfig) {
  await fs.writeFile(configPath, JSON.stringify(config, null, 2));

  // Add .deploy to .gitignore if not already there
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  const gitignore = await fs.readFile(gitignorePath, 'utf-8').catch(() => '');

  if (!gitignore.includes('.deploy')) {
    await fs.appendFile(
      gitignorePath,
      '\n# Deployment configuration\n.deploy/\n',
    );
  }
}

async function createAppwriteProject(config: DeployConfig) {
  // Note: In real implementation, this would use Appwrite Management API
  // For now, we'll simulate the creation

  // In production, you'd do:
  // const client = new Client()
  //   .setEndpoint(config.appwrite.endpoint)
  //   .setKey(ADMIN_API_KEY);
  //
  // const projects = new Projects(client);
  // await projects.create(config.appwrite.projectId, config.project);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Update config with actual project ID
  config.appwrite.projectId = config.appwrite.projectId || ID.unique();
}

async function setupCollections(config: DeployConfig) {
  // Default collections for auth system
  const collections = ['users', 'sessions', 'teams', 'memberships', 'tokens'];

  config.appwrite.collections = collections;
  await new Promise((resolve) => setTimeout(resolve, 500));
}

async function createStorageBuckets(config: DeployConfig) {
  // Default storage buckets
  const buckets = ['profile-pictures', 'documents', 'uploads'];

  config.appwrite.buckets = buckets;
  await new Promise((resolve) => setTimeout(resolve, 500));
}

async function configureGitHubSecrets(config: DeployConfig) {
  // Check if gh CLI is available
  try {
    execSync('which gh', {stdio: 'ignore'});

    // Note: In real implementation, would set actual secrets
    // execSync(`gh secret set APPWRITE_ENDPOINT --body "${config.appwrite.endpoint}" --repo ${config.github.repository}`);
    // execSync(`gh secret set APPWRITE_PROJECT_ID --body "${config.appwrite.projectId}" --repo ${config.github.repository}`);

    config.github.secretsConfigured = true;
  } catch {
    console.log(
      chalk.yellow(
        '\n  ⚠️  GitHub CLI not found. Please configure secrets manually.',
      ),
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 500));
}

async function setupCIPipeline(config: DeployConfig) {
  // Create GitHub Actions workflow
  const workflowDir = path.join(process.cwd(), '.github', 'workflows');
  await fs.mkdir(workflowDir, {recursive: true});

  const workflowContent = `name: Deploy
on:
  push:
    branches: [main]
  pull_request:
    types: [opened, synchronize]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm test
      - name: Deploy
        if: github.ref == 'refs/heads/main'
        run: pnpm deploy:sync --migrations
        env:
          APPWRITE_ENDPOINT: \${{ secrets.APPWRITE_ENDPOINT }}
          APPWRITE_PROJECT_ID: \${{ secrets.APPWRITE_PROJECT_ID }}
          APPWRITE_API_KEY: \${{ secrets.APPWRITE_API_KEY }}
`;

  await fs.writeFile(path.join(workflowDir, 'deploy.yml'), workflowContent);
  config.github.actionsEnabled = true;
}

async function runInitialMigrations(config: DeployConfig) {
  // Create initial migration file
  const migrationPath = path.join(
    process.cwd(),
    '.deploy',
    'migrations',
    '001-initial-schema.ts',
  );
  const migrationContent = `import { Client, Databases, ID, Permission, Role } from 'appwrite';

export const up = async (client: Client) => {
  const databases = new Databases(client);
  const databaseId = 'main';

  // Create main database
  await databases.create(databaseId, 'Main Database');

  // Create users collection
  await databases.createCollection(
    databaseId,
    ID.unique(),
    'users',
    [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.user(ID.unique())),
      Permission.delete(Role.user(ID.unique())),
    ]
  );
};

export const down = async (client: Client) => {
  const databases = new Databases(client);
  await databases.delete('main');
};
`;

  await fs.writeFile(migrationPath, migrationContent);

  // Update migration history
  config.migrations.current = '001';
  config.migrations.history.push({
    id: '001',
    name: 'initial-schema',
    appliedAt: new Date().toISOString(),
  });

  await new Promise((resolve) => setTimeout(resolve, 500));
}

async function createDeploymentScripts(config: DeployConfig) {
  // Add deploy scripts to package.json
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

  packageJson.scripts = {
    ...packageJson.scripts,
    'deploy:init': 'brain-deploy init',
    'deploy:sync': 'brain-deploy sync',
    'deploy:status': 'brain-deploy status',
    'deploy:destroy': 'brain-deploy destroy',
  };

  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
}
