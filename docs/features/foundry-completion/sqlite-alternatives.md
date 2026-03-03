# SQLite Alternatives Analysis

## Context

From PROP-030/S1: `better-sqlite3` blocks bun migration because it requires native compilation.

Used in: `packages/core-db` (SQLite + Drizzle adapter)

## Options

### 1. bun:sqlite (Bun Built-in)

**Pros:**
- Native to bun, zero dependencies
- 3-6x faster than better-sqlite3 (per Bun docs)
- Works out of the box with bun
- No compilation required

**Cons:**
- Bun-specific (won't work with pnpm/node)
- Not 1:1 API compatible with better-sqlite3
- Libraries like better-auth expect better-sqlite3 adapter

**API Example:**
```typescript
import { Database } from "bun:sqlite";
const db = new Database("mydb.sqlite");
const query = db.query("SELECT * FROM users");
const users = query.all();
```

### 2. Node.js Built-in SQLite (Experimental)

**Pros:**
- Built into Node.js 22+ (experimental)
- No native dependencies
- Works with both pnpm and bun

**Cons:**
- Still experimental (flag: `--experimental-sqlite`)
- API differs from better-sqlite3
- Requires Node.js 22+

**API Example:**
```typescript
import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync("mydb.sqlite");
const query = db.prepare("SELECT * FROM users");
const users = query.all();
```

### 3. sql.js (WASM-based)

**Pros:**
- Works everywhere (browser, Node, bun)
- No native dependencies
- SQLite compiled to WebAssembly

**Cons:**
- Loads entire database into memory
- Slower than native
- Persistence requires manual file I/O

**Not recommended** for server-side use.

### 4. libsql (Turso's Fork)

**Pros:**
- Drop-in SQLite replacement
- Active development
- Supports remote connections (Turso)

**Cons:**
- Still has native dependencies
- May have same compilation issues

**Needs testing** to confirm bun compatibility.

### 5. Database Abstraction Layer (Recommended)

Create an abstraction layer that supports multiple backends:

```typescript
// packages/core-db-interface/src/index.ts
export interface DatabaseAdapter {
  query<T>(sql: string, params?: unknown[]): Promise<T[]>;
  execute(sql: string, params?: unknown[]): Promise<void>;
  transaction<T>(fn: () => Promise<T>): Promise<T>;
}

// packages/core-db/src/better-sqlite3-adapter.ts
import { Adapter } from "core-db-interface";
import BetterSqlite3 from "better-sqlite3";

export class BetterSqlite3Adapter implements Adapter {
  // ... implementation
}

// packages/core-db-bun/src/bun-sqlite-adapter.ts
import { Adapter } from "core-db-interface";
import { Database } from "bun:sqlite";

export class BunSqliteAdapter implements Adapter {
  // ... implementation
}
```

**Pros:**
- Projects choose their backend
- Supports both pnpm (better-sqlite3) and bun (bun:sqlite)
- No breaking changes for existing users
- Future-proof for other backends

**Cons:**
- More code to maintain
- Requires interface design

## Decision Matrix

| Option | bun compat | pnpm compat | Performance | Effort |
|--------|------------|-------------|-------------|--------|
| bun:sqlite | ✅ | ❌ | ⚡⚡⚡ | Low |
| node:sqlite | ✅ | ✅ | ⚡⚡ | Low |
| sql.js | ✅ | ✅ | ⚡ | Low |
| libsql | ? | ? | ⚡⚡ | Medium |
| **Abstraction** | ✅ | ✅ | ⚡⚡⚡ | Medium |

## Recommendation

**Create database abstraction layer (Option 5)**

This allows:
1. Existing pnpm users continue using better-sqlite3
2. Bun users switch to bun:sqlite for 3-6x speedup
3. Future backends (libsql, turso) can be added
4. No breaking changes

**Implementation Plan (PROP-031/S4):**
1. Create `packages/core-db-interface` with TypeScript interface
2. Refactor `packages/core-db` to implement interface with better-sqlite3
3. Create `packages/core-db-bun` with bun:sqlite implementation
4. Document migration path for users

## References

- [Bun SQLite Docs](https://bun.com/docs/runtime/sqlite)
- [Node.js SQLite (Experimental)](https://nodejs.org/api/sqlite.html)
- [GitHub Issue: better-sqlite3 in bun](https://github.com/oven-sh/bun/issues/16050)
- [Better Auth SQLite](https://better-auth.com/docs/adapters/sqlite)
