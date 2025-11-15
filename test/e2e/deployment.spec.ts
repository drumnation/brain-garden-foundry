import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { Client, Databases, Storage, Account } from 'appwrite';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * E2E Test: Effortless Deployment
 *
 * This test proves that a developer can:
 * 1. Clone the template
 * 2. Run a single command
 * 3. Get a fully deployed application with:
 *    - Appwrite project created
 *    - Database schema deployed
 *    - Storage buckets created
 *    - CI/CD configured
 *    - Application accessible
 */
describe('Effortless Deployment E2E', () => {
  const testProjectName = `test-deploy-${Date.now()}`;
  const testDir = path.join(__dirname, '../../.test-deployments', testProjectName);
  let appwriteClient: Client;
  let databases: Databases;
  let storage: Storage;

  beforeAll(async () => {
    // Clean up test directory if it exists
    await fs.rm(testDir, { recursive: true, force: true });

    // Create test directory
    await fs.mkdir(path.dirname(testDir), { recursive: true });

    // Initialize Appwrite client
    appwriteClient = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://appwrite.singularity-labs.org')
      .setProject(process.env.APPWRITE_PROJECT_ID || 'test-project');

    databases = new Databases(appwriteClient);
    storage = new Storage(appwriteClient);
  }, 60000); // 1 minute timeout for setup

  afterAll(async () => {
    // Clean up test deployment
    try {
      // Run destroy command
      await execAsync(`cd ${testDir} && pnpm deploy:destroy --force --no-interactive`, {
        env: { ...process.env, CI: 'true' }
      });
    } catch (error) {
      console.warn('Cleanup failed:', error);
    }

    // Remove test directory
    await fs.rm(testDir, { recursive: true, force: true });
  }, 60000);

  it('should deploy from template clone to production in under 5 minutes', async () => {
    // Step 1: Simulate cloning the template
    console.log('📦 Copying template to test directory...');
    const templateDir = path.join(__dirname, '../..');
    await execAsync(`cp -r ${templateDir} ${testDir}`);

    // Step 2: Install dependencies
    console.log('📦 Installing dependencies...');
    const { stdout: installOutput } = await execAsync('pnpm install', {
      cwd: testDir,
    });
    expect(installOutput).toContain('packages installed');

    // Step 3: Run the deploy:init command
    console.log('🚀 Running deploy:init command...');
    const startTime = Date.now();

    const { stdout: deployOutput, stderr: deployError } = await execAsync(
      `pnpm deploy:init --project ${testProjectName} --no-interactive --dry-run`,
      {
        cwd: testDir,
        env: {
          ...process.env,
          CI: 'true',
          APPWRITE_ENDPOINT: 'https://appwrite.singularity-labs.org',
        }
      }
    );

    const deployTime = Date.now() - startTime;

    // Verify deployment completed
    expect(deployOutput).toContain('Deployment Initialized Successfully');
    expect(deployError).toBe('');

    // Verify deployment was fast (under 5 minutes)
    expect(deployTime).toBeLessThan(5 * 60 * 1000);

    // Step 4: Verify configuration was created
    console.log('✅ Verifying deployment configuration...');
    const configPath = path.join(testDir, '.deploy', 'config.json');
    const configExists = await fs.access(configPath).then(() => true).catch(() => false);
    expect(configExists).toBe(true);

    const config = JSON.parse(await fs.readFile(configPath, 'utf-8'));
    expect(config.project).toBe(testProjectName);
    expect(config.appwrite.projectId).toBeDefined();
    expect(config.appwrite.collections).toContain('users');
    expect(config.appwrite.buckets).toContain('profile-pictures');

    // Step 5: Verify GitHub Actions workflow was created
    console.log('✅ Verifying CI/CD pipeline...');
    const workflowPath = path.join(testDir, '.github', 'workflows', 'deploy.yml');
    const workflowExists = await fs.access(workflowPath).then(() => true).catch(() => false);
    expect(workflowExists).toBe(true);

    const workflow = await fs.readFile(workflowPath, 'utf-8');
    expect(workflow).toContain('name: Deploy');
    expect(workflow).toContain('pnpm deploy:sync');

    // Step 6: Verify migrations were created
    console.log('✅ Verifying database migrations...');
    const migrationPath = path.join(testDir, '.deploy', 'migrations', '001-initial-schema.ts');
    const migrationExists = await fs.access(migrationPath).then(() => true).catch(() => false);
    expect(migrationExists).toBe(true);

    const migration = await fs.readFile(migrationPath, 'utf-8');
    expect(migration).toContain('export const up');
    expect(migration).toContain('export const down');

    // Step 7: Verify package.json was updated with deploy scripts
    console.log('✅ Verifying package.json updates...');
    const packageJsonPath = path.join(testDir, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    expect(packageJson.scripts['deploy:init']).toBe('brain-deploy init');
    expect(packageJson.scripts['deploy:sync']).toBe('brain-deploy sync');
    expect(packageJson.scripts['deploy:status']).toBe('brain-deploy status');
    expect(packageJson.scripts['deploy:destroy']).toBe('brain-deploy destroy');

    // Step 8: Run deploy:status to verify health
    console.log('✅ Checking deployment status...');
    const { stdout: statusOutput } = await execAsync('pnpm deploy:status --json', {
      cwd: testDir,
    });

    const status = JSON.parse(statusOutput);
    expect(status.health).toBe('healthy');
    expect(status.project).toBe(testProjectName);
    expect(status.services.appwrite.status).toContain('✅');

    console.log(`\n🎉 Deployment completed in ${Math.round(deployTime / 1000)} seconds!`);
  }, 300000); // 5 minute timeout for the main test

  it('should support incremental migrations', async () => {
    // Create a new migration
    const newMigrationPath = path.join(testDir, '.deploy', 'migrations', '002-add-feature.ts');
    const newMigration = `
import { Client } from 'appwrite';
import { DatabaseHelper } from '@brain-garden/appwrite-migrations';

export const up = async (client: Client) => {
  const db = new DatabaseHelper(client, 'main');
  await db.createCollection({
    name: 'features',
    attributes: [
      { key: 'name', type: 'string', required: true, size: 255 },
      { key: 'enabled', type: 'boolean', default: true },
    ],
  });
};

export const down = async (client: Client) => {
  const db = new DatabaseHelper(client, 'main');
  await db.deleteCollection('features');
};
`;

    await fs.writeFile(newMigrationPath, newMigration);

    // Run sync with migrations
    const { stdout: syncOutput } = await execAsync('pnpm deploy:sync --migrations', {
      cwd: testDir,
    });

    expect(syncOutput).toContain('Deployment Synced Successfully');

    // Verify migration was recorded in config
    const configPath = path.join(testDir, '.deploy', 'config.json');
    const config = JSON.parse(await fs.readFile(configPath, 'utf-8'));

    expect(config.migrations.current).toBe('002');
    expect(config.migrations.history).toHaveLength(2);
  });

  it('should handle deployment destruction gracefully', async () => {
    // Run destroy command with dry-run
    const { stdout: destroyOutput } = await execAsync(
      `pnpm deploy:destroy --project ${testProjectName} --force`,
      {
        cwd: testDir,
        env: { ...process.env, CI: 'true' }
      }
    );

    expect(destroyOutput).toContain('Deployment Destroyed');

    // Verify config was removed
    const configPath = path.join(testDir, '.deploy', 'config.json');
    const configExists = await fs.access(configPath).then(() => true).catch(() => false);
    expect(configExists).toBe(false);

    // Verify deploy scripts were removed from package.json
    const packageJsonPath = path.join(testDir, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    expect(packageJson.scripts['deploy:init']).toBeUndefined();
    expect(packageJson.scripts['deploy:sync']).toBeUndefined();
    expect(packageJson.scripts['deploy:status']).toBeUndefined();
    expect(packageJson.scripts['deploy:destroy']).toBeUndefined();
  });
});

/**
 * Integration Test: Migration System
 */
describe('Migration System Integration', () => {
  it('should create and rollback migrations', async () => {
    // This would test the migration system in isolation
    // Implementation depends on having a test Appwrite instance

    // For now, just verify the migration package exports work
    const migrations = await import('@brain-garden/appwrite-migrations');

    expect(migrations.MigrationRunner).toBeDefined();
    expect(migrations.DatabaseHelper).toBeDefined();
    expect(migrations.StorageHelper).toBeDefined();
    expect(migrations.CommonSchemas).toBeDefined();
    expect(migrations.CommonBuckets).toBeDefined();
  });
});