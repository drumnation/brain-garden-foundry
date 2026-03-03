/**
 * Project detection utilities
 * Identifies projects and their characteristics
 */

import {existsSync} from 'fs';
import {readdir, readFile, stat} from 'fs/promises';
import {basename, join} from 'path';
import type {ProjectSignals} from './scanner.types.ts';

/**
 * Check if a directory is a project root
 */
export const isProjectRoot = async (dirPath: string): Promise<boolean> => {
  // Primary indicators
  const primaryIndicators = [
    'package.json',
    'composer.json',
    'requirements.txt',
    'Gemfile',
    'Cargo.toml',
    'go.mod',
    'pom.xml',
    'build.gradle',
    '.git',
  ];

  for (const indicator of primaryIndicators) {
    if (existsSync(join(dirPath, indicator))) {
      return true;
    }
  }

  return false;
};

/**
 * Detect project signals and characteristics
 */
export const detectProjectSignals = async (
  projectPath: string,
): Promise<ProjectSignals> => {
  const signals: ProjectSignals = {
    hasPackageJson: existsSync(join(projectPath, 'package.json')),
    hasGitRepo: existsSync(join(projectPath, '.git')),
    hasTsConfig: existsSync(join(projectPath, 'tsconfig.json')),
    hasReadme:
      existsSync(join(projectPath, 'README.md')) ||
      existsSync(join(projectPath, 'readme.md')),
    hasTests: false,
    hasBrainGarden:
      existsSync(join(projectPath, '.claude')) &&
      existsSync(join(projectPath, '.claude/agent-communication-prototype')),
    hasClaudeRules:
      existsSync(join(projectPath, 'CLAUDE.md')) ||
      existsSync(join(projectPath, '.clinerules')),
    hasCursorRules: existsSync(join(projectPath, '.cursorrules')),
    hasDockerfile:
      existsSync(join(projectPath, 'Dockerfile')) ||
      existsSync(join(projectPath, 'docker-compose.yml')),
    hasCI:
      existsSync(join(projectPath, '.github/workflows')) ||
      existsSync(join(projectPath, '.gitlab-ci.yml')) ||
      existsSync(join(projectPath, '.circleci')),
    techStack: [],
    projectType: 'unknown',
  };

  // Check for test directories
  const testDirs = ['test', 'tests', '__tests__', 'spec'];
  for (const testDir of testDirs) {
    if (existsSync(join(projectPath, testDir))) {
      signals.hasTests = true;
      break;
    }
  }

  // Detect tech stack from package.json
  if (signals.hasPackageJson) {
    try {
      const packageJsonContent = await readFile(
        join(projectPath, 'package.json'),
        'utf-8',
      );
      const packageJson = JSON.parse(packageJsonContent);

      const deps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      // Detect frameworks
      if (deps.react || deps['react-dom']) signals.techStack.push('React');
      if (deps.vue) signals.techStack.push('Vue');
      if (deps.angular || deps['@angular/core'])
        signals.techStack.push('Angular');
      if (deps.next) signals.techStack.push('Next.js');
      if (deps.express) signals.techStack.push('Express');
      if (deps.fastify) signals.techStack.push('Fastify');
      if (deps.electron) signals.techStack.push('Electron');
      if (deps.svelte) signals.techStack.push('Svelte');
      if (deps.typescript) signals.techStack.push('TypeScript');
      if (deps.vite) signals.techStack.push('Vite');
      if (deps.webpack) signals.techStack.push('Webpack');
      if (deps.turbo) signals.techStack.push('Turborepo');

      // Detect project type
      if (
        packageJson.workspaces ||
        existsSync(join(projectPath, 'pnpm-workspace.yaml'))
      ) {
        signals.projectType = 'monorepo';
      } else if (deps.electron) {
        signals.projectType = 'electron-app';
      } else if (deps.next || deps.gatsby) {
        signals.projectType = 'nextjs-app';
      } else if (deps.react || deps.vue || deps.angular) {
        signals.projectType = 'web-app';
      } else if (deps.express || deps.fastify || deps.koa) {
        signals.projectType = 'api-server';
      } else if (packageJson.bin) {
        signals.projectType = 'cli-tool';
      } else {
        signals.projectType = 'library';
      }
    } catch (_error) {
      // Failed to parse package.json
    }
  }

  // Check for other language indicators
  if (
    existsSync(join(projectPath, 'requirements.txt')) ||
    existsSync(join(projectPath, 'setup.py'))
  ) {
    signals.techStack.push('Python');
    signals.projectType =
      signals.projectType === 'unknown' ? 'python-app' : signals.projectType;
  }

  if (existsSync(join(projectPath, 'go.mod'))) {
    signals.techStack.push('Go');
    signals.projectType =
      signals.projectType === 'unknown' ? 'go-app' : signals.projectType;
  }

  if (existsSync(join(projectPath, 'Cargo.toml'))) {
    signals.techStack.push('Rust');
    signals.projectType =
      signals.projectType === 'unknown' ? 'rust-app' : signals.projectType;
  }

  return signals;
};

/**
 * Get project description from README
 */
export const getProjectDescription = async (
  projectPath: string,
): Promise<string | undefined> => {
  const readmeFiles = ['README.md', 'readme.md', 'Readme.md'];

  for (const readmeFile of readmeFiles) {
    const readmePath = join(projectPath, readmeFile);
    if (existsSync(readmePath)) {
      try {
        const content = await readFile(readmePath, 'utf-8');
        // Get first paragraph after title
        const lines = content.split('\n').filter((line) => line.trim());

        // Skip title (usually first line starting with #)
        let startIdx = 0;
        if (lines[0]?.startsWith('#')) {
          startIdx = 1;
        }

        // Find first non-heading paragraph
        for (let i = startIdx; i < Math.min(lines.length, 10); i++) {
          const line = lines[i];
          if (
            !line.startsWith('#') &&
            !line.startsWith('![') &&
            !line.startsWith('<')
          ) {
            return line.slice(0, 200); // Limit to 200 chars
          }
        }
      } catch (_error) {
        // Failed to read README
      }
    }
  }

  return undefined;
};

/**
 * Calculate directory size in MB
 */
export const getDirectorySize = async (dirPath: string): Promise<number> => {
  let totalSize = 0;

  async function calculateSize(path: string): Promise<void> {
    try {
      const stats = await stat(path);

      if (stats.isDirectory()) {
        // Skip node_modules and other heavy directories
        const dirName = basename(path);
        if (
          dirName === 'node_modules' ||
          dirName === '.git' ||
          dirName === 'dist' ||
          dirName === 'build'
        ) {
          return;
        }

        const items = await readdir(path);
        await Promise.all(items.map((item) => calculateSize(join(path, item))));
      } else {
        totalSize += stats.size;
      }
    } catch (_error) {
      // Ignore permission errors
    }
  }

  await calculateSize(dirPath);
  return Math.round((totalSize / (1024 * 1024)) * 10) / 10; // Convert to MB with 1 decimal
};
