/**
 * Types for the project scanner
 */

export interface ScanConfig {
  rootPath: string;
  ignorePatterns?: string[];
  maxDepth?: number;
  followSymlinks?: boolean;
}

export interface ProjectSignals {
  hasPackageJson: boolean;
  hasGitRepo: boolean;
  hasTsConfig: boolean;
  hasReadme: boolean;
  hasTests: boolean;
  hasBrainGarden: boolean;
  hasClaudeRules: boolean;
  hasCursorRules: boolean;
  hasDockerfile: boolean;
  hasCI: boolean;
  techStack: string[];
  projectType: string;
}

export interface ScannedProject {
  path: string;
  name: string;
  signals: ProjectSignals;
  gitRemote?: string;
  lastModified?: Date;
  sizeMb?: number;
  description?: string;
}
