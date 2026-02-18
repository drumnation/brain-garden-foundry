# Brain Garden Foundry

AI-powered project materialization system — production-ready monorepo template with generator-first approach for web, mobile, desktop, and backend applications. Features Brain Garden AI tooling, complete testing infrastructure, automated validation, and comprehensive development tools.

## 🚀 What's Included

This mega template provides everything you need to start building modern full-stack applications:

- **React Web App** - Vite + Mantine UI + Zustand + React Router
- **React Native Mobile** - Expo + Expo Router + React Native Paper
- **Electron Desktop** - Cross-platform desktop app with auto-updates
- **Express API** - Functional DI pattern with Prisma + Zod + JWT
- **Shared Packages** - Common utilities and UI components
- **Comprehensive Testing** - Unit, Integration, and E2E tests for all apps
- **Brain Monitor** - AI-assisted validation and error tracking
- **GitHub Actions** - Automated CI/CD workflows
- **Complete Tooling** - Biome (linting & formatting), TypeScript, Turborepo
- **🆕 Appwrite Deployment** - ONE-COMMAND deployment to REAL infrastructure

## 🎯 Quick Start

### ⚡ ONE-COMMAND Deployment (NEW!)

Deploy your entire backend infrastructure with ONE command:

```bash
# Clone template
git clone https://github.com/your-org/brain-garden-monorepo-template.git my-project
cd my-project

# Deploy to Appwrite (30 seconds!)
./scripts/deploy-to-appwrite.sh my-project

# Done! Your backend is ready with:
# ✅ Database
# ✅ Authentication
# ✅ File Storage
# ✅ API Endpoints
# ✅ Custom Domain
```

### 🚀 Mega Setup (Recommended)

The fastest way to get started is using our mega setup system:

```bash
# Use this template on GitHub or clone it
git clone https://github.com/your-org/brain-garden-monorepo-template.git my-project
cd my-project

# Install dependencies
pnpm install

# Run mega setup - interactive wizard
pnpm setup:mega
```

This interactive wizard will:
- Ask questions about your project
- Generate a complete PRD (Product Requirements Document)
- Create apps and packages based on your needs
- Set up all documentation automatically
- Recommend appropriate coding rules
- Validate everything with brain-monitor

See the [Mega Setup Guide](./docs/guides/mega-setup-guide.md) for detailed instructions.

### Manual Setup

If you prefer manual control, you can use individual generators:

```bash
# Generate your apps (choose what you need)
pnpm gen:express-api     # Generate Express API server → apps/api
pnpm gen:react-web       # Generate React web app → apps/web (if available)
pnpm gen:react-native    # Generate React Native app → apps/mobile (if available)
pnpm gen:electron        # Generate Electron desktop app → apps/desktop (if available)

# Start all generated apps in development mode
pnpm dev

# Run validation
pnpm validate
```

### What Runs When You `pnpm dev` (After Generating Apps)

The following apps run **after you generate them** using the generators above:

- **Web App** → http://localhost:3000 (after `pnpm gen:react-web`)
- **API** → http://localhost:8080 (after `pnpm gen:express-api`)
- **Mobile** → Expo Dev Server (after `pnpm gen:react-native`)
- **Desktop** → Electron app window (after `pnpm gen:electron`)

## 📦 Template Structure

```
brain-garden-monorepo-template/
├── apps/                      # Executable applications
│   ├── web/                  # React web app (Vite + Mantine UI)
│   ├── mobile/               # React Native app (Expo)
│   ├── desktop/              # Electron desktop app
│   └── api/                  # Express REST API (Prisma + JWT)
├── packages/                  # Shared libraries (no build step)
│   ├── shared-utils/         # Common utility functions
│   └── shared-ui/            # Shared React components
├── tooling/                   # Shared tooling packages
│   ├── brain-monitor/        # Validation orchestration
│   ├── testing/              # Centralized test configs
│   ├── typescript/           # TypeScript configurations
│   ├── logger/               # Structured logging
│   └── generators/           # App/package generators
├── docs/                      # Documentation
│   ├── guides/               # How-to guides
│   ├── architecture/         # Architecture decisions
│   └── MEGA_TEMPLATE_SETUP.md
├── scripts/                   # Automation scripts
├── _errors/                   # Validation error reports (tracked in git)
├── _logs/                     # Application logs (tracked in git)
└── .github/workflows/         # GitHub Actions CI/CD
```

## Getting Started

### Prerequisites

- **Node.js**: 22+ (uses native ESM)
- **pnpm**: 9+ (package manager)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

### Environment Setup

1. Copy the root environment example:

```bash
cp .env.example .env
```

2. Configure your environment variables in the `.env` file

**Note**: This template uses `tooling/env-loader` to consolidate all environment variables in the monorepo root `.env` file. Individual apps should use `@kit/env-loader` to access environment variables rather than maintaining separate `.env` files.

### Running the Development Server

**Prerequisites:** Generate apps first using the generators (e.g., `pnpm gen:express-api`)

Start all generated apps with hot-reloading:

```bash
pnpm dev
```

**Available endpoints** (after generating apps):
- API: `http://localhost:8080` (after `pnpm gen:express-api`)
- Web: `http://localhost:3000` (after `pnpm gen:react-web`, if available)
- Mobile: Expo Dev Server (after `pnpm gen:react-native`, if available)
- Desktop: Electron window (after `pnpm gen:electron`, if available)

## Architecture

### Key Principles

1. **ESM-only**: All packages use `"type": "module"` - no CommonJS
2. **No build step for libraries**: Packages in `/packages` export TypeScript source directly
3. **Functional programming**: No classes, pure functions with dependency injection
4. **Strict typing**: TypeScript with `strict: true` and `noUncheckedIndexedAccess`
5. **Monorepo**: pnpm workspaces + Turborepo for task orchestration

### Technology Stack

- **Runtime**: Node.js 22+ (ESM)
- **Package Manager**: pnpm 9+
- **Build Orchestrator**: Turborepo
- **Backend Framework**: Express.js (functional DI pattern)
- **Type System**: TypeScript 5.7+
- **Testing**: Vitest
- **Validation**: Zod
- **Logging**: Custom `@kit/logger` (structured logging)

## Development Workflow

### Adding a New Feature

1. **Define types** in the appropriate shared package (e.g., `@starter/shared-utils` or create a new package using `pnpm gen:library`)
2. **Implement business logic** in the package's service layer
3. **Create API endpoints** in your Express app (e.g., `apps/api/src/modules/<feature>/`)
4. **Register routes** in your app's route configuration
5. **Write tests** using the centralized `@kit/testing` configs

### Package Naming Conventions

- **Apps**: `@[app-name]` (e.g., `@starter/web`, `@starter/api`)
- **Shared Packages**: `@starter/[package-name]` (e.g., `@starter/shared-utils`, `@starter/shared-ui`)
- **Tooling**: `@kit/[tool-name]` (e.g., `@kit/logger`, `@kit/testing`)

### Importing from Packages

```typescript
// Shared packages
import { formatDate, addDays } from '@starter/shared-utils';
import { Button } from '@starter/shared-ui';

// Tooling packages (use @kit/logger for all logging)
import { createLogger } from '@kit/logger';
import { loadEnvironment } from '@kit/env-loader/node';
```

## Available Scripts

### Root Level

```bash
pnpm dev              # Start all apps in development mode
pnpm build            # Build all apps
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode
pnpm test:unit        # Run unit tests only
pnpm test:integration # Run integration tests
pnpm test:e2e         # Run end-to-end tests
pnpm lint             # Lint all packages
pnpm typecheck        # Type-check all packages
pnpm format           # Format code with Biome
pnpm validate         # Run lint + typecheck + test
pnpm clean            # Remove all node_modules and build artifacts
```

### App Level Scripts

Each app (web, mobile, desktop, api) has its own scripts. For example, in `apps/api/`:

```bash
pnpm dev              # Start dev server with hot-reload
pnpm build            # Build for production
pnpm start            # Start production server
pnpm test             # Run all tests (unit, integration, e2e)
pnpm test:unit        # Run unit tests only
pnpm test:integration # Run integration tests
pnpm test:e2e         # Run end-to-end tests
```

## Agent Coordination with Brain Monitor

This project uses `@kit/brain-monitor` for real-time validation feedback and agent coordination:

```bash
pnpm monitor:dev      # Start development server with monitoring
pnpm monitor:errors   # Check validation errors before running tasks
pnpm monitor:logs     # View application logs
```

**Agents should**:
1. Check `_errors/` directory before running validation tasks
2. Check `_logs/` directory before restarting servers
3. Use `@kit/brain-monitor` CLI for validation insights

## Testing Strategy

- **Unit tests**: Test pure functions in isolation (packages)
- **Integration tests**: Test module interactions (API routes + services)
- **E2E tests**: Test complete user flows (API endpoints)

All tests use Vitest with parallel execution and watch mode support.

## Documentation

Core documentation is organized under `/docs`:
- `/docs/architecture/` - System architecture and design decisions
- `/docs/guides/` - Development guides and workflows
- `/docs/maintenance/` - Maintenance documentation and reports
- `/docs/ai-platforms/` - AI assistant instruction files (auto-generated)

**Note:** Per the documentation placement policy, only `README.md`, `CHANGELOG.md`, and `.env.example` are allowed in the root directory.

## AI Assistant Rules

This project uses a modular rules system for AI assistants:
- **Source:** `.brain/rules/**/*.rules.mdc`
- **Generated:** `docs/ai-platforms/{CLAUDE.md,AGENTS.md,GEMINI.md}`
- **Build:** `pnpm rules:build`
- **Watch:** `pnpm rules:watch`

See `docs/ai-platforms/README.md` for details.

## Project Rules & Documentation

Core architectural rules are documented in `.cursor/_backup/`:

- [Monorepo Structure](/.cursor/_backup/monorepo-structure-and-configuration.rules.mdc)
- [Express Architecture](/.cursor/_backup/monorepo-node-express-architecture.rules.mdc)
- [Functional Programming](/.cursor/_backup/node.functional-isolated-concerns.rules.mdc)

## API Documentation

### Health Check

```
GET /health
```

Returns server health status.

### API v1 Base

```
GET /api/v1/
```

Base API endpoint. Feature-specific endpoints:

- `/api/v1/calendar` - Calendar operations (to be implemented)
- `/api/v1/tasks` - Task operations (to be implemented)

Detailed API documentation will be added as features are implemented.

## Contributing

When contributing:

1. Follow the functional programming patterns (no classes)
2. Maintain strict TypeScript typing
3. Write tests for all new features
4. Update documentation
5. Run `pnpm validate` before committing

## License

Private project - all rights reserved.

## Applications

| Path | Type | Description |
|------|------|-------------|
| `apps/web` | web | web |
| `apps/api` | api | api |
