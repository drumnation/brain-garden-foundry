#!/usr/bin/env tsx
/**
 * Build Consolidated Rules
 *
 * Reads source rules from .cursor/rules-source-{mode} directories and generates
 * platform-specific instruction files.
 *
 * Usage:
 *   tsx .cursor/sync/build-consolidated-rules.ts [--strict]
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';
import { contexts, type Context } from './contexts.js';

// ESM workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..', '..');

interface RuleFrontmatter {
  description?: string;
  scopes?: string[];
  alwaysApply?: boolean;
  globs?: string[];
}

interface Rule {
  filePath: string;
  frontmatter: RuleFrontmatter;
  content: string;
  category: string;
}

type ClaudeMode = 'builder';

const STRICT_MODE = process.argv.includes('--strict');

/**
 * Get CLAUDE_MODE from .env file
 */
function getClaudeMode(): ClaudeMode {
  const envPath = join(ROOT_DIR, '.env');

  if (!existsSync(envPath)) {
    console.error('❌ No .env file found at root. Creating with default mode.');
    writeFileSync(envPath, 'CLAUDE_MODE=builder\n');
    return 'builder';
  }

  const envContent = readFileSync(envPath, 'utf-8');
  const modeMatch = envContent.match(/CLAUDE_MODE=([\w-]+)/);

  if (!modeMatch) {
    console.error('CLAUDE_MODE not found in .env. Add: CLAUDE_MODE=builder');
    process.exit(1);
  }

  const mode = modeMatch[1] as ClaudeMode;

  if (mode !== 'builder') {
    console.error(`Invalid CLAUDE_MODE: ${mode}. Must be 'builder'`);
    process.exit(1);
  }

  return mode;
}

/**
 * Check if rules need rebuilding after mode change
 */
function checkRulesSyncStatus(currentMode: ClaudeMode) {
  const statusFile = join(__dirname, '..', '.last-build-mode');

  if (!existsSync(statusFile)) {
    writeFileSync(statusFile, currentMode);
    return;
  }

  const lastMode = readFileSync(statusFile, 'utf-8').trim() as ClaudeMode;

  if (lastMode !== currentMode) {
    console.warn('\n🚨 MODE MISMATCH!');
    console.warn(`   .env says: ${currentMode.toUpperCase()}`);
    console.warn(`   Rules built for: ${lastMode.toUpperCase()}\n`);
  }

  writeFileSync(statusFile, currentMode);
}

// Get mode and set rules directory
const CLAUDE_MODE = getClaudeMode();
checkRulesSyncStatus(CLAUDE_MODE);

const RULES_SOURCE_DIR = join('.cursor', 'rules');

/**
 * Parse YAML frontmatter from rule content
 */
function parseRuleFrontmatter(content: string): { frontmatter: RuleFrontmatter; body: string } {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!frontmatterMatch) {
    return { frontmatter: {}, body: content };
  }

  const [, yamlContent, body] = frontmatterMatch;
  const frontmatter: RuleFrontmatter = {};

  // Simple YAML parser for our limited needs
  const lines = yamlContent.split('\n');
  let currentKey: keyof RuleFrontmatter | null = null;

  for (const line of lines) {
    if (line.trim().startsWith('#') || !line.trim()) continue;

    if (line.startsWith('  - ')) {
      // Array item
      const value = line.substring(4).trim().replace(/^["']|["']$/g, '');
      if (currentKey === 'scopes' || currentKey === 'globs') {
        frontmatter[currentKey] = frontmatter[currentKey] || [];
        (frontmatter[currentKey] as string[]).push(value);
      }
    } else if (line.includes(':')) {
      const [key, ...valueParts] = line.split(':');
      const trimmedKey = key.trim() as keyof RuleFrontmatter;
      const value = valueParts.join(':').trim();

      currentKey = trimmedKey;

      if (trimmedKey === 'alwaysApply') {
        frontmatter[trimmedKey] = value === 'true';
      } else if (trimmedKey === 'description') {
        frontmatter[trimmedKey] = value.replace(/^["']|["']$/g, '');
      } else if (trimmedKey === 'scopes' || trimmedKey === 'globs') {
        if (value && !value.includes('\n')) {
          // Inline array
          frontmatter[trimmedKey] = value.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
        } else {
          frontmatter[trimmedKey] = [];
        }
      }
    }
  }

  return { frontmatter, body };
}

/**
 * Recursively find all .rules.mdc files
 */
function findRuleFiles(dir: string, baseDir: string = dir): string[] {
  const files: string[] = [];

  for (const item of readdirSync(dir)) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...findRuleFiles(fullPath, baseDir));
    } else if (item.endsWith('.rules.mdc')) {
      files.push(relative(baseDir, fullPath));
    }
  }

  return files;
}

/**
 * Load all rules from source directory
 */
function loadRules(): Rule[] {
  const rules: Rule[] = [];
  const ruleFiles = findRuleFiles(RULES_SOURCE_DIR);

  for (const relPath of ruleFiles) {
    const fullPath = join(RULES_SOURCE_DIR, relPath);
    const content = readFileSync(fullPath, 'utf-8');
    const { frontmatter, body } = parseRuleFrontmatter(content);

    // Extract category from path (e.g., "agent/pattern" from "agent/pattern/file.rules.mdc")
    const pathParts = relPath.split('/');
    const category = pathParts.slice(0, -1).join('/');

    rules.push({
      filePath: relPath,
      frontmatter,
      content: body,
      category,
    });
  }

  return rules;
}

/**
 * Filter rules by scope
 */
function filterRulesByScope(rules: Rule[], scopes: string[]): Rule[] {
  return rules.filter(rule => {
    // If alwaysApply is true, include it
    if (rule.frontmatter.alwaysApply) return true;

    // If no scopes defined, exclude it (requires explicit scoping)
    if (!rule.frontmatter.scopes || rule.frontmatter.scopes.length === 0) {
      if (STRICT_MODE) {
        console.warn(`Warning: Rule ${rule.filePath} has no scopes defined`);
      }
      return false;
    }

    // Check if any of the rule's scopes match our target scopes
    return rule.frontmatter.scopes.some(scope => scopes.includes(scope));
  });
}

/**
 * Generate hierarchical CLAUDE.md format
 */
function generateCLAUDEFormat(rules: Rule[]): string {
  const sections = new Map<string, Rule[]>();

  // Group rules by category
  for (const rule of rules) {
    const category = rule.category || 'general';
    if (!sections.has(category)) {
      sections.set(category, []);
    }
    sections.get(category)!.push(rule);
  }

  // Sort categories
  const sortedCategories = Array.from(sections.keys()).sort();

  let output = '# Claude Instructions - Monorepo Root\n\n';
  output += `This file is auto-generated from \`.cursor/rules/\`.\n\n`;
  output += '**DO NOT EDIT THIS FILE DIRECTLY.** Edit source files and run `pnpm rules:build`.\n\n';

  // Table of contents
  output += '## Table of Contents\n\n';
  for (const category of sortedCategories) {
    const displayCategory = category.replace(/\//g, ' / ').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    output += `- [${displayCategory}](#${category.replace(/\//g, '-')})\n`;
  }
  output += '\n---\n\n';

  // Generate sections
  for (const category of sortedCategories) {
    const categoryRules = sections.get(category)!;
    const displayCategory = category.replace(/\//g, ' / ').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    output += `## ${displayCategory}\n\n`;

    for (const rule of categoryRules) {
      if (rule.frontmatter.description) {
        output += `### ${rule.frontmatter.description}\n\n`;
      }

      output += rule.content.trim() + '\n\n';

      if (rule.frontmatter.globs && rule.frontmatter.globs.length > 0) {
        output += `**Applies to:** ${rule.frontmatter.globs.join(', ')}\n\n`;
      }

      output += '---\n\n';
    }
  }

  return output;
}

/**
 * Generate concise AGENTS.md format
 */
function generateAGENTSFormat(rules: Rule[]): string {
  let output = '# Agent Instructions - Monorepo Root\n\n';
  output += `This file is auto-generated from \`.cursor/rules/\`.\n\n`;
  output += '**DO NOT EDIT THIS FILE DIRECTLY.** Edit source files and run `pnpm rules:build`.\n\n';
  output += '---\n\n';

  // More concise, action-oriented format
  for (const rule of rules) {
    if (rule.frontmatter.description) {
      output += `## ${rule.frontmatter.description}\n\n`;
    }

    output += rule.content.trim() + '\n\n';
  }

  return output;
}

/**
 * Generate structured GEMINI.md format
 */
function generateGEMINIFormat(rules: Rule[]): string {
  let output = '# Gemini Instructions - Monorepo Root\n\n';
  output += `This file is auto-generated from \`.cursor/rules/\`.\n\n`;
  output += '**DO NOT EDIT THIS FILE DIRECTLY.** Edit source files and run `pnpm rules:build`.\n\n';
  output += '---\n\n';

  // Structured format with decision points
  for (const rule of rules) {
    output += '## Rule\n\n';

    if (rule.frontmatter.description) {
      output += `**Description:** ${rule.frontmatter.description}\n\n`;
    }

    if (rule.frontmatter.globs && rule.frontmatter.globs.length > 0) {
      output += `**File Patterns:** ${rule.frontmatter.globs.join(', ')}\n\n`;
    }

    output += '**Content:**\n\n';
    output += rule.content.trim() + '\n\n';
    output += '---\n\n';
  }

  return output;
}

/**
 * Generate single-file format (.clinerules, .windsurfrules)
 */
function generateSingleFileFormat(rules: Rule[], platform: 'cline' | 'windsurf'): string {
  let output = `# ${platform.charAt(0).toUpperCase() + platform.slice(1)} Instructions - Monorepo Root\n\n`;
  output += `This file is auto-generated from \`.cursor/rules/\`.\n\n`;
  output += '**DO NOT EDIT THIS FILE DIRECTLY.** Edit source files and run `pnpm rules:build`.\n\n';
  output += '---\n\n';

  for (const rule of rules) {
    if (rule.frontmatter.description) {
      output += `## ${rule.frontmatter.description}\n\n`;
    }

    output += rule.content.trim() + '\n\n';
  }

  return output;
}

/**
 * Main build function
 */
function build() {
  console.log('Loading rules from', RULES_SOURCE_DIR);
  const allRules = loadRules();
  console.log(`Found ${allRules.length} rule files`);

  // Generate outputs for each context
  for (const context of contexts) {
    console.log(`\nGenerating ${context.name} (${context.outputPath})`);
    console.log(`  Scopes: ${context.scopes.join(', ')}`);

    const filteredRules = filterRulesByScope(allRules, context.scopes);
    console.log(`  Filtered to ${filteredRules.length} rules`);

    let content: string;

    if (context.outputPath.endsWith('CLAUDE.md')) {
      content = generateCLAUDEFormat(filteredRules);
    } else if (context.outputPath.endsWith('AGENTS.md')) {
      content = generateAGENTSFormat(filteredRules);
    } else if (context.outputPath.endsWith('GEMINI.md')) {
      content = generateGEMINIFormat(filteredRules);
    } else if (context.outputPath.endsWith('.clinerules') || context.outputPath.endsWith('CLINE_RULES.md')) {
      content = generateSingleFileFormat(filteredRules, 'cline');
    } else if (context.outputPath.endsWith('.windsurfrules')) {
      content = generateSingleFileFormat(filteredRules, 'windsurf');
    } else {
      console.warn(`  Unknown output format for ${context.outputPath}, using CLAUDE format`);
      content = generateCLAUDEFormat(filteredRules);
    }

    writeFileSync(context.outputPath, content, 'utf-8');
    console.log(`  ✓ Written to ${context.outputPath}`);
  }

  console.log('\n✓ Build complete');
}

// Run build
try {
  build();
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
