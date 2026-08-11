#!/usr/bin/env bash
# Run full local security checks: live processes, then repo + global npm CLI.
#
# Usage:  scripts/security/security-check.sh [repo-dir]
#         (repo-dir defaults to current directory, same as worm-scan)
#
# Exit:   0 = all clean, 1 = any check failed
#
# Prefer this over npm for manual checks — no infected npm/cli.js on the path.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="${1:-.}"

echo "── security-check ──"
echo

echo "▸ [1/2] Live processes (malware-procs-check)"
bash "${SCRIPT_DIR}/malware-procs-check.sh"
echo

echo "▸ [2/2] Repo + npm CLI (worm-scan)"
# worm-scan also runs proc check [10]; skip duplicate after step 1.
WORM_SCAN_SKIP_PROCS=1 bash "${SCRIPT_DIR}/worm-scan.sh" "$ROOT"
