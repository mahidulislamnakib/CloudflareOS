# Cost Optimization Playbook

A practical playbook for estimating cost drivers, controlling spend, choosing simpler Cloudflare-first architectures, and avoiding expensive mistakes before they reach production.

> Pricing, limits, and product availability can change. Confirm current numbers and plan details in official Cloudflare documentation before making a budget decision.

## Goal

Keep infrastructure costs understandable, intentional, and proportional to real product value.

Use this playbook for:

- solo projects
- SaaS products
- marketplaces
- media and upload platforms
- API products
- AI-enabled applications
- internal tools

---

## Cost mindset

The cheapest system is not always the best system.

A good cost decision balances:

```text
monthly spend
engineering time
operational risk
user experience
ability to scale
ability to recover
```

Start simple. Add services only when a clear product or operational need exists.

---

## Main cost drivers

| Area | Typical driver | Questions to ask |
| --- | --- | --- |
| Workers | request volume, execution, bindings | Can this request be cached or reduced? |
| D1 | queries, reads/writes, storage | Are expensive reports running repeatedly? |
| R2 | stored objects, operations, retrieval patterns | Are old uploads and derivatives cleaned up? |
| KV | reads, writes, key patterns | Is KV being used for data that belongs in D1? |
| Queues | message volume and retries | Are failed jobs retrying forever? |
| Durable Objects | active coordination and state patterns | Is a Durable Object truly needed? |
| AI | model inference, tokens, requests | Can prompts, models, and context be smaller? |
| Images/media | transforms, delivery, storage | Are transformations generated repeatedly? |
| Third parties | payment, email, SMS, maps, AI | Is usage tracked by provider and feature? |

---

## Cost inventory

Create a monthly inventory before launch.

| Service | Why it exists | Owner | Meter to watch | Budget alert | Notes |
| --- | --- | --- | --- | --- | --- |
| Workers |  |  |  |  |  |
| D1 |  |  |  |  |  |
| R2 |  |  |  |  |  |
| KV |  |  |  |  |  |
| Queues |  |  |  |  |  |
| Durable Objects |  |  |  |  |  |
| AI / AI Gateway |  |  |  |  |  |
| External providers |  |  |  |  |  |

Every service should have a clear reason to exist.

---

## Architecture rules that reduce cost

### 1. Start with a modular monolith

Prefer:

```text
one frontend
one Worker API
one D1 database
one R2 bucket
one queue only when background work is needed
```

Do not split services early just because the product may grow later.

### 2. Use D1 for durable structured records

Use D1 for users, orders, permissions, metadata, and business records.

Avoid using KV as a substitute for relational business data when you need filtering, ownership checks, reporting, or durable consistency.

### 3. Put files in R2, not the database

Store file keys and metadata in D1. Store original files, exports, images, and attachments in R2.

### 4. Cache stable public content deliberately

Good candidates:

- published articles
- public catalog pages
- locale-specific menus
- static configuration
- non-sensitive search suggestions

Do not cache user-specific dashboards, sessions, private files, or permission-sensitive responses without a clear boundary.

### 5. Move slow work to queues

Use queues for work that does not need to block the user:

- email and notifications
- document exports
- image processing
- indexing
- analytics processing
- provider retries

Keep retries bounded. Unlimited retries create unnecessary cost and operational noise.

---

## D1 optimization checklist

- [ ] Queries select only the columns needed.
- [ ] Pagination exists for lists and admin tables.
- [ ] High-use filters and joins are reviewed.
- [ ] Dashboard totals are not recalculated unnecessarily.
- [ ] Expensive reports use snapshots or asynchronous generation.
- [ ] Tenant/workspace filters are included in query design.
- [ ] Large raw files are not stored in database rows.
- [ ] Old test or demo data is removed safely.

### Avoid

```text
SELECT * for large listings
unbounded admin exports
repeating the same aggregate query on every page load
loading entire tables into memory
using the database as file storage
```

---

## R2 optimization checklist

- [ ] Original files and derivatives use predictable object paths.
- [ ] Upload size limits are enforced.
- [ ] Thumbnail and preview generation is not repeated unnecessarily.
- [ ] Failed uploads can be cleaned up.
- [ ] Temporary exports have expiry or cleanup rules.
- [ ] Old unused files are identified safely before deletion.
- [ ] Public and private object access is intentionally separated.

### Retention categories

```text
permanent user content
rebuildable derivatives
temporary exports
failed uploads
logs or diagnostics
backups
```

Assign a retention rule to each category.

---

## Queue optimization checklist

- [ ] Every job has a clear business purpose.
- [ ] Job payloads are small and contain references instead of large blobs.
- [ ] Jobs are idempotent.
- [ ] Retry count is limited.
- [ ] Permanent failures are recorded for review.
- [ ] Duplicate jobs do not repeat irreversible actions.
- [ ] Consumers batch or process efficiently when appropriate.

Do not use queues as an uncontrolled event archive.

---

## Durable Object optimization checklist

Use a Durable Object only when you need coordinated shared state, ordering, locks, presence, or real-time rooms.

Before adding one, ask:

```text
Can ordinary Worker + D1 logic solve this?
Does this need a single coordination point?
Is the state short-lived or bounded?
Can inactive state be cleaned up?
```

Avoid creating a Durable Object per low-value event, page view, or ordinary CRUD record.

---

## AI cost controls

For AI features, track cost by feature and tenant.

```text
feature
model
request count
input size
output size
latency
success rate
fallback rate
```

Practical controls:

- set maximum input and output sizes
- summarize or trim long context before inference
- use smaller models for simple classification or extraction
- cache safe repeatable outputs
- rate-limit expensive endpoints
- require quotas for tenant-level AI features
- log usage without storing private prompt content unnecessarily

Do not give unbounded AI access to public users without abuse controls.

---

## Third-party provider controls

Track external cost by provider and business capability.

Examples:

```text
email per notification
SMS per verification
maps per search
payment fees per transaction
AI per assistant request
storage/transform cost per media item
```

For each provider, document:

```text
purpose
owner
pricing model
fallback behavior
monthly alert threshold
shutdown or degrade-safe rule
```

---

## Budget and alert model

Use at least three thresholds.

| Threshold | Meaning | Action |
| --- | --- | --- |
| 50% | Early signal | Review growth and forecast |
| 80% | Attention required | Investigate top drivers and assign owner |
| 100% | Budget exceeded | Limit non-essential usage and approve next action |

Do not wait for an invoice surprise before checking usage trends.

---

## Cost anomaly response

```text
Unexpected cost increase
  ↓
Confirm which service and metric changed
  ↓
Check recent deploys, traffic, retries, abuse, and provider incidents
  ↓
Contain high-cost non-essential features if needed
  ↓
Fix root cause
  ↓
Document prevention rule
```

Typical causes:

- bot traffic
- missing rate limits
- accidental retry loop
- unbounded export
- repeated media processing
- dashboard query regression
- large AI context
- leaked API key
- unexpected provider pricing tier

---

## Monthly cost review

Review monthly with the product or engineering owner.

```text
1. Compare actual spend with budget.
2. Identify top three drivers.
3. Explain major increase or decrease.
4. Remove unused resources.
5. Review retries, storage growth, and AI usage.
6. Confirm alert thresholds still fit the business.
7. Create one optimization action with an owner and due date.
```

---

## Pre-launch checklist

- [ ] Each service has a documented reason to exist.
- [ ] Public APIs and expensive actions are rate-limited.
- [ ] Large uploads, reports, and AI inputs have limits.
- [ ] Queue retries are bounded.
- [ ] Database lists and exports are paginated.
- [ ] Temporary files and exports have cleanup rules.
- [ ] Cost ownership is assigned.
- [ ] Monthly budget thresholds are defined.
- [ ] External providers have usage monitoring.
- [ ] High-cost features have a safe degrade or shutdown option.

---

## Common mistakes

- adding too many services before product-market fit
- using a Durable Object for ordinary CRUD
- storing files inside database records
- running heavy reports on every request
- letting queue retries run indefinitely
- allowing unbounded AI prompts and outputs
- exposing paid APIs without rate limits
- keeping unused uploads and generated exports forever
- treating provider cost as someone else’s responsibility

---

## Related guides

- [`../docs/production-readiness-checklist.md`](../docs/production-readiness-checklist.md)
- [`../playbooks/disaster-recovery-business-continuity.md`](./disaster-recovery-business-continuity.md)
- [`../architectures/deployment-release.md`](../architectures/deployment-release.md)
- [`../architectures/observability-operations.md`](../architectures/observability-operations.md)
- [`../architectures/data-pipeline-reporting.md`](../architectures/data-pipeline-reporting.md)
- [`../architectures/ai-chatbot.md`](../architectures/ai-chatbot.md)
