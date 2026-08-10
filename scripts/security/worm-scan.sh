#!/usr/bin/env bash
# Local malware / worm scanner for next-auth-admin.
#
# Based on Heliguy PolinRider worm-scan v2, extended for EtherHiding
# (postcss/C2 loader) and ChainDrop (setup.mjs / IDE hooks).
#
# Usage:   scripts/security/worm-scan.sh [dir]   (default: current dir)
# Exit:    0 = clean, 1 = signatures found
#
# Run before install/dev/build and on pre-commit. Do not run npm/next
# if this exits 1.

set -uo pipefail
ROOT="${1:-.}"
PRUNE=( -path '*/.git' -o -path '*/node_modules' -o -path '*/.next' -o -path '*/dist' -o -path '*/build' -o -path '*/coverage' -o -path '*/src/generated' )
hits=0

flag() { echo "  ⚠ $1"; hits=$((hits + 1)); }

file_size() {
  # macOS: -f%z, Linux: -c%s
  stat -f%z "$1" 2>/dev/null || stat -c%s "$1" 2>/dev/null || echo 0
}

is_scanner_file() {
  case "$1" in
    */worm-scan.sh|*/worm-scan.ps1) return 0 ;;
    *) return 1 ;;
  esac
}

# ── [1] PolinRider definitive marker ──
while IFS= read -r f; do
  [ -z "$f" ] && continue
  is_scanner_file "$f" && continue
  flag "MARKER global['!'] in: $f"
done < <(
  find "$ROOT" \( "${PRUNE[@]}" \) -prune -o -type f -print 2>/dev/null \
    | while IFS= read -r f; do
        grep -l "global\['!'\]" "$f" 2>/dev/null || true
      done
)

# ── [2] Build-config concealment line (>500 chars) ──
while IFS= read -r f; do
  [ -z "$f" ] && continue
  mx=$(awk '{ if (length > m) m = length } END { print m+0 }' "$f" 2>/dev/null)
  [ "${mx:-0}" -gt 500 ] && flag "CONFIG long line ($mx chars): $f"
done < <(
  find "$ROOT" \( "${PRUNE[@]}" \) -prune -o -type f \
    \( -name '*.config.*' -o -name '.eslintrc*' -o -name 'babel.config.*' -o -name '.babelrc*' \) -print 2>/dev/null
)

# ── [3] Fake binary-extension asset (small text + JS) ──
# Fonts only — avoid scanning every public image in larger trees.
while IFS= read -r f; do
  [ -z "$f" ] && continue
  sz=$(file_size "$f")
  [ "$sz" -lt 15000 ] || continue
  if head -c 400 "$f" 2>/dev/null | grep -qE 'function|require|global\[|eval|String\.fromCharCode|_\$_'; then
    flag "FAKE-ASSET (binary ext, JS content, ${sz}b): $f"
  fi
done < <(
  find "$ROOT" \( "${PRUNE[@]}" \) -prune -o -type f \
    \( -name '*.woff2' -o -name '*.woff' -o -name '*.ttf' -o -name '*.otf' -o -name '*.eot' \) -print 2>/dev/null
)

# ── [4] VS Code / Cursor folderOpen autorun ──
while IFS= read -r f; do
  [ -z "$f" ] && continue
  case "$f" in
    */.vscode/*|*/.cursor/*) ;;
    *) continue ;;
  esac
  if grep -q 'folderOpen' "$f" 2>/dev/null; then
    flag "VSCODE auto-run (folderOpen): $f"
  fi
done < <(
  find "$ROOT" \( "${PRUNE[@]}" \) -prune -o -type f \
    \( -name 'tasks.json' -o -name 'settings.json' \) -print 2>/dev/null
)

# ── [5] .gitignore dropper residue ──
while IFS= read -r f; do
  [ -z "$f" ] && continue
  flag "GITIGNORE dropper residue: $f"
done < <(
  find "$ROOT" \( "${PRUNE[@]}" \) -prune -o -name '.gitignore' -type f -print 2>/dev/null \
    | while IFS= read -r f; do
        grep -lE '_push\.bat|config\.bat' "$f" 2>/dev/null || true
      done
)

# ── [6] EtherHiding / postcss-style C2 loader ──
ETHER_PAT='spawn\("node",\["-e"|eth_getBlockByNumber|eth\.blockscout|x-payload-b64|166\.88\.134\.62|/0x/clb|/0x/cls|windowsHide:!0'
while IFS= read -r f; do
  [ -z "$f" ] && continue
  is_scanner_file "$f" && continue
  flag "ETHERHIDING / C2 loader markers in: $f"
done < <(
  find "$ROOT" \( "${PRUNE[@]}" \) -prune -o -type f \
    \( -name '*.mjs' -o -name '*.cjs' -o -name '*.js' -o -name '*.ts' -o -name '*.tsx' -o -name '*.json' \) -print 2>/dev/null \
    | while IFS= read -r f; do
        grep -lE "$ETHER_PAT" "$f" 2>/dev/null || true
      done
)

# ── [7] ChainDrop dropper / preinstall ──
while IFS= read -r f; do
  [ -z "$f" ] && continue
  flag "CHAINDROP dropper file: $f"
done < <(
  find "$ROOT" \( "${PRUNE[@]}" \) -prune -o -type f \
    \( -name 'setup.mjs' -o -name 'Math_Symbol.js' -o -name 'math_init.js' \) -print 2>/dev/null
)

while IFS= read -r f; do
  [ -z "$f" ] && continue
  flag "CHAINDROP preinstall setup.mjs in: $f"
done < <(
  find "$ROOT" \( "${PRUNE[@]}" \) -prune -o -name 'package.json' -type f -print 2>/dev/null \
    | while IFS= read -r f; do
        grep -lE '"preinstall"[[:space:]]*:[[:space:]]*"node setup\.mjs"' "$f" 2>/dev/null || true
      done
)

# ── [8] Claude Code SessionStart hook persistence ──
while IFS= read -r f; do
  [ -z "$f" ] && continue
  flag "CLAUDE SessionStart hook: $f"
done < <(
  find "$ROOT" \( "${PRUNE[@]}" \) -prune -o -path '*/.claude/settings.json' -type f -print 2>/dev/null \
    | while IFS= read -r f; do
        grep -l 'SessionStart' "$f" 2>/dev/null || true
      done
)

# ── [9] Host npm CLI / home module persistence (EtherHiding reinfect) ──
# Active `npm` resolves via `node` on PATH → …/lib/node_modules/npm/lib/cli.js
NPM_CLI=""
if command -v node >/dev/null 2>&1; then
  NPM_CLI="$(node -e "process.stdout.write(require('path').join(require('path').dirname(process.execPath),'..','lib','node_modules','npm','lib','cli.js'))" 2>/dev/null || true)"
fi
if [ -n "${NPM_CLI}" ] && [ -f "${NPM_CLI}" ]; then
  npm_sz="$(file_size "$NPM_CLI")"
  # Clean npm 10/11 cli.js is ~200–500 bytes; infected copies are 100KB+.
  if [ "${npm_sz:-0}" -gt 5000 ]; then
    flag "NPM-CLI oversized (${npm_sz}b): $NPM_CLI"
  fi
  if grep -qE "M260630A|RS260605|global\['e'\]='NPM'|/\*M[0-9]+A\*/" "$NPM_CLI" 2>/dev/null; then
    flag "NPM-CLI EtherHiding marker: $NPM_CLI"
  fi
  mx="$(awk '{ if (length > m) m = length } END { print m+0 }' "$NPM_CLI" 2>/dev/null || echo 0)"
  if [ "${mx:-0}" -gt 2000 ]; then
    flag "NPM-CLI long line (${mx} chars): $NPM_CLI"
  fi
fi

if [ -e "${HOME}/.node_modules" ]; then
  flag "HOME .node_modules present (possible stage-2 drop): ${HOME}/.node_modules"
fi

echo "── worm-scan: $ROOT ──"
if [ "$hits" -eq 0 ]; then
  echo "  ✓ clean (9 checks: marker, config-line, fake-asset, vscode-autorun, gitignore-dropper, etherhiding, chaindrop, claude-hook, npm-cli-host)"
  exit 0
else
  echo "  ✗ $hits signature(s) found — DO NOT run install/dev/build; investigate and clean first."
  exit 1
fi
