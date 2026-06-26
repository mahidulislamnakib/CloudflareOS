# News Portal Playbook

Build a Cloudflare-first news portal with public articles, editorial publishing, media uploads, search-friendly pages, and safe admin access.

---

## Goal

A news portal should let editors publish and manage articles while readers get a fast, reliable, mobile-friendly reading experience.

This playbook starts simple and can grow into a production newsroom system.

---

## Best for

Use this playbook for:

- online newspapers
- local news portals
- magazine sites
- civic reporting sites
- organizational newsrooms
- content-heavy campaign sites

---

## MVP features

Start with the smallest useful version:

- public homepage
- article listing page
- article detail page
- categories
- tags
- author profile
- admin login
- create/edit/publish articles
- image upload
- draft and published states
- basic SEO fields
- contact/report form protected by Turnstile

Avoid comments, realtime notifications, paywalls, mobile apps, and advanced personalization in the first version.

---

## Beginner architecture

```text
Reader
  ↓
Cloudflare Pages or Workers
  ↓
Worker routes / app routes
  ↓
D1 for article data
  ↓
R2 for images and media
  ↓
Turnstile for forms
```

Good starting stack:

| Need | Cloudflare service |
| --- | --- |
| Frontend | Pages or Workers |
| API/backend | Workers |
| Database | D1 |
| Images/files | R2 |
| Forms | Turnstile |
| Admin protection | Access or app auth |

---

## Production architecture

```text
Readers
  ↓
Cloudflare cache/CDN
  ↓
Workers app
  ├── D1 articles, authors, categories
  ├── R2 media library
  ├── KV for config/cache
  ├── Queues for background tasks
  ├── Turnstile for forms
  └── Access for admin protection
```

Add production services only when needed:

| Need | Add this |
| --- | --- |
| Background jobs | Queues |
| Site settings/cache | KV |
| Admin gate | Access |
| Event analytics | Analytics Engine |
| AI summaries/tags | Workers AI |
| Webhook processing | Queues |

---

## Cloudflare services used

### Workers or Pages

Hosts the public site and routes requests.

Use Workers for a full-stack app. Use Pages when the site is mostly static with a simpler deployment flow.

### D1

Stores structured content:

- articles
- authors
- categories
- tags
- settings
- form submissions

### R2

Stores uploaded media:

- article images
- thumbnails
- author photos
- downloadable files

### Turnstile

Protects public forms from spam and bots.

### Access

Protects the admin area when you want a simple Cloudflare-managed gate before the app admin.

### Queues

Handles slow background work later:

- image processing
- newsletter jobs
- webhook processing
- analytics events
- AI summaries

---

## Data model direction

Start with these D1 tables:

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
category_id
author_id
featured_image_id
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

## R2 storage layout

Use clear folders:

```text
media/
  articles/
    yyyy/mm/
  authors/
  thumbnails/
  documents/
```

Example object key:

```text
media/articles/2026/06/article-slug-main-image.webp
```

Rules:

- never store uploaded files in D1
- store only file metadata in D1
- validate file type and size
- generate safe object keys
- keep original filename only as metadata if needed

---

## Auth and access

Beginner option:

```text
Cloudflare Access protects /admin
App has simple editor/admin roles
```

Production option:

```text
Cloudflare Access + app-level roles
```

Recommended roles:

- super admin
- admin
- editor
- author
- media manager
- form reviewer

---

## Folder structure

Example structure for a full-stack app:

```text
news-portal/
├── app/
│   ├── page.tsx
│   ├── articles/
│   ├── categories/
│   └── admin/
├── components/
├── lib/
│   ├── db/
│   ├── auth/
│   ├── storage/
│   ├── seo/
│   └── validation/
├── worker/
├── schema/
├── public/
├── docs/
└── wrangler.jsonc
```

For a Worker-only app:

```text
news-portal/
├── src/
│   ├── index.ts
│   ├── routes/
│   ├── db/
│   ├── storage/
│   ├── auth/
│   └── views/
├── schema/
├── public/
└── wrangler.jsonc
```

---

## Starter template

Recommended starting templates:

- Simple Workers API
- D1 CRUD starter
- R2 upload starter
- Turnstile protected form
- Secure admin dashboard structure

Until templates are complete, use this playbook as the planning source.

---

## AI build prompt

```text
Use CloudflareOS guidance to plan a Cloudflare-first news portal.

Build the smallest useful version first:
- public homepage
- article list
- article detail page
- categories
- admin article publishing
- D1 content database
- R2 image uploads
- Turnstile protected public form

Do not add advanced services unless needed.
Explain the architecture, folder structure, D1 tables, R2 layout, local setup, deployment steps, and production checklist.
```

---

## Deployment workflow

Basic flow:

```text
1. Create Cloudflare project
2. Create D1 database
3. Create R2 bucket
4. Configure wrangler bindings
5. Add secrets and environment variables
6. Run locally
7. Apply D1 migrations
8. Deploy
9. Test public pages and admin flow
10. Run production checklist
```

Suggested resources:

```text
D1 database: news-portal-db
R2 bucket: news-portal-media
KV namespace: news-portal-config
Queue: news-portal-jobs
```

---

## Production checklist

Before launch:

- [ ] Admin area protected
- [ ] Article slugs are unique
- [ ] Draft articles are not public
- [ ] R2 uploads validate file type and size
- [ ] Images have alt text
- [ ] Public forms use Turnstile
- [ ] SEO title and description exist
- [ ] Sitemap and robots rules exist
- [ ] D1 migrations tested
- [ ] Error pages are friendly
- [ ] Basic analytics enabled
- [ ] Rollback plan exists
- [ ] Backups/export plan exists

---

## Common mistakes

- storing images directly in the database
- exposing draft articles publicly
- skipping admin protection
- using too many services in the MVP
- forgetting image validation
- adding comments too early
- ignoring mobile reading experience
- not planning slugs and redirects
- not separating author, category, and tag data

---

## When to add advanced features

Add later only when needed:

| Feature | Add when |
| --- | --- |
| Newsletter | Publishing flow is stable |
| AI summaries | Editors need speedups |
| Search | Content volume grows |
| Comments | Moderation workflow exists |
| Paywall | Business model is clear |
| Realtime breaking news | Editorial workflow demands it |
| Multi-language | Translation workflow exists |

---

## Related resources

- [`playbooks/README.md`](README.md)
- [`templates/README.md`](../templates/README.md)
- [`architectures/README.md`](../architectures/README.md)
- [`catalog/README.md`](../catalog/README.md)
- [`prompts/README.md`](../prompts/README.md)
