# Durable Object Starter

A minimal Cloudflare Workers + Durable Objects starter for shared state and coordination.

---

## What this template does

This starter gives you a small Durable Object pattern with:

- Durable Object binding
- one named object instance
- simple counter state
- state read endpoint
- state increment endpoint
- example `wrangler.jsonc`
- local testing notes
- deployment notes

---

## Best for

Use this template for:

- shared counters
- live rooms
- collaborative sessions
- locks and coordination
- rate limit buckets
- multiplayer-style state
- chat room state
- per-customer state containers

Durable Objects are for coordinated state. Do not use them as a replacement for every database table.

---

## Cloudflare services used

| Service | Purpose |
| --- | --- |
| Workers | Routes requests |
| Durable Objects | Owns and coordinates state |
| Wrangler | Local dev and deployment |

Optional later:

| Service | Add when |
| --- | --- |
| D1 | You need relational records |
| R2 | You need file storage |
| Queues | You need background processing |
| KV | You need lightweight config/cache |

---

## Folder structure

```text
durable-object-starter/
├── README.md
├── wrangler.jsonc.example
└── src/
    └── index.ts
```

---

## Required binding

```jsonc
{
  "durable_objects": {
    "bindings": [
      {
        "name": "COUNTER_OBJECT",
        "class_name": "CounterObject"
      }
    ]
  },
  "migrations": [
    {
      "tag": "v1",
      "new_sqlite_classes": ["CounterObject"]
    }
  ]
}
```

---

## Setup

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

Read state:

```bash
curl http://localhost:8787/counter/main
```

Increment state:

```bash
curl -X POST http://localhost:8787/counter/main/increment
```

---

## Common mistakes

- using Durable Objects when D1 is enough
- creating too many object classes without a clear reason
- storing large files in Durable Object storage
- forgetting migrations
- treating object state as globally queryable data
- not planning object naming strategy
- putting unrelated business logic into one object

---

## Production notes

Before production:

- define object naming rules
- keep object state small
- use D1 for queryable records
- use R2 for files
- add authentication for write actions
- document reset/recovery behavior
- avoid one global object for everything
- add observability for important object actions

---

## Related resources

- [`templates/README.md`](../README.md)
- [`templates/simple-workers-api`](../simple-workers-api/README.md)
- [`architectures/README.md`](../../architectures/README.md)
- [`catalog/README.md`](../../catalog/README.md)
