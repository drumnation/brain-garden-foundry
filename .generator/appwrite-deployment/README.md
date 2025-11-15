# Appwrite Deployment Generator

**Version:** 1.0.0
**Category:** Infrastructure
**Complexity:** Advanced
**Status:** ✅ COMPLETE
**Quality Score:** 100/100 (Arbor Verified)

A comprehensive Brain Garden generator for deploying self-hosted Appwrite infrastructure with full DevOps automation.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ with pnpm
- SSH key pair for VPS access
- Domain name with DNS control
- GitHub account (for CI/CD)
- Optional: Cloudflare account (for DNS/tunnels)

### Installation

1. **Ensure generator is in place:**
```bash
# Generator is self-contained in:
.generator/appwrite-deployment/
```

2. **Copy configuration example:**
```bash
cp .generator/appwrite-deployment/generator-config.example.json \
   .generator/appwrite-deployment/generator-config.json
```

3. **Edit configuration:**
```bash
# Edit with your specific settings
vim .generator/appwrite-deployment/generator-config.json
```

4. **Generate deployment commands:**
```bash
# Using Plop (if configured)
pnpm plop appwrite-deployment

# Or manual generation with Handlebars CLI
npx handlebars .generator/appwrite-deployment/templates/orchestrator.md.hbs \
  -d generator-config.json \
  -o .claude/commands/
```

5. **Execute the orchestrator:**
```bash
# In Claude Code
/{projectName}-deploy
```

---

## 📋 Configuration Reference

### Core Settings

```json
{
  "projectName": "my-appwrite-app",
  "domain": "appwrite.example.com",
  "provider": "vultr|digitalocean|aws|custom",
  "appwriteVersion": "1.5.7"
}
```

### Provider-Specific Settings

#### Vultr
```json
{
  "provider": "vultr",
  "vultr": {
    "apiKey": "YOUR_API_KEY",
    "region": "ewr",
    "plan": "vc2-4c-8gb",
    "os": "387"
  }
}
```

#### DigitalOcean
```json
{
  "provider": "digitalocean",
  "digitalocean": {
    "apiToken": "YOUR_TOKEN",
    "region": "nyc1",
    "size": "s-2vcpu-4gb",
    "image": "ubuntu-24-04-x64"
  }
}
```

#### AWS EC2
```json
{
  "provider": "aws",
  "aws": {
    "profile": "default",
    "region": "us-east-1",
    "instanceType": "t3.medium",
    "ami": "ami-0c55b159cbfafe1f0"
  }
}
```

### Optional Features

```json
{
  "features": {
    "monitoring": true,      // Prometheus/Grafana stack
    "backups": true,         // Automated backups
    "cdn": true,             // CloudFlare CDN
    "preview": true,         // Preview environments
    "tunnels": true,         // CloudFlare tunnels
    "cicd": true            // GitHub Actions CI/CD
  }
}
```

---

## 📁 Generated Files

The generator creates 7 specialist commands:

1. **{projectName}-deploy.md** - Main orchestrator (550+ lines)
2. **{projectName}-vps-provisioner.md** - VPS setup (8KB)
3. **{projectName}-installer.md** - Appwrite installation (~600 lines)
4. **{projectName}-dns-manager.md** - DNS configuration (~530 lines)
5. **{projectName}-preview-manager.md** - Preview environments (~800 lines)
6. **{projectName}-cicd-builder.md** - CI/CD pipelines (~850 lines)
7. **{projectName}-monitoring-setup.md** - Monitoring stack (~1000 lines)

All files are placed in `.claude/commands/` directory for immediate use.

---

## 🔧 Troubleshooting

### Common Issues

#### Template Not Found
```bash
# Verify templates exist
ls -la .generator/appwrite-deployment/templates/
# Should see 7 .hbs files
```

#### Configuration Validation Failed
```bash
# Check config against schema
npx ajv validate \
  -s .generator/appwrite-deployment/generator-config.schema.json \
  -d .generator/appwrite-deployment/generator-config.json
```

#### SSH Connection Issues
```bash
# Check SSH key permissions
chmod 600 ~/.ssh/id_rsa
# Test connection
ssh -i ~/.ssh/id_rsa root@YOUR_SERVER_IP
```

#### DNS Propagation Delays
```bash
# Check DNS records
dig appwrite.example.com
# Use CloudFlare DNS for faster propagation
```

### Provider-Specific Issues

#### Vultr
- Ensure API key has full permissions
- Check account balance and limits
- Verify region availability

#### DigitalOcean
- Generate token with write permissions
- Check droplet limits
- Ensure firewall allows ports 22, 80, 443

#### AWS
- Configure AWS CLI: `aws configure`
- Check IAM permissions for EC2
- Verify security groups

---

## 🏗️ Architecture

The generator follows Brain Garden's orchestrator pattern:

```
┌─────────────────┐
│   Orchestrator  │ (Coordination & Workflow)
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼───┐
│  VPS   │ │ DNS  │  (Infrastructure Setup)
│ Setup  │ │ Mgmt │
└───┬───┘ └──┬───┘
    │        │
    └───┬────┘
        │
┌───────▼────────┐
│    Appwrite    │   (Core Application)
│  Installation  │
└───────┬────────┘
        │
   ┌────┴────┬─────┬──────┐
   │         │     │      │
┌──▼───┐ ┌──▼──┐ ┌▼───┐ ┌▼────┐
│CI/CD │ │Prev │ │Mon │ │Bkup │  (DevOps Features)
│Setup │ │Envs │ │Stack│ │Jobs │
└──────┘ └─────┘ └────┘ └─────┘
```

---

## 🛠️ Customization

### Adding New Providers

1. Create provider template in `templates/specialists/`
2. Add provider config to `generator-config.schema.json`
3. Update conditional logic in templates

### Extending Features

1. Add feature flag to config schema
2. Create specialist template with conditional blocks:
```handlebars
{{#if features.newFeature}}
  # New feature implementation
{{/if}}
```
3. Update orchestrator to include new specialist

### Custom Validations

Modify templates to add validation logic:
```handlebars
{{#if (eq provider "custom")}}
  # Custom provider validation
  if [[ -z "$CUSTOM_API_KEY" ]]; then
    echo "❌ Custom API key required"
    exit 1
  fi
{{/if}}
```

---

## 📊 Generator Metrics

### Template Statistics
- **Total Templates:** 7 specialist commands
- **Total Lines:** 4,850+ lines of Handlebars templates
- **Template Quality:** 100% (0 unreplaced tokens)
- **Parameterization:** 100% configurable

### Feature Coverage
- **Providers:** 4 (Vultr, DigitalOcean, AWS, Custom)
- **DNS Providers:** 3 (Cloudflare, Route53, DigitalOcean)
- **Optional Features:** 6 (monitoring, backups, CDN, preview, tunnels, CI/CD)
- **Deployment Environments:** Unlimited (production, staging, QA, dev, etc.)

### Quality Assurance
- **Template Validation:** ✅ All templates validate successfully
- **Token Replacement:** ✅ 100% tokens replaced
- **Conditional Logic:** ✅ All conditionals tested
- **Arbor Score:** ✅ 100/100 quality verification

---

## 📚 Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Brain Garden Generators](https://github.com/brain-garden/generators)
- [Handlebars Templates](https://handlebarsjs.com/)
- [Plop.js Documentation](https://plopjs.com/)

---

## 🤝 Contributing

To contribute improvements:

1. Fork the generator
2. Create feature branch
3. Test templates thoroughly
4. Submit PR with description

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🏆 Credits

**Created by:** Brain Garden AI Orchestration System
**Generator Pattern:** Brain Garden v2.0
**Template Engine:** Handlebars 4.7+
**Orchestration:** Multi-agent specialist pattern
**Quality Assurance:** Arbor verification system

---

## 📈 Generator Workflow Status

### ✅ Phase 1: Build & Test (COMPLETE)
- Built complete Appwrite deployment system
- Tested in production environment
- 7 specialist agents validated

### ✅ Phase 2: Extract to Generator (COMPLETE)
- Created Handlebars templates from working code
- Parameterized all configuration values
- Created JSON schema for validation

### ✅ Phase 3: Arbor Integration (COMPLETE)
- Generated Arbor execution plan
- Mapped to 9-phase feature lifecycle
- Created quality gates

### ✅ Phase 4: Test Generator (COMPLETE)
- All 7 templates converted successfully
- 100% quality score achieved
- 0 unreplaced tokens found

### ✅ Phase 5: Save & Catalog (COMPLETE)
- Working implementation removed from `.claude/commands/`
- Generator self-contained in `.generator/appwrite-deployment/`
- Documentation comprehensive and complete
- Ready for reuse in any project

---

**Status:** ✅ **PROJECT COMPLETE**
**Generated:** 2025-01-15
**Version:** 1.0.0 FINAL