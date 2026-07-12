# DNS for fortunesite.one (Manus custom domain)

## Current problem (diagnosed 2026-07-09)

Public DNS for the **apex** returns a **mix** of targets:

| IP | Owner | Result for https://fortunesite.one |
|----|--------|-------------------------------------|
| `104.18.26.246` | Cloudflare / Manus | **200** – real app (Express) |
| `185.199.108–111.153` | **GitHub Pages** | **404** + cert `*.github.io` |

`www.fortunesite.one` is a **CNAME → `alexaliao001.github.io`** (static GitHub Pages), **not** Manus.

Browsers round-robin A records. When a JS chunk request hits GitHub (or when a missing `/assets/*.js` was SPA-fallback’d as HTML 200 on Manus), Chrome shows:

```text
TypeError: Failed to fetch dynamically imported module:
https://fortunesite.one/assets/Home-….js
```

## Correct setup (pick ONE path)

### Path A — Manus-managed custom domain (recommended)

1. In Manus project → **Publish / Custom domain** → connect `fortunesite.one`.
2. Copy the **exact** A / CNAME / TXT records Manus shows.
3. At the DNS host for NS `ns1/ns2.globaldomaingroup.com`, **delete** all conflicting records below, then add only Manus’s records.

### Path B — Point domain at Manus subdomain

If Manus gives you `fortunesite-toqeb9pd.manus.space` (or similar):

**Apex (`fortunesite.one`)** — only one of:

- **CNAME flattening / ALIAS** → `fortunesite-toqeb9pd.manus.space`  
  (preferred if registrar supports it), **or**
- **Only** the A/AAAA records Manus documents (do **not** invent GitHub IPs).

**www:**

```text
www  CNAME  fortunesite-toqeb9pd.manus.space
```

(or CNAME to apex if Manus prefers)

## Records that MUST be removed

Delete these if still present:

```text
# Wrong — GitHub Pages (causes intermittent 404 / wrong SSL)
A     fortunesite.one  → 185.199.108.153
A     fortunesite.one  → 185.199.109.153
A     fortunesite.one  → 185.199.110.153
A     fortunesite.one  → 185.199.111.153

# Wrong — www → GitHub user pages
www   CNAME  alexaliao001.github.io
```

Optional: if you still want a GitHub static site, use a **different** host (`docs.fortunesite.one` or `blog.…`), never the apex used by the Manus app.

## Verify after DNS change (TTL ~60s here)

```bash
dig fortunesite.one A +short
# Expect ONLY Manus/Cloudflare IPs from Manus docs — zero 185.199.*

dig www.fortunesite.one +short
# Expect CNAME to *.manus.space (or Manus target), NOT github.io

curl -sI https://fortunesite.one/ | head -15
# Expect: HTTP/2 200, x-powered-by: Express (or Manus), NOT server: GitHub.com

curl -sI https://fortunesite.one/assets/does-not-exist.js | head -5
# After code fix: 404 (not 200 HTML)
```

## After code deploy (GitHub main → Manus pull)

Also fixed in app:

1. Missing `/assets/*` returns **404**, not `index.html` 200.
2. Chunk load failure clears SW caches and hard-reloads once.
3. SW no longer caches HTML bodies under asset URLs.

## Temporary workaround for users (until DNS fixed)

Open the known-good host:

```text
https://fortunesite-toqeb9pd.manus.space/
```

Or hard-clear site data for `fortunesite.one` (Application → Clear storage) then reload **only after** DNS no longer includes `185.199.*`.
