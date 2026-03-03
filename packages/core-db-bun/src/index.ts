/**
 * Bun SQLite Database Adapter
 *
 * Uses bun:sqlite built-in for 3-6x faster performance than better-sqlite3
 *
 * Decision: PROP-031/S4 - bun:sqlite chosen for bun runtime
 * Landmine: bun:sqlite not 1:1 API compatible with better-sqlite3
 */

import {Database} from 'bun:sqlite';
import type {
  AdapterInfo,
  DatabaseAdapter,
  DbParams,
  DbRow,
  PreparedStatement,
} from '@bg-kit/core-db-interface';

/**
 * Bun SQLite prepared statement wrapper
 */
class BunPreparedStatement implements PreparedStatement {
  private stmt: ReturnType<Database['query']>;

  constructor(stmt: ReturnType<Database['query']>) {
    this.stmt = stmt;
  }

  run(params?: DbParams): DbRow[] {
    if (Array.isArray(params)) {
      return this.stmt.all(...params) as DbRow[];
    }
    return this.stmt.all(params) as DbRow[];
  }

  get<T extends DbRow = DbRow>(params?: DbParams): T | undefined {
    if (Array.isArray(params)) {
      return this.stmt.get(...params) as T | undefined;
    }
    return this.stmt.get(params) as T | undefined;
  }

  all<T extends DbRow = DbRow>(params?: DbParams): T[] {
    if (Array.isArray(params)) {
      return this.stmt.all(...params) as T[];
    }
    return this.stmt.all(params) as T[];
  }
}

/**
 * Bun SQLite database adapter
 */
export class BunSqliteAdapter implements DatabaseAdapter {
  private db: Database;
  private _path: string;
  private _isOpen: boolean = true;

  constructor(path: string) {
    this._path = path;
    this.db = new Database(path);

    // Enable foreign keys
    this.db.run('PRAGMA foreign_keys = ON');

    // Optimize for performance
    this.db.run('PRAGMA journal_mode = WAL');
    this.db.run('PRAGMA synchronous = NORMAL');
  }

  query<T extends DbRow = DbRow>(sql: string, params?: DbParams): T[] {
    const stmt = this.db.query<T, unknown[]>(sql);
    if (Array.isArray(params)) {
      return stmt.all(...params);
    }
    return stmt.all(params);
  }

  execute(sql: string, params?: DbParams): number {
    if (Array.isArray(params)) {
      const result = this.db.run(sql, ...params);
      return result.changes;
    }
    const result = this.db.run(sql, params);
    return result.changes;
  }

  transaction<T>(fn: () => T): T {
    return this.db.transaction(fn)();
  }

  prepare(sql: string): PreparedStatement {
    const stmt = this.db.query(sql);
    return new BunPreparedStatement(stmt);
  }

  close(): void {
    if (this._isOpen) {
      this.db.close();
      this._isOpen = false;
    }
  }

  get isOpen(): boolean {
    return this._isOpen;
  }

  get path(): string {
    return this._path;
  }
}

/**
 * Factory function to create Bun SQLite adapter
 */
export const createBunAdapter = (path: string): DatabaseAdapter => {
  return new BunSqliteAdapter(path);
};

/**
 * Get adapter information
 */
export const getAdapterInfo = (): AdapterInfo => ({
  name: '@bg-kit/core-db-bun',
  version: '1.0.0',
  backend: 'bun:sqlite',
  features: {
    transactions: true,
    preparedStatements: true,
    inMemory: false,
  },
});
