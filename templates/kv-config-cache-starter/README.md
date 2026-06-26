# KV Config and Cache Starter

A minimal Cloudflare Workers + KV starter for small runtime config, feature flags, and lightweight cache.

---

## What this template does

This starter gives you a small KV-backed API pattern with:

- KV namespace binding
- read config value
- write config value
- read cached value
- write cached value with TTL
- example `wrangler.jsonc`
- local testing notes
- deployment notes

---

## Best for

Use this template for:

- feature flags
- simple site settings
- small public config
- lightweight cache
- API response cache
- maintenance mode flag
- homepage configuration
- temporary tokens or short-lived values

KV is not a relational database. Use D1 for structured data and relationships.

---

## Cloudflare services used

| Service | Purpose |
| --- | --- |
| Workers | Runs the API |
| KV | Stores small key-value data |
| Wrangler | Local dev and deployment |

Optional later:

| Service | Add when |
| --- | --- |
| D1 | You need relational data |
| Queues | You need async refresh jobs |
| Analytics Engine | You need high-volume metrics |

---

## Folder structure

```text
kv-config-cache-starter/
├── README.md
├── wrangler.jsonc.example
└── src/
    └── index.ts
```

---

## Required binding

```jsonc
{
  "kv_namespaces": [
    {
      "binding": "CONFIG_KV",
      "id": "PASTE_KV_NAMESPACE_ID"
    }
  ]
}
```

---

## Setup

Create a KV namespace:

```bash
npx wrangler kv namespace create CONFIG_KV
```

Run locally:

```bash
npx wrangler dev
```

Deploy:

```bash
npx wrangler deploy
```

---

## Test

Set config:

```bash
curl -X POST http://localhost:8787/config/site-name \
  -H "Content-Type: application/json" \
  -d '{"value":"CloudflareOS"}'
```

Read config:

```bash
curl http://localhost:8787/config/site-name
```

Set cache value:

```bash
curl -X POST http://localhost:8787/cache/homepage \
  -H "Content-Type: application/json" \
  -d '{"value":"cached homepage data","ttl":300}'
```

---

## Common mistakes

- using KV as the main database
- storing large JSON objects without limits
- expecting instant global consistency
- storing sensitive secrets in KV
- forgetting TTL for temporary cache values
- not namespacing keys clearly
- using random key names without a convention

---

## Production notes

Before production:

- define clear key prefixes
- keep values small
- use D1 for relational data
- use Worker secrets for secrets
- set TTL for cache data
- document config keys
- avoid storing sensitive user data
- add admin protection for write routes

---

## Related resources

- [`templates/README.md`](../README.md)
- [`templates/simple-workers-api`](../simple-workers-api/README.md)
- [`architectures/README.md`](../../architectures/README.md)
- [`catalog/README.md`](../../catalog/README.md)
