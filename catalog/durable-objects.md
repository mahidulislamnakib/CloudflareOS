# Cloudflare Durable Objects

Cloudflare Durable Objects provide strongly coordinated, per-object state for Workers applications.

Use Durable Objects when your app needs one logical place to manage shared live state, coordination, counters, rooms, locks, or session-like behavior.

---

## Simple explanation

A Durable Object is like a small stateful worker with a unique name or ID.

Requests for the same object go to the same logical instance, so it can safely coordinate state for that object.

Example:

```text
chat room: room-123
counter: article-456
lock: payout-job-789
customer workspace: tenant-abc
```

---

## What problem it solves

Durable Objects solve coordination problems that are hard with normal stateless Workers.

They are useful when you need:

- shared live state
- accurate counters
- rooms or sessions
- locks
- coordination
- rate limit buckets
- multiplayer-style state
- WebSocket coordination
- per-tenant state containers

---

## When to use Durable Objects

Use Durable Objects when multiple requests need to coordinate around the same named thing.

Good examples:

- chat room state
- collaborative editing room
- live poll counter
- rate limit bucket
- queue coordination lock
- multiplayer room
- per-customer workspace state
- payment or order workflow coordination

---

## When not to use Durable Objects

Durable Objects are usually unnecessary when:

- you only need SQL records
- you only need file storage
- you only need simple key-value config
- you do not need coordination
- your app is mostly static
- the state must be globally queryable like a database table

Use:

- D1 for relational/queryable records
- R2 for files
- KV for simple config/cache
- Queues for background jobs
- Workers directly for stateless request logic

---

## Beginner example

A live poll can use one Durable Object per poll:

```text
User votes
  ↓
Worker routes to Durable Object for poll-123
  ↓
Durable Object updates vote count
  ↓
Durable Object returns latest result
```

This keeps voting state coordinated for that specific poll.

---

## Production notes

For production projects:

- define object naming rules clearly
- keep object state focused and small
- use D1 for queryable records
- use R2 for files
- avoid one global object for everything
- document reset and recovery behavior
- add authentication for write actions
- monitor important object operations
- use migrations correctly

---

## Security notes

Do:

- authenticate sensitive actions
- validate all input before changing state
- keep secrets in Worker secrets
- separate tenants/users by object naming rules
- avoid storing unnecessary sensitive data
- document who can access each object

Do not:

- trust client-provided object IDs blindly
- put unrelated business logic into one object
- store large files in object storage
- expose private object state publicly
- skip authorization checks for state changes

---

## Cost awareness

Durable Object cost can be affected by:

- number of requests
- object usage volume
- storage operations
- WebSocket usage
- long-running active objects
- poor object naming strategy

Use Durable Objects only when coordination is truly needed.

---

## Common mistakes

- using Durable Objects when D1 is enough
- creating one global object for everything
- storing large files inside Durable Objects
- forgetting migrations
- treating object state as a queryable database
- using unclear object names
- mixing unrelated state in one object
- skipping auth on write operations

---

## Related Cloudflare services

| Service | Relationship |
| --- | --- |
| Workers | Routes requests to Durable Objects |
| D1 | Stores relational/queryable records |
| R2 | Stores files and large objects |
| KV | Stores lightweight config/cache |
| Queues | Handles background work |
| Realtime/WebSockets | Often coordinated through Durable Objects |
| Wrangler | Configures bindings and migrations |

---

## Good starter templates

- [`templates/durable-object-starter`](../templates/durable-object-starter/README.md)
- [`templates/simple-workers-api`](../templates/simple-workers-api/README.md)

---

## Official sources

- Cloudflare Durable Objects documentation
- Durable Objects Workers bindings documentation
- Durable Objects migrations documentation

---

## Freshness

Last checked: 2026-06-27
Risk level: medium

Durable Objects are powerful but easy to overuse. Always verify current limits, storage behavior, pricing, and migration rules in the official Cloudflare documentation before production use.
