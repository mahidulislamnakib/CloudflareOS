# Search & Discovery Architecture

A Cloudflare-first reference for searchable products, articles, profiles, resources, filters, autocomplete, ranking, and search analytics.

## Goal

Build search that starts predictable and useful before adding AI or advanced ranking.

Use this for:

- product catalogs
- resource libraries
- course directories
- job listings
- marketplaces
- news archives
- people or provider directories

## Starting stack

| Need | Service |
| --- | --- |
| Search API | Workers |
| Searchable records | D1 |
| Media/files | R2 |
| Small cache/config | KV |
| Indexing jobs | Queues |
| Semantic search later | Vectorize / AutoRAG |
| Search analytics | Analytics Engine |
| Internal admin | Access |

Start with structured search in D1. Add Vectorize only when semantic similarity or natural-language discovery is genuinely needed.

## Core model

```text
Content or product changes
  ↓
Search document is updated
  ↓
Search API receives query and filters
  ↓
Worker validates access and query
  ↓
Results ranked and returned
  ↓
Non-sensitive search event recorded
```

## Suggested D1 tables

```text
search_documents
search_synonyms
search_filters
saved_searches
search_clicks
index_jobs
```

A search document should include fields that are safe and useful to search:

```text
id
workspace_id
resource_type
resource_id
title
summary
keywords
status
updated_at
```

Do not index private content into a public search document.

## Search document pattern

Keep the source record and search document separate.

```text
Product or article changes
  ↓
Queue index job
  ↓
Worker creates or updates search document
```

This prevents search logic from spreading across every content module.

## Query flow

```text
User enters query
  ↓
Worker normalizes query
  ↓
Worker applies access rules
  ↓
Worker applies filters
  ↓
Worker queries search index
  ↓
Worker returns paginated results
```

Always validate filter values and pagination limits server-side.

## Filter model

Common filters:

```text
category
price range
location
language
level
availability
verified status
published date
```

Keep filters structured. Do not hide all filtering inside a free-text query.

## Ranking model

Start with transparent ranking:

```text
exact title match
  ↓
keyword match
  ↓
verified or active status
  ↓
recently updated
  ↓
manual boost where needed
```

Avoid opaque ranking rules until you have enough usage data to evaluate them.

## Autocomplete

Use autocomplete only for short, safe suggestions:

- categories
- product names
- public locations
- public tags
- course titles

Rate-limit autocomplete endpoints and use a small result limit.

## Semantic search

Use Vectorize or AutoRAG when users need to find conceptually similar content rather than exact words.

Examples:

- “beginner course for web development”
- “services for a wedding photographer”
- “articles about visa documents”

Keep semantic search separate from strict filters such as ownership, status, price, and permissions.

## Private search

For tenant or user-specific search:

```text
Authenticate user
  ↓
Resolve workspace
  ↓
Apply workspace filter
  ↓
Apply role/ownership filter
  ↓
Search only allowed records
```

Never run a broad search first and filter private results in the browser.

## Indexing jobs

Use Queues for:

- create search document
- update search document
- remove deleted content
- rebuild selected index segments
- process search analytics

Use a version or updated timestamp so stale jobs cannot overwrite newer content.

## API route plan

```text
/api/search
/api/search/suggestions
/api/search/filters
/api/search/click
/api/admin/search/reindex
/api/admin/search/synonyms
```

Keep public and private search endpoints separate where access rules differ.

## Analytics

Record non-sensitive events such as:

- search submitted
- filter applied
- result clicked
- zero results
- autocomplete selected

Do not store private query text, sensitive user data, or full document content in analytics events.

## Security rules

- Enforce access rules before querying private content.
- Validate all filters and sort parameters.
- Rate-limit public search and autocomplete endpoints.
- Never expose hidden or draft records.
- Restrict manual boosts and synonym management to admins.
- Audit bulk reindex and admin search changes.

## Production checklist

- [ ] Public and private search boundaries are separate
- [ ] Draft/private records are excluded correctly
- [ ] Pagination and result limits are enforced
- [ ] Filters are validated server-side
- [ ] Search document updates are asynchronous where useful
- [ ] Stale index jobs cannot overwrite newer records
- [ ] Search events avoid sensitive data
- [ ] Admin reindex actions are protected
- [ ] Zero-result searches are visible in analytics
- [ ] Backup and rollback plans exist

## Common mistakes

- indexing private content into public search
- filtering search results only in the frontend
- relying only on semantic search for exact filters
- allowing unbounded autocomplete queries
- mixing source data and search index responsibilities
- skipping stale-job protection
- logging sensitive searches

## Related docs

- [`architectures/api-platform.md`](./api-platform.md)
- [`architectures/ai-chatbot.md`](./ai-chatbot.md)
- [`architectures/multi-tenant-saas.md`](./multi-tenant-saas.md)
- [`catalog/d1.md`](../catalog/d1.md)
- [`catalog/kv.md`](../catalog/kv.md)
- [`catalog/queues.md`](../catalog/queues.md)
- [`catalog/vectorize.md`](../catalog/vectorize.md)
- [`catalog/autorag.md`](../catalog/autorag.md)
- [`catalog/analytics-engine.md`](../catalog/analytics-engine.md)
