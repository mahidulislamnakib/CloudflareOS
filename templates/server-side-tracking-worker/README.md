# Server-side Tracking Worker Starter

A minimal Cloudflare Workers + Queues starter for collecting tracking events and processing them in the background.

---

## What this template does

This starter gives you a small server-side tracking pattern with:

- `/track` endpoint
- event validation
- Queue producer
- Queue consumer
- provider adapter placeholders
- safe event shape
- example `wrangler.jsonc`
- local testing notes
- deployment notes

---

## Best for

Use this template for:

- page view tracking
- lead form tracking
- signup events
- purchase events
- campaign landing pages
- SaaS conversion tracking
- marketplace order tracking
- multi-project analytics foundations

---

## Cloudflare services used

| Service | Purpose |
| --- | --- |
| Workers | Receives events and processes queue messages |
| Queues | Moves provider delivery to background work |
| Wrangler | Local dev and deployment |

Optional later:

| Service | Add when |
| --- | --- |
| D1 | Store event logs and delivery status |
| Analytics Engine | Store high-volume event analytics |
| KV | Store provider toggles and sampling config |
| Turnstile / Rate Limiting | Protect public endpoints |

---

## Folder structure

```text
server-side-tracking-worker/
├── README.md
├── wrangler.jsonc.example
└── src/
    ├── index.ts
    ├── types.ts
    └── providers/
        ├── ga4.ts
        └── meta.ts
```

---

## Required binding

```jsonc
{
  "queues": {
    "producers": [
      {
        "binding": "TRACKING_QUEUE",
        "queue": "tracking-events"
      }
    ],
    "consumers": [
      {
        "queue": "tracking-events"
      }
    ]
  }
}
```

---

## Setup

Create a Queue:

```bash
npx wrangler queues create tracking-events
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

Send a test event:

```bash
curl -X POST http://localhost:8787/track \
  -H "Content-Type: application/json" \
  -d '{"event_name":"page_view","client_id":"test-client","url":"https://example.com"}'
```

Expected response:

```json
{
  "ok": true
}
```

---

## Privacy rules

Never collect or forward:

- passwords
- full payment card data
- passport or NID numbers
- private documents
- unnecessary personal information

Use hashing where providers support it and where your legal/privacy rules allow it.

---

## Common mistakes

- calling every provider directly from the browser
- blocking the user request while provider APIs run
- collecting too much personal data
- not using unique event IDs
- not separating test and production events
- hardcoding provider secrets
- skipping consent and privacy review

---

## Production notes

Before production:

- add provider secrets with `wrangler secret put`
- define allowed event names
- filter sensitive payload fields
- add event IDs for deduplication
- log provider delivery status if needed
- update privacy policy
- document consent behavior
- separate staging and production providers

---

## Related resources

- [`playbooks/server-side-tracking.md`](../../playbooks/server-side-tracking.md)
- [`templates/queue-worker-starter`](../queue-worker-starter/README.md)
- [`templates/simple-workers-api`](../simple-workers-api/README.md)
- [`templates/README.md`](../README.md)
