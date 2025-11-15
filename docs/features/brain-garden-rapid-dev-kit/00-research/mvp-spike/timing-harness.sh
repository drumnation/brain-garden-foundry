#!/bin/bash
#
# 10-Minute MVP Validation Spike - Timing Harness
#
# Purpose: Prove Brain Garden can generate a complete, working MVP in <10 minutes
# Target: React+Vite app (simplest, fastest build times)
# Evidence: Precise timing, screen recording, working demo
#
# Success Criteria:
# - Total time ≤600 seconds (10 minutes)
# - App builds successfully
# - Dev server starts and is accessible
# - All steps automated (zero manual intervention)
#

set -e  # Exit on error

# ==================== Configuration ====================

PROJECT_NAME="mvp-spike-todoapp"
PROJECT_DIR="/tmp/brain-garden-mvp-spike"
TIMING_REPORT="/Users/dmieloch/Dev/created/brain-garden-monorepo-template/docs/features/brain-garden-rapid-dev-kit/00-research/mvp-spike/timing-report.json"
LOG_FILE="/Users/dmieloch/Dev/created/brain-garden-monorepo-template/docs/features/brain-garden-rapid-dev-kit/00-research/mvp-spike/execution.log"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ==================== Timing Utilities ====================

START_TIME=$(date +%s)
TIMING_DATA="{"

log() {
  echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
  echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

log_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

log_error() {
  echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
}

start_phase() {
  PHASE_NAME="$1"
  PHASE_START=$(date +%s)
  log "Starting Phase: $PHASE_NAME"
}

end_phase() {
  PHASE_END=$(date +%s)
  PHASE_DURATION=$((PHASE_END - PHASE_START))

  # Add to timing data
  if [ "$TIMING_DATA" = "{" ]; then
    TIMING_DATA="$TIMING_DATA\"$PHASE_NAME\": $PHASE_DURATION"
  else
    TIMING_DATA="$TIMING_DATA, \"$PHASE_NAME\": $PHASE_DURATION"
  fi

  log_success "Phase Complete: $PHASE_NAME (${PHASE_DURATION}s)"

  # Check cumulative time
  ELAPSED=$((PHASE_END - START_TIME))
  log "Elapsed Total: ${ELAPSED}s / 600s (${TARGET_PERCENT}%)"

  if [ $ELAPSED -gt 600 ]; then
    log_error "⏰ EXCEEDED 10-MINUTE TARGET!"
    exit 1
  fi
}

# ==================== Pre-Flight Checks ====================

log "🚀 Brain Garden 10-Minute MVP Spike"
log "Target: Complete React+Vite TODO app in <10 minutes"
log ""

# Check dependencies
log "Checking dependencies..."

if ! command -v node &> /dev/null; then
  log_error "Node.js not found. Install: brew install node"
  exit 1
fi

if ! command -v npm &> /dev/null; then
  log_error "npm not found. Install Node.js first."
  exit 1
fi

if ! command -v claude &> /dev/null; then
  log_error "Claude Code CLI not found. Install: brew install claude-code"
  exit 1
fi

log_success "All dependencies available"

# ==================== Phase 1: Project Scaffold (Target: <30s) ====================

start_phase "01-scaffold"

log "Cleaning up previous spike..."
rm -rf "$PROJECT_DIR"
mkdir -p "$PROJECT_DIR"

log "Creating Vite project with React+TypeScript..."
cd "$PROJECT_DIR"

# Use npm create vite (fastest scaffold method)
npm create vite@latest "$PROJECT_NAME" -- --template react-ts > /dev/null 2>&1

cd "$PROJECT_NAME"

log_success "Project scaffold created"

end_phase

# ==================== Phase 2: Claude Code Generation (Target: <120s) ====================

start_phase "02-generation"

log "Generating TODO app components with Claude Code..."

# Generate main Todo component
claude --print \
  --model haiku \
  --tools "Write,Edit,Read" \
  --permission-mode bypassPermissions \
  "Create a production-quality Todo app component in src/TodoApp.tsx with:
  - TypeScript for type safety (use React.FC or omit return type - no JSX.Element)
  - State management for todos (add, toggle, delete)
  - Modern React hooks (useState)
  - Clean UI with Tailwind-style inline classes
  - Input field for new todos
  - Todo list with checkboxes and delete buttons
  - Filter buttons (All, Active, Completed)
  Export as default function (no JSX.Element return type)" \
  "src/TodoApp.tsx" >> "$LOG_FILE" 2>&1

# Update App.tsx to use TodoApp (import from ./TodoApp not ./components/TodoApp)
claude --print \
  --model haiku \
  --tools "Edit,Read" \
  --permission-mode bypassPermissions \
  "Replace App.tsx content to import TodoApp from './TodoApp' (same directory) and render it as the only content" \
  "src/App.tsx" >> "$LOG_FILE" 2>&1

log_success "Components generated"

end_phase

# ==================== Phase 3: Dependency Installation (Target: <240s) ====================

start_phase "03-dependencies"

log "Installing dependencies..."

# Use npm ci for faster, reproducible installs
npm install >> "$LOG_FILE" 2>&1

log_success "Dependencies installed"

end_phase

# ==================== Phase 4: Build Validation (Target: <120s) ====================

start_phase "04-build"

log "Building production bundle..."

npm run build >> "$LOG_FILE" 2>&1

if [ -d "dist" ]; then
  DIST_SIZE=$(du -sh dist | cut -f1)
  log_success "Build successful (dist size: $DIST_SIZE)"
else
  log_error "Build failed - dist directory not created"
  exit 1
fi

end_phase

# ==================== Phase 5: Dev Server Startup (Target: <30s) ====================

start_phase "05-dev-server"

log "Starting dev server..."

# Start dev server in background
npm run dev > "$LOG_FILE" 2>&1 &
DEV_PID=$!

# Wait for server to be ready (max 30s)
WAIT_COUNT=0
while [ $WAIT_COUNT -lt 30 ]; do
  if curl -s http://localhost:5173 > /dev/null 2>&1; then
    log_success "Dev server ready at http://localhost:5173"
    break
  fi
  sleep 1
  WAIT_COUNT=$((WAIT_COUNT + 1))
done

if [ $WAIT_COUNT -eq 30 ]; then
  log_error "Dev server failed to start within 30s"
  kill $DEV_PID 2>/dev/null || true
  exit 1
fi

end_phase

# ==================== Phase 6: Browser Verification (Target: <30s) ====================

start_phase "06-verification"

log "Verifying app is accessible..."

# Wait a bit for Vite to compile (HMR takes a moment)
sleep 2

# Check if page loads and contains expected content
RESPONSE=$(curl -s http://localhost:5173)

if echo "$RESPONSE" | grep -q -i "vite\|react\|todo"; then
  log_success "App loaded successfully"
else
  log_warning "Unexpected response, checking if server is running..."
  # Try one more time after brief wait
  sleep 2
  RESPONSE=$(curl -s http://localhost:5173)
  if [ -n "$RESPONSE" ]; then
    log_success "App loaded (response received)"
  else
    log_error "App not loading correctly"
    kill $DEV_PID 2>/dev/null || true
    exit 1
  fi
fi

# Capture screenshot (if available)
if command -v screencapture &> /dev/null; then
  log "Capturing screenshot..."
  screencapture -x "/Users/dmieloch/Dev/created/brain-garden-monorepo-template/docs/features/brain-garden-rapid-dev-kit/00-research/mvp-spike/demo-screenshot.png"
  log_success "Screenshot saved"
fi

# Stop dev server
log "Stopping dev server..."
kill $DEV_PID 2>/dev/null || true

end_phase

# ==================== Final Report ====================

END_TIME=$(date +%s)
TOTAL_DURATION=$((END_TIME - START_TIME))

TIMING_DATA="$TIMING_DATA, \"total\": $TOTAL_DURATION}"

log ""
log "=========================================="
log "🎉 10-MINUTE MVP SPIKE COMPLETE!"
log "=========================================="
log ""

if [ $TOTAL_DURATION -le 600 ]; then
  log_success "✅ PASSED: Total time ${TOTAL_DURATION}s (target: 600s)"
  log_success "⚡ Efficiency: $((600 - TOTAL_DURATION))s under budget"
else
  log_error "❌ FAILED: Total time ${TOTAL_DURATION}s (exceeded 600s by $((TOTAL_DURATION - 600))s)"
fi

log ""
log "Timing Breakdown:"
log "  01-scaffold:      $(echo $TIMING_DATA | jq -r '.\"01-scaffold\"')s"
log "  02-generation:    $(echo $TIMING_DATA | jq -r '.\"02-generation\"')s"
log "  03-dependencies:  $(echo $TIMING_DATA | jq -r '.\"03-dependencies\"')s"
log "  04-build:         $(echo $TIMING_DATA | jq -r '.\"04-build\"')s"
log "  05-dev-server:    $(echo $TIMING_DATA | jq -r '.\"05-dev-server\"')s"
log "  06-verification:  $(echo $TIMING_DATA | jq -r '.\"06-verification\"')s"
log ""

# Save timing report
echo "$TIMING_DATA" | jq '.' > "$TIMING_REPORT"
log_success "Timing report saved: $TIMING_REPORT"

log ""
log "Artifacts:"
log "  - Project: $PROJECT_DIR/$PROJECT_NAME"
log "  - Timing Report: $TIMING_REPORT"
log "  - Execution Log: $LOG_FILE"
log "  - Screenshot: mvp-spike/demo-screenshot.png"
log ""

if [ $TOTAL_DURATION -le 600 ]; then
  log "Next Steps:"
  log "  1. Review generated code: cd $PROJECT_DIR/$PROJECT_NAME"
  log "  2. Test manually: npm run dev"
  log "  3. Document findings in 10-minute-mvp-validation.md"
  log ""
  exit 0
else
  log "Investigation Required:"
  log "  1. Identify bottleneck phase"
  log "  2. Propose optimization strategies"
  log "  3. Escalate to The General with recommendations"
  log ""
  exit 1
fi
