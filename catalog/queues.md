# Cloudflare Queues

Cloudflare Queues provide asynchronous messaging between Workers.

Use Queues when work should happen after the user receives a response, especially when the task may be slow, retryable, or dependent on an external service.

---

## Simple explanation

A Queue lets one Worker send a message now and lets another Worker process it later.

```text
Request
  ↓
Worker receives request
  ↓
Queue stores message
  ↓
Consumer Worker processes it in the background
```

This keeps the original request fast and separates user-facing work from background work.

---

## What problem it solves

Queues solve problems caused by slow, unreliable, or non-essential work inside a request.

They are useful for:

- email sending
- webhook processing
- server-side tracking
- notifications
- image or document processing triggers
- AI summary jobs
- CRM synchronization
- report generation
- cache refresh jobs
- audit event processing

---

## When to use Queues

Use Queues when:

- the user should not wait for the task to finish
- an external API can be slow or fail temporarily
- retries are important
- events need to be processed in the background
- you are processing many independent jobs

Good examples:

```text
User submits a contact form
  ↓
Return success quickly
  ↓
Queue message
  ↓
Send notification and update CRM
```

```text
User completes checkout
  ↓
Return confirmation
  ↓
Queue message
  ↓
Send analytics events and receipt email
```

---

## When not to use Queues

Queues are usually unnecessary when:

- the response is required immediately
- the work is very small and fast
- you need shared live state or coordination
- you need SQL querying as the main operation

Use:

- Durable Objects for coordinated shared state
- D1 for relational/queryable data
- KV for lightweight configuration or cache
- Workers directly for small request-time work

---

## Beginner example

A simple form-processing flow:

```text
Visitor submits form
  ↓
Worker validates input
  ↓
Worker adds message to Queue
  ↓
Worker returns success response
  ↓
Queue consumer sends email or stores follow-up work
```

---

## Production notes

For production projects:

- keep messages small
- validate every message payload
- define clear job types
- make processing safe to retry
- log failures and important outcomes
- separate unrelated job types when useful
- monitor queue depth and consumer behavior
- document retry and failure handling
- avoid using a Queue as the only source of business truth

---

## Security notes

Do:

- validate messages before processing
- authenticate public producer endpoints
- keep provider credentials in Worker secrets
- minimize personal data in messages
- use clear job schemas

Do not:

- put secrets inside queue messages
- trust client-provided payloads without validation
- store sensitive data unnecessarily
- assume every external provider call will succeed

---

## Cost awareness

Queue usage can be affected by:

- messages sent
- messages processed
- retries
- processing volume
- message size

Keep jobs focused, avoid duplicate messages, and use the simplest event structure that fits the task.

---

## Common mistakes

- doing slow work directly in the user request
- sending huge payloads
- ignoring retry behavior
- mixing unrelated job types without naming conventions
- not logging failures
- placing permanent business state only inside queue messages
- hardcoding provider secrets
- processing the same message unsafely more than once

---

## Related Cloudflare services

| Service | Relationship |
| --- | --- |
| Workers | Produces and consumes queue messages |
| D1 | Stores job status, business records, or results |
| R2 | Stores files that jobs may process |
| KV | Stores lightweight config for consumers |
| Durable Objects | Coordinates shared state when needed |
| Analytics Engine | Tracks high-volume job metrics |
| Turnstile | Protects public endpoints that produce jobs |
| Wrangler | Creates queues and configures bindings |

---

## Good starter templates

- [`templates/queue-worker-starter`](../templates/queue-worker-starter/README.md)
- [`templates/server-side-tracking-worker`](../templates/server-side-tracking-worker/README.md)
- [`templates/simple-workers-api`](../templates/simple-workers-api/README.md)

---

## Official sources

- Cloudflare Queues documentation
- Cloudflare Queues Workers bindings documentation
- Cloudflare Queues limits and pricing documentation

---

## Freshness

Last checked: 2026-06-27
Risk level: medium

Always verify current limits, delivery behavior, retries, and pricing in the official Cloudflare documentation before using Queues in production.
