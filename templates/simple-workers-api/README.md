# Simple Workers API Starter

A minimal Cloudflare Workers API starter for small backend services, JSON APIs, webhooks, and app routes.

---

## What this template does

This starter gives you a clean API foundation with:

- health check route
- JSON response helper
- basic route handling
- safe method handling
- example `wrangler.jsonc`
- local testing commands
- deployment steps

---

## Best for

Use this template for:

- small APIs
- backend endpoints
- webhook receivers
- form handlers
- admin API prototypes
- D1-backed CRUD apps later
- Queue producers later

Do not use this alone for a full frontend app. Pair it with Pages, Next.js on Cloudflare, or another frontend layer.

---

## Cloudflare services used

| Service | Purpose |
| --- | --- |
| Workers | Runs the API code |
| Wrangler | Local dev and deploy tool |

Optional later:

| Service | Add when |
| --- | --- |
| D1 | You need SQL data |
| R2 | You need file uploads |
| KV | You need small config/cache |
| Queues | You need background jobs |
| Turnstile | You need bot protection |

---

## Folder structure

```text
simple-workers-api/
├── README.md
├── wrangler.jsonc.example
└── src/
    └── index.ts
```

---

## Required bindings

None for the basic version.

Add bindings only when needed.

---

## Required secrets

None for the basic version.

Use Worker secrets for real API keys:

```bash
npx wrangler secret put MY_SECRET_NAME
```

---

## Local setup

```bash
npm create cloudflare@latest my-api
cd my-api
```

Choose:

```text
Worker only
TypeScript
```

Then copy this template's `src/index.ts` and `wrangler.jsonc.example` into your project.

Rename:

```text
wrangler.jsonc.example → wrangler.jsonc
```

Run locally:

```bash
npx wrangler dev
```

---

## Deploy

```bash
npx wrangler deploy
```

---

## Test

Health check:

```bash
curl http://localhost:8787/health
```

Expected response:

```json
{
  "ok": true,
  "service": "simple-workers-api"
}
```

Example API route:

```bash
curl http://localhost:8787/api/example
```

---

## Common mistakes

- adding D1, R2, KV, or Queues before they are needed
- forgetting to update the Worker name in `wrangler.jsonc`
- returning plain strings when JSON is expected
- not handling unsupported HTTP methods
- putting real secrets in the repository
- skipping local tests before deployment

---

## Production notes

Before using in production:

- add route validation
- add error handling
- add CORS rules only if needed
- add rate limiting for public endpoints
- move secrets to Worker secrets
- add logs/observability
- add a rollback plan

---

## Related resources

- [`templates/README.md`](../README.md)
- [`playbooks/README.md`](../../playbooks/README.md)
- [`architectures/README.md`](../../architectures/README.md)
- [`catalog/README.md`](../../catalog/README.md)
