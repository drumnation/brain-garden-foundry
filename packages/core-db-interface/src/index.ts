/**
 * Database Abstraction Interface
 *
 * Allows projects to use different SQLite backends:
 * - pnpm/node: better-sqlite3 (native compilation)
 * - bun: bun:sqlite (built-in, 3-6x faster)
 *
 * Decision: PROP-031/S4 recommended abstraction layer over single backend
 * Rationale: Projects choose backend without breaking changes
 */

/**
 * Query result row - generic key-value record
 */
export type DbRow = Record<string, unknown>;

/**
 * Query parameters - can be single value or array
 */
export type DbParams = unknown | unknown[];

/**
 * Database adapter interface
 *
 * Implementations:
 * - @bg-kit/core-db (better-sqlite3)
 * - @bg-kit/core-db-bun (bun:sqlite)
 */
export interface DatabaseAdapter {
  /**
   * Execute a query that returns results
   * @param sql SQL query with ? placeholders
   * @param params Parameters to bind
   * @returns Array of result rows
   */
  query<T extends DbRow = DbRow>(sql: string, params?: DbParams): T[];

  /**
   * Execute a statement that doesn't return results
   * @param sql SQL statement with ? placeholders
   * @param params Parameters to bind
   * @returns Number of affected rows
   */
  execute(sql: string, params?: DbParams): number;

  /**
   * Execute multiple statements in a transaction
   * @param fn Function containing operations to execute
   * @returns Result of the function
   */
  transaction<T>(fn: () => T): T;

  /**
   * Prepare a statement for repeated execution
   * @param sql SQL statement with ? placeholders
   * @returns Prepared statement object
   */
  prepare(sql: string): PreparedStatement;

  /**
   * Close the database connection
   */
  close(): void;

  /**
   * Check if database is open
   */
  readonly isOpen: boolean;

  /**
   * Get database path
   */
  readonly path: string;
}

/**
 * Prepared statement for efficient repeated execution
 */
export interface PreparedStatement {
  /**
   * Execute and return results
   */
  run(params?: DbParams): DbRow[];

  /**
   * Execute and return first row
   */
  get<T extends DbRow = DbRow>(params?: DbParams): T | undefined;

  /**
   * Execute and return all rows
   */
  all<T extends DbRow = DbRow>(params?: DbParams): T[];
}

/**
 * Database adapter factory function type
 */
export type CreateDatabaseAdapter = (path: string) => DatabaseAdapter;

/**
 * Adapter metadata for logging/debugging
 */
export interface AdapterInfo {
  name: string;
  version: string;
  backend: 'better-sqlite3' | 'bun:sqlite' | 'node:sqlite' | 'sql.js';
  features: {
    transactions: boolean;
    preparedStatements: boolean;
    inMemory: boolean;
  };
}

/**
 * Get adapter information
 */
export type GetAdapterInfo = () => AdapterInfo;
