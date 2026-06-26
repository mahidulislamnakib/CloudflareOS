# Queue Worker Starter

A minimal Cloudflare Workers + Queues starter for background jobs.

---

## What this template does

This starter gives you a small async job pattern with:

- API endpoint that accepts a job
- Queue producer binding
- Queue consumer handler
- typed job payload
- simple validation
- example `wrangler.jsonc`
- local testing notes
- deployment notes

---

## Best for

Use this template for:

- server-side tracking events
- webhook processing
- email jobs
- notification jobs
- media processing triggers
- AI summary jobs
- payment confirmation workflows
- audit log processing

Use a Queue when work should happen after the user gets a fast response.

---

## Cloudflare services used

| Service | Purpose |
| --- | --- |
| Workers | Receives requests and processes jobs |
| Queues | Stores jobs for background processing |
| Wrangler | Local dev and deployment |

Optional later:

| Service | Add when |
| --- | --- |
| D1 | Store job results or status |
| R2 | Process uploaded files |
| KV | Store lightweight config |
| Analytics Engine | Track high-volume job metrics |

---

## Folder structure

```text
queue-worker-starter/
├── README.md
├── wrangler.jsonc.example
└── src/
    └── index.ts
```

---

## Required binding

```jsonc
{
  "queues": {
    "producers": [
      {
        "binding": "JOB_QUEUE",
        "queue": "my-app-jobs"
      }
    ],
    "consumers": [
      {
        "queue": "my-app-jobs"
      }
    ]
  }
}
```

---

## Setup

Create a Queue:

```bash
npx wrangler queues create my-app-jobs
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

Send a job:

```bash
curl -X POST http://localhost:8787/jobs \
  -H "Content-Type: application/json" \
  -d '{"type":"example","payload":{"message":"hello"}}'
```

Expected response:

```json
{
  "ok": true
}
```

---

## Common mistakes

- doing slow work directly inside the request
- not validating job payloads
- not planning retry behavior
- not logging failed jobs
- mixing many unrelated job types without clear names
- forgetting queue producer and consumer bindings
- assuming provider APIs will always be available

---

## Production notes

Before production:

- define job types clearly
- validate job payloads
- keep job payloads small
- log delivery or processing status where needed
- make jobs safe to retry
- avoid storing secrets inside job payloads
- add D1 status logs if business visibility is needed
- document failure handling

---

## Related resources

- [`templates/README.md`](../README.md)
- [`playbooks/server-side-tracking.md`](../../playbooks/server-side-tracking.md)
- [`architectures/README.md`](../../architectures/README.md)
- [`catalog/README.md`](../../catalog/README.md)
