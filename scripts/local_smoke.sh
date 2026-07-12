#!/usr/bin/env bash
# F2-3: Local smoke checks for Fortune Insight (no push, no production).
# Usage:
#   BASE=http://127.0.0.1:55605 bash scripts/local_smoke.sh
#   bash scripts/local_smoke.sh http://127.0.0.1:55605
set -euo pipefail

BASE="${1:-${BASE:-http://127.0.0.1:3000}}"
BASE="${BASE%/}"
CURL="${CURL:-curl}"
FAIL=0

pass() { echo "PASS  $*"; }
fail() { echo "FAIL  $*"; FAIL=1; }

check_http() {
  local path="$1"
  local want="$2"
  local code
  code=$($CURL -sS -o /dev/null -w "%{http_code}" --max-time 15 "${BASE}${path}" || echo "000")
  if [ "$code" = "$want" ]; then
    pass "GET ${path} → ${code}"
  else
    fail "GET ${path} → ${code} (want ${want})"
  fi
}

check_body_not_html() {
  local path="$1"
  local body
  body=$($CURL -sS --max-time 15 "${BASE}${path}" || true)
  local code
  code=$($CURL -sS -o /dev/null -w "%{http_code}" --max-time 15 "${BASE}${path}" || echo "000")
  if [ "$code" != "404" ]; then
    fail "GET ${path} status ${code} (want 404)"
    return
  fi
  case "$(echo "$body" | tr '[:upper:]' '[:lower:]')" in
    \<!doctype*|\<html*) fail "GET ${path} body is HTML" ;;
    *) pass "GET ${path} → 404 non-HTML (${body:0:40})" ;;
  esac
}

check_html_root() {
  local path="$1"
  local body
  body=$($CURL -sS --max-time 15 "${BASE}${path}" || true)
  local code
  code=$($CURL -sS -o /dev/null -w "%{http_code}" --max-time 15 "${BASE}${path}" || echo "000")
  if [ "$code" != "200" ]; then
    fail "GET ${path} → ${code}"
    return
  fi
  if echo "$body" | grep -q 'id="root"'; then
    pass "GET ${path} → 200 + #root"
  else
    fail "GET ${path} → 200 but missing #root"
  fi
}

check_no_manus_login() {
  local body
  body=$($CURL -sS --max-time 15 "${BASE}/login" || true)
  if echo "$body" | grep -qi 'manus-analytics\|manus-runtime\|Manus OAuth\|Continue with Manus'; then
    fail "/login contains Manus branding strings"
  else
    pass "/login shell free of Manus branding strings"
  fi
}

echo "=== Fortune Insight local smoke ==="
echo "BASE=${BASE}"
echo

check_html_root "/"
check_html_root "/login"
check_html_root "/tarot"
check_html_root "/tarot?type=career"
check_html_root "/membership"
check_body_not_html "/assets/no-such-local-smoke.js"
check_no_manus_login

# Optional tRPC probe (may be null without session)
ME=$($CURL -sS --max-time 10 \
  "${BASE}/api/trpc/auth.me?batch=1&input=%7B%220%22%3A%7B%22json%22%3Anull%7D%7D" || true)
if echo "$ME" | grep -qi 'passwordHash'; then
  fail "auth.me response leaks passwordHash"
else
  pass "auth.me body has no passwordHash key"
fi

echo
if [ "$FAIL" -eq 0 ]; then
  echo "OVERALL PASS"
  exit 0
else
  echo "OVERALL FAIL"
  exit 1
fi
