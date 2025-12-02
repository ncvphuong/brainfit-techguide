#!/usr/bin/env bash
set -euo pipefail

# ---- CONFIG: chỉnh nếu cần ----
HOME_DIR="/home/deploynode"
PROJECT_DIR="$HOME_DIR/tech-guide-brainfit"

# Path chính xác nơi mise và node của mise được cài
MISE_BIN="$HOME_DIR/.local/bin/mise"
MISE_NODE_BIN="$HOME_DIR/.local/share/mise/installs/node/22.9.0/bin"

# ---- Ensure PATH contains mise + node (explicit) ----
export PATH="$HOME_DIR/.local/bin:$MISE_NODE_BIN:$PATH"
export HOME="$HOME_DIR"

echo "---- DEBUG: environment before activating mise ----"
echo "PATH=$PATH"
echo "which mise: $(command -v mise || true)"
echo "which node: $(command -v node || true)"
echo "node -v: $(node -v || true)"
echo "npm -v: $(npm -v || true)"

# If mise binary exists, try to activate it (support both forms)
if [ -x "$MISE_BIN" ]; then
  echo "👉 Found mise at $MISE_BIN, trying to activate..."
  # Try explicit 'activate bash' first (recommended), fallback to plain activate
  if $MISE_BIN activate bash >/dev/null 2>&1; then
    eval "$($MISE_BIN activate bash)"
  else
    eval "$($MISE_BIN activate || true)"
  fi
else
  echo "⚠️ mise binary not executable at $MISE_BIN — continuing but Node may be wrong"
fi

# Re-print to confirm
echo "---- DEBUG: environment after activating mise ----"
echo "PATH=$PATH"
echo "which mise: $(command -v mise || true)"
echo "which node: $(command -v node || true)"
echo "node -v: $(node -v || true)"
echo "npm -v: $(npm -v || true)"

# ---- Deployment steps ----
cd "$PROJECT_DIR"

echo "👉 Pulling latest code..."
git pull origin master

echo "📦 Installing dependencies..."
# Use npm ci for reproducible installs if package-lock.json exists, fallback to npm install
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

echo "⚙️ Building site..."
npm run build

echo "✅ Deployment completed!"
