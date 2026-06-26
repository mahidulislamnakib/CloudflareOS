# Performance Optimization Playbook

A practical playbook for making Cloudflare-first applications feel fast on mobile and desktop without adding unnecessary complexity.

## Goal

Improve the speed of the user journeys that matter most:

- first page load
- login and dashboard access
- search and filtering
- form submission
- upload and download flows
- checkout or booking steps
- admin operations

Performance work should improve real user experience, not only benchmark scores.

---

## Start with the critical journey

Choose the most important path before optimizing.

Examples:

```text
visitor opens homepage → reads content → submits lead form
user logs in → opens dashboard → completes primary task
buyer searches → opens product → completes checkout
staff opens admin → reviews queue → approves action
```

For each path, record:

```text
entry page
main action
slowest screen
largest response
largest media item
external providers involved
success condition
```

---

## Performance principles

- Measure before changing architecture.
- Fix the largest bottleneck first.
- Keep data close to the request path.
- Avoid loading data the current screen does not need.
- Cache stable public content deliberately.
- Keep private and permission-sensitive responses out of shared caches.
- Move slow non-essential work to queues.
- Test on mobile and slower networks.

---

## Performance budget

Set a simple budget for core routes.

| Metric | Target | Owner | Current |
| --- | --- | --- | --- |
| Homepage load |  |  |  |
| Core dashboard route |  |  |  |
| API response for primary action |  |  |  |
| Search response |  |  |  |
| Largest image/media payload |  |  |  |
| JavaScript bundle for main page |  |  |  |

Use realistic targets for your audience and devices instead of copying a universal number.

---

## Frontend performance

### Reduce what the browser receives

- Load only the data needed for the current view.
- Paginate long lists.
- Avoid sending whole records when a summary is enough.
- Split heavy routes or components when practical.
- Delay non-critical widgets, analytics, chat tools, and media.
- Avoid large client-side libraries for small tasks.
- Keep loading, empty, and error states lightweight.

### Images and media

- Use correctly sized images for the rendered space.
- Generate thumbnails or previews for lists.
- Avoid loading original uploads in cards or feeds.
- Lazy-load below-the-fold media.
- Use stable width and height to reduce layout shifts.
- Keep video, animations, and large galleries off the critical render path.

### Mobile-first checks

- Test on a real phone or mobile emulation with limited network speed.
- Keep primary actions reachable without excessive scrolling.
- Avoid large modal-heavy interfaces.
- Make loading feedback visible on slow connections.
- Check that touch interactions do not trigger duplicate submissions.

---

## Worker and API performance

### Keep request paths small

A good request path usually looks like:

```text
authenticate
  ↓
authorize
  ↓
validate input
  ↓
run focused query or operation
  ↓
return minimal response
  ↓
queue non-essential follow-up work
```

Avoid doing every side effect before returning a response.

### Move slow work out of the request

Use queues for:

- notifications
- report generation
- image processing
- search indexing
- analytics events
- large imports
- retryable provider calls

Do not make users wait for work that can safely happen later.

### Response rules

- Return only required fields.
- Use pagination and hard limits.
- Avoid deeply nested payloads unless the screen needs them.
- Avoid repeating authorization or lookup work unnecessarily.
- Use consistent error formats so clients can recover quickly.

---

## D1 performance

### Query design

- Select only needed columns.
- Paginate every list that can grow.
- Filter by tenant/workspace early.
- Use clear query paths for common filters.
- Avoid repeated aggregate queries on each page load.
- Precompute or snapshot expensive dashboard metrics.
- Keep raw files and very large payloads out of database rows.

### Warning signs

```text
slow admin tables
large unpaginated lists
many repeated count queries
full-table searches
report generation in user requests
loading all child records for each parent record
```

### Better pattern

```text
dashboard request
  ↓
read precomputed summary
  ↓
load paginated detail only when user opens it
```

---

## R2 and upload performance

- Upload directly or through the simplest safe upload path for your product.
- Keep upload metadata and permissions in D1.
- Use preview versions for browsing.
- Generate heavy derivatives asynchronously.
- Avoid downloading large private files only to transform them during a normal page request.
- Expire temporary exports and failed uploads.

For large media systems, separate:

```text
original upload
preview or thumbnail
derived export
temporary processing output
```

---

## Cache strategy

### Good candidates for shared caching

- public articles
- public category pages
- public course or product summaries
- locale-specific menus
- static settings
- public search suggestions

### Do not share-cache without clear boundaries

- user dashboards
- authenticated API responses
- private files
- tenant-scoped data
- account settings
- checkout state
- admin pages

### Cache workflow

```text
Is content public and stable?
  ↓ yes
Can it be invalidated or refreshed safely?
  ↓ yes
Cache it with a clear key and expiry strategy.
```

Always include locale, route, version, and relevant public filter state in cache design where needed.

---

## Search and listing performance

For directory, catalog, job, or content search:

- limit page size
- validate sort and filter inputs
- return summaries first
- load full detail only on the detail page
- keep autocomplete result sets small
- index or precompute common search fields when needed
- separate exact filters from semantic/AI search

Do not return thousands of results to the browser and filter them client-side.

---

## Third-party dependency performance

External providers often become the slowest part of a request.

For each provider, define:

```text
timeout
retry rule
fallback behavior
user-facing message
whether work can move to a queue
```

Examples:

- Email delivery should usually be asynchronous.
- Analytics failure should not block checkout.
- A map or recommendation service should degrade safely.
- Payment status should use verified provider events, not a browser timeout guess.

---

## Performance testing

Test the important path under realistic conditions.

```text
normal network
slow mobile network
cold first visit
logged-in user
large tenant or dataset
provider failure
multiple rapid submissions
```

Test both:

```text
perceived performance
= loading feedback, interaction readiness, clear progress

technical performance
= response size, latency, query cost, errors, retries
```

---

## Performance incident response

```text
Slowdown detected
  ↓
Confirm which route, job, or provider is affected
  ↓
Check recent deploys and traffic changes
  ↓
Check errors, retries, queue delay, and database query patterns
  ↓
Disable non-essential expensive feature if needed
  ↓
Apply smallest safe fix
  ↓
Verify core journey recovery
  ↓
Document root cause and prevention action
```

---

## Pre-launch checklist

- [ ] Core user journeys are defined.
- [ ] Main pages are tested on mobile.
- [ ] Long lists and exports are limited or paginated.
- [ ] Large uploads have size limits and preview handling.
- [ ] Heavy work is moved to queues where appropriate.
- [ ] Public caching has clear boundaries.
- [ ] Private data is not shared through cache.
- [ ] API responses return only needed fields.
- [ ] Search and autocomplete have result limits.
- [ ] Third-party failures do not block non-essential flows.
- [ ] Performance budget has an owner.

---

## Common mistakes

- optimizing a benchmark while the main user journey is still slow
- loading full records for list screens
- returning unbounded API results
- doing emails, exports, or image processing inside user requests
- caching authenticated responses accidentally
- using original media files as thumbnails
- running expensive dashboard queries on every page load
- ignoring slow-network and mobile behavior
- adding more infrastructure before measuring the bottleneck

---

## Related guides

- [`../docs/production-readiness-checklist.md`](../docs/production-readiness-checklist.md)
- [`../playbooks/testing-strategy.md`](./testing-strategy.md)
- [`../playbooks/cost-optimization.md`](./cost-optimization.md)
- [`../architectures/observability-operations.md`](../architectures/observability-operations.md)
- [`../architectures/search-discovery.md`](../architectures/search-discovery.md)
- [`../architectures/data-pipeline-reporting.md`](../architectures/data-pipeline-reporting.md)
- [`../architectures/deployment-release.md`](../architectures/deployment-release.md)
