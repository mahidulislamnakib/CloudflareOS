# Cost Checklist

Use this checklist before launching or scaling a Cloudflare-first application so usage, retries, storage, AI, and third-party providers do not create surprise spend.

> Do not invent exact pricing in project docs. Current prices, included usage, and plan behavior can change. Use this checklist to identify cost drivers and then confirm current numbers in official provider documentation before making budget commitments.

## 1. Budget ownership

- [ ] A monthly launch budget is written down.
- [ ] A budget owner is named.
- [ ] Each paid Cloudflare service has an owner.
- [ ] Each paid third-party provider has an owner.
- [ ] Budget thresholds are defined for early warning, investigation, and containment.
- [ ] The team knows who can approve spend increases.
- [ ] Cost review is part of launch readiness, not only finance review.

## 2. Service justification

Every service should exist because the product needs it now.

- [ ] Workers or Pages runtime choice is documented.
- [ ] D1 is used for relational source-of-truth data, not file blobs.
- [ ] R2 is used for files, media, exports, backups, or objects when needed.
- [ ] KV is limited to cache, flags, config, or low-risk metadata.
- [ ] Queues are used only for retryable async work that should not block users.
- [ ] Durable Objects are used only when coordination, ordering, presence, locks, or strongly scoped state are required.
- [ ] Workflows, Vectorize, AI, Images, or other advanced services have a launch-stage reason.
- [ ] Unused services, buckets, namespaces, queues, and indexes have a removal plan.

## 3. Traffic and request controls

- [ ] Expected monthly requests are estimated for the first launch window.
- [ ] Public APIs have rate limits or abuse controls where needed.
- [ ] Expensive endpoints require authentication, quotas, pagination, or feature flags.
- [ ] Bot-sensitive routes have protection such as Turnstile, WAF rules, or rate limiting.
- [ ] Caching is used only where it is safe and does not leak private or tenant-specific data.
- [ ] Preview, staging, and test traffic cannot accidentally generate production-scale costs.

## 4. Database and query controls

- [ ] Lists and admin tables are paginated.
- [ ] Large exports are asynchronous, limited, and auditable.
- [ ] Dashboard aggregates are cached, snapshotted, or computed intentionally.
- [ ] High-use D1 filters and joins are reviewed before launch.
- [ ] Queries do not select unnecessary columns for large lists.
- [ ] Test/demo data cleanup has an owner.
- [ ] Cost-risky reporting features have feature flags or staff-only access until proven safe.

## 5. R2, media, and export controls

- [ ] Upload size limits are enforced server-side.
- [ ] Public and private object access patterns are separated.
- [ ] Temporary exports have expiry or cleanup rules.
- [ ] Generated thumbnails, previews, transcripts, or derivatives are not regenerated unnecessarily.
- [ ] Failed uploads can be identified and cleaned safely.
- [ ] Large downloads, bulk exports, and media transformations have usage limits.
- [ ] Retention categories are documented for originals, derivatives, backups, diagnostics, and temporary files.

## 6. Queue, retry, and background job controls

- [ ] Every job type has a business purpose.
- [ ] Retry count and dead-letter or escalation behavior are defined.
- [ ] Job payloads use references instead of large blobs when possible.
- [ ] Jobs are idempotent and cannot duplicate payments, orders, payouts, or emails.
- [ ] Consumers can be paused during incidents or cost anomalies.
- [ ] Repeated provider failures do not create infinite retry cost.
- [ ] Batch or scheduled work has limits and observability.

## 7. AI and token controls

- [ ] AI usage is tracked by feature, tenant, or customer segment when relevant.
- [ ] Maximum input and output sizes are enforced.
- [ ] Prompts avoid unnecessary context and large repeated instructions.
- [ ] Retrieval results are limited and ranked before model calls.
- [ ] Simple tasks use the smallest acceptable model or non-AI logic.
- [ ] Public AI endpoints have authentication, abuse controls, and quotas.
- [ ] Private or sensitive prompt content is not logged unnecessarily.
- [ ] AI features have a disable, degrade, or staff-only mode for cost containment.

## 8. Third-party provider controls

- [ ] Provider pricing model is documented at the level needed for launch planning.
- [ ] Provider usage is tracked by product feature.
- [ ] Provider credentials are protected and rotated when exposed.
- [ ] Provider failures do not trigger expensive retry storms.
- [ ] Email, SMS, maps, payments, analytics, and external AI providers have alert thresholds.
- [ ] Non-essential provider calls can be disabled or degraded safely.
- [ ] Browser success pages do not trigger paid or financial state without server verification.

## 9. Cost observability

- [ ] The team knows where to inspect Cloudflare usage and provider usage.
- [ ] High-cost features emit safe structured events or usage counters.
- [ ] Logs include enough context to connect cost spikes to routes, features, tenants, jobs, or deploys.
- [ ] Alerts or manual review thresholds are defined for unusual request, retry, storage, or AI growth.
- [ ] Recent deployments can be connected to cost anomalies.
- [ ] Monthly review captures top drivers, unexpected growth, and one owner for follow-up.

## 10. Cost anomaly response

Prepare a containment path before there is an invoice surprise.

- [ ] Feature flags can disable expensive non-critical features.
- [ ] Public write, export, upload, AI, and webhook routes can be rate-limited or paused.
- [ ] Queue consumers can be paused without losing the source of truth.
- [ ] Temporary files, derived media, and failed uploads can be cleaned safely.
- [ ] A leaked credential or abusive client can be revoked or blocked quickly.
- [ ] Incident notes include the suspected cost driver, containment action, owner, and follow-up.

## Cost inventory template

```md
# Cost Inventory

Environment:
Budget owner:
Monthly budget:
Last reviewed:

| Area | Service/provider | Why it exists | Main driver | Alert threshold | Containment action | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| Runtime | Workers/Pages |  | requests / execution |  |  |  |
| Data | D1 |  | queries / storage |  |  |  |
| Files | R2 |  | storage / operations |  |  |  |
| AI | Workers AI / provider |  | requests / tokens |  | disable feature flag |  |
| Async | Queues |  | messages / retries |  | pause consumer |  |
```

## Related guides

- [`production-readiness-checklist.md`](production-readiness-checklist.md)
- [`environment-variable-checklist.md`](environment-variable-checklist.md)
- [`incident-response-checklist.md`](incident-response-checklist.md)
- [`rollback-checklist.md`](rollback-checklist.md)
- [`../playbooks/cost-optimization.md`](../playbooks/cost-optimization.md)
- [`../prompts/cloudflare-cost-risk-estimate.md`](../prompts/cloudflare-cost-risk-estimate.md)
- [`12-ai-token-and-decision-economy.md`](12-ai-token-and-decision-economy.md)
