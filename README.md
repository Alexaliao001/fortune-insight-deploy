# fortune-insight-deploy

Historical public mirror for **https://fortunesite.one**. Production now runs on the Nube VPS.

| Surface | Host |
|---------|------|
| Production app + full Express/tRPC API | Nube VPS `fortune.service` |
| Optional static GH | `gh-pages` (historical / fallback) |

## Source of truth

| Role | Repo | Local |
|------|------|-------|
| **SSOT (edit here)** | private `Alexaliao001/fortune-insight` | `~/fortune-insight` |
| **Historical mirror** | public `Alexaliao001/fortune-insight-deploy` | `~/fortune-insight-deploy` |
| Archive (do not edit) | private `Alexaliao001/fortune-insight-` (trailing `-`) | — |

Production deploys are handled from the private SSOT with:

```bash
bash ~/fortune-insight/scripts/sync_fortune_deploy.sh
```

The script builds the frontend, backs up the current Nube static assets, replaces `dist/public`, and restarts `fortune.service`. It deliberately preserves the full API entrypoint already installed on Nube.

## Rebuild / push (app)

Prefer SSOT + the Nube deploy script above. Manual:

```bash
cd ~/fortune-insight   # edit / build full product
bash ~/fortune-insight/scripts/sync_fortune_deploy.sh
```

Env: see `~/quantradar/docs/env/fortune-insight.env.example` and SSOT `.env.example`.

## Static-only note

Do not use `rebuild_static.sh` for Fortune production — that helper is for MoYu / Portfolio / Drama GH statics.

## Verify locally

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build
PORT=3000 HOST=127.0.0.1 NODE_ENV=production node dist/index.js
```

In another terminal:

```bash
curl -sS http://127.0.0.1:3000/health
```

## Verify live after an authorized deploy

```bash
curl -sS https://fortunesite.one/health
curl -sS -X POST https://fortunesite.one/api/tarot/preview -H 'content-type: application/json' -d '{}'
python3 ~/quantradar/scripts/sites_extreme_verify.py
```
