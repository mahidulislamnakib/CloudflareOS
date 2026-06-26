# D1 vs KV vs R2

Use this guide to decide where application data should live in a Cloudflare-first project.

The short rule:

```text
D1 = structured records
KV = small config/cache
R2 = files and large objects
```

---

## Quick decision table

| Need | Best choice | Why |
| --- | --- | --- |
| SQL tables and relationships | D1 | Queryable relational data |
| Articles, users, jobs, orders | D1 | Structured business records |
| Categories and tags | D1 | Relationships and filtering |
| Public settings or flags | KV | Simple key-value reads |
| Homepage cache | KV | Small cached response data |
| Feature flags | KV | Fast global config reads |
| Images, PDFs, uploads | R2 | Object/file storage |
| Invoices or exports | R2 | Generated files |
| Large JSON exports | R2 | Better than database rows |
| File metadata | D1 | Searchable metadata and ownership |

---

## Use D1 when

Use D1 for data that needs structure.

Good examples:

- users
- articles
- jobs
- orders
- payments
- categories
- tags
- settings records
- audit logs
- form submissions
- media metadata

D1 is best when you need:

- SQL queries
- filtering
- sorting
- pagination
- relationships
- indexes
- migrations

---

## Use KV when

Use KV for small values that are read often and do not need SQL relationships.

Good examples:

- feature flags
- maintenance mode
- public site config
- short-lived cache
- redirect maps
- homepage cached payload
- simple lookup values

KV is best when you need:

- simple key-value access
- fast reads
- small values
- TTL-based cache
- lightweight config

---

## Use R2 when

Use R2 for files and large objects.

Good examples:

- images
- PDFs
- documents
- profile photos
- job attachments
- delivery files
- exports
- backups
- generated reports

R2 is best when you need:

- file storage
- object keys
- large content
- downloadable files
- media storage
- generated assets

---

## Common app pattern

Most real apps use all three together.

Example: news portal

```text
D1
  articles
  authors
  categories
  media metadata

R2
  article images
  author photos
  downloadable reports

KV
  homepage cache
  feature flags
  public site settings
```

Example: marketplace

```text
D1
  users
  products
  orders
  reviews

R2
  product images
  delivery files
  invoices

KV
  homepage cache
  maintenance mode
  pricing display config
```

---

## What not to do

Avoid these mistakes:

- Do not store uploaded files in D1.
- Do not use KV as your main relational database.
- Do not use R2 when you need SQL queries.
- Do not store secrets in KV or R2 metadata.
- Do not store important business records only as files.
- Do not use one storage service for every kind of data.

---

## Metadata rule

If a file needs to be managed, store the file in R2 and the metadata in D1.

```text
R2 object:
media/articles/2026/06/image.webp

D1 media row:
id
object_key
owner_id
content_type
size
alt_text
created_at
```

This lets your app search, filter, display, and delete files safely.

---

## Cache rule

If a value can be rebuilt, it can often live in KV.

Examples:

- rendered homepage JSON
- public navigation config
- computed statistics
- external API response cache

But the original source of truth should usually live in D1, R2, or another primary system.

---

## Security rule

Choose storage based on access control needs.

| Data type | Safer pattern |
| --- | --- |
| User account | D1 with auth checks |
| Private document | R2 with protected access |
| Public config | KV |
| Admin setting | D1 or protected KV write route |
| Secret/API key | Worker Secret, not D1/KV/R2 |

---

## Simple decision flow

```text
Is it a file or large object?
  yes → R2
  no ↓

Does it need SQL queries, relationships, filters, or pagination?
  yes → D1
  no ↓

Is it small config/cache/flag data?
  yes → KV
  no ↓

Re-check the data model. You may need D1 + R2 or D1 + KV.
```

---

## Related catalog pages

- [`catalog/d1.md`](../catalog/d1.md)
- [`catalog/kv.md`](../catalog/kv.md)
- [`catalog/r2.md`](../catalog/r2.md)
- [`catalog/workers.md`](../catalog/workers.md)

---

## Freshness

Last checked: 2026-06-27
Risk level: low

This decision guide is mostly architectural. Always verify current limits and pricing in official Cloudflare documentation before production launch.
