#!/usr/bin/env bash
set -euo pipefail

# Run MCP server using the Site Restricted endpoint (/v1/siterestrict) with siteRestricted=true
# Usage:
#   ./scripts/run_server_siterestrict.sh <api_key> <cx> [api_host]
# Or set environment variables:
#   export API_KEY=...
#   export CX=...
#   export API_HOST=https://www.googleapis.com/customsearch
#   ./scripts/run_server_siterestrict.sh
#
# Note: Requires prior build (run ./scripts/setup.sh)

API_KEY_ARG="${1:-}"
CX_ARG="${2:-}"
API_HOST_ARG="${3:-}"

API_HOST="${API_HOST_ARG:-${API_HOST:-https://www.googleapis.com/customsearch}}"
API_KEY="${API_KEY_ARG:-${API_KEY:-}}"
CX="${CX_ARG:-${CX:-}}"

if [[ -z "${API_KEY}" || -z "${CX}" ]]; then
  echo "[run_server_siterestrict] ERROR: Missing API_KEY or CX."
  echo "  Provide them as args or environment variables."
  echo "  Example: ./scripts/run_server_siterestrict.sh sk-xxxx cx-xxxx"
  exit 1
fi

SITE_RESTRICTED="true"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

if [[ ! -x "build/index.js" ]]; then
  echo "[run_server_siterestrict] build/index.js not found or not executable. Building..."
  npm run build
fi

echo "[run_server_siterestrict] Starting MCP server (site restricted /v1/siterestrict) with siteRestricted=true"
echo "[run_server_siterestrict] API_HOST=${API_HOST}"
exec ./build/index.js "${API_HOST}" "${API_KEY}" "${CX}" "${SITE_RESTRICTED}"
