# Observability & Operations Architecture

A Cloudflare-first reference for logs, metrics, audit trails, alerts, incident response, backups, and production runbooks.

## Goal

Build applications that are not only deployable, but also understandable and recoverable when something fails.

Use this architecture for:

- SaaS products
- marketplaces
- admin platforms
- APIs
- AI applications
- internal tools
- high-traffic public sites

## Starting stack

| Need | Service |
| --- | --- |
| App runtime | Workers |
| Structured app records | D1 |
| Custom product events | Analytics Engine |
| Async processing | Queues |
| Durable files and exports | R2 |
| Internal dashboards | Access |
| Application logs | Workers Logs / observability tools |
| Incident notes and audits | D1 |

Start with useful logs, clear error responses, audit records, and a lightweight incident process before adding complex monitoring systems. Use [`../docs/observability-checklist.md`](../docs/observability-checklist.md) before launch to verify the operational signals are in place.

## Core model

```text
Request or job runs
  ↓
Worker records structured event
  ↓
Errors and latency are visible
  ↓
Important actions create audit records
  ↓
Alerts notify staff when thresholds are crossed
  ↓
Incident runbook guides response
```

## What to measure

Track a small set of meaningful signals first:

```text
request count
error rate
latency
queue failures
webhook failures
payment verification failures
login failures
rate-limit events
background job delay
```

Avoid collecting every possible metric before you know how it will be used.

## Structured logging pattern

Every important request or job should include a correlation ID.

```text
request_id
workspace_id
user_id when safe
action
status
latency_ms
error_code
created_at
```

Use consistent field names across APIs, Workers, queue consumers, and webhook handlers.

Do not log:

- passwords
- API keys
- authorization headers
- session tokens
- payment credentials
- private document content
- sensitive health or identity data

## Error model

Use clear application error categories.

```text
validation_error
authentication_error
authorization_error
not_found
conflict
rate_limited
external_service_error
internal_error
```

Return safe error responses to users. Keep detailed technical context in internal logs only.

## Audit logging

Audit logs are for important business and security actions.

Suggested actions:

```text
user.role_changed
workspace.member_removed
payment.status_changed
payout.approved
inventory.adjusted
document.downloaded
api_key.revoked
admin.setting_changed
```

Suggested audit fields:

```text
id
workspace_id
actor_user_id
action
resource_type
resource_id
metadata
created_at
```

Audit logs should be append-only or strongly protected from casual edits.

## Queue observability

For every asynchronous job, store enough information to investigate failures.

```text
job_id
event_type
resource_id
attempt_count
status
last_error
created_at
processed_at
```

Make consumers retry-safe. A failed notification should not create a duplicate order or payment record.

## Webhook observability

Track incoming and outgoing webhooks separately.

```text
webhook_event_id
provider
signature_valid
status
attempt_count
received_at
processed_at
```

Never log raw secrets or complete sensitive payloads unnecessarily.

## Alert model

Start with alerts for high-impact events:

- sudden error-rate increase
- payment webhook failures
- queue processing failures
- repeated login or abuse failures
- critical integration failure
- unusually high latency
- failed deployment or migration

Alerts should include a link or reference to the relevant runbook.

## Incident response flow

```text
Issue detected
  ↓
Confirm impact
  ↓
Contain or disable risky action
  ↓
Check logs and recent deploys
  ↓
Rollback or apply fix
  ↓
Verify recovery
  ↓
Write incident note
  ↓
Create follow-up tasks
```

Keep incident notes factual: time, impact, root cause, mitigation, and prevention work. For an operational response checklist, use [`../docs/incident-response-checklist.md`](../docs/incident-response-checklist.md).

## Backup and recovery model

Define backup and export responsibilities before launch.

```text
D1 data export or backup plan
R2 object retention plan
configuration export
secret recovery procedure
migration rollback procedure
```

Test restoration steps. A backup that has never been restored is only an assumption.

## Deployment runbook

Before production deployment:

```text
1. Review schema changes
2. Review secrets and bindings
3. Run tests
4. Confirm migration plan
5. Deploy
6. Check error logs
7. Verify core user flow
8. Watch key metrics
9. Keep rollback path ready
```

## Production checklist

- [ ] Correlation IDs are used across important flows
- [ ] Sensitive data is excluded from logs
- [ ] Error categories are consistent
- [ ] Audit logs exist for sensitive actions
- [ ] Queue failures are visible
- [ ] Webhook failures are visible
- [ ] High-impact alerts are configured
- [ ] Incident runbook exists
- [ ] Backup and restore steps are documented
- [ ] Deployment rollback steps are tested
- [ ] Recent changes can be traced to a deploy

## Common mistakes

- logging secrets or full customer payloads
- treating logs as the only audit trail
- no correlation ID across async jobs
- retrying non-idempotent actions blindly
- alerting on everything and ignoring alerts later
- having backups without testing restore
- deploying schema changes without rollback planning
- hiding internal errors behind generic messages without recording details

## Related docs

- [`architectures/microservices.md`](./microservices.md)
- [`architectures/api-platform.md`](./api-platform.md)
- [`architectures/authentication-authorization.md`](./authentication-authorization.md)
- [`catalog/workers.md`](../catalog/workers.md)
- [`catalog/d1.md`](../catalog/d1.md)
- [`catalog/r2.md`](../catalog/r2.md)
- [`catalog/queues.md`](../catalog/queues.md)
- [`catalog/analytics-engine.md`](../catalog/analytics-engine.md)
- [`catalog/access.md`](../catalog/access.md)
