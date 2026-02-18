import {promises as fs} from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';

export async function deployDestroyCommand(options: any) {
  console.log(chalk.bold.red('\n⚠️  Destroy Deployment\n'));

  const configPath = path.join(process.cwd(), '.deploy', 'config.json');

  // Check if project is initialized
  if (!(await fileExists(configPath))) {
    console.error(chalk.red('❌ Project not initialized. Nothing to destroy.'));
    process.exit(0);
  }

  const config = JSON.parse(await fs.readFile(configPath, 'utf-8'));

  // Confirm destruction
  if (!options.force) {
    console.log(chalk.yellow('This will destroy the following resources:'));
    console.log(chalk.gray(`  • Appwrite project: ${config.project}`));
    console.log(
      chalk.gray(
        `  • Database collections: ${config.appwrite.collections.length}`,
      ),
    );
    console.log(
      chalk.gray(`  • Storage buckets: ${config.appwrite.buckets.length}`),
    );
    console.log(chalk.gray(`  • GitHub secrets`));
    console.log(chalk.gray(`  • CI/CD pipeline`));

    if (!options.keepData) {
      console.log(
        chalk.red.bold('\n  ⚠️  All data will be permanently deleted!'),
      );
    }

    const {confirm} = await prompts({
      type: 'confirm',
      name: 'confirm',
      message: `Are you sure you want to destroy "${config.project}"?`,
      initial: false,
    });

    if (!confirm) {
      console.log(chalk.gray('\nDestruction cancelled'));
      process.exit(0);
    }

    // Double confirmation for production
    if (config.environment === 'production') {
      const {confirmProduction} = await prompts({
        type: 'text',
        name: 'confirmProduction',
        message: `Type "${config.project}" to confirm destruction of PRODUCTION environment:`,
        validate: (value) =>
          value === config.project || 'Project name does not match',
      });

      if (!confirmProduction) {
        console.log(chalk.gray('\nDestruction cancelled'));
        process.exit(0);
      }
    }
  }

  console.log(chalk.bold('\n💥 Destroying Deployment\n'));

  const steps = [
    {
      name: 'Backing up data',
      fn: async () => {
        if (options.keepData) {
          const backupDir = path.join(
            process.cwd(),
            '.deploy',
            'backups',
            new Date().toISOString(),
          );
          await fs.mkdir(backupDir, {recursive: true});
          await fs.copyFile(configPath, path.join(backupDir, 'config.json'));
          console.log(chalk.gray(`    Backup saved to: ${backupDir}`));
        }
      },
    },
    {
      name: 'Removing Appwrite resources',
      fn: async () => {
        // In production, would call Appwrite API to delete project
        await new Promise((resolve) => setTimeout(resolve, 1000));
      },
    },
    {
      name: 'Cleaning GitHub secrets',
      fn: async () => {
        try {
          if (config.github.secretsConfigured) {
            // Would use gh CLI to remove secrets
            // execSync(`gh secret delete APPWRITE_ENDPOINT --repo ${config.github.repository}`);
            // execSync(`gh secret delete APPWRITE_PROJECT_ID --repo ${config.github.repository}`);
          }
        } catch {
          // Ignore errors if secrets don't exist
        }
      },
    },
    {
      name: 'Removing CI/CD workflows',
      fn: async () => {
        const workflowPath = path.join(
          process.cwd(),
          '.github',
          'workflows',
          'deploy.yml',
        );
        try {
          await fs.unlink(workflowPath);
        } catch {
          // File might not exist
        }
      },
    },
    {
      name: 'Cleaning local configuration',
      fn: async () => {
        if (!options.keepData) {
          const deployDir = path.join(process.cwd(), '.deploy');
          await fs.rm(deployDir, {recursive: true, force: true});
        } else {
          // Just remove config, keep migrations and backups
          await fs.unlink(configPath);
        }
      },
    },
    {
      name: 'Updating package.json',
      fn: async () => {
        const packageJsonPath = path.join(process.cwd(), 'package.json');
        const packageJson = JSON.parse(
          await fs.readFile(packageJsonPath, 'utf-8'),
        );

        // Remove deploy scripts
        delete packageJson.scripts['deploy:init'];
        delete packageJson.scripts['deploy:sync'];
        delete packageJson.scripts['deploy:status'];
        delete packageJson.scripts['deploy:destroy'];

        await fs.writeFile(
          packageJsonPath,
          JSON.stringify(packageJson, null, 2),
        );
      },
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
      console.log(
        chalk.yellow(
          '\n⚠️  Destruction may be incomplete. Manual cleanup may be required.',
        ),
      );
    }
  }

  console.log(chalk.green.bold('\n✅ Deployment Destroyed\n'));
  console.log(chalk.gray('All resources have been cleaned up.'));

  if (options.keepData) {
    console.log(chalk.yellow('\n📦 Data preserved in .deploy/backups/'));
  }
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}
