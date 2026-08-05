# Fortune Insight SSOT

- **Private SSOT**: `Alexaliao001/fortune-insight` → `~/fortune-insight`
- **Production deploy**: Nube VPS `nube-sin` → `/opt/nube-sites/apps/fortune` → https://fortunesite.one
- **Manus archive** (do not develop here): `Alexaliao001/fortune-insight-` (trailing hyphen)

Base: product tree from `fortune-insight-` @ `4761dc4` (2026-07-10).  
Overlay: SX3 light API from deploy (`server/host.mjs`, `server/tarot_rules.mjs`, `client/public/free-tarot.html`).

Sync to deploy: `bash ~/quantradar/scripts/sync_fortune_deploy.sh`
