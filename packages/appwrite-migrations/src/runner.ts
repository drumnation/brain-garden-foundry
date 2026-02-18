import {createHash} from 'node:crypto';
import {promises as fs} from 'node:fs';
import path from 'node:path';
import {Client, Databases, ID} from 'appwrite';
import chalk from 'chalk';
import type {
  Migration,
  MigrationConfig,
  MigrationHistory,
  MigrationResult,
} from './types.js';

export class MigrationRunner {
  private config: MigrationConfig;
  private databases: Databases;
  private historyCollection = 'migration_history';

  constructor(config: MigrationConfig) {
    this.config = config;
    this.databases = new Databases(config.client);
  }

  /**
   * Run all pending migrations
   */
  async up(): Promise<MigrationResult> {
    console.log(chalk.bold('🔄 Running migrations...'));

    try {
      // Ensure migration history collection exists
      await this.ensureHistoryCollection();

      // Get migration files
      const files = await this.getMigrationFiles();

      // Get applied migrations
      const history = await this.getHistory();
      const appliedIds = new Set(history.map((h) => h.id));

      // Find pending migrations
      const pending = files.filter((file) => {
        const id = this.extractId(file);
        return !appliedIds.has(id);
      });

      if (pending.length === 0) {
        console.log(chalk.gray('No pending migrations'));
        return {success: true, migrationsRun: []};
      }

      console.log(chalk.blue(`Found ${pending.length} pending migration(s)`));

      const migrationsRun: string[] = [];

      // Run each migration
      for (const file of pending) {
        const id = this.extractId(file);
        const name = this.extractName(file);

        console.log(chalk.gray(`  Running: ${id} - ${name}`));

        try {
          // Import migration module
          const migrationPath = path.join(this.config.migrationsDir, file);
          const module = await import(migrationPath);

          // Run up migration
          await module.up(this.config.client);

          // Record in history
          await this.recordMigration({id, name, file});

          migrationsRun.push(id);
          console.log(chalk.green(`    ✓ ${id} completed`));
        } catch (error) {
          console.error(chalk.red(`    ✗ ${id} failed`));
          throw error;
        }
      }

      console.log(
        chalk.green.bold(`✅ ${migrationsRun.length} migration(s) completed`),
      );
      return {success: true, migrationsRun};
    } catch (error) {
      console.error(chalk.red('Migration failed:'), error);
      return {
        success: false,
        migrationsRun: [],
        error: error as Error,
      };
    }
  }

  /**
   * Rollback the last migration
   */
  async down(): Promise<MigrationResult> {
    console.log(chalk.bold('⏪ Rolling back migration...'));

    try {
      const history = await this.getHistory();

      if (history.length === 0) {
        console.log(chalk.gray('No migrations to rollback'));
        return {success: true, migrationsRun: []};
      }

      // Get last migration
      const lastMigration = history[history.length - 1];
      const file = `${lastMigration.id}-${lastMigration.name}.ts`;

      console.log(
        chalk.gray(
          `  Rolling back: ${lastMigration.id} - ${lastMigration.name}`,
        ),
      );

      // Import migration module
      const migrationPath = path.join(this.config.migrationsDir, file);
      const module = await import(migrationPath);

      // Run down migration
      await module.down(this.config.client);

      // Remove from history
      await this.removeMigration(lastMigration.id);

      console.log(chalk.green(`    ✓ ${lastMigration.id} rolled back`));
      return {success: true, migrationsRun: [lastMigration.id]};
    } catch (error) {
      console.error(chalk.red('Rollback failed:'), error);
      return {
        success: false,
        migrationsRun: [],
        error: error as Error,
      };
    }
  }

  /**
   * Get migration status
   */
  async status(): Promise<{pending: string[]; applied: string[]}> {
    const files = await this.getMigrationFiles();
    const history = await this.getHistory();
    const appliedIds = new Set(history.map((h) => h.id));

    const pending = files
      .map((file) => this.extractId(file))
      .filter((id) => !appliedIds.has(id));

    const applied = history.map((h) => h.id);

    return {pending, applied};
  }

  /**
   * Get list of migration files
   */
  private async getMigrationFiles(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.config.migrationsDir);
      return files.filter((file) => file.match(/^\d{3}-.*\.ts$/)).sort();
    } catch (error) {
      // Directory might not exist yet
      return [];
    }
  }

  /**
   * Extract migration ID from filename
   */
  private extractId(filename: string): string {
    return filename.split('-')[0];
  }

  /**
   * Extract migration name from filename
   */
  private extractName(filename: string): string {
    return filename.replace(/^\d{3}-/, '').replace(/\.ts$/, '');
  }

  /**
   * Ensure migration history collection exists
   */
  private async ensureHistoryCollection(): Promise<void> {
    const databaseId = this.config.databaseId || 'main';

    try {
      // Try to get the collection
      await this.databases.getCollection(databaseId, this.historyCollection);
    } catch (error) {
      // Collection doesn't exist, create it
      await this.databases.createCollection(
        databaseId,
        ID.unique(),
        this.historyCollection,
        [],
      );

      // Add attributes
      await this.databases.createStringAttribute(
        databaseId,
        this.historyCollection,
        'migrationId',
        255,
        true,
      );

      await this.databases.createStringAttribute(
        databaseId,
        this.historyCollection,
        'name',
        255,
        true,
      );

      await this.databases.createStringAttribute(
        databaseId,
        this.historyCollection,
        'checksum',
        64,
        false,
      );

      await this.databases.createDatetimeAttribute(
        databaseId,
        this.historyCollection,
        'appliedAt',
        true,
      );

      // Create unique index on migrationId
      await this.databases.createIndex(
        databaseId,
        this.historyCollection,
        'unique_migration_id',
        'unique',
        ['migrationId'],
      );
    }
  }

  /**
   * Get migration history
   */
  private async getHistory(): Promise<MigrationHistory[]> {
    const databaseId = this.config.databaseId || 'main';

    try {
      const response = await this.databases.listDocuments(
        databaseId,
        this.historyCollection,
      );

      return response.documents.map((doc) => ({
        id: doc.migrationId,
        name: doc.name,
        appliedAt: doc.appliedAt,
        checksum: doc.checksum,
      }));
    } catch (error) {
      // Collection might not exist yet
      return [];
    }
  }

  /**
   * Record a migration in history
   */
  private async recordMigration(migration: {
    id: string;
    name: string;
    file: string;
  }): Promise<void> {
    const databaseId = this.config.databaseId || 'main';

    // Calculate checksum of migration file
    const filePath = path.join(this.config.migrationsDir, migration.file);
    const content = await fs.readFile(filePath, 'utf-8');
    const checksum = createHash('sha256').update(content).digest('hex');

    await this.databases.createDocument(
      databaseId,
      this.historyCollection,
      ID.unique(),
      {
        migrationId: migration.id,
        name: migration.name,
        checksum,
        appliedAt: new Date().toISOString(),
      },
    );
  }

  /**
   * Remove a migration from history
   */
  private async removeMigration(id: string): Promise<void> {
    const databaseId = this.config.databaseId || 'main';

    const response = await this.databases.listDocuments(
      databaseId,
      this.historyCollection,
    );

    const doc = response.documents.find((d) => d.migrationId === id);
    if (doc) {
      await this.databases.deleteDocument(
        databaseId,
        this.historyCollection,
        doc.$id,
      );
    }
  }
}
