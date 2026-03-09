#!/usr/bin/env bash
set -euo pipefail

# Setup script for google-pse-mcp development: install deps and build
# Usage: ./scripts/setup.sh

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "[setup] Starting setup in $REPO_ROOT"

if ! command -v npm >/dev/null 2>&1; then
  echo "[setup] ERROR: npm not found. Please install Node.js and npm." >&2
  exit 1
fi

if [ -f package-lock.json ]; then
  echo "[setup] Installing dependencies with npm ci..."
  npm ci
else
  echo "[setup] Installing dependencies with npm install..."
  npm install
fi

echo "[setup] Building TypeScript..."
npm run build

echo "[setup] Marking scripts as executable..."
chmod +x scripts/*.sh || true

echo "[setup] Setup completed successfully."
