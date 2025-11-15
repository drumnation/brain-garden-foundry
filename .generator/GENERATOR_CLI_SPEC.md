# Brain Garden Generator CLI - Specification

**Version:** 1.0.0
**Status:** Specification Complete
**Implementation:** Pending

---

## 🎯 Overview

The Brain Garden Generator CLI is a command-line tool that processes generator configurations and produces parameterized code from templates.

---

## 🚀 Installation

```bash
# Global installation
npm install -g @brain-garden/generator-cli

# OR via pnpm
pnpm add -g @brain-garden/generator-cli

# Verify installation
brain-garden --version
```

---

## 📋 CLI Commands

### `brain-garden generate <generator-name>`

Generate files from a Brain Garden generator.

**Usage:**
```bash
brain-garden generate <generator-name> [options]
```

**Arguments:**
- `<generator-name>` - Name of generator (e.g., `appwrite-deployment`)

**Options:**
- `-c, --config <path>` - Path to configuration JSON file
- `-o, --output <path>` - Output directory (default: current directory)
- `-d, --dry-run` - Show what would be generated without creating files
- `-f, --force` - Overwrite existing files without prompting
- `-i, --interactive` - Use interactive prompts (default if no config)
- `-v, --verbose` - Show detailed generation logs
- `--no-arbor` - Skip Arbor integration plan generation

**Examples:**
```bash
# Interactive mode (prompts for configuration)
brain-garden generate appwrite-deployment

# With configuration file
brain-garden generate appwrite-deployment --config my-config.json

# Dry run to preview generation
brain-garden generate appwrite-deployment --dry-run

# Force overwrite without prompting
brain-garden generate appwrite-deployment --force

# Verbose output
brain-garden generate appwrite-deployment --verbose
```

---

### `brain-garden list`

List all available generators.

**Usage:**
```bash
brain-garden list [options]
```

**Options:**
- `-c, --category <name>` - Filter by category
- `-t, --tags <tags>` - Filter by tags (comma-separated)
- `-v, --verbose` - Show full descriptions

**Examples:**
```bash
# List all generators
brain-garden list

# List infrastructure generators
brain-garden list --category infrastructure

# List generators with specific tags
brain-garden list --tags deployment,monitoring
```

**Output:**
```
Available Generators:

📦 appwrite-deployment (v1.0.0)
   Category: infrastructure
   Tags: appwrite, deployment, monitoring, ci-cd
   Description: Complete Appwrite deployment orchestrator

📦 express-api-server (v1.0.0)
   Category: backend
   Tags: express, api, node
   Description: RESTful API server with Express.js

📦 react-component-library (v1.0.0)
   Category: frontend
   Tags: react, components, ui
   Description: React component library with Storybook
```

---

### `brain-garden info <generator-name>`

Show detailed information about a generator.

**Usage:**
```bash
brain-garden info <generator-name>
```

**Example:**
```bash
brain-garden info appwrite-deployment
```

**Output:**
```
Generator: appwrite-deployment
Version: 1.0.0
Category: infrastructure
Tags: appwrite, deployment, infrastructure, monitoring, ci-cd

Description:
  Complete Appwrite deployment orchestrator with VPS provisioning,
  installation, DNS, preview environments, CI/CD, and monitoring

Configuration Schema:
  Required fields:
    - projectName (string)
    - domain (object)
    - vpsProvider (object)
    - dnsProvider (object)
    - deploymentEnvironments (array)

  Optional fields:
    - previewEnvironments (object)
    - monitoring (object)
    - security (object)

Templates:
  - orchestrator.md.hbs → .claude/commands/{project}-deploy.md
  - vps-provisioner.md.hbs → .claude/commands/{project}-vps-provisioner.md
  - ... (7 templates total)

Prerequisites:
  - VPS provider API access
  - DNS provider API access
  - GitHub repository with Actions enabled
  - SSH key pair generated

Estimated Time:
  - Generation: < 30 seconds
  - Deployment: 45-60 minutes
```

---

### `brain-garden validate <config-file>`

Validate a generator configuration file.

**Usage:**
```bash
brain-garden validate <config-file>
```

**Example:**
```bash
brain-garden validate my-appwrite-config.json
```

**Output (Success):**
```
✅ Configuration is valid

Generator: appwrite-deployment
Project Name: cannabis-codex
Domain: appwrite.singularity-labs.org
VPS Provider: vultr (ewr, vc2-4c-8gb)
DNS Provider: cloudflare
Environments: production, staging
Preview Environments: enabled
Monitoring: enabled
```

**Output (Failure):**
```
❌ Configuration validation failed

Errors:
  - Missing required field: projectName
  - Invalid domain.rootDomain: Must be a valid domain name
  - vpsProvider.plan: "invalid-plan" is not a valid Vultr plan
  - deploymentEnvironments: Must have at least 1 environment

Warnings:
  - monitoring.alerting.email: No email configured for alerts
  - security.sshKeyPath: Path does not exist
```

---

### `brain-garden init`

Initialize a new generator in current directory.

**Usage:**
```bash
brain-garden init [options]
```

**Options:**
- `-n, --name <name>` - Generator name
- `-c, --category <category>` - Generator category
- `-t, --template <template>` - Base template to use

**Example:**
```bash
brain-garden init --name my-generator --category infrastructure
```

**Creates:**
```
.generator/my-generator/
├── generator-config.json
├── README.md
├── templates/
└── examples/
```

---

## 🔧 Generator Configuration Format

### `generator-config.json`

```json
{
  "name": "generator-name",
  "version": "1.0.0",
  "description": "Generator description",
  "category": "infrastructure|backend|frontend|testing|devops",
  "tags": ["tag1", "tag2"],

  "generatorType": "orchestrator-with-specialists|simple|multi-file",
  "outputType": "claude-commands|typescript|javascript|markdown",

  "schema": {
    "type": "object",
    "required": ["field1", "field2"],
    "properties": {
      "field1": {
        "type": "string",
        "description": "Field description",
        "examples": ["example1"]
      }
    }
  },

  "templates": [
    {
      "source": "templates/file.hbs",
      "destination": "output/{{projectName}}.md",
      "description": "Template description"
    }
  ],

  "prompts": [
    {
      "type": "input|list|checkbox|confirm",
      "name": "field.path",
      "message": "Prompt message",
      "default": "default value",
      "choices": ["option1", "option2"]
    }
  ],

  "dependencies": {
    "runtime": [],
    "devDependencies": []
  },

  "postGeneration": {
    "instructions": [
      "Step 1",
      "Step 2"
    ],
    "arborIntegration": {
      "enabled": true,
      "planPath": "path/to/plan.md"
    }
  },

  "metadata": {
    "author": "Author name",
    "license": "MIT",
    "prerequisites": ["Prerequisite 1"]
  }
}
```

---

## 🎨 Template System (Handlebars)

### Available Helpers

**String Manipulation:**
- `{{upperCase value}}` - Convert to UPPERCASE
- `{{lowerCase value}}` - Convert to lowercase
- `{{capitalize value}}` - Capitalize first letter
- `{{kebabCase value}}` - Convert to kebab-case
- `{{snakeCase value}}` - Convert to snake_case
- `{{camelCase value}}` - Convert to camelCase
- `{{pascalCase value}}` - Convert to PascalCase

**Conditionals:**
- `{{#if condition}}...{{/if}}`
- `{{#unless condition}}...{{/unless}}`
- `{{#if condition}}...{{else}}...{{/if}}`

**Iteration:**
- `{{#each array}}...{{/each}}`
- `{{#each object}}{{@key}}: {{this}}{{/each}}`

**Special:**
- `{{currentDate}}` - Current date (ISO 8601)
- `{{currentYear}}` - Current year
- `{{generateUuid}}` - Generate UUID v4

### Template Example

```handlebars
# {{projectName}} Deployment

**Domain:** {{domain.appwriteSubdomain}}.{{domain.rootDomain}}
**VPS Provider:** {{vpsProvider.provider}}

## Environments

{{#each deploymentEnvironments}}
- **{{name}}:** `{{branch}}` branch{{#if requiresApproval}} (requires approval){{/if}}
{{/each}}

{{#if monitoring.enabled}}
## Monitoring

- Prometheus: http://{{vpsIp}}:{{monitoring.prometheus.port}}
- Grafana: http://{{vpsIp}}:{{monitoring.grafana.port}}
{{/if}}
```

**Input:**
```json
{
  "projectName": "my-project",
  "domain": {
    "rootDomain": "example.com",
    "appwriteSubdomain": "api"
  },
  "vpsProvider": {
    "provider": "vultr"
  },
  "deploymentEnvironments": [
    {"name": "production", "branch": "main", "requiresApproval": true}
  ],
  "monitoring": {
    "enabled": true,
    "prometheus": {"port": 9090},
    "grafana": {"port": 3000}
  },
  "vpsIp": "140.82.14.49"
}
```

**Output:**
```markdown
# my-project Deployment

**Domain:** api.example.com
**VPS Provider:** vultr

## Environments

- **production:** `main` branch (requires approval)

## Monitoring

- Prometheus: http://140.82.14.49:9090
- Grafana: http://140.82.14.49:3000
```

---

## 📦 Generator Discovery

Generators are discovered from:

1. **Global generators:** `~/.brain-garden/generators/`
2. **Project generators:** `./.generator/`
3. **Package generators:** `node_modules/@brain-garden/generators-*/`

### Generator Registry Format

`~/.brain-garden/registry.json`

```json
{
  "generators": [
    {
      "name": "appwrite-deployment",
      "version": "1.0.0",
      "path": "/Users/user/.brain-garden/generators/appwrite-deployment",
      "category": "infrastructure",
      "tags": ["appwrite", "deployment"],
      "installedAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

---

## 🔄 Generation Workflow

```
1. Load generator-config.json
     ↓
2. Validate configuration schema
     ↓
3. Interactive prompts (if no config file)
     ↓
4. Merge config with defaults
     ↓
5. Load Handlebars templates
     ↓
6. Process each template
     ↓
7. Write output files
     ↓
8. Run post-generation scripts
     ↓
9. Display success summary
```

---

## 🚨 Error Handling

### Configuration Errors

```
❌ Error: Invalid configuration

File: my-config.json
Line: 15
Field: vpsProvider.plan

Error: "vc2-invalid" is not a valid Vultr plan

Valid plans:
  - vc2-1c-1gb
  - vc2-2c-4gb
  - vc2-4c-8gb
```

### Template Errors

```
❌ Error: Template processing failed

Template: templates/orchestrator.md.hbs
Line: 47

Error: Missing variable: domain.appwriteSubdomain

Context:
  domain: {
    rootDomain: "example.com"
    // appwriteSubdomain is missing
  }
```

### File Write Errors

```
❌ Error: Cannot write file

Path: .claude/commands/my-project-deploy.md
Reason: File already exists

Use --force to overwrite or --dry-run to preview changes
```

---

## 📊 CLI Output Format

### Progress Output

```
🚀 Generating from appwrite-deployment (v1.0.0)

📋 Configuration:
   Project: cannabis-codex
   Domain: appwrite.singularity-labs.org
   VPS: vultr (ewr, vc2-4c-8gb)
   Environments: 2 (production, staging)

📝 Processing templates...
   ✅ orchestrator.md.hbs → .claude/commands/cannabis-codex-deploy.md
   ✅ vps-provisioner.md.hbs → .claude/commands/cannabis-codex-vps-provisioner.md
   ✅ appwrite-installer.md.hbs → .claude/commands/cannabis-codex-appwrite-installer.md
   ✅ dns-manager.md.hbs → .claude/commands/cannabis-codex-dns-manager.md
   ✅ preview-manager.md.hbs → .claude/commands/cannabis-codex-preview-manager.md
   ✅ cicd-builder.md.hbs → .claude/commands/cannabis-codex-cicd-builder.md
   ✅ monitoring-setup.md.hbs → .claude/commands/cannabis-codex-monitoring-setup.md
   ✅ deploy.yml.hbs → .github/workflows/cannabis-codex-deploy.yml
   ✅ preview.yml.hbs → .github/workflows/cannabis-codex-preview.yml
   ✅ arbor-integration-plan.md.hbs → docs/generators/appwrite-deployment-integration-plan.md

✅ Generation complete!

📂 Files created:
   - 7 Claude commands
   - 2 GitHub workflows
   - 1 Arbor integration plan

📚 Next steps:
   1. Review generated files
   2. Set GitHub secrets (VULTR_API_KEY, CLOUDFLARE_API_TOKEN, etc.)
   3. Run: /cannabis-codex-deploy
```

---

## 🔌 Plugin System (Future)

### Custom Helpers

```javascript
// .brain-garden/helpers/custom.js
module.exports = {
  customHelper: (value) => {
    // Custom logic
    return transformedValue;
  }
};
```

### Custom Validators

```javascript
// .brain-garden/validators/custom.js
module.exports = {
  validateCustomField: (value, schema) => {
    // Validation logic
    return { valid: true };
  }
};
```

---

## 📝 Implementation Checklist

### Core Functionality
- [ ] CLI argument parsing (Commander.js)
- [ ] Generator discovery and loading
- [ ] Configuration schema validation (Ajv)
- [ ] Interactive prompts (Inquirer.js)
- [ ] Handlebars template processing
- [ ] File writing with conflict detection
- [ ] Post-generation scripts

### Commands
- [ ] `generate` command
- [ ] `list` command
- [ ] `info` command
- [ ] `validate` command
- [ ] `init` command

### Helpers
- [ ] String case conversion helpers
- [ ] Date helpers
- [ ] UUID generation
- [ ] Custom helper registration

### Error Handling
- [ ] Configuration validation errors
- [ ] Template processing errors
- [ ] File write errors
- [ ] Helpful error messages

### Testing
- [ ] Unit tests for helpers
- [ ] Integration tests for generation
- [ ] E2E tests with sample generators
- [ ] Error handling tests

---

## 🚀 Implementation Technologies

**Core:**
- Node.js >= 18
- TypeScript 5.x

**CLI:**
- Commander.js - CLI framework
- Inquirer.js - Interactive prompts
- Chalk - Terminal colors
- Ora - Spinners

**Template Processing:**
- Handlebars - Template engine
- Prettier - Code formatting

**Validation:**
- Ajv - JSON schema validation
- Zod - Runtime validation (alternative)

**File System:**
- fs-extra - Enhanced fs operations
- glob - File pattern matching

**Utilities:**
- lodash - Utility functions
- date-fns - Date formatting
- uuid - UUID generation

---

## 📦 Package Structure

```
@brain-garden/generator-cli/
├── src/
│   ├── cli/
│   │   ├── commands/
│   │   │   ├── generate.ts
│   │   │   ├── list.ts
│   │   │   ├── info.ts
│   │   │   ├── validate.ts
│   │   │   └── init.ts
│   │   ├── prompts/
│   │   └── index.ts
│   ├── core/
│   │   ├── generator.ts
│   │   ├── template.ts
│   │   ├── validator.ts
│   │   └── discovery.ts
│   ├── helpers/
│   │   ├── string.ts
│   │   ├── date.ts
│   │   └── registry.ts
│   └── index.ts
├── bin/
│   └── brain-garden.js
├── package.json
├── tsconfig.json
└── README.md
```

---

**Status:** ✅ Specification Complete - Ready for Implementation
**Next Step:** Implement CLI or manually test template substitution
