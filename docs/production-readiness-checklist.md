# Production Readiness Checklist

Use this checklist before launching a Cloudflare-first application to real users.

> This is a practical release checklist, not a guarantee of security, availability, legal compliance, or provider-specific compliance.

## How to use it

1. Review every section before production launch.
2. Mark each item as **Pass**, **Fix**, **Not applicable**, or **Risk accepted**.
3. Do not launch with unknown answers for security, payment, data-loss, or access-control items.
4. Record exceptions, owners, and due dates.

---

## 1. Product scope

- [ ] The smallest launch scope is written down.
- [ ] Non-essential features are disabled, delayed, or behind feature flags.
- [ ] Core user journeys are identified.
- [ ] Known limitations are documented for support or internal staff.
- [ ] There is an owner for the launch decision.

## 2. Environments and configuration

- [ ] Development and production use separate configuration.
- [ ] Production secrets are not stored in source code.
- [ ] Required Worker bindings are present in production.
- [ ] Production domain, routes, and redirects are verified.
- [ ] Environment-specific URLs are correct.
- [ ] Debug-only behavior is disabled in production.
- [ ] Feature flags have clear owners and removal dates.

## 3. Authentication and authorization

- [ ] Authentication is verified server-side.
- [ ] Sensitive routes enforce authorization server-side.
- [ ] Admin and staff tools have separate access controls.
- [ ] Role changes and sensitive actions are audit-logged.
- [ ] Session expiry, logout, and revocation behavior are tested.
- [ ] Password reset and email verification flows are rate-limited.
- [ ] Users cannot access another user's or tenant's records by changing an ID.

## 4. Data and tenant isolation

- [ ] Every tenant-owned query includes the authorized tenant boundary.
- [ ] Database migrations are versioned and reviewed.
- [ ] Risky migrations have a rollback or recovery plan.
- [ ] Data validation happens on the server.
- [ ] Important records have created/updated timestamps.
- [ ] Sensitive changes have an audit trail.
- [ ] Backup/export and restore steps are documented.
- [ ] Restore steps have been tested for important data.

## 5. File uploads and storage

- [ ] File size and content-type limits are enforced.
- [ ] Object keys are generated server-side.
- [ ] Private files require a permission check before download.
- [ ] Upload metadata is stored separately from file objects.
- [ ] Public and private buckets/object paths are clearly separated.
- [ ] Unused or failed uploads can be cleaned up safely.

## 6. APIs, forms, and abuse controls

- [ ] All API inputs are validated.
- [ ] Public forms use abuse protection where needed.
- [ ] Login, signup, upload, checkout, and reset routes have rate limits.
- [ ] API error responses do not reveal secrets or internal stack traces.
- [ ] Pagination and result-size limits are enforced.
- [ ] CORS rules are deliberate and not overly broad.
- [ ] Webhooks verify provider signatures.
- [ ] Webhook processing is idempotent.

## 7. Payments and financial actions

- [ ] Prices, discounts, taxes, and commissions are recalculated server-side.
- [ ] Browser success pages do not alone mark a payment as complete.
- [ ] Provider webhook signatures are verified.
- [ ] Duplicate payment events are safe to process.
- [ ] Orders, payments, invoices, refunds, and payouts are separate records.
- [ ] Refund and payout actions are role-protected and audit-logged.
- [ ] Financial reconciliation steps are documented.

## 8. Background jobs and integrations

- [ ] Slow work runs outside user-facing requests where appropriate.
- [ ] Queue consumers are retry-safe.
- [ ] Jobs have an idempotency key or duplicate-protection rule.
- [ ] Failed jobs are visible and diagnosable.
- [ ] Retry limits and dead-letter/escalation behavior are defined.
- [ ] External provider failures do not corrupt internal records.
- [ ] Integration credentials are stored as secrets.

## 9. Security and privacy

- [ ] Secrets, tokens, and credentials are excluded from logs.
- [ ] Private information is not sent to public analytics.
- [ ] Sensitive admin tools are protected with Access and application roles.
- [ ] Dependencies and third-party scripts are reviewed.
- [ ] Security headers and HTTPS behavior are checked.
- [ ] Account, data export, and deletion requirements are understood.
- [ ] Security incident contact and escalation path are documented.

## 10. Observability and support

- [ ] Structured logs include request or correlation IDs where useful.
- [ ] Application errors can be found after deployment.
- [ ] High-impact failures have alerts or active monitoring.
- [ ] Queue, webhook, payment, and login failures are visible.
- [ ] A basic incident runbook exists.
- [ ] Recent deployments can be connected to incidents.
- [ ] Staff know where to report and investigate issues.

## 11. Performance and resilience

- [ ] The homepage and core flow are tested on mobile.
- [ ] Large responses, uploads, and reports have safe limits.
- [ ] Expensive dashboard/report queries are identified.
- [ ] Caching does not leak user- or locale-specific content.
- [ ] Core pages work under slow-network conditions.
- [ ] Third-party service failure has a user-safe fallback.
- [ ] Critical paths have been tested with realistic data volume.

## 12. Deployment and rollback

- [ ] Preview or staging deployment was reviewed.
- [ ] Build, lint, type, and test checks pass where available.
- [ ] Core user journeys pass a post-deploy smoke test.
- [ ] Migration order is documented.
- [ ] Rollback steps are written down.
- [ ] Feature flags can disable risky functionality quickly.
- [ ] Release version, commit, and deployment time are recorded.
- [ ] Post-launch monitoring window and owner are assigned.

## Launch decision

| Area | Status | Owner | Notes / follow-up |
| --- | --- | --- | --- |
| Product scope |  |  |  |
| Access control |  |  |  |
| Data safety |  |  |  |
| Uploads |  |  |  |
| Abuse protection |  |  |  |
| Payments |  |  |  |
| Jobs and integrations |  |  |  |
| Security/privacy |  |  |  |
| Observability |  |  |  |
| Performance |  |  |  |
| Deployment/rollback |  |  |  |

## Launch rules

Do not launch until every critical item is either:

```text
Pass
or
Risk accepted by a named owner with a documented mitigation and due date
```

## Related guides

- [`cost-checklist.md`](cost-checklist.md)
- [`data-backup-export-checklist.md`](data-backup-export-checklist.md)
- [`environment-variable-checklist.md`](environment-variable-checklist.md)
- [`incident-response-checklist.md`](incident-response-checklist.md)
- [`rollback-checklist.md`](rollback-checklist.md)
- [`../architectures/deployment-release.md`](../architectures/deployment-release.md)
- [`../architectures/security-threat-modeling.md`](../architectures/security-threat-modeling.md)
- [`../architectures/observability-operations.md`](../architectures/observability-operations.md)
- [`../architectures/data-pipeline-reporting.md`](../architectures/data-pipeline-reporting.md)
- [`../architectures/authentication-authorization.md`](../architectures/authentication-authorization.md)
