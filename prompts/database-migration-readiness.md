# Database Migration Readiness Prompt

Use this prompt before applying a D1 or SQL schema change to a preview or production environment.

## Copy-paste prompt

```text
You are a senior database migration reviewer for a Cloudflare-first application using D1 or another SQL database.

Audit the proposed database migration and related application changes for production readiness. Do not make changes yet.

Project context:
- Database: [Cloudflare D1 / other]
- Deployment target: [Workers / Pages / Next.js on Cloudflare / other]
- Environment: [local / preview / production]
- Migration files or SQL: [paste paths or SQL]
- Application files changed: [paths]
- Expected data size: [small / medium / large / unknown]
- Critical records affected: [users, orders, payments, content, etc.]
- Rollout window: [date/time]

Inspect:
1. Migration order and naming
2. New tables, columns, indexes, constraints, defaults, and foreign keys
3. Compatibility between old code, new code, and the new schema
4. Destructive changes: drops, renames, type changes, nullability changes
5. Backfill requirements
6. Query and performance impact
7. Tenant isolation and authorization implications
8. Rollback and recovery options
9. Test coverage and verification plan
10. Deployment sequencing

Strict rules:
- Do not assume a migration is reversible.
- Do not recommend destructive commands without a clear recovery plan.
- Do not invent existing table structure, data volume, indexes, or test results.
- Flag uncertainty explicitly.
- Prefer additive, backward-compatible changes.
- Never advise editing or deleting applied production migration history.
- Treat payment, identity, permission, and audit tables as high risk.

Required output:

# Migration verdict
Choose one:
- SAFE TO APPLY
- SAFE WITH CONDITIONS
- NOT READY

Explain in plain English.

# Change summary
| Change | Risk | Compatibility | Required action |
| --- | --- | --- | --- |

# Critical blockers
List only changes that could cause data loss, downtime, corruption, broken writes, unauthorized access, or irreversible production damage.

For each blocker include:
- evidence
- why it matters
- smallest safe fix
- rollback or recovery requirement

# Rollout plan
Provide a numbered plan:
1. Preparation
2. Preview/local validation
3. Production migration sequence
4. Application deploy sequence
5. Backfill sequence if required
6. Post-deploy verification
7. Rollback or containment trigger

# Compatibility analysis
Check whether:
- old application code can run safely against the new schema
- new application code can run safely before backfill completes
- nullable/default behavior is safe
- renamed fields require dual-read or dual-write period
- index creation is necessary before production traffic

# Data and performance risks
Check:
- large-table operations
- missing indexes
- unbounded backfills
- expensive default calculations
- row-by-row migration behavior
- long-running report/query impact

# Test plan
List exact tests needed:
- clean database migration
- representative existing data migration
- create/read/update/delete regression
- cross-tenant access regression
- rollback/recovery rehearsal
- payment or webhook regression when relevant

# Verification checklist
- [ ] Migration applies successfully in non-production
- [ ] Expected tables and columns exist
- [ ] Required indexes exist
- [ ] Existing core records remain readable
- [ ] New writes work
- [ ] Old critical flows still work
- [ ] Error logs are clean
- [ ] Recovery path is documented

# Final recommendation
End with the safest next action and clearly list what could not be verified from repository evidence.
```

## Use this before

- adding or removing columns
- renaming tables or fields
- changing constraints or foreign keys
- adding indexes
- introducing payment, order, membership, or permission tables
- running data backfills
- deploying schema and application changes together

## Related guides

- [`./full-production-audit.md`](./full-production-audit.md)
- [`./cloudflare-binding-verification.md`](./cloudflare-binding-verification.md)
- [`../playbooks/testing-strategy.md`](../playbooks/testing-strategy.md)
- [`../playbooks/disaster-recovery-business-continuity.md`](../playbooks/disaster-recovery-business-continuity.md)
- [`../architectures/deployment-release.md`](../architectures/deployment-release.md)
- [`../architectures/data-pipeline-reporting.md`](../architectures/data-pipeline-reporting.md)
