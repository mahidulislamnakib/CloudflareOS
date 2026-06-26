# IoT Platform Architecture

A Cloudflare-first reference for devices, telemetry, commands, alerts, dashboards, and tenant-safe operations.

## Starting stack

| Need | Service |
| --- | --- |
| Device API and dashboard API | Workers |
| Device and tenant records | D1 |
| Telemetry pipeline | Queues |
| Live device coordination | Durable Objects |
| Firmware, reports, exports | R2 |
| Small config/cache | KV |
| Long jobs | Workflows |
| Internal admin | Access |
| Operational analytics | Analytics Engine |

Start with Workers, D1, and Queues. Add Durable Objects only when devices need live coordination, connection state, or ordered command handling.

## Core model

```text
Workspace
  ↓
Devices
  ↓
Telemetry and events
  ↓
Alerts and commands
  ↓
Dashboard and reports
```

Every device-owned record should include `workspace_id`.

## Suggested D1 tables

```text
users
workspaces
memberships
devices
device_credentials
device_groups
telemetry_snapshots
commands
command_results
alerts
alert_rules
firmware_releases
firmware_assignments
audit_logs
settings
```

Keep high-volume raw telemetry out of D1 when volume grows. D1 is best for device metadata, current state, commands, configuration, and audit records.

## Device registration flow

```text
Admin creates device record
  ↓
System creates device credential or enrollment token
  ↓
Device registers through Worker endpoint
  ↓
Worker validates identity and workspace
  ↓
Device becomes active
```

Never use one shared device secret for every device.

## Telemetry flow

```text
Device sends telemetry
  ↓
Worker authenticates device
  ↓
Worker validates payload and limits size
  ↓
Current state stored or updated
  ↓
Queue receives async processing job
  ↓
Alerts, reports, and downstream actions run
```

Use idempotency keys or sequence numbers to avoid duplicate processing when devices retry.

## Command flow

```text
Operator requests command
  ↓
Worker checks workspace and role
  ↓
Command record created
  ↓
Durable Object or queue coordinates delivery
  ↓
Device acknowledges command
  ↓
Command result stored
```

Commands should have explicit states:

```text
queued
sent
acknowledged
completed
failed
expired
```

## Durable Object use cases

Use Durable Objects when you need:

- one logical coordinator per device
- live connection state
- ordered command processing
- rate-limited device channels
- shared real-time dashboard state

Do not use a Durable Object for every simple database write.

## File model

Store firmware packages, reports, and exported data in R2.

```text
R2:
workspaces/{workspace_id}/firmware/{release_id}.bin
workspaces/{workspace_id}/reports/{report_id}.csv
```

Store file metadata and access rules in D1.

## API route plan

```text
/api/devices/register
/api/devices/:id/telemetry
/api/devices/:id/heartbeat
/api/devices/:id/commands
/api/devices/:id/config
/api/dashboard/devices
/api/dashboard/alerts
/api/admin/devices
/api/admin/firmware
/api/admin/audit-logs
```

## Security rules

- Device identity is validated on every device endpoint.
- Device credentials are rotated and revocable.
- Every dashboard query filters by `workspace_id`.
- Commands require role checks.
- Device configuration changes are audit-logged.
- Internal operations are protected with Access.
- Payload size, frequency, and schema are validated server-side.

## Background jobs

Use Queues for:

- telemetry enrichment
- alert evaluation
- report generation
- notification delivery
- firmware rollout follow-up
- retryable command processing

Use Workflows for staged firmware rollouts, scheduled reports, and long-running maintenance processes.

## Analytics

Use Analytics Engine for non-sensitive operational events:

- device registered
- telemetry accepted
- device offline
- alert triggered
- command completed
- firmware rollout started

Do not place private device secrets or sensitive payloads into analytics events.

## Production checklist

- [ ] Device credentials are unique and revocable
- [ ] Device payloads are validated and rate-limited
- [ ] Workspace isolation is enforced
- [ ] Command states are explicit
- [ ] Retries are idempotent
- [ ] High-volume telemetry strategy is defined
- [ ] Firmware access is protected
- [ ] Admin actions are audit-logged
- [ ] Alert ownership and escalation rules exist
- [ ] Backup and rollback plans exist

## Common mistakes

- using one shared secret for all devices
- writing unlimited raw telemetry into transactional tables
- trusting device timestamps without validation
- sending commands without status tracking
- ignoring duplicate delivery and retry behavior
- exposing firmware files publicly
- forgetting workspace filters on dashboards

## Related docs

- [`architectures/multi-tenant-saas.md`](./multi-tenant-saas.md)
- [`architectures/authentication-authorization.md`](./authentication-authorization.md)
- [`catalog/workers.md`](../catalog/workers.md)
- [`catalog/d1.md`](../catalog/d1.md)
- [`catalog/r2.md`](../catalog/r2.md)
- [`catalog/queues.md`](../catalog/queues.md)
- [`catalog/durable-objects.md`](../catalog/durable-objects.md)
- [`catalog/workflows.md`](../catalog/workflows.md)
- [`catalog/access.md`](../catalog/access.md)
