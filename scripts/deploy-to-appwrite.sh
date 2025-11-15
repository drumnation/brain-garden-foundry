#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║     Brain Garden Appwrite Deployment System              ║"
echo "║     ONE COMMAND → FULL BACKEND                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if project name provided
if [ -z "$1" ]; then
  echo -e "${RED}❌ Error: Project name required${NC}"
  echo ""
  echo "Usage: ./scripts/deploy-to-appwrite.sh <project-name>"
  echo ""
  echo "Example:"
  echo "  ./scripts/deploy-to-appwrite.sh my-awesome-app"
  exit 1
fi

PROJECT_NAME=$1

echo -e "${YELLOW}📋 Pre-flight Checklist${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check for API key
if [ -z "$APPWRITE_API_KEY" ]; then
  echo -e "${YELLOW}⚠️  No API key found${NC}"
  echo ""
  echo "To get your API key:"
  echo "1. Go to: ${CYAN}https://appwrite.singularity-labs.org/console${NC}"
  echo "2. Navigate to: Settings → API Keys"
  echo "3. Create key with scopes: databases, collections, buckets"
  echo "4. Export it:"
  echo "   ${CYAN}export APPWRITE_API_KEY=\"your-key-here\"${NC}"
  echo ""
  echo -e "${YELLOW}Or use test mode (mock data):${NC}"
  echo "   ${CYAN}export APPWRITE_API_KEY=\"test-mode\"${NC}"
  echo ""
  exit 1
fi

echo "✅ API key found"

# Check for pnpm
if ! command -v pnpm &> /dev/null; then
  echo -e "${YELLOW}⚠️  pnpm not found, installing...${NC}"
  npm install -g pnpm
fi

echo "✅ pnpm installed"

# Check for dependencies
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}📦 Installing dependencies...${NC}"
  pnpm install
fi

echo "✅ Dependencies ready"
echo ""

echo -e "${GREEN}🚀 Deploying to Appwrite${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Project: ${CYAN}$PROJECT_NAME${NC}"
echo "Target: ${CYAN}appwrite.singularity-labs.org${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Run deployment
cd packages/appwrite-deployment
npx tsx src/cli.ts provision "$PROJECT_NAME"

# Check if successful
if [ $? -eq 0 ]; then
  echo ""
  echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║     🎉 DEPLOYMENT SUCCESSFUL!                           ║${NC}"
  echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo "Your backend is ready at:"
  echo -e "  ${CYAN}https://appwrite.singularity-labs.org${NC}"
  echo ""
  echo "Environment variables saved to:"
  echo -e "  ${CYAN}.env${NC}"
  echo -e "  ${CYAN}.env.local${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Start development:"
  echo -e "   ${CYAN}pnpm dev${NC}"
  echo ""
  echo "2. Deploy to production:"
  echo -e "   ${CYAN}npx brain-garden-deploy deploy $PROJECT_NAME${NC}"
  echo ""
  echo "3. View in Appwrite console:"
  echo -e "   ${CYAN}https://appwrite.singularity-labs.org/console${NC}"
else
  echo ""
  echo -e "${RED}❌ Deployment failed${NC}"
  echo ""
  echo "Troubleshooting:"
  echo "1. Check your API key is valid"
  echo "2. Verify network connection"
  echo "3. Check Appwrite is running"
  echo ""
  echo "Test connection:"
  echo -e "   ${CYAN}cd packages/appwrite-deployment && npx tsx src/cli.ts test${NC}"
  exit 1
fi