# Microservices Architecture

A Cloudflare-first reference for deciding when services are useful, how they communicate, and how to avoid turning a simple project into an unmanageable distributed system.

## Start with a modular monolith

Most products should begin with one Worker application split into clear modules.

```text
One Worker app
  ├── auth module
  ├── users module
  ├── orders module
  ├── payments module
  ├── notifications module
  └── admin module
```

Move a module into a separate service only when it has a clear operational reason.

## Good reasons to split a service

- independent scaling needs
- separate deployment ownership
- long-running background workloads
- strict data or access boundary
- external integration isolation
- failure isolation
- clearly independent business domain

## Bad reasons to split a service

- the project is still small
- there is only one developer/team
- the modules share the same data constantly
- no monitoring exists yet
- the split is only for trend-following

## Cloudflare-first service map

| Need | Service |
| --- | --- |
| HTTP APIs | Workers |
| Async service communication | Queues |
| Ordered/shared state | Durable Objects |
| Core relational records | D1 |
| Files and exports | R2 |
| Small config/cache | KV |
| Long workflows | Workflows |
| Service analytics | Analytics Engine |
| Internal access | Access |

## Example service boundaries

```text
Public API Worker
  ↓
Identity service
Order service
Payment integration service
Notification service
Search/indexing service
Reporting service
```

Not every service needs its own database at the beginning. First define ownership and access boundaries clearly.

## Service communication

Use synchronous calls only when the user needs an immediate answer.

```text
User request
  ↓
API Worker
  ↓
Service response
  ↓
Return result
```

Use Queues for work that can happen later.

```text
Order created
  ↓
Queue event
  ↓
Notification service
Reporting service
Search service
```

Avoid chaining many synchronous services in one user request.

## Event pattern

Use clear event names.

```text
order.created
payment.confirmed
user.registered
file.uploaded
invoice.generated
```

Each event should include:

```text
event_id
event_type
occurred_at
workspace_id
resource_id
payload_version
```

Consumers should be safe to retry.

## Idempotency

Distributed systems retry. Every sensitive write should support idempotency.

```text
Request arrives
  ↓
Check idempotency key
  ↓
Previous result exists? Return it
  ↓
Otherwise process once
  ↓
Store result
```

Use this for payments, order creation, provisioning, and webhook handling.

## Service-to-service security

Never treat an internal route as automatically trusted.

Use:

- scoped service credentials
- signed requests
- short-lived tokens where appropriate
- explicit tenant/workspace context
- server-side authorization checks
- audit logs for sensitive actions

Do not expose service secrets to frontend code.

## Tenant isolation

For multi-tenant systems, pass and validate `workspace_id` deliberately.

```text
Incoming request
  ↓
Authenticate caller
  ↓
Resolve workspace
  ↓
Check caller access
  ↓
Run service action only within workspace boundary
```

Never accept a client-provided workspace ID without checking membership.

## Durable Object use cases

Use Durable Objects when one logical object needs ordered coordination.

Examples:

- live collaboration room
- device command channel
- checkout inventory reservation
- rate-limited shared counter
- per-customer workflow lock

Do not use them for every normal CRUD request.

## Data ownership

Each domain should have a clear owner.

```text
Order service owns orders
Payment service owns payment integration records
Notification service owns delivery attempts
```

Avoid multiple services writing the same business record without an explicit contract.

## Observability

Track:

- request failures
- queue failures
- retry counts
- latency
- event processing delay
- service dependency errors
- idempotency collisions

Use correlation IDs across API requests, queue events, and audit records.

## Deployment strategy

Deploy services independently only when they are actually independent.

For every service, define:

```text
owner
purpose
inputs
outputs
secrets
data access
failure behavior
rollback plan
```

## Production checklist

- [ ] Modular monolith was considered first
- [ ] Every service has a clear domain owner
- [ ] Async work uses queues where possible
- [ ] Sensitive writes use idempotency keys
- [ ] Service credentials are scoped
- [ ] Tenant boundaries are enforced
- [ ] Events have versioned payloads
- [ ] Consumers are retry-safe
- [ ] Correlation IDs exist
- [ ] Failure and rollback plans exist
- [ ] Observability exists before major service splits

## Common mistakes

- splitting too early
- too many synchronous service calls
- sharing one table across unrelated services
- no idempotency for retries
- no event schema versioning
- trusting internal routes automatically
- hiding errors between services
- adding distributed complexity without monitoring

## Related docs

- [`architectures/api-platform.md`](./api-platform.md)
- [`architectures/multi-tenant-saas.md`](./multi-tenant-saas.md)
- [`architectures/authentication-authorization.md`](./authentication-authorization.md)
- [`catalog/workers.md`](../catalog/workers.md)
- [`catalog/d1.md`](../catalog/d1.md)
- [`catalog/queues.md`](../catalog/queues.md)
- [`catalog/durable-objects.md`](../catalog/durable-objects.md)
- [`catalog/workflows.md`](../catalog/workflows.md)
- [`catalog/analytics-engine.md`](../catalog/analytics-engine.md)
