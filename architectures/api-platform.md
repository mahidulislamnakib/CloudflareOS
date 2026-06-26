# API Platform Architecture

A Cloudflare-first reference for building APIs that serve customer applications, partner integrations, mobile apps, and internal systems.

## Starting stack

| Need | Service |
| --- | --- |
| API runtime | Workers |
| Core records | D1 |
| Files and exports | R2 |
| Small config/cache | KV |
| Async jobs | Queues |
| Long workflows | Workflows |
| Internal/admin protection | Access |
| Abuse protection | Turnstile / rate limits |
| API events | Analytics Engine |

Start with Workers and D1. Add R2 for files, Queues for asynchronous delivery, and Access for staff tools.

## Core model

```text
Client application
  ↓
API key or user session
  ↓
Workers API
  ↓
Authorization and rate limits
  ↓
D1, R2, KV, Queues
```

## Suggested D1 tables

```text
users
workspaces
memberships
api_keys
api_key_scopes
api_clients
webhook_endpoints
webhook_deliveries
request_logs
audit_logs
usage_limits
settings
```

Minimum API key fields:

```text
id
workspace_id
name
key_prefix
key_hash
scopes
status
last_used_at
expires_at
created_at
```

Store only a hash of the full API key. Show the complete key once when it is created.

## Authentication choices

Use user sessions for browser users.

Use API keys for server-to-server integrations.

Use signed webhook verification for incoming provider events.

Do not use one shared secret for all customers or all integrations.

## Authorization flow

```text
Request arrives
  ↓
Identify user or API key
  ↓
Load workspace context
  ↓
Check scope and role
  ↓
Apply rate limit
  ↓
Validate request body
  ↓
Run action
  ↓
Write audit or usage event
```

Every tenant-owned query must filter by `workspace_id`.

## API key rules

- Give each integration its own key.
- Use scopes such as `read:orders` or `write:leads`.
- Allow key rotation and revocation.
- Store key hashes, never full keys.
- Track last usage without storing sensitive request bodies.
- Use expiration dates for temporary keys.

## Versioning model

Use explicit API versions for public APIs.

```text
/api/v1/products
/api/v1/orders
/api/v1/webhooks
```

Keep breaking changes out of an existing version. Publish deprecation dates before retiring a version.

## Webhook model

```text
Business event occurs
  ↓
Webhook delivery record created
  ↓
Queue sends signed request
  ↓
Receiver responds
  ↓
Delivery status saved
  ↓
Retry when appropriate
```

Suggested webhook delivery states:

```text
pending
processing
delivered
failed
expired
```

Use idempotency identifiers so customers can safely handle retries.

## Request validation

Every write endpoint should validate:

- authentication or API key
- scope
- workspace access
- request schema
- resource ownership
- idempotency key when duplicate writes are risky
- rate limit

Never accept client-provided prices, permissions, tenant IDs, or payment states without server-side verification.

## File and export model

Store exports and large files in R2.

```text
R2:
workspaces/{workspace_id}/exports/{export_id}.csv
```

Store metadata and permission rules in D1. Private exports require a Worker permission check before download.

## API route plan

```text
/api/v1/me
/api/v1/api-keys
/api/v1/webhooks
/api/v1/usage
/api/v1/exports
/api/v1/admin/api-clients
/api/v1/admin/audit-logs
```

Keep public APIs, internal admin APIs, and webhook endpoints clearly separated.

## Background jobs

Use Queues for:

- webhook delivery
- retryable jobs
- export generation
- notification delivery
- usage aggregation
- audit event processing

Use Workflows for long-running export, onboarding, or approval processes.

## Observability

Track:

- request count
- response class
- latency
- rate-limit events
- API key usage
- webhook outcomes
- error categories

Do not log raw authorization headers, passwords, secrets, or sensitive request bodies.

## Security rules

- Protect internal dashboards with Access.
- Enforce scopes and tenant checks server-side.
- Apply rate limits to public endpoints.
- Verify webhook signatures.
- Use idempotency keys for sensitive writes.
- Rotate secrets and revoke keys quickly.
- Audit key creation, revocation, and scope changes.

## Production checklist

- [ ] API keys are hashed and scoped
- [ ] Key rotation and revocation exist
- [ ] Public endpoints are rate-limited
- [ ] Tenant filters are enforced server-side
- [ ] Webhook signatures are verified
- [ ] Retries are idempotent
- [ ] API versions are explicit
- [ ] Sensitive headers are not logged
- [ ] Admin tools are protected
- [ ] Usage and error visibility exists
- [ ] Backup and rollback plans exist

## Common mistakes

- storing full API keys
- using one key for every integration
- trusting client-supplied tenant IDs
- skipping webhook verification
- retrying writes without idempotency
- mixing internal and public endpoints
- logging secrets in request logs
- changing public APIs without versioning

## Related docs

- [`architectures/authentication-authorization.md`](./authentication-authorization.md)
- [`architectures/multi-tenant-saas.md`](./multi-tenant-saas.md)
- [`catalog/workers.md`](../catalog/workers.md)
- [`catalog/d1.md`](../catalog/d1.md)
- [`catalog/r2.md`](../catalog/r2.md)
- [`catalog/kv.md`](../catalog/kv.md)
- [`catalog/queues.md`](../catalog/queues.md)
- [`catalog/workflows.md`](../catalog/workflows.md)
- [`catalog/access.md`](../catalog/access.md)
