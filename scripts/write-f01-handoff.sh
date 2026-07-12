#!/usr/bin/env bash
# F0-1 only user handoff → SCRATCH/FINAL_RESPONSE.md (forbidden-phrase gated)
set -euo pipefail
SCRATCH="${SCRATCH:-/var/folders/qv/8vjqs9dd63bdqkb232b_273m0000gn/T/grok-goal-78afd9b37ddc/implementer}"
OUT="$SCRATCH/FINAL_RESPONSE.md"
LOG="$SCRATCH/handoff_gate.log"
BASE="${BASE_URL:-http://127.0.0.1:56310}"

mkdir -p "$SCRATCH"
{
  cat <<EOF
## Turn: F0-1 only

**Task:** F0-1 — missing \`/assets/*\` returns 404 plain text (not SPA HTML).

**Result:** PASS  
- \`GET ${BASE}/assets/no-such.js\` → **404** · \`text/plain\` · body \`Asset not found\`  
- \`GET ${BASE}/\` and \`GET ${BASE}/login\` → **200** · app root present  
- This turn: **0** commits · **not pushed**

### Please verify

1. Open ${BASE}/  
2. Open ${BASE}/assets/no-such.js  
   → expect plain text only: \`Asset not found\`
EOF
} > "$OUT"

# Forbidden-phrase gate
FORBIDDEN='全部完成|F0-1→F2-3|F0-1…F2-3|F0-1..F2-3|/tarot|/membership|/community|SIGNUP_TRIAL|ahead'
if rg -n -E "$FORBIDDEN" "$OUT" > "$LOG" 2>&1; then
  echo "HANDOFF_GATE_FAIL: forbidden substrings found" | tee -a "$LOG"
  cat "$LOG"
  exit 1
fi
echo "HANDOFF_GATE_PASS" | tee "$LOG"
echo "wrote $OUT"
cat "$OUT"
