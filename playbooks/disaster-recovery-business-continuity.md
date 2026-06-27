# Disaster Recovery & Business Continuity Playbook

A practical playbook for recovering a Cloudflare-first application after data loss, failed deployment, provider outage, security incident, or major operational failure.

> This is an engineering playbook, not legal, insurance, regulatory, or compliance advice. Adapt it to your product, data sensitivity, provider contracts, and local requirements.

## Goal

Keep the business operating safely during disruption and restore critical user journeys with clear ownership, evidence, and communication.

Use this playbook for:

- SaaS products
- marketplaces
- content platforms
- internal tools
- e-commerce and booking systems
- APIs and automation systems

---

## Recovery objectives

Define these before launch.

| Term | Meaning | Example |
| --- | --- | --- |
| RTO | Maximum acceptable time to restore service | Core checkout restored within 2 hours |
| RPO | Maximum acceptable data loss window | No more than 15 minutes of confirmed order data lost |
| MTPD | Maximum tolerable disruption before serious business impact | Admin operations unavailable for 1 business day |

Set separate targets for each critical capability.

| Capability | Priority | RTO | RPO | Owner |
| --- | --- | --- | --- | --- |
| Login and account access | Critical |  |  |  |
| Core API | Critical |  |  |  |
| Payments or bookings | Critical |  |  |  |
| Admin dashboard | High |  |  |  |
| File downloads/uploads | High |  |  |  |
| Reporting | Medium |  |  |  |
| Marketing website | Medium |  |  |  |

---

## What to protect

Create an inventory before an incident occurs.

```text
source code and deployment configuration
production secrets
D1 data and migration history
R2 objects and file metadata
KV configuration
Queue and workflow behavior
custom domains and DNS settings
third-party provider credentials
payment and webhook records
admin access policies
runbooks and contact information
```

For each item, document:

```text
owner
location
backup/export method
restore method
last restore test
business impact if unavailable
```

---

## Incident levels

| Level | Meaning | Example |
| --- | --- | --- |
| SEV-1 | Critical customer or financial impact | Payment processing or core API unavailable |
| SEV-2 | Major feature unavailable, workaround exists | Admin dashboard or upload flow down |
| SEV-3 | Limited impact | One report, page, or integration failing |
| SEV-4 | Minor issue | Cosmetic error or low-risk degradation |

Use a named incident commander for SEV-1 and SEV-2 events.

---

## First 30 minutes

```text
1. Confirm the impact.
2. Name the incident commander.
3. Stop unsafe changes and deployments.
4. Preserve logs, request IDs, and relevant events.
5. Identify the last known good release.
6. Protect data from further corruption.
7. Notify the necessary internal team members.
8. Start the incident timeline.
```

Do not guess the root cause in public communication. State what is known, what is affected, and when the next update will be shared.

---

## Decision tree

```text
Is user data or money at risk?
  ↓ yes
Disable risky writes, payment actions, imports, or payouts.
  ↓
Is the issue caused by a recent release?
  ↓ yes
Rollback code or disable the affected feature flag.
  ↓
Is data corrupted or missing?
  ↓ yes
Stop writes, preserve evidence, assess restore point.
  ↓
Is a third-party provider failing?
  ↓ yes
Activate fallback or degrade safely.
  ↓
Verify recovery with core user journeys.
```

---

## Deployment rollback runbook

Use this when a new deployment causes customer impact.

```text
1. Confirm the incident is linked to the release.
2. Disable the feature flag if that safely contains impact.
3. Roll back to the last known good version.
4. Confirm critical routes, login, and primary user action.
5. Review logs and error rate.
6. Keep the faulty version preserved for investigation.
7. Record the release ID, time, and mitigation.
```

A code rollback does not automatically reverse database changes, sent emails, external webhooks, payments, or queued work.

---

## Data loss or corruption runbook

Use this when important records are missing, incorrect, or unexpectedly modified.

```text
1. Stop automatic writes that may continue corruption.
2. Record the affected tenant, records, timeframe, and suspected source.
3. Preserve logs, audit records, queue messages, and deployment history.
4. Identify the latest trustworthy restore or export point.
5. Test restoration in a safe environment first.
6. Restore only the required data scope when possible.
7. Reconcile records created after the recovery point.
8. Verify data integrity with business owners.
9. Re-enable writes gradually.
```

Never overwrite production data blindly during recovery.

---

## D1 recovery preparation

For every application using D1, maintain:

- versioned migrations in source control
- regular export or backup procedure appropriate to the product
- tested restoration steps
- a record of the latest successful restore exercise
- a list of tables that are financially or legally critical
- a data reconciliation procedure for records created after a restore point

Test a restore process before it is needed. Document the exact commands and access requirements in a restricted internal runbook.
Use [`../docs/data-backup-export-checklist.md`](../docs/data-backup-export-checklist.md) to turn the recovery plan into a launch checklist.

---

## R2 and file recovery preparation

For file-based products, maintain:

- a clear object-key naming standard
- D1 metadata mapping files to owners and permissions
- retention or recovery policy appropriate to the product
- a process for recovering accidental deletions
- a method to rebuild derived thumbnails, exports, or previews
- a test procedure for validating restored files

Keep original user files and generated derivatives logically separate.

---

## Secret compromise runbook

Use this when credentials, keys, access tokens, or webhook secrets may be exposed.

```text
1. Revoke or rotate the affected secret immediately.
2. Disable affected integration if rotation cannot be completed safely.
3. Review access logs and deployment history.
4. Identify systems that used the secret.
5. Update production and non-production values separately.
6. Verify integrations after rotation.
7. Record scope, mitigation, and follow-up actions.
```

Never paste secrets into incident channels, tickets, screenshots, or logs.

---

## Third-party provider outage

Examples include payment, email, SMS, analytics, identity, maps, or AI providers.

```text
Provider failure detected
  ↓
Confirm provider status and internal impact
  ↓
Disable repeated retries that create noise or duplicates
  ↓
Activate fallback or safe degradation
  ↓
Queue/retry non-critical work later
  ↓
Communicate customer impact
  ↓
Reconcile delayed events after recovery
```

Design safe degradation in advance. A non-essential recommendation feature may be disabled; a payment flow may need to pause rather than continue with uncertain status.

---

## Business continuity mode

When full recovery will take time, keep essential operations running with a reduced process.

Examples:

```text
manual order review
manual lead assignment
read-only customer portal
temporary support form
manual payment reconciliation
controlled spreadsheet export/import
limited admin actions by named staff
```

Every manual workaround needs:

```text
owner
start time
source of truth
approval rule
reconciliation plan
end condition
```

Do not create a temporary manual process without a plan to reconcile it back into the main system.

---

## Customer communication templates

### Initial notice

```text
We are investigating an issue affecting [service or feature].
Current impact: [clear customer impact].
We have taken steps to limit further impact and will share another update by [time].
```

### Progress update

```text
We have identified [what is confirmed].
[Service or feature] is currently [status].
We are continuing recovery work and will provide the next update by [time].
```

### Resolution notice

```text
The issue affecting [service or feature] has been resolved.
Impact period: [start time] to [end time].
We are monitoring the service and completing follow-up work to prevent recurrence.
```

Avoid blaming individuals or speculating about causes before the investigation is complete.

---

## Post-incident review

Complete this after SEV-1 or SEV-2 incidents and any recurring SEV-3 issue.

```text
Incident title:
Date and time:
Incident commander:
Customer impact:
Systems affected:
Detection method:
Timeline:
Root cause:
Contributing factors:
What worked:
What did not work:
Immediate mitigation:
Long-term prevention actions:
Owners and due dates:
```

Focus on system improvements, not blame.

---

## Quarterly recovery exercise

At least quarterly, test one realistic failure scenario.

Examples:

- faulty production deployment
- accidental data deletion
- broken payment webhook
- lost deployment credential
- R2 file-access issue
- unavailable email provider
- admin access policy failure

For every exercise, record:

```text
scenario
date
participants
recovery time
what failed in the runbook
what was updated
next test date
```

---

## Recovery readiness checklist

- [ ] RTO and RPO are defined for critical capabilities.
- [ ] Critical data, files, secrets, and configuration are inventoried.
- [ ] A named incident commander process exists.
- [ ] Deployment rollback steps are documented.
- [ ] D1 restoration steps are tested.
- [ ] R2 recovery approach is documented.
- [ ] Secrets can be rotated quickly.
- [ ] Payment and webhook reconciliation steps exist.
- [ ] Third-party outage fallback rules exist.
- [ ] Customer communication templates are prepared.
- [ ] Business continuity workarounds have reconciliation plans.
- [ ] Post-incident review template exists.
- [ ] Recovery exercises are scheduled and recorded.

---

## Related guides

- [`../docs/production-readiness-checklist.md`](../docs/production-readiness-checklist.md)
- [`../architectures/deployment-release.md`](../architectures/deployment-release.md)
- [`../architectures/observability-operations.md`](../architectures/observability-operations.md)
- [`../architectures/security-threat-modeling.md`](../architectures/security-threat-modeling.md)
- [`../architectures/data-pipeline-reporting.md`](../architectures/data-pipeline-reporting.md)
