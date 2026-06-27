# Performance Checklist

Use this checklist before launching or scaling a Cloudflare-first application so the important user journeys stay fast on real devices, real networks, and realistic data volumes.

> Performance work should improve user experience, not only benchmark scores. Start with the core journey, measure the bottleneck, and make the smallest safe change.

## 1. Critical journey and budget

- [ ] The top one to three user journeys are named.
- [ ] Each journey has an owner and success condition.
- [ ] Each journey has a simple performance budget or target.
- [ ] The slowest screen, route, query, upload, or provider call is identified.
- [ ] Test data includes empty, small, and realistic large states.
- [ ] Mobile and slow-network behavior is part of the launch review.
- [ ] Performance goals are tied to product outcomes, not only lab scores.

## 2. Frontend and UX readiness

- [ ] Main pages avoid unnecessary JavaScript and large client libraries.
- [ ] Loading, empty, error, and retry states are visible and lightweight.
- [ ] Primary actions remain reachable on mobile.
- [ ] Forms prevent duplicate submissions on slow connections.
- [ ] Long lists use pagination, filtering, or incremental loading.
- [ ] Non-critical widgets, analytics, chat, maps, and media do not block the primary action.
- [ ] Layout reserves space for media to avoid major shifts.
- [ ] Keyboard and assistive-technology flows remain usable when content loads asynchronously.

## 3. Worker and API response controls

- [ ] Request handlers authenticate, authorize, validate, then run focused work.
- [ ] API responses return only fields the screen needs.
- [ ] All lists and search results have hard limits.
- [ ] Expensive side effects move to queues when the user does not need to wait.
- [ ] Error responses are small, safe, and consistent.
- [ ] Timeouts and provider failures return a user-safe fallback where possible.
- [ ] The route can be tested with realistic payload size and tenant data.

## 4. D1 and query performance

- [ ] High-traffic queries select only needed columns.
- [ ] Tenant or workspace filters are applied early for multi-tenant data.
- [ ] Admin tables, reports, and exports are paginated or asynchronous.
- [ ] Expensive dashboard totals are snapshotted, cached, or computed intentionally.
- [ ] Full-table scans are avoided for critical paths.
- [ ] Query behavior is checked with realistic data volume before launch.
- [ ] Raw files and large blobs are stored outside D1.
- [ ] Slow query remediation has an owner.

## 5. R2, images, uploads, and downloads

- [ ] Upload size and content-type limits are enforced server-side.
- [ ] Lists and cards use previews or thumbnails instead of original files.
- [ ] Heavy transforms, previews, exports, and processing run asynchronously when possible.
- [ ] Temporary exports and failed uploads have cleanup rules.
- [ ] Private file access checks do not require unnecessary large downloads.
- [ ] Large downloads and export generation have limits and progress feedback.
- [ ] Original files, derivatives, and temporary outputs are logically separated.

## 6. Cache and CDN safety

- [ ] Public, stable content has an intentional cache strategy.
- [ ] Cache keys include route, locale, version, and public filter state where needed.
- [ ] Authenticated, tenant-specific, permission-sensitive, checkout, and admin responses are not shared-cached accidentally.
- [ ] Cache invalidation or refresh behavior is documented.
- [ ] Stale content behavior is acceptable for the product use case.
- [ ] Cache changes have a rollback or purge plan.

## 7. Queue, scheduled, and Durable Object performance

- [ ] Queue jobs are bounded, idempotent, and observable.
- [ ] Retry behavior cannot create a performance or cost storm.
- [ ] Consumers can be paused during incidents.
- [ ] Scheduled jobs have limits and do not compete with core user traffic unexpectedly.
- [ ] Durable Objects are used only for coordination or state that needs them.
- [ ] Durable Object state and alarms are bounded and recoverable.
- [ ] Real-time or presence features degrade safely when overloaded.

## 8. Search, reporting, and exports

- [ ] Search validates filters, sort values, and page size.
- [ ] Autocomplete returns small result sets.
- [ ] Detail pages load full records only when needed.
- [ ] Reports and exports are generated asynchronously when they can be large.
- [ ] Staff/admin exports have limits, audit logs, and progress states.
- [ ] AI or semantic search limits retrieval size before model calls.
- [ ] Expensive reports can be disabled or staff-limited during incidents.

## 9. AI and third-party latency

- [ ] AI input and output sizes are capped.
- [ ] Retrieval context is ranked and limited before model calls.
- [ ] Simple classification or extraction avoids unnecessarily large models or prompts.
- [ ] Third-party calls have timeouts and safe fallbacks.
- [ ] Non-essential provider work is asynchronous.
- [ ] Provider failure does not block unrelated core journeys.
- [ ] Slow provider behavior is visible in logs without exposing secrets or private payloads.

## 10. Observability and regression response

- [ ] Important routes log safe latency, status, and request or correlation IDs.
- [ ] Queue delay, retries, failed jobs, and provider failures are visible.
- [ ] Recent deploys can be connected to latency or error regressions.
- [ ] Performance alerts or manual review thresholds exist for critical journeys.
- [ ] A feature flag or rollback path exists for high-risk performance changes.
- [ ] Performance incidents record route, dataset size, deployment, mitigation, and prevention work.

## Performance review template

```md
# Performance Review

Journey:
Owner:
Environment:
Dataset size:
Device/network:
Date:

Target:
Observed behavior:
Slowest route/query/provider:
Largest response or asset:
Cache behavior:
Queue/background behavior:
Accessibility/mobile notes:
Risk:
Mitigation:
Follow-up owner and due date:
```

## Related guides

- [`observability-checklist.md`](observability-checklist.md)
- [`production-readiness-checklist.md`](production-readiness-checklist.md)
- [`cost-checklist.md`](cost-checklist.md)
- [`data-backup-export-checklist.md`](data-backup-export-checklist.md)
- [`incident-response-checklist.md`](incident-response-checklist.md)
- [`rollback-checklist.md`](rollback-checklist.md)
- [`../playbooks/performance-optimization.md`](../playbooks/performance-optimization.md)
- [`../playbooks/testing-strategy.md`](../playbooks/testing-strategy.md)
- [`../architectures/observability-operations.md`](../architectures/observability-operations.md)
