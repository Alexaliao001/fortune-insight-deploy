#!/usr/bin/env bash
# Production smoke for Fortune Insight (read-only).
# Usage:
#   bash scripts/prod_smoke.sh
#   bash scripts/prod_smoke.sh https://fortunesite.one
set -euo pipefail

BASE="${1:-${BASE:-https://fortunesite.one}}"
BASE="${BASE%/}"
CURL="${CURL:-curl}"
UA="${UA:-Mozilla/5.0 (compatible; FortuneInsight-ProdSmoke/1.0)}"
FAIL=0

pass() { echo "PASS  $*"; }
fail() { echo "FAIL  $*"; FAIL=1; }

check_http() {
  local path="$1"
  local want="$2"
  local code
  code=$($CURL -sS -A "$UA" -o /dev/null -w "%{http_code}" --max-time 25 "${BASE}${path}" || echo "000")
  if [ "$code" = "$want" ]; then
    pass "GET ${path} → ${code}"
  else
    fail "GET ${path} → ${code} (want ${want})"
  fi
}

check_asset_404() {
  local path="${1:-/assets/no-such-prod-smoke.js}"
  local code body
  code=$($CURL -sS -A "$UA" -o /tmp/fi-prod-asset-body.$$ -w "%{http_code}" --max-time 25 "${BASE}${path}" || echo "000")
  body=$(cat /tmp/fi-prod-asset-body.$$ 2>/dev/null || true)
  rm -f /tmp/fi-prod-asset-body.$$
  if [ "$code" != "404" ]; then
    fail "GET ${path} status ${code} (want 404)"
    return
  fi
  case "$(echo "$body" | tr '[:upper:]' '[:lower:]')" in
    \<!doctype*|\<html*)
      fail "GET ${path} 404 but body is HTML (SPA leak)"
      ;;
    *)
      # Empty body is OK behind Cloudflare/CDN as long as not HTML
      pass "GET ${path} → 404 non-HTML (body_len=${#body})"
      ;;
  esac
}

check_no_manus_shell() {
  local body
  body=$($CURL -sS -A "$UA" --max-time 25 "${BASE}/login" || true)
  if echo "$body" | grep -qiE 'manus-analytics|manus-runtime|Continue with Manus|Manus OAuth'; then
    fail "/login shell contains Manus branding"
  else
    pass "/login shell free of Manus branding strings"
  fi
  if echo "$body" | grep -q 'id="root"'; then
    pass "/login has #root"
  else
    fail "/login missing #root"
  fi
}

check_auth_me_anon() {
  local body
  body=$($CURL -sS -A "$UA" --max-time 25 "${BASE}/api/trpc/auth.me" || true)
  if echo "$body" | grep -q 'passwordHash'; then
    fail "auth.me leaks passwordHash"
  else
    pass "auth.me has no passwordHash key"
  fi
}

echo "=== Fortune Insight production smoke ==="
echo "BASE=${BASE}"
echo

check_http "/" "200"
check_http "/login" "200"
check_http "/tarot" "200"
check_http "/tarot?type=career" "200"
check_http "/membership" "200"
check_http "/community" "200"
check_asset_404 "/assets/no-such-prod-smoke.js"
check_no_manus_shell
check_auth_me_anon

echo
if [ "$FAIL" -eq 0 ]; then
  echo "OVERALL PASS"
  exit 0
else
  echo "OVERALL FAIL"
  exit 1
fi
