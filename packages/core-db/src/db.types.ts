/**
 * Database types for PM Agent
 * Following the database-driven architecture where projects stay in place
 */

export interface Project {
  id?: number;
  name: string;
  path: string;

  // State
  lifecycle?: string; // discovered, building, using, reference, paused, abandoned
  paused?: boolean;
  paused_reason?: string;
  paused_at?: string;

  // Categorization
  category?: string; // app, tool, learning, work, experimental
  tags?: string; // JSON array

  // Ownership & Origin
  origin_type?: string; // created, cloned, forked
  ownership?: string; // mine, exploring, customized-fork, abandoned-clone
  contribution_level?: number; // 0-100
  original_repo_url?: string;
  forked_from?: string;
  became_mine_date?: string;

  // Timestamps
  discovered_at?: string;
  created_at?: string;
  last_worked_on?: string;
  last_opened?: string;

  // Git
  git_origin_url?: string;
  git_upstream_url?: string;
  git_default_branch?: string;

  // Purpose & Documentation
  purpose?: string;
  problem_solved?: string;
  gpt_summary?: string;
  ai_summary_updated?: string;

  // Data & Deployment
  has_real_data?: boolean;
  data_volume?: string;
  deployed?: boolean;
  deployed_url?: string;
  last_deployed_state?: string;

  // Versioning
  is_current_version?: boolean;
  version_number?: number;
  app_family?: string;
  superseded_by?: string;

  // Structure Flags
  has_brain_folder?: boolean;
  has_tooling_folder?: boolean;
  is_pnpm_monorepo?: boolean;
  is_npm_monorepo?: boolean;
  is_turborepo?: boolean;
  is_nx_monorepo?: boolean;
  monorepo_type?: string;

  // Documentation Flags
  has_prd?: boolean;
  has_project_overview?: boolean;
  has_architecture_docs?: boolean;
  has_bmad_docs?: boolean;
  has_cursor_rules?: boolean;
  has_claude_md?: boolean;
}

export interface QualityScore {
  id?: number;
  project_path: string;
  quality_score: number;
  test_coverage?: number;
  test_count?: number;
  eslint_score?: number;
  prettier_score?: number;
  typescript_score?: number;
  complexity_score?: number;
  doc_coverage?: number;
  has_readme?: boolean;
  has_tests?: boolean;
  has_ci?: boolean;
  has_docker?: boolean;
  build_status?: string;
  test_status?: string;
  calculated_at?: string;
}

export interface ProjectHealth {
  id?: number;
  project_path: string;
  health_score: number;
  days_since_last_activity?: number;
  activity_trend?: string;
  commit_frequency?: number;
  issue_count?: number;
  pr_count?: number;
  tech_debt_indicators?: string;
  next_recommended_action?: string;
  calculated_at?: string;
}

export interface ScanResult {
  projectsFound: number;
  projectsAdded: number;
  projectsUpdated: number;
  errors: string[];
  duration: number;
}

export interface ProjectFilter {
  lifecycle?: string;
  category?: string;
  ownership?: string;
  deployed?: boolean;
  hasBrainFolder?: boolean;
  hasClaudeMd?: boolean;
  hasCursorRules?: boolean;
  isPnpmMonorepo?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'last_worked_on' | 'discovered_at' | 'name' | 'lifecycle';
  sortOrder?: 'asc' | 'desc';
}
