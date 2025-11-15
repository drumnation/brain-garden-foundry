#!/bin/bash
#
# brain-garden-codegen.sh - Unified Code Generation CLI
#
# Primary: Claude Code CLI (non-interactive, first-class citizen)
# Fallback: Aider + Claude/OpenAI API
#
# Usage:
#   brain-garden-codegen "Create Button.tsx with TypeScript" "src/components/Button.tsx"
#   brain-garden-codegen --model sonnet "Complex state management" "src/store/index.ts"
#   brain-garden-codegen --no-commit "Generate test" "src/test.ts"

set -e  # Exit on error

# ==================== Configuration ====================

MODEL="haiku"  # Default: Fast and high-quality
AUTO_COMMIT=true
TOOLS="Write,Edit,Read,Grep,Glob,Bash"
PERMISSION_MODE="bypassPermissions"

# ==================== Argument Parsing ====================

while [[ $# -gt 0 ]]; do
  case $1 in
    --model)
      MODEL="$2"
      shift 2
      ;;
    --no-commit)
      AUTO_COMMIT=false
      shift
      ;;
    --tools)
      TOOLS="$2"
      shift 2
      ;;
    --help|-h)
      cat << EOF
Brain Garden Code Generation CLI

Usage:
  brain-garden-codegen [options] "<task>" "<files>"

Options:
  --model <model>      Model to use (haiku, sonnet, opus, gpt-4o)
  --no-commit          Skip Git auto-commit
  --tools <tools>      Tools to enable (default: Write,Edit,Read,Grep,Glob,Bash)
  --help, -h           Show this help message

Examples:
  # Generate React component (default: haiku)
  brain-garden-codegen "Create Button.tsx with TypeScript" "src/components/Button.tsx"

  # Complex task with Sonnet
  brain-garden-codegen --model sonnet "Implement Redux store" "src/store/index.ts"

  # Generate without auto-commit
  brain-garden-codegen --no-commit "Create test file" "src/test.ts"

Environment Variables:
  ANTHROPIC_API_KEY   - Required for Aider + Claude API fallback
  OPENAI_API_KEY      - Required for Aider + OpenAI fallback
EOF
      exit 0
      ;;
    *)
      if [ -z "$TASK" ]; then
        TASK="$1"
      elif [ -z "$FILES" ]; then
        FILES="$1"
      else
        echo "Error: Unexpected argument '$1'"
        exit 1
      fi
      shift
      ;;
  esac
done

# Validate required arguments
if [ -z "$TASK" ]; then
  echo "Error: Task description required"
  echo "Usage: brain-garden-codegen '<task>' '<files>'"
  exit 1
fi

if [ -z "$FILES" ]; then
  echo "Error: Target file(s) required"
  echo "Usage: brain-garden-codegen '<task>' '<files>'"
  exit 1
fi

# ==================== Git Pre-Work ====================

if [ "$AUTO_COMMIT" = true ] && [ -d ".git" ]; then
  echo "📦 Preparing Git state..."

  # Stash any uncommitted changes
  if [ -n "$(git status --porcelain)" ]; then
    git stash save "Pre-codegen: $TASK" --quiet || true
  fi
fi

# ==================== Code Generation ====================

echo "🧠 Brain Garden: Generating code..."
echo "   Task: $TASK"
echo "   Files: $FILES"
echo "   Model: $MODEL"

# Primary: Claude Code (non-interactive)
if command -v claude &> /dev/null; then
  echo "   Engine: Claude Code CLI (first-class) ✨"

  claude --print \
    --model "$MODEL" \
    --tools "$TOOLS" \
    --permission-mode "$PERMISSION_MODE" \
    "$TASK" \
    "$FILES"

  ENGINE="claude-code"

# Fallback 1: Aider + Anthropic API
elif [ -n "$ANTHROPIC_API_KEY" ]; then
  echo "   Engine: Aider + Claude API (fallback 1) ⚡"

  aider --yes --auto-commits \
    --model "claude-3-5-$MODEL" \
    --message "$TASK" \
    "$FILES"

  ENGINE="aider-anthropic"

# Fallback 2: Aider + OpenAI API
elif [ -n "$OPENAI_API_KEY" ]; then
  echo "   Engine: Aider + OpenAI (fallback 2) ⚡"

  # Map model names (haiku → gpt-4o-mini, sonnet/opus → gpt-4o)
  if [ "$MODEL" = "haiku" ]; then
    OPENAI_MODEL="gpt-4o-mini"
  else
    OPENAI_MODEL="gpt-4o"
  fi

  aider --yes --auto-commits \
    --model "$OPENAI_MODEL" \
    --message "$TASK" \
    "$FILES"

  ENGINE="aider-openai"

else
  echo "❌ Error: No LLM access configured"
  echo ""
  echo "Solutions:"
  echo "  1. Install Claude Code (recommended)"
  echo "     → brew install claude-code"
  echo "  2. Set ANTHROPIC_API_KEY"
  echo "     → export ANTHROPIC_API_KEY='sk-ant-...'"
  echo "  3. Set OPENAI_API_KEY"
  echo "     → export OPENAI_API_KEY='sk-...'"
  echo ""
  exit 1
fi

# ==================== Git Post-Work ====================

if [ "$AUTO_COMMIT" = true ] && [ -d ".git" ] && [ "$ENGINE" = "claude-code" ]; then
  echo ""
  echo "📝 Auto-committing changes..."

  # Check if files were modified
  if [ -n "$(git status --porcelain)" ]; then
    # Stage the target files
    git add "$FILES"

    # Create commit with Brain Garden template
    git commit -m "feat: $TASK

🤖 Generated with Brain Garden Rapid Dev Kit
Model: Claude $MODEL (Claude Code CLI)
Engine: $ENGINE

Co-Authored-By: Claude <noreply@anthropic.com>" --quiet

    COMMIT_HASH=$(git rev-parse --short HEAD)
    echo "   ✅ Auto-committed: $COMMIT_HASH"
    echo ""
    echo "Rollback: git reset HEAD~1"
  else
    echo "   ⚠️  No changes detected (files may already exist)"
  fi
fi

# ==================== Summary ====================

echo ""
echo "✅ Code generation complete!"
echo ""
echo "Next steps:"
echo "  → Review: cat $FILES"
echo "  → Test: npm run test"
echo "  → Rollback: git reset HEAD~1 (if needed)"
echo ""
