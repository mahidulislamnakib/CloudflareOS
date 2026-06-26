# CMS Architecture

A Cloudflare-first architecture for building a content management system with posts, pages, media, authors, roles, drafts, previews, publishing, and safe admin workflows.

---

## Goal

Build a CMS that is simple enough for a small team but structured enough for production content operations.

This architecture is designed for:

- blogs
- company websites
- education portals
- newsrooms
- resource libraries
- course content sites
- documentation websites
- organization websites

---

## Recommended starting stack

| Need | Service |
| --- | --- |
| Public website | Pages or Workers |
| Backend/API | Workers |
| Content database | D1 |
| Media/files | R2 |
| Cache/config | KV |
| Admin protection | Access |
| Public form protection | Turnstile |
| Background jobs | Queues |
| Analytics | Analytics Engine |

Start with Workers, D1, R2, and Access. Add KV, Turnstile, Queues, and Analytics Engine when the workflow needs them.

---

## Architecture overview

```text
Visitors
  ↓
Pages or Workers frontend
  ↓
Public content routes
  ↓
Workers API
  ├── D1 content records
  ├── R2 media files
  ├── KV public cache/config
  └── Analytics Engine events

Editors/Admins
  ↓
Cloudflare Access or app login
  ↓
CMS admin dashboard
  ↓
Workers API
```

---

## Core content model

A CMS usually starts with:

```text
posts
pages
categories
tags
media
authors
settings
```

Keep the first version simple. Avoid building too many content types before the editor flow works.

---

## Suggested D1 tables

```text
users
authors
posts
pages
categories
tags
post_tags
media
menus
settings
revisions
audit_logs
form_submissions
```

Minimum post fields:

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

Recommended content statuses:

```text
draft
review
published
archived
```

---

## Publishing flow

```text
Editor creates draft
  ↓
Content stored in D1
  ↓
Media uploaded to R2
  ↓
Editor previews page
  ↓
Editor sends to review or publishes
  ↓
Public routes show only published content
```

Drafts and previews must be protected.

---

## Media model

Store media files in R2 and searchable metadata in D1.

```text
R2:
cms/media/2026/06/image-id.webp

D1 media table:
id
object_key
owner_user_id
content_type
size
alt_text
caption
status
created_at
```

Do not store image or document bodies in D1.

---

## Route plan

Public routes:

```text
/
/posts
/posts/:slug
/pages/:slug
/categories/:slug
/tags/:slug
/search
/contact
```

Admin routes:

```text
/admin
/admin/posts
/admin/posts/new
/admin/pages
/admin/media
/admin/categories
/admin/tags
/admin/settings
/admin/forms
```

API routes:

```text
/api/posts
/api/pages
/api/media
/api/categories
/api/tags
/api/settings
/api/forms/contact
/api/admin/posts
```

---

## Role model

Start with simple roles:

```text
admin
editor
author
media_manager
viewer
```

Do not build granular permission systems too early. Add them only after the basic publishing flow is stable.

---

## Security model

Use layered security.

```text
Cloudflare Access or app login
  ↓
User identity
  ↓
Role check
  ↓
Content status check
  ↓
Audit log
```

Important rules:

- public routes show only published content
- drafts require authentication
- previews require protected tokens or login
- media uploads require role checks
- settings updates require admin role
- form endpoints use Turnstile when public

---

## Caching strategy

Good cache targets:

- published posts
- published pages
- menus
- public settings
- category lists
- homepage sections

Do not cache:

- admin routes
- drafts
- previews
- private submissions
- user-specific responses

Use KV for small public config or cached page payloads when needed.

---

## Background jobs

Use Queues for work that should not block editors or visitors.

Good queue jobs:

- rebuild homepage cache
- send publish notification
- process media metadata
- generate summaries
- update search index
- send form notification
- create sitemap update job

---

## SEO model

Minimum SEO fields:

```text
seo_title
seo_description
canonical_url
og_image_id
robots
published_at
updated_at
```

Add sitemap and robots support before launch.

---

## Analytics

Use Analytics Engine or Web Analytics for:

- post views
- page views
- search queries
- form submissions
- content category performance
- publish workflow events

Do not store sensitive form details in analytics events.

---

## Production checklist

Before launch:

- [ ] Public routes hide drafts
- [ ] Preview routes are protected
- [ ] Admin routes are protected
- [ ] Role checks exist for writes
- [ ] R2 upload rules are enforced
- [ ] Media has metadata in D1
- [ ] SEO fields exist
- [ ] Sitemap exists
- [ ] Robots rules exist
- [ ] Form endpoints use Turnstile
- [ ] Audit logs exist for admin actions
- [ ] D1 migrations are tested
- [ ] Backup/export plan exists
- [ ] Rollback plan exists

---

## Common mistakes

- exposing drafts publicly
- storing media files in D1
- building too many content types too early
- skipping role checks
- using frontend validation only
- caching previews accidentally
- missing alt text and SEO metadata
- not logging admin changes
- mixing published content and draft content in one public query

---

## Related docs

- [`architectures/news-portal.md`](./news-portal.md)
- [`docs/d1-vs-kv-vs-r2.md`](../docs/d1-vs-kv-vs-r2.md)
- [`catalog/workers.md`](../catalog/workers.md)
- [`catalog/d1.md`](../catalog/d1.md)
- [`catalog/r2.md`](../catalog/r2.md)
- [`catalog/kv.md`](../catalog/kv.md)
- [`catalog/access.md`](../catalog/access.md)
- [`catalog/turnstile.md`](../catalog/turnstile.md)
- [`catalog/queues.md`](../catalog/queues.md)
