# Cloudflare Workers

Cloudflare Workers let you run backend code close to users on Cloudflare's global network.

Use Workers when you need APIs, middleware, server-rendered pages, webhooks, background logic, or edge-side business rules without managing servers.

---

## Simple explanation

A Worker is a small serverless program that runs when a request comes in.

Instead of renting a VPS, installing software, and managing uptime, you write code and Cloudflare runs it for you.

---

## What problem it solves

Workers solve the problem of running application logic without managing servers.

They are useful when you need:

- API endpoints
- form handlers
- webhooks
- authentication checks
- redirects and rewrites
- custom caching logic
- server-side tracking endpoints
- lightweight full-stack applications
- backend logic for D1, R2, KV, Queues, and Durable Objects

---

## When to use Workers

Use Workers when:

- your app needs backend/API logic
- you want a Cloudflare-first backend
- you need fast global response times
- you want to connect Cloudflare services together
- you want to avoid VPS/server maintenance
- your project benefits from serverless scaling

Good examples:

- news portal API
- CMS backend
- job portal backend
- marketplace API
- server-side tracking service
- webhook receiver
- secure upload endpoint
- admin dashboard API

---

## When not to use Workers

Workers may not be the best fit when:

- you need a long-running traditional server process
- you depend heavily on unsupported Node.js APIs
- your app needs local disk storage
- you need a standard always-on WebSocket server without Durable Objects
- your workload is better handled by specialized services
- you only need a static website with no backend logic

For mostly static websites, start with Pages.

For relational data, pair Workers with D1.

For file storage, pair Workers with R2.

---

## Beginner example

A simple API Worker can expose:

```text
GET /health
GET /api/articles
POST /api/contact
```

Basic flow:

```text
Browser
  ↓
Worker route
  ↓
Validate request
  ↓
Read/write D1 or R2 if needed
  ↓
Return JSON response
```

---

## Production notes

For production projects:

- keep routes small and understandable
- validate all request input
- use environment bindings for Cloudflare services
- store secrets with Worker secrets
- use Queues for slow background work
- use D1 for relational data
- use R2 for files
- add rate limits or Turnstile for public endpoints
- log errors clearly
- plan rollback and migration steps

---

## Security notes

Do:

- keep secrets out of Git
- validate user input
- protect admin routes
- check authentication before sensitive actions
- avoid exposing private R2 objects directly
- rate-limit public write endpoints
- use Turnstile for public forms when needed

Do not:

- hardcode API keys
- trust client-provided user roles
- store sensitive data in logs
- expose debug errors publicly
- skip auth for write routes

---

## Cost awareness

Worker cost can be affected by:

- number of requests
- CPU time
- subrequests to other services
- usage of connected services like D1, R2, KV, Queues, and Durable Objects
- high-volume public endpoints

Keep the first version simple. Add services only when there is a real need.

---

## Common mistakes

- using Workers as a dumping ground for all logic
- adding too many services before the MVP is clear
- forgetting bindings in `wrangler.jsonc`
- using secrets in `.env` but not setting Worker secrets
- doing slow provider API calls inside user-facing requests
- skipping input validation
- skipping local testing with Wrangler
- not separating frontend and backend responsibilities

---

## Related Cloudflare services

| Service | Relationship |
| --- | --- |
| Pages | Frontend hosting; can pair with Workers APIs |
| D1 | SQL database for Workers apps |
| R2 | File/object storage |
| KV | Lightweight key-value config/cache |
| Queues | Background jobs |
| Durable Objects | Coordinated state |
| Turnstile | Bot protection for forms |
| Access | Admin/internal protection |
| Wrangler | Local dev and deployment |

---

## Good starter templates

- [`templates/simple-workers-api`](../templates/simple-workers-api/README.md)
- [`templates/d1-crud-starter`](../templates/d1-crud-starter/README.md)
- [`templates/r2-upload-starter`](../templates/r2-upload-starter/README.md)
- [`templates/queue-worker-starter`](../templates/queue-worker-starter/README.md)

---

## Official sources

- Cloudflare Workers documentation
- Cloudflare Workers runtime documentation
- Cloudflare Wrangler documentation

---

## Freshness

Last checked: 2026-06-27
Risk level: medium

Cloudflare Workers changes frequently. For production usage, always verify limits, runtime support, and pricing against the official Cloudflare documentation.
