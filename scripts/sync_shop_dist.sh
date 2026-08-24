#!/usr/bin/env bash
# Copy shop static files from client/public (source) into dist/public (Render prebuilt bundle).
# Render buildCommand is prebuilt-static+api — production serves dist/public, not client/public.
#
# Run after editing client/public/shop/** when not doing a full `pnpm build`:
#   bash scripts/sync_shop_dist.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/client/public/shop"
DEST="$ROOT/dist/public/shop"

[[ -d "$SRC" ]] || { echo "ERROR: missing $SRC" >&2; exit 1; }
mkdir -p "$DEST"
cp -a "$SRC/." "$DEST/"
echo "Synced shop static: $SRC → $DEST"
