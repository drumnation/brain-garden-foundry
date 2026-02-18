/**
 * Project Scanner Service
 * Scans filesystem for projects and populates database
 * Following functional DI pattern
 */

import type {Project, ProjectRepo} from '@pm-agent/core-db';
import {existsSync} from 'fs';
import {readdir, stat} from 'fs/promises';
import ignore from 'ignore';
import {basename, join} from 'path';
import simpleGit from 'simple-git';
import {
  detectProjectSignals,
  getDirectorySize,
  getProjectDescription,
  isProjectRoot,
} from './project.detector.ts';
import type {
  ProjectSignals,
  ScanConfig,
  ScannedProject,
} from './scanner.types.ts';

export interface ScannerService {
  scanDirectory: (config: ScanConfig) => Promise<ScannedProject[]>;
  scanAndPersist: (config: ScanConfig) => Promise<{
    projectsFound: number;
    projectsAdded: number;
    projectsUpdated: number;
    errors: string[];
  }>;
}

/**
 * Factory function to create scanner service
 */
export const makeScannerService = (deps: {
  projectRepo: ProjectRepo;
}): ScannerService => {
  const {projectRepo} = deps;

  /**
   * Categorize project based on its signals
   */
  const categorizeProject = (signals: ProjectSignals): string => {
    if (signals.projectType === 'cli-tool') return 'tool';
    if (signals.projectType === 'api-server') return 'app';
    if (signals.projectType === 'web-app') return 'app';
    if (signals.projectType === 'electron-app') return 'app';
    if (signals.projectType === 'library') return 'tool';
    if (signals.projectType === 'monorepo') return 'app';
    return 'experimental';
  };

  /**
   * Detect monorepo type
   */
  const detectMonorepoType = (project: ScannedProject): string => {
    if (project.signals.techStack.includes('Turborepo')) return 'turborepo';
    if (existsSync(join(project.path, 'pnpm-workspace.yaml'))) return 'pnpm';
    if (existsSync(join(project.path, 'lerna.json'))) return 'lerna';
    if (existsSync(join(project.path, 'nx.json'))) return 'nx';
    return 'unknown';
  };

  // Default ignore patterns
  const defaultIgnorePatterns = [
    'node_modules',
    '.git',
    'dist',
    'build',
    'coverage',
    '.next',
    '.cache',
    'target',
    '__pycache__',
    '.pytest_cache',
    '.venv',
    'venv',
    '.idea',
    '.vscode',
    '*.log',
    '.DS_Store',
    'Thumbs.db',
  ];

  /**
   * Recursively scan directory for projects
   */
  const scanDirectoryRecursive = async (
    dirPath: string,
    config: ScanConfig,
    currentDepth: number = 0,
    ig: ReturnType<typeof ignore>,
  ): Promise<ScannedProject[]> => {
    const projects: ScannedProject[] = [];

    // Check max depth
    if (config.maxDepth && currentDepth > config.maxDepth) {
      return projects;
    }

    try {
      // Check if current directory is a project
      if (await isProjectRoot(dirPath)) {
        const projectName = basename(dirPath);

        // Skip if ignored
        if (!ig.ignores(projectName)) {
          console.log(`Found project: ${dirPath}`);

          const signals = await detectProjectSignals(dirPath);
          const description = await getProjectDescription(dirPath);
          const sizeMb = await getDirectorySize(dirPath);

          let gitRemote: string | undefined;
          let lastModified: Date | undefined;

          // Get git info if available
          if (signals.hasGitRepo) {
            try {
              const git = simpleGit(dirPath);
              const remotes = await git.getRemotes(true);
              if (remotes.length > 0) {
                gitRemote = remotes[0].refs.fetch;
              }

              // Get last commit date
              const log = await git.log({n: 1});
              if (log.latest) {
                lastModified = new Date(log.latest.date);
              }
            } catch (error) {
              // Git operations failed
            }
          }

          // If no git info, use filesystem modified time
          if (!lastModified) {
            try {
              const stats = await stat(dirPath);
              lastModified = stats.mtime;
            } catch (error) {
              // Stat failed
            }
          }

          projects.push({
            path: dirPath,
            name: projectName,
            signals,
            gitRemote,
            lastModified,
            sizeMb,
            description,
          });

          // Don't scan inside project directories for nested projects
          // unless it's a monorepo
          if (signals.projectType !== 'monorepo') {
            return projects;
          }
        }
      }

      // Scan subdirectories
      const items = await readdir(dirPath, {withFileTypes: true});

      for (const item of items) {
        if (item.isDirectory() && !item.name.startsWith('.')) {
          const itemPath = join(dirPath, item.name);

          // Skip if ignored
          if (ig.ignores(item.name)) {
            continue;
          }

          // Recursively scan subdirectory
          const subProjects = await scanDirectoryRecursive(
            itemPath,
            config,
            currentDepth + 1,
            ig,
          );

          projects.push(...subProjects);
        }
      }
    } catch (error) {
      console.error(`Error scanning ${dirPath}:`, error);
    }

    return projects;
  };

  return {
    scanDirectory: async (config: ScanConfig): Promise<ScannedProject[]> => {
      // Create ignore instance
      const ig = ignore();
      const patterns = [
        ...defaultIgnorePatterns,
        ...(config.ignorePatterns || []),
      ];
      ig.add(patterns);

      console.log(`Starting scan of ${config.rootPath}`);
      const projects = await scanDirectoryRecursive(
        config.rootPath,
        config,
        0,
        ig,
      );
      console.log(`Scan complete. Found ${projects.length} projects.`);

      return projects;
    },

    scanAndPersist: async (config: ScanConfig) => {
      const startTime = Date.now();
      const errors: string[] = [];
      let projectsAdded = 0;
      let projectsUpdated = 0;

      // Scan directory for projects
      const scannedProjects =
        await makeScannerService(deps).scanDirectory(config);

      // Persist each project to database
      for (const scannedProject of scannedProjects) {
        try {
          // Check if project already exists
          const existing = await projectRepo.findByPath(scannedProject.path);

          // Prepare project data matching actual database schema
          const projectData: Record<string, any> = {
            path: scannedProject.path,
            name: scannedProject.name,
            lifecycle: 'discovered',
            category: categorizeProject(scannedProject.signals),
            tags: JSON.stringify(scannedProject.signals.techStack),

            // Default ownership
            origin_type: 'created',
            ownership: 'mine',
            contribution_level: 100,

            // Timestamps
            last_worked_on: scannedProject.lastModified?.toISOString(),

            // Git info
            git_origin_url: scannedProject.gitRemote,
            git_default_branch: 'main',

            // Purpose
            purpose: scannedProject.description,

            // Structure flags (convert booleans to 0/1 for SQLite)
            has_brain_folder: scannedProject.signals.hasBrainGarden ? 1 : 0,
            has_claude_md: scannedProject.signals.hasClaudeRules ? 1 : 0,
            has_cursor_rules: scannedProject.signals.hasCursorRules ? 1 : 0,
            is_pnpm_monorepo:
              scannedProject.signals.projectType === 'monorepo' &&
              existsSync(join(scannedProject.path, 'pnpm-workspace.yaml'))
                ? 1
                : 0,
            is_turborepo: scannedProject.signals.techStack.includes('Turborepo')
              ? 1
              : 0,
            monorepo_type:
              scannedProject.signals.projectType === 'monorepo'
                ? detectMonorepoType(scannedProject)
                : null,

            // Documentation flags (convert booleans to 0/1 for SQLite)
            has_prd:
              existsSync(join(scannedProject.path, 'docs/PRD.md')) ||
              existsSync(join(scannedProject.path, 'docs/architecture/prd.md'))
                ? 1
                : 0,
            has_project_overview: existsSync(
              join(scannedProject.path, 'README.md'),
            )
              ? 1
              : 0,
            has_architecture_docs: existsSync(
              join(scannedProject.path, 'docs/architecture'),
            )
              ? 1
              : 0,
          };

          if (existing) {
            // Update existing project
            await projectRepo.update(scannedProject.path, projectData);
            projectsUpdated++;
          } else {
            // Create new project
            await projectRepo.create(projectData);
            projectsAdded++;
          }
        } catch (error) {
          const errorMsg = `Failed to persist project ${scannedProject.path}: ${error}`;
          console.error(errorMsg);
          errors.push(errorMsg);
        }
      }

      const duration = Date.now() - startTime;

      console.log(`
Scan Results:
- Projects found: ${scannedProjects.length}
- Projects added: ${projectsAdded}
- Projects updated: ${projectsUpdated}
- Errors: ${errors.length}
- Duration: ${duration}ms
      `);

      return {
        projectsFound: scannedProjects.length,
        projectsAdded,
        projectsUpdated,
        errors,
      };
    },
  };
};
