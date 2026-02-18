import type {DbClient} from './db.client.ts';
import type {Project, ProjectFilter} from './db.types.ts';

export interface ProjectRepo {
  findByPath: (path: string) => Promise<Project | null>;
  findAll: (filter?: ProjectFilter) => Promise<Project[]>;
  create: (project: Omit<Project, 'id'>) => Promise<Project>;
  update: (path: string, updates: Partial<Project>) => Promise<void>;
  upsert: (project: Omit<Project, 'id'>) => Promise<Project>;
  delete: (path: string) => Promise<void>;
  count: (filter?: ProjectFilter) => Promise<number>;
}

/**
 * Factory function to create project repository
 * Following functional DI pattern
 */
export const makeProjectRepo = (deps: {db: DbClient}): ProjectRepo => {
  const {db} = deps;

  return {
    findByPath: async (path: string): Promise<Project | null> => {
      const stmt = db.prepare('SELECT * FROM projects WHERE path = ?');
      const row = stmt.get(path) as Project | undefined;
      return row || null;
    },

    findAll: async (filter?: ProjectFilter): Promise<Project[]> => {
      let query = 'SELECT * FROM projects WHERE 1=1';
      const params: any[] = [];

      if (filter) {
        if (filter.lifecycle) {
          query += ' AND lifecycle = ?';
          params.push(filter.lifecycle);
        }

        if (filter.category) {
          query += ' AND category = ?';
          params.push(filter.category);
        }

        if (filter.ownership) {
          query += ' AND ownership = ?';
          params.push(filter.ownership);
        }

        if (filter.deployed !== undefined) {
          query += ' AND deployed = ?';
          params.push(filter.deployed ? 1 : 0);
        }

        if (filter.hasBrainFolder !== undefined) {
          query += ' AND has_brain_folder = ?';
          params.push(filter.hasBrainFolder ? 1 : 0);
        }

        if (filter.hasClaudeMd !== undefined) {
          query += ' AND has_claude_md = ?';
          params.push(filter.hasClaudeMd ? 1 : 0);
        }

        if (filter.hasCursorRules !== undefined) {
          query += ' AND has_cursor_rules = ?';
          params.push(filter.hasCursorRules ? 1 : 0);
        }

        if (filter.isPnpmMonorepo !== undefined) {
          query += ' AND is_pnpm_monorepo = ?';
          params.push(filter.isPnpmMonorepo ? 1 : 0);
        }

        // Sorting
        const sortBy = filter.sortBy || 'last_worked_on';
        const sortOrder = filter.sortOrder || 'desc';
        query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;

        // Pagination
        if (filter.limit) {
          query += ' LIMIT ?';
          params.push(filter.limit);
        }

        if (filter.offset) {
          query += ' OFFSET ?';
          params.push(filter.offset);
        }
      } else {
        query += ' ORDER BY last_worked_on DESC';
      }

      const stmt = db.prepare(query);
      return stmt.all(...params) as Project[];
    },

    create: async (project: Omit<Project, 'id'>): Promise<Project> => {
      const columns = Object.keys(project).join(', ');
      const placeholders = Object.keys(project)
        .map(() => '?')
        .join(', ');
      const values = Object.values(project);

      const stmt = db.prepare(`
        INSERT INTO projects (${columns})
        VALUES (${placeholders})
      `);

      const result = stmt.run(...values);

      return {
        ...project,
        id: result.lastInsertRowid as number,
      };
    },

    update: async (path: string, updates: Partial<Project>): Promise<void> => {
      // Remove id and path from updates
      const {id, path: _, ...validUpdates} = updates;

      if (Object.keys(validUpdates).length === 0) {
        return;
      }

      const setClause = Object.keys(validUpdates)
        .map((key) => `${key} = ?`)
        .join(', ');

      const values = [...Object.values(validUpdates), path];

      const stmt = db.prepare(`
        UPDATE projects
        SET ${setClause}, updated_at = datetime('now')
        WHERE path = ?
      `);

      stmt.run(...values);
    },

    upsert: async (project: Omit<Project, 'id'>): Promise<Project> => {
      const existing = await makeProjectRepo(deps).findByPath(project.path);

      if (existing) {
        await makeProjectRepo(deps).update(project.path, project);
        return {...existing, ...project};
      } else {
        return await makeProjectRepo(deps).create(project);
      }
    },

    delete: async (path: string): Promise<void> => {
      const stmt = db.prepare('DELETE FROM projects WHERE path = ?');
      stmt.run(path);
    },

    count: async (filter?: ProjectFilter): Promise<number> => {
      let query = 'SELECT COUNT(*) as count FROM projects WHERE 1=1';
      const params: any[] = [];

      if (filter) {
        if (filter.lifecycle) {
          query += ' AND lifecycle = ?';
          params.push(filter.lifecycle);
        }

        if (filter.category) {
          query += ' AND category = ?';
          params.push(filter.category);
        }

        if (filter.ownership) {
          query += ' AND ownership = ?';
          params.push(filter.ownership);
        }

        if (filter.hasBrainFolder !== undefined) {
          query += ' AND has_brain_folder = ?';
          params.push(filter.hasBrainFolder ? 1 : 0);
        }

        if (filter.hasClaudeMd !== undefined) {
          query += ' AND has_claude_md = ?';
          params.push(filter.hasClaudeMd ? 1 : 0);
        }
      }

      const stmt = db.prepare(query);
      const result = stmt.get(...params) as {count: number};
      return result.count;
    },
  };
};
