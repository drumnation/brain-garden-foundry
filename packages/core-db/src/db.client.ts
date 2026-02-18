import type {Database as DatabaseType} from 'better-sqlite3';
import Database from 'better-sqlite3';
import {existsSync} from 'fs';
import {mkdir} from 'fs/promises';
import {dirname} from 'path';

export interface DbConfig {
  dbPath: string;
  readonly?: boolean;
}

export type DbClient = DatabaseType;

/**
 * Factory function to create database client
 * Following functional DI pattern - no classes
 */
export const makeDbClient = async (config: DbConfig): Promise<DbClient> => {
  // Ensure directory exists
  const dir = dirname(config.dbPath);
  if (!existsSync(dir)) {
    await mkdir(dir, {recursive: true});
  }

  // Open database connection
  const db = new Database(config.dbPath, {
    readonly: config.readonly || false,
    fileMustExist: false,
  });

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Optimize for performance
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');

  return db;
};

/**
 * Close database connection
 */
export const closeDb = (db: DbClient): void => {
  if (db && !db.readonly) {
    db.close();
  }
};
