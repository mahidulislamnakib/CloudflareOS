# Incident Response Checklist

Use this checklist when a Cloudflare-first application has a production incident, security concern, data risk, or customer-impacting outage.

> The goal is fast, safe recovery. Do not spend the first minutes proving a perfect root cause while users, data, payments, or private information may still be at risk.

## When this is an incident

Treat the situation as an incident when any of these are true:

- users cannot complete a core journey such as login, signup, checkout, upload, publishing, or API access
- one user or tenant may see, change, or delete another user's data
- D1 records, R2 objects, KV values, queue jobs, webhooks, or scheduled tasks may be corrupt, duplicated, or missing
- a secret, token, private route, debug page, or admin action may be exposed
- error rate, latency, or retry volume is high enough to affect normal usage
- payment, refund, payout, invoice, or order state may be wrong
- support, legal, security, or leadership needs coordinated updates

## Severity levels

| Severity | Meaning | Response target |
| --- | --- | --- |
| SEV-1 | Data exposure, unsafe financial action, total outage, or active security risk | Contain immediately and assign an incident owner. |
| SEV-2 | Major customer journey broken, high error rate, or risky background processing | Contain or rollback quickly, then diagnose. |
| SEV-3 | Partial degradation, limited tenant impact, or non-critical integration failure | Diagnose, mitigate, and schedule a fix. |
| SEV-4 | Minor bug with low impact and no active risk | Track as normal maintenance. |

When severity is uncertain, start one level higher and downgrade after evidence is collected.

## 1. Assign ownership

- [ ] Name one incident owner.
- [ ] Name one technical lead for diagnosis and mitigation.
- [ ] Name one communications/support owner if users may be affected.
- [ ] Name one data owner if records, files, payments, or queues may be affected.
- [ ] Create one shared incident note or ticket.
- [ ] Record start time, environment, affected routes, and initial severity.

Small teams can combine roles, but the responsibilities should still be explicit.

## 2. Stabilize first

Choose the fastest safe action that reduces harm.

- [ ] Disable the risky feature flag or kill switch.
- [ ] Roll back the release if a recent deployment is the likely trigger.
- [ ] Pause unsafe writes when D1 data integrity is uncertain.
- [ ] Pause queue consumers, scheduled tasks, or webhook processing if retries or duplicate actions are making impact worse.
- [ ] Temporarily protect admin or staff routes with Cloudflare Access if access control is uncertain.
- [ ] Rate-limit or block abusive traffic if the incident is caused by abuse or automation.
- [ ] Preserve evidence before deleting records, logs, queue messages, or objects.

## 3. Collect evidence

Collect enough evidence to choose a safe fix, not every possible fact.

- [ ] Recent deployment ID, commit, release time, and author.
- [ ] Affected Worker, Pages project, route, domain, cron trigger, queue, Durable Object, D1 database, R2 bucket, or KV namespace.
- [ ] First known bad timestamp and last known good timestamp.
- [ ] Request IDs, correlation IDs, account IDs, tenant IDs, object keys, queue job IDs, and webhook event IDs.
- [ ] Error messages, status codes, latency changes, and retry counts.
- [ ] Recent configuration, binding, secret, route, cache, CORS, or DNS changes.
- [ ] Whether the issue affects all users, selected tenants, one region, one browser, one API client, or one integration.

Do not paste secrets, full tokens, private documents, or sensitive payloads into incident notes or AI tools.

## 4. Inspect Cloudflare surfaces

Use the Cloudflare areas that match the affected system.

- [ ] Workers or Pages deployment history for recent releases.
- [ ] Worker logs, traces, or observability output for request failures.
- [ ] Wrangler configuration and environment-specific bindings.
- [ ] D1 migration history and first failing queries if data reads/writes fail.
- [ ] R2 bucket/object metadata if uploads or downloads fail.
- [ ] Queue consumer failures, retry counts, and dead-letter behavior if async work fails.
- [ ] Durable Object alarms, IDs, and coordination logic if stateful workflows fail.
- [ ] KV keys, TTLs, and cache assumptions if stale or missing values are suspected.
- [ ] Access, WAF, Turnstile, Rate Limiting, or Bot controls if abuse or access behavior changed.
- [ ] DNS, custom domains, routes, redirects, and cache behavior if traffic is not reaching the expected app.

## 5. Decide the mitigation

Pick one clear mitigation and record why it is safe.

- [ ] Roll back code to the previous known-good deployment.
- [ ] Ship a small hotfix instead of a broad rewrite.
- [ ] Disable a feature flag, route, cron trigger, webhook endpoint, or queue consumer.
- [ ] Restore previous configuration, binding, route, or secret values.
- [ ] Run a forward data repair after backup/export review.
- [ ] Add temporary rate limits or Access protection.
- [ ] Communicate a workaround if the system cannot be fully recovered immediately.

If data may be corrupted, separate application recovery from data recovery. Do not run destructive repair commands without a written recovery note.

## 6. Verify recovery

After mitigation, verify the user journey and the operational signal.

- [ ] Primary entry point loads in production.
- [ ] Authentication/session flow works if relevant.
- [ ] Core create/read/update action works with safe test data.
- [ ] Admin or staff route remains protected.
- [ ] Upload/download flow works if R2 is involved.
- [ ] Queue, webhook, scheduled, or Durable Object workflow is no longer amplifying the incident.
- [ ] D1 reads and writes work for affected records or tenants.
- [ ] Error rate, latency, retries, and alerts are returning to normal.
- [ ] Support/contact owner confirms whether new reports are still arriving.

## 7. Communicate status

Keep updates factual, short, and time-bound.

- [ ] Internal update includes severity, impact, owner, mitigation, and next update time.
- [ ] User-facing update avoids speculation and avoids exposing private technical details.
- [ ] Support team has a clear workaround or acknowledgement script.
- [ ] Leadership or customer owners are notified when business-critical flows are affected.
- [ ] Privacy/security escalation happens if private data, account access, or secrets may be involved.

## 8. Close the incident

Do not close until recovery and follow-up ownership are clear.

- [ ] Incident owner declares the customer-impacting issue stable.
- [ ] Monitoring confirms no immediate recurrence.
- [ ] Temporary mitigations have owners and expiration dates.
- [ ] Affected users, tenants, records, objects, or jobs are identified where practical.
- [ ] Follow-up tasks have owners and due dates.
- [ ] Incident note includes timeline, impact, mitigation, root cause if known, and prevention work.

## 9. Prevention review

Use the review to reduce repeat incidents, not assign blame.

- [ ] Add or improve a test for the failed journey.
- [ ] Add or improve validation, authorization, rate limits, or abuse protection.
- [ ] Add missing logs, request IDs, audit records, alerts, or dashboards.
- [ ] Update deployment, rollback, migration, or binding verification checklists.
- [ ] Improve feature flag, kill switch, or staged rollout behavior.
- [ ] Update support, privacy, or security response documentation.
- [ ] Remove stale temporary configuration after the permanent fix ships.

## Incident note template

```md
# Incident Note

Date:
Severity:
Incident owner:
Technical lead:
Communications owner:
Environment:
Affected users/tenants/routes:
Start time:
Detection time:
Mitigation time:
Recovery time:

Summary:
Customer impact:
Data/privacy/security impact:
Trigger or suspected cause:
Containment action:
Recovery verification:
Commands or dashboards checked:
Follow-up tasks:
Owner and due date:
```

## Related guides

- [`cost-checklist.md`](cost-checklist.md)
- [`data-backup-export-checklist.md`](data-backup-export-checklist.md)
- [`rollback-checklist.md`](rollback-checklist.md)
- [`production-readiness-checklist.md`](production-readiness-checklist.md)
- [`../architectures/observability-operations.md`](../architectures/observability-operations.md)
- [`../architectures/deployment-release.md`](../architectures/deployment-release.md)
- [`../debug/README.md`](../debug/README.md)
- [`../prompts/debug-error.md`](../prompts/debug-error.md)
- [`../prompts/deployment-failure-diagnosis.md`](../prompts/deployment-failure-diagnosis.md)
