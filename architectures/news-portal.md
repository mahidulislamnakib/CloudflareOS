# News Portal Architecture

A Cloudflare-first news portal architecture for fast publishing, mobile reading, media uploads, and safe editorial operations.

---

## Goal

Build a production-aware news portal that can start small and grow without leaving the Cloudflare platform too early.

This architecture is designed for:

- local news sites
- online newspapers
- magazine-style websites
- civic reporting projects
- organizational media rooms
- content-heavy campaign websites

---

## Recommended starting stack

| Need | Service |
| --- | --- |
| Public website | Pages or Workers |
| Backend/API | Workers |
| Content database | D1 |
| Images/files | R2 |
| Public form protection | Turnstile |
| Admin protection | Access |
| Background jobs | Queues |
| Analytics events | Analytics Engine |

Start with Workers, D1, R2, and Turnstile. Add Access, Queues, and Analytics Engine only when the workflow needs them.

---

## Architecture overview

```text
Readers
  ↓
Cloudflare CDN / Pages / Workers
  ↓
Public routes
  ├── Homepage
  ├── Article pages
  ├── Category pages
  └── Search/list pages

Admin users
  ↓
Cloudflare Access
  ↓
Admin dashboard
  ↓
Workers API
  ├── D1 content records
  ├── R2 media storage
  ├── Queues for async jobs
  └── Analytics Engine for events
```

---

## Public user flow

```text
Reader opens article
  ↓
Worker fetches published article from D1
  ↓
Worker reads image metadata
  ↓
Image loads from R2 or image service
  ↓
Page renders and can be cached safely
```

Public pages should be fast, readable, and mobile-friendly.

---

## Editorial flow

```text
Editor signs in
  ↓
Access or app auth verifies identity
  ↓
Editor creates draft
  ↓
Article stored in D1
  ↓
Images uploaded to R2
  ↓
Editor previews article
  ↓
Editor publishes
  ↓
Public article becomes visible
```

Draft content must never be visible on public routes.

---

## Suggested D1 tables

Start with these tables:

```text
users
authors
articles
categories
tags
article_tags
media
settings
form_submissions
audit_logs
```

Minimum article fields:

```text
id
slug
title
excerpt
body
status
author_id
category_id
featured_media_id
seo_title
seo_description
published_at
created_at
updated_at
```

Recommended article statuses:

```text
draft
review
published
archived
```

---

## Media storage model

Store files in R2 and metadata in D1.

```text
R2:
media/articles/2026/06/article-slug-cover.webp

D1 media table:
id
object_key
owner_id
content_type
size
alt_text
caption
created_at
```

Do not store images or PDFs directly in D1.

---

## Route plan

Public routes:

```text
/
/articles
/articles/:slug
/categories/:slug
/authors/:slug
/search
/contact
```

Admin routes:

```text
/admin
/admin/articles
/admin/articles/new
/admin/media
/admin/categories
/admin/settings
/admin/forms
```

API routes:

```text
/api/articles
/api/media
/api/categories
/api/forms/contact
/api/admin/articles
```

---

## Security model

Use multiple layers.

```text
Cloudflare Access
  ↓
App authentication
  ↓
Role checks
  ↓
Action validation
  ↓
Audit logs
```

Recommended roles:

- super admin
- admin
- editor
- author
- media manager
- form reviewer

Public form endpoints should use Turnstile and rate limiting.

---

## Caching strategy

Cache public read-heavy pages carefully.

Good cache targets:

- homepage sections
- published article pages
- category pages
- public navigation config
- image assets

Do not cache:

- admin pages
- drafts
- preview pages
- private forms
- personalized responses

Use KV for small cached homepage or navigation payloads if needed.

---

## Background jobs

Use Queues when work should not block publishing or reading.

Good queue jobs:

- send newsletter notification
- process media metadata
- rebuild homepage cache
- send webhook events
- generate summaries
- push analytics events

Keep the first version simple. Add Queues only when needed.

---

## Analytics

Use Analytics Engine for custom events such as:

- article view
- category view
- search query
- form submission
- newsletter signup
- share click

Do not use analytics as the source of truth for business records.

---

## Deployment workflow

```text
1. Create Worker or Pages project
2. Create D1 database
3. Create R2 bucket
4. Add Turnstile for public forms
5. Configure bindings in wrangler config
6. Add secrets
7. Run locally
8. Apply D1 migrations
9. Deploy preview
10. Test public and admin flows
11. Deploy production
```

---

## Production checklist

Before launch:

- [ ] Draft articles are not public
- [ ] Article slugs are unique
- [ ] Admin routes are protected
- [ ] Public forms use Turnstile
- [ ] Upload file type and size are limited
- [ ] Images have alt text support
- [ ] D1 migrations are tested
- [ ] R2 bucket access is planned
- [ ] SEO title and description exist
- [ ] Sitemap and robots rules exist
- [ ] Error pages are friendly
- [ ] Analytics does not store sensitive data
- [ ] Backup/export plan exists
- [ ] Rollback plan exists

---

## Common mistakes

- adding too many services before MVP
- exposing draft content
- storing files in D1
- skipping admin protection
- using client-side validation only
- ignoring mobile reading experience
- not planning slugs and redirects
- making forms public without Turnstile
- using analytics events as business records

---

## Related docs

- [`playbooks/news-portal.md`](../playbooks/news-portal.md)
- [`docs/d1-vs-kv-vs-r2.md`](../docs/d1-vs-kv-vs-r2.md)
- [`catalog/workers.md`](../catalog/workers.md)
- [`catalog/d1.md`](../catalog/d1.md)
- [`catalog/r2.md`](../catalog/r2.md)
- [`catalog/turnstile.md`](../catalog/turnstile.md)
- [`catalog/access.md`](../catalog/access.md)
- [`catalog/queues.md`](../catalog/queues.md)
