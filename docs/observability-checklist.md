# Observability Checklist

Use this checklist before launching or operating a Cloudflare-first application so the team can find, explain, and recover from production failures without exposing private data.

> Observability is not only collecting logs. It is knowing which user journey, route, tenant, job, deployment, or provider failed and what safe action to take next.

## 1. Ownership and scope

- [ ] Each production application has an owner for observability and incident review.
- [ ] Critical user journeys are listed with the signals needed to verify them.
- [ ] Admin, payment, upload, webhook, queue, and login flows have explicit monitoring expectations when used.
- [ ] Support knows where to report examples, timestamps, account IDs, and request IDs.
- [ ] The team knows which dashboards, logs, or provider pages to inspect first.
- [ ] Observability work is reviewed before launch, not only after the first outage.

## 2. Request and correlation IDs

- [ ] Important HTTP requests include or generate a request/correlation ID.
- [ ] The ID is returned or surfaced safely where support can collect it.
- [ ] The same ID follows queued jobs, webhook processing, provider calls, and audit records when practical.
- [ ] Logs can be filtered by route, tenant/workspace, user-safe identifier, job ID, and deployment version.
- [ ] IDs do not expose secrets, raw tokens, or private payload content.

## 3. Structured logging

- [ ] Logs use consistent field names across Workers, queue consumers, scheduled jobs, and webhooks.
- [ ] Logs include action, status, route or job type, latency, and safe error code.
- [ ] Logs avoid passwords, API keys, authorization headers, cookies, session tokens, private files, and sensitive payloads.
- [ ] Expected validation and auth failures are distinguishable from internal errors.
- [ ] High-value business events are recorded without leaking private data.
- [ ] Log volume is intentional and does not create unnecessary cost or noise.

## 4. Error and latency visibility

- [ ] Core routes expose error rate and latency signals.
- [ ] Login, signup, upload, checkout, admin, and API flows can be checked separately when relevant.
- [ ] Slow third-party providers are visible as provider latency or timeout events.
- [ ] User-safe error messages map to internal error categories.
- [ ] Recent deploys can be connected to new errors or latency spikes.
- [ ] Known noisy errors are either fixed, grouped, or documented with an owner.

## 5. Audit records

- [ ] Sensitive actions create audit records.
- [ ] Role changes, admin setting changes, permission changes, payment state changes, exports, and private file downloads are audited when relevant.
- [ ] Audit records include actor, action, resource type, resource ID, tenant/workspace, timestamp, and safe metadata.
- [ ] Audit records are protected from casual edits or deletion.
- [ ] Audit review is part of incident response for access-control and data incidents.

## 6. Queue, scheduled job, and Durable Object observability

- [ ] Queue messages include job type, resource ID, attempt count, status, and last error when safe.
- [ ] Failed jobs are visible and actionable.
- [ ] Retry limits and dead-letter or escalation behavior are documented.
- [ ] Scheduled jobs record start, finish, status, and affected scope.
- [ ] Durable Object state transitions, alarms, and coordination failures are visible enough to debug.
- [ ] Replayed jobs and duplicate messages can be identified safely.

## 7. Webhook and integration observability

- [ ] Incoming webhook events store provider, event ID, signature-valid status, processing status, and timestamp.
- [ ] Duplicate webhook events are safe and visible.
- [ ] Outgoing provider calls record provider, operation, status, latency, and safe error category.
- [ ] Provider credentials and complete sensitive payloads are not logged.
- [ ] Provider outage behavior has a fallback, retry, or pause rule.
- [ ] Reconciliation paths exist for payments, orders, emails, exports, and other irreversible actions.

## 8. Alerts and thresholds

- [ ] Alerts exist for high-impact failures, not every noisy event.
- [ ] Error-rate, latency, queue-failure, webhook-failure, payment, login, and abuse thresholds are defined where relevant.
- [ ] Alerts include an owner, severity, affected route or job, and first runbook link.
- [ ] Alert thresholds are reviewed after launch traffic is understood.
- [ ] Alerts have a quieting or grouping strategy to reduce noise.
- [ ] There is a fallback manual review process when automated alerts are not available.

## 9. Dashboards and review

- [ ] The team has a small dashboard or checklist for launch-day health.
- [ ] Dashboard sections map to user journeys, not only infrastructure names.
- [ ] Monthly review covers top errors, slowest routes, failed jobs, provider failures, and incidents.
- [ ] Observability gaps discovered during incidents become follow-up tasks.
- [ ] Metrics and logs have retention expectations appropriate to support, privacy, and cost.

## 10. Privacy, security, and cost safety

- [ ] Logs and analytics do not collect more personal data than needed.
- [ ] Private data is not sent to public analytics or unrelated providers.
- [ ] Debug logging is disabled or restricted in production.
- [ ] Access to logs, dashboards, and audit records is limited to named roles.
- [ ] Retention and deletion expectations are documented.
- [ ] Observability volume and provider usage are reviewed as cost drivers.

## Observability inventory template

```md
# Observability Inventory

Application:
Environment:
Owner:
Last reviewed:

| Journey/surface | Signal | Where to inspect | Alert? | Owner | Runbook |
| --- | --- | --- | --- | --- | --- |
| Login | error rate + latency |  | yes |  |  |
| Uploads | R2 errors + metadata write failures |  | yes |  |  |
| Webhooks | provider event status |  | yes |  |  |
| Queue jobs | failures + retry count |  | yes |  |  |
| Admin actions | audit records |  | review |  |  |
```

## Related guides

- [`production-readiness-checklist.md`](production-readiness-checklist.md)
- [`incident-response-checklist.md`](incident-response-checklist.md)
- [`rollback-checklist.md`](rollback-checklist.md)
- [`performance-checklist.md`](performance-checklist.md)
- [`cost-checklist.md`](cost-checklist.md)
- [`../architectures/observability-operations.md`](../architectures/observability-operations.md)
- [`../playbooks/server-side-tracking.md`](../playbooks/server-side-tracking.md)
- [`../prompts/full-production-audit.md`](../prompts/full-production-audit.md)
