#!/usr/bin/env bash
# Deploy shop static files to Nube VPS (fortunesite.one production).
# Requires: rsync, ssh, dist/public/shop (or client/public/shop)
#
# Usage:
#   NUBE_SSH_KEY=~/.ssh/nube NUBE_USER=ubuntu bash scripts/deploy_shop_nube.sh
#   NUBE_DRY_RUN=1 bash scripts/deploy_shop_nube.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
NUBE_HOST="${NUBE_HOST:-64.118.142.148}"
NUBE_USER="${NUBE_USER:-ubuntu}"
NUBE_APP_PATH="${NUBE_APP_PATH:-/opt/nube-sites/apps/fortune}"
SHOP_SRC="${SHOP_SRC:-$ROOT/dist/public/shop}"

if [[ ! -d "$SHOP_SRC" ]]; then
  SHOP_SRC="$ROOT/client/public/shop"
fi
[[ -d "$SHOP_SRC" ]] || { echo "ERROR: shop source not found (build first: pnpm build)" >&2; exit 1; }

SSH_OPTS=(-o StrictHostKeyChecking=accept-new -o BatchMode=yes)
if [[ -n "${NUBE_SSH_KEY:-}" ]]; then
  SSH_OPTS+=(-i "$NUBE_SSH_KEY")
fi

RSYNC_SSH="ssh ${SSH_OPTS[*]}"
DEST="${NUBE_USER}@${NUBE_HOST}:${NUBE_APP_PATH}/dist/public/shop/"

echo "Deploy shop → ${DEST}"
echo "  source: ${SHOP_SRC}"

RSYNC_FLAGS=(-avz --delete)
if [[ -n "${NUBE_DRY_RUN:-}" ]]; then
  RSYNC_FLAGS+=(--dry-run -n)
fi

rsync "${RSYNC_FLAGS[@]}" -e "$RSYNC_SSH" "${SHOP_SRC}/" "$DEST"

if [[ -z "${NUBE_DRY_RUN:-}" ]]; then
  ssh "${SSH_OPTS[@]}" "${NUBE_USER}@${NUBE_HOST}" \
    "test -f '${NUBE_APP_PATH}/dist/public/shop/index.html' && echo 'OK: shop index on Nube'"
fi

echo "Done."
