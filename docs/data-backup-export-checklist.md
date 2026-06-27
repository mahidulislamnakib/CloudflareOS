# Data Backup and Export Checklist

Use this checklist before launching or changing a Cloudflare-first application that stores important data in D1, R2, KV, Queues, Durable Objects, or external providers.

> A backup plan is not complete until someone has tested a restore or export path with safe non-production data.

## What this protects

Track every data surface that matters to users, staff, billing, support, or recovery:

- D1 relational data and migration history
- R2 original files, derived files, exports, and object metadata
- KV configuration, feature flags, cache keys, and low-risk session metadata
- Queue messages, retry state, and dead-letter or failure records
- Durable Object state and coordination records
- Webhook events, audit logs, payment records, and provider IDs
- Wrangler configuration, routes, and binding names needed to read the data
- repeatable local or staging seed data used for restore tests

## 1. Assign ownership and recovery targets

- [ ] Every critical data set has a named owner.
- [ ] Every critical data set has a business impact note.
- [ ] Recovery time objective is written for each core user journey.
- [ ] Recovery point objective is written for data that may change during an incident.
- [ ] The restore approver is named for production recovery.
- [ ] Support/contact owner knows how affected users or tenants will be identified.

## 2. Inventory the data

Create an inventory before the first production launch.

- [ ] D1 tables are listed with owner, tenant boundary, lifecycle, and criticality.
- [ ] R2 buckets and object prefixes are listed with public/private boundary and retention expectations.
- [ ] KV namespaces are listed with whether they are cache, config, flag, or low-risk metadata.
- [ ] Queue producers and consumers are listed with retry and failure behavior.
- [ ] Durable Object namespaces are listed with what state they coordinate.
- [ ] External provider records are listed with provider, record ID, and reconciliation path.
- [ ] Data relationships between D1 rows, R2 objects, jobs, and external IDs are documented.

## 3. D1 backup and restore readiness

- [ ] Migrations are versioned in source control.
- [ ] Risky migrations have a written backup/export and rollback or forward-repair plan.
- [ ] Critical tables have first queries and integrity checks documented.
- [ ] Exports or backups are taken on a schedule appropriate to the product risk.
- [ ] Restore steps are tested against non-production or copied data.
- [ ] Restore verification includes row counts, tenant boundaries, critical queries, and app smoke tests.
- [ ] Records created after a restore point have a reconciliation plan.
- [ ] Manual repair SQL is reviewed, recorded, and scoped before production use.

## 4. R2 object recovery readiness

- [ ] Object keys are generated server-side and follow a predictable naming standard.
- [ ] D1 or another metadata source maps objects to owner, tenant, permission, and lifecycle state.
- [ ] Public and private objects are separated by bucket or prefix policy.
- [ ] Original files and generated derivatives are logically separate.
- [ ] Delete behavior is documented as soft delete, retention window, or immediate delete.
- [ ] Restore steps verify both object bytes and metadata permissions.
- [ ] A cleanup path exists for orphaned metadata or orphaned objects.
- [ ] Large export/download workflows have limits and audit logging.

## 5. KV, cache, and feature flag recovery

- [ ] KV is not the source of truth for transactional data.
- [ ] Critical KV keys or namespaces have documented default values.
- [ ] Feature flags have owners, safe defaults, and removal dates.
- [ ] Cache invalidation or repopulation steps are documented.
- [ ] Recovery does not depend on eventually consistent reads for critical writes.
- [ ] Missing or stale KV data fails safely.

## 6. Queue and workflow recovery

- [ ] Every job type has an idempotency key or duplicate-protection rule.
- [ ] Failed jobs are visible with enough context to retry or abandon safely.
- [ ] Retry limits and dead-letter or escalation behavior are documented.
- [ ] Job payloads avoid storing secrets or unnecessary private data.
- [ ] Replaying jobs cannot duplicate payments, orders, emails, payouts, or irreversible actions.
- [ ] Queue recovery includes a way to pause producers or consumers during data incidents.

## 7. Durable Object recovery

- [ ] Durable Object state ownership and lifecycle are documented.
- [ ] The system knows which entity or tenant maps to each object ID.
- [ ] Critical state has a recovery, rebuild, or reconciliation plan.
- [ ] Alarms and background behavior can be paused or made safe during incidents.
- [ ] Recovery verification includes concurrent access or coordination behavior when relevant.

## 8. Privacy, access, and retention

- [ ] Backups and exports are protected from public access.
- [ ] Export files avoid unnecessary private data.
- [ ] Access to backup/export data is limited to named roles.
- [ ] Retention period is documented for operational, legal, and user-deletion needs.
- [ ] Account deletion or data export requirements are understood before launch.
- [ ] Backups are not copied into local development without approval and sanitization.
- [ ] Incident notes record data set names and IDs, not secrets or private payloads.

## 9. Restore test checklist

A restore test should be repeatable and non-destructive.

- [ ] Test uses non-production data or an approved sanitized copy.
- [ ] Test starts from a written backup/export artifact.
- [ ] Test records exact commands, dashboard steps, and access requirements.
- [ ] Test verifies application behavior, not only file existence or row counts.
- [ ] Test includes empty, partial, and realistic data cases when practical.
- [ ] Test records duration, gaps, failed assumptions, and follow-up tasks.
- [ ] Test evidence is stored where future incident responders can find it.

## 10. Launch blocker questions

Do not launch critical workflows until these have clear answers:

- [ ] What data can the business afford to lose?
- [ ] How quickly must core journeys be restored?
- [ ] Who can approve a production restore?
- [ ] Which data is financially, legally, or privacy critical?
- [ ] How will newly created records after a restore point be reconciled?
- [ ] How will affected users or tenants be identified and contacted?
- [ ] What command or dashboard path proves the restore worked?

## Backup inventory template

```md
# Backup and Export Inventory

Environment:
Owner:
Last restore test:

| Data set | Service | Criticality | Backup/export method | Restore verification | Owner | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| posts | D1 | high |  | row count + page smoke test |  |  |
| private uploads | R2 | high |  | object exists + permission check |  |  |
| feature flags | KV | medium |  | expected defaults loaded |  |  |
```

## Related guides

- [`production-readiness-checklist.md`](production-readiness-checklist.md)
- [`rollback-checklist.md`](rollback-checklist.md)
- [`incident-response-checklist.md`](incident-response-checklist.md)
- [`environment-variable-checklist.md`](environment-variable-checklist.md)
- [`../playbooks/disaster-recovery-business-continuity.md`](../playbooks/disaster-recovery-business-continuity.md)
- [`../playbooks/data-modeling-d1.md`](../playbooks/data-modeling-d1.md)
- [`../prompts/database-migration-readiness.md`](../prompts/database-migration-readiness.md)
