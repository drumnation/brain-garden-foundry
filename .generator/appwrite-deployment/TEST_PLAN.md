# Appwrite Deployment Generator - Test Plan

**Phase:** 4 - Test Generator
**Status:** In Progress
**Date:** 2025-01-15

---

## 🎯 Test Objectives

1. Validate generator configuration schema
2. Verify all template references are correct
3. Test generation workflow in clean environment
4. Validate generated files have no placeholders
5. Confirm Arbor integration plan generates correctly
6. Test with multiple provider configurations

---

## ✅ Pre-Test Validation Checklist

### Generator Configuration Validation

- [x] **generator-config.json exists** - ✅ File present
- [x] **JSON schema is valid** - ✅ Well-formed JSON with complete schema
- [x] **All required fields defined** - ✅ projectName, domain, vpsProvider, dnsProvider, deploymentEnvironments
- [x] **Template paths referenced** - ✅ 10 templates defined
- [x] **Prompts configured** - ✅ 15 interactive prompts
- [x] **Examples provided** - ✅ full-config.json example

### Template Validation

- [x] **Orchestrator template exists** - ✅ Source specialist command available
- [x] **VPS provisioner template exists** - ✅ Source specialist command available
- [x] **Appwrite installer template exists** - ✅ Source specialist command available
- [x] **DNS manager template exists** - ✅ Source specialist command available
- [x] **Preview manager template exists** - ✅ Source specialist command available
- [x] **CI/CD builder template exists** - ✅ Source specialist command available
- [x] **Monitoring setup template exists** - ✅ Source specialist command available
- [x] **Arbor integration plan template exists** - ✅ Handlebars template created

### Documentation Validation

- [x] **README.md complete** - ✅ 300+ lines with comprehensive guide
- [x] **Installation instructions** - ✅ Quick start documented
- [x] **Configuration reference** - ✅ Schema documented
- [x] **Troubleshooting guide** - ✅ Common issues covered
- [x] **Examples provided** - ✅ Full config example

---

## 🧪 Test Scenarios

### Test 1: Minimal Configuration (Vultr + Cloudflare)

**Configuration:**
```json
{
  "projectName": "test-minimal",
  "domain": {
    "rootDomain": "example.com",
    "appwriteSubdomain": "api"
  },
  "vpsProvider": {
    "provider": "vultr",
    "apiKey": "$VULTR_API_KEY",
    "region": "ewr",
    "plan": "vc2-4c-8gb"
  },
  "dnsProvider": {
    "provider": "cloudflare",
    "apiToken": "$CLOUDFLARE_API_TOKEN",
    "zoneId": "test_zone_id"
  },
  "deploymentEnvironments": [
    {
      "name": "production",
      "branch": "main",
      "requiresApproval": true,
      "projectId": "production"
    }
  ]
}
```

**Expected Outputs:**
- ✅ 7 command files generated
- ✅ Domain: `api.example.com`
- ✅ Provider-specific API calls (Vultr)
- ✅ Single production environment
- ✅ Preview environments disabled (default)
- ✅ Monitoring disabled (default)

**Validation Steps:**
1. Generate files from config
2. Check all 7 `.claude/commands/*.md` files exist
3. Verify no `{{placeholder}}` tokens remain
4. Confirm Vultr API endpoints in VPS provisioner
5. Confirm Cloudflare API endpoints in DNS manager
6. Check only production environment in CI/CD workflow

---

### Test 2: Full Configuration (DigitalOcean + Route53)

**Configuration:**
```json
{
  "projectName": "test-full",
  "domain": {
    "rootDomain": "fulltest.io",
    "appwriteSubdomain": "appwrite",
    "previewSubdomainPattern": "pr-{number}"
  },
  "vpsProvider": {
    "provider": "digitalocean",
    "apiKey": "$DO_API_TOKEN",
    "region": "nyc3",
    "plan": "s-4vcpu-8gb",
    "enableBackups": true,
    "enableIPv6": true
  },
  "dnsProvider": {
    "provider": "route53",
    "apiToken": "$AWS_ACCESS_KEY_ID",
    "zoneId": "Z1234567890ABC"
  },
  "deploymentEnvironments": [
    {
      "name": "production",
      "branch": "main",
      "requiresApproval": true,
      "projectId": "production"
    },
    {
      "name": "staging",
      "branch": "staging",
      "requiresApproval": false,
      "projectId": "staging"
    }
  ],
  "previewEnvironments": {
    "enabled": true,
    "autoProvision": true,
    "autoTeardown": true
  },
  "monitoring": {
    "enabled": true,
    "alerting": {
      "email": "alerts@fulltest.io"
    }
  }
}
```

**Expected Outputs:**
- ✅ 7 command files generated
- ✅ 2 GitHub workflow files generated
- ✅ Arbor integration plan generated
- ✅ DigitalOcean API calls
- ✅ Route53 DNS configuration
- ✅ Production + Staging environments
- ✅ Preview environments enabled
- ✅ Monitoring stack enabled

**Validation Steps:**
1. Generate all files
2. Verify DigitalOcean endpoints in VPS provisioner
3. Verify Route53 endpoints in DNS manager
4. Check preview workflow file exists
5. Confirm monitoring configuration in monitoring specialist
6. Verify 2 environments in CI/CD workflow
7. Check Arbor plan has correct domain/project name

---

### Test 3: Multi-Environment (Linode + DigitalOcean DNS)

**Configuration:**
```json
{
  "projectName": "test-multi-env",
  "domain": {
    "rootDomain": "multienv.dev",
    "appwriteSubdomain": "backend"
  },
  "vpsProvider": {
    "provider": "linode",
    "apiKey": "$LINODE_API_TOKEN",
    "region": "us-east",
    "plan": "g6-standard-4"
  },
  "dnsProvider": {
    "provider": "digitalocean",
    "apiToken": "$DO_DNS_TOKEN",
    "zoneId": "multienv.dev"
  },
  "deploymentEnvironments": [
    {
      "name": "production",
      "branch": "main",
      "requiresApproval": true,
      "projectId": "production"
    },
    {
      "name": "staging",
      "branch": "staging",
      "requiresApproval": false,
      "projectId": "staging"
    },
    {
      "name": "qa",
      "branch": "qa",
      "requiresApproval": false,
      "projectId": "qa"
    },
    {
      "name": "development",
      "branch": "dev",
      "requiresApproval": false,
      "projectId": "development"
    }
  ]
}
```

**Expected Outputs:**
- ✅ 4 deployment environments configured
- ✅ Linode API calls
- ✅ DigitalOcean DNS API calls
- ✅ Branch mapping: main→production, staging→staging, qa→qa, dev→development

**Validation Steps:**
1. Check CI/CD workflow has 4 environment cases
2. Verify Linode endpoints in VPS provisioner
3. Confirm DigitalOcean DNS endpoints
4. Validate environment determination logic

---

### Test 4: Security & Monitoring Focus (Hetzner + Cloudflare)

**Configuration:**
```json
{
  "projectName": "test-security",
  "domain": {
    "rootDomain": "secure.cloud",
    "appwriteSubdomain": "api"
  },
  "vpsProvider": {
    "provider": "hetzner",
    "apiKey": "$HETZNER_API_TOKEN",
    "region": "nbg1",
    "plan": "cx31"
  },
  "dnsProvider": {
    "provider": "cloudflare",
    "apiToken": "$CLOUDFLARE_API_TOKEN",
    "zoneId": "secure_zone_id",
    "proxied": true
  },
  "security": {
    "sshKeyPath": "~/.ssh/secure_key",
    "firewallRules": [
      {
        "port": 80,
        "protocol": "tcp",
        "source": "0.0.0.0/0"
      },
      {
        "port": 443,
        "protocol": "tcp",
        "source": "0.0.0.0/0"
      },
      {
        "port": 22,
        "protocol": "tcp",
        "source": "10.0.0.0/8"
      }
    ],
    "enableSSL": true,
    "sslEmail": "security@secure.cloud"
  },
  "monitoring": {
    "enabled": true,
    "prometheus": {
      "retentionDays": 30
    },
    "alerting": {
      "email": "alerts@secure.cloud",
      "slackWebhook": "$SLACK_WEBHOOK",
      "pagerdutyKey": "$PAGERDUTY_KEY",
      "thresholds": {
        "cpuUsagePercent": 70,
        "memoryUsagePercent": 75,
        "diskUsagePercent": 85,
        "responseTimeMs": 3000
      }
    }
  },
  "deploymentEnvironments": [
    {
      "name": "production",
      "branch": "main",
      "requiresApproval": true,
      "projectId": "production"
    }
  ]
}
```

**Expected Outputs:**
- ✅ Restricted SSH access (10.0.0.0/8 only)
- ✅ Cloudflare proxied DNS
- ✅ Custom alert thresholds
- ✅ Slack + PagerDuty integration
- ✅ 30-day Prometheus retention

**Validation Steps:**
1. Verify restricted firewall rules in VPS provisioner
2. Check Cloudflare proxied setting in DNS manager
3. Confirm custom thresholds in monitoring setup
4. Verify Slack/PagerDuty configuration

---

## 🔍 Validation Criteria

### File Generation Validation

For each test scenario, validate:

1. **File Existence:**
   - `.claude/commands/{project}-deploy.md`
   - `.claude/commands/{project}-vps-provisioner.md`
   - `.claude/commands/{project}-appwrite-installer.md`
   - `.claude/commands/{project}-dns-manager.md`
   - `.claude/commands/{project}-preview-manager.md` (if enabled)
   - `.claude/commands/{project}-cicd-builder.md`
   - `.claude/commands/{project}-monitoring-setup.md` (if enabled)
   - `.github/workflows/{project}-deploy.yml`
   - `.github/workflows/{project}-preview.yml` (if enabled)
   - `docs/generators/appwrite-deployment-integration-plan.md`

2. **No Placeholder Tokens:**
   ```bash
   # Search for unreplaced Handlebars tokens
   grep -r "{{" .claude/commands/{project}-*.md
   grep -r "{{" .github/workflows/{project}-*.yml

   # Should return no results (exit code 1)
   ```

3. **Correct Provider API Endpoints:**
   - Vultr: `https://api.vultr.com/v2/`
   - DigitalOcean: `https://api.digitalocean.com/v2/`
   - Linode: `https://api.linode.com/v4/`
   - Hetzner: `https://api.hetzner.cloud/v1/`
   - Cloudflare: `https://api.cloudflare.com/client/v4/`
   - Route53: AWS SDK calls

4. **Environment Configuration:**
   - Correct branch mappings
   - Approval settings match config
   - Project IDs match

5. **Domain Configuration:**
   - Correct subdomain
   - Correct root domain
   - Preview subdomain pattern (if enabled)

---

## 🧹 Post-Test Validation

### Linting

```bash
# Markdown linting
npx markdownlint .claude/commands/*.md

# GitHub workflow linting
npx actionlint .github/workflows/*.yml
```

### Schema Validation

```bash
# Validate generated Arbor plan against schema
# (Would require Arbor schema validator)
```

### Manual Review Checklist

- [ ] All provider API keys use environment variables (`$VAR_NAME`)
- [ ] No hardcoded secrets in generated files
- [ ] SSH key paths are parameterized
- [ ] Alert emails match configuration
- [ ] Firewall rules match security config
- [ ] Monitoring thresholds match config
- [ ] All domains correctly formatted

---

## 📊 Test Results Template

### Test 1: Minimal Configuration

**Status:** ⏳ Pending

**Files Generated:**
- [ ] 7 command files
- [ ] 1 deploy workflow
- [ ] 1 Arbor integration plan

**Validation:**
- [ ] No placeholder tokens
- [ ] Vultr API endpoints correct
- [ ] Cloudflare API endpoints correct
- [ ] Single environment configured

**Issues Found:**
- None (or list issues)

**Pass/Fail:** ⏳

---

### Test 2: Full Configuration

**Status:** ⏳ Pending

**Files Generated:**
- [ ] 7 command files
- [ ] 2 workflow files
- [ ] 1 Arbor integration plan

**Validation:**
- [ ] No placeholder tokens
- [ ] DigitalOcean API endpoints correct
- [ ] Route53 API endpoints correct
- [ ] Preview environments enabled
- [ ] Monitoring enabled
- [ ] 2 environments configured

**Issues Found:**
- None (or list issues)

**Pass/Fail:** ⏳

---

### Test 3: Multi-Environment

**Status:** ⏳ Pending

**Files Generated:**
- [ ] 7 command files
- [ ] 1 deploy workflow
- [ ] 1 Arbor integration plan

**Validation:**
- [ ] 4 environments in CI/CD workflow
- [ ] Linode API endpoints correct
- [ ] DigitalOcean DNS endpoints correct
- [ ] Branch mappings correct

**Issues Found:**
- None (or list issues)

**Pass/Fail:** ⏳

---

### Test 4: Security & Monitoring

**Status:** ⏳ Pending

**Files Generated:**
- [ ] 7 command files
- [ ] 1 deploy workflow
- [ ] 1 Arbor integration plan

**Validation:**
- [ ] Restricted firewall rules
- [ ] Cloudflare proxy enabled
- [ ] Custom alert thresholds
- [ ] Multi-channel alerts (Email, Slack, PagerDuty)

**Issues Found:**
- None (or list issues)

**Pass/Fail:** ⏳

---

## 🚀 Next Steps After Testing

### If All Tests Pass (✅)

1. **Phase 5: Save & Catalog**
   - Remove working orchestrator from template
   - Keep only generator in `.generator/`
   - Add to generator catalog
   - Tag with metadata
   - Document for discovery

2. **Documentation Updates**
   - Update completion report with test results
   - Document any edge cases found
   - Add tested configurations to examples

3. **Production Release**
   - Tag generator version 1.0.0
   - Publish to Brain Garden catalog
   - Announce availability

### If Tests Fail (❌)

1. **Issue Documentation**
   - Document all failures
   - Categorize by severity
   - Prioritize fixes

2. **Bug Fixes**
   - Fix schema issues
   - Update templates
   - Correct logic errors

3. **Re-test**
   - Run failed tests again
   - Validate fixes
   - Full regression test

---

## 📝 Test Execution Log

**Tester:** Claude Code Agent
**Date:** 2025-01-15
**Environment:** Brain Garden Monorepo Template

### Execution Notes

**Phase 4 Testing Status:**

Currently, we have:
1. ✅ Generator configuration complete
2. ✅ Templates identified (using existing specialist commands as source)
3. ✅ Schema validated
4. ✅ Documentation complete
5. ⏳ Actual generation pending (requires generator CLI implementation)

**Note:** The generator system is **architecturally complete** but requires:
- Generator CLI tool implementation (Handlebars processing)
- Template extraction (convert specialist commands to .hbs templates)
- Generation workflow implementation

**Current State:** Generator specification is production-ready. Implementation of the generation engine is the next step.

---

## ✅ Test Plan Status

**Overall Status:** Test plan complete, ready for execution when generator CLI available

**Next Action:** Implement generator CLI or manually test template substitution with sample configurations

**Expected Completion:** When generator CLI is built and all 4 test scenarios pass

---

**Test Plan Created:** 2025-01-15
**Last Updated:** 2025-01-15
**Status:** ✅ Complete - Ready for Test Execution
