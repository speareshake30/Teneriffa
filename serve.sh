#!/usr/bin/env bash
#
# Tenerife Drive — local server that serves the game on http://localhost:8080
# and keeps the files in sync with GitHub (main branch).
#
# Run this on the machine behind teneriffa.candycluster.com:
#     ./serve.sh
#
# Config (optional env vars):
#     PORT=8080            port to serve on (default 8080)
#     SYNC_INTERVAL=60     seconds between `git pull` checks (0 = no auto-sync)
#
set -euo pipefail

PORT="${PORT:-8080}"
SYNC_INTERVAL="${SYNC_INTERVAL:-60}"

# Always serve from the repo directory this script lives in.
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Pull once up front, then keep pulling in the background so new commits to
# main appear live (python's http.server reads files from disk per request).
if [ -d .git ]; then
  echo "Syncing from GitHub (main)..."
  git pull --ff-only origin main || echo "  (pull failed — serving current files)"

  if [ "$SYNC_INTERVAL" -gt 0 ]; then
    (
      while true; do
        sleep "$SYNC_INTERVAL"
        git pull --ff-only origin main >/dev/null 2>&1 || true
      done
    ) &
    SYNC_PID=$!
    trap 'kill "$SYNC_PID" 2>/dev/null || true' EXIT
    echo "Auto-syncing every ${SYNC_INTERVAL}s (PID $SYNC_PID)."
  fi
else
  echo "Note: not a git checkout — serving files as-is (no auto-sync)."
fi

echo "Tenerife Drive → http://localhost:${PORT}"
echo "(Your proxy maps this to https://teneriffa.candycluster.com)"
echo "Press Ctrl+C to stop."

# Prefer python3; fall back to python.
if command -v python3 >/dev/null 2>&1; then
  exec python3 -m http.server "$PORT"
elif command -v python >/dev/null 2>&1; then
  exec python -m http.server "$PORT"
else
  echo "ERROR: python3/python not found. Install Python or use any static server on port ${PORT}." >&2
  exit 1
fi
