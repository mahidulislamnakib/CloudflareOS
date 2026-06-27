# Mini CMS Worker Starter

A runnable Cloudflare Worker + D1 starter for a small content API with public published posts and admin-protected content management routes.

## What this template does

- serves public published posts
- supports drafts and publishing
- protects admin routes with an `ADMIN_API_TOKEN` secret
- validates request input and returns consistent JSON errors
- stores post content in D1
- includes a local development, migration, and smoke-test path

This is a foundation for a blog, news site, resource library, course content area, or simple CMS backend. It is not a complete editorial system.

## Cloudflare services used

| Service | Why it is used |
| --- | --- |
| Workers | Runs the HTTP API |
| D1 | Stores post content, status, and timestamps |

## Folder structure

```text
mini-cms-worker/
├── README.md
├── package.json
├── tsconfig.json
├── wrangler.jsonc.example
├── .dev.vars.example
├── migrations/
│   └── 0001_create_posts.sql
└── src/
    └── index.ts
```

## API routes

### Public

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Basic health response |
| `GET` | `/api/posts?limit=20` | List published posts |
| `GET` | `/api/posts/:slug` | Read one published post |

### Admin

Admin routes require this header:

```text
Authorization: Bearer YOUR_ADMIN_API_TOKEN
```

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/admin/posts?limit=50` | List drafts and published posts |
| `POST` | `/api/admin/posts` | Create a draft or published post |
| `PATCH` | `/api/admin/posts/:id` | Update title, slug, excerpt, body, or status |
| `DELETE` | `/api/admin/posts/:id` | Permanently delete a post |

## Required bindings

Rename `wrangler.jsonc.example` to `wrangler.jsonc`, then replace:

```text
REPLACE_WITH_D1_DATABASE_ID
```

The Worker expects this D1 binding:

```text
DB
```

## Required secret

Set a long, random admin token. Do not commit it.

```bash
npx wrangler secret put ADMIN_API_TOKEN
```

For local development, copy `.dev.vars.example` to `.dev.vars` and set a local value.

## Local setup

```bash
npm install
cp wrangler.jsonc.example wrangler.jsonc
cp .dev.vars.example .dev.vars
```

Create a D1 database, place its ID in `wrangler.jsonc`, then apply the migration locally:

```bash
npm run db:migrate:local
npm run dev
```

## Deploy

Before production deployment:

```bash
npm run typecheck
npm run db:migrate:remote
npx wrangler secret put ADMIN_API_TOKEN
npm run deploy
```

Use a preview environment or non-production database before applying migrations to production.

## Smoke test

With the local Worker running:

```bash
curl http://127.0.0.1:8787/health

curl -X POST http://127.0.0.1:8787/api/admin/posts \
  -H "Authorization: Bearer replace-this-for-local-dev" \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello CloudflareOS","slug":"hello-cloudflareos","excerpt":"First post","body":"This is a draft."}'

curl http://127.0.0.1:8787/api/admin/posts \
  -H "Authorization: Bearer replace-this-for-local-dev"
```

To publish the post, use the returned `id`:

```bash
curl -X PATCH http://127.0.0.1:8787/api/admin/posts/POST_ID \
  -H "Authorization: Bearer replace-this-for-local-dev" \
  -H "Content-Type: application/json" \
  -d '{"status":"published"}'

curl http://127.0.0.1:8787/api/posts/hello-cloudflareos
```

## Production upgrades

Add these only when the product needs them:

- real user authentication and role-based permissions instead of one admin token
- an admin frontend protected by identity-aware access controls
- R2 media uploads with database-held file metadata and server-side authorization
- revisions, scheduled publishing, categories, tags, authors, and editorial workflow
- a queue for notifications, search indexing, image processing, or cache refresh
- cursor pagination, analytics, audit history, backups, and content recovery rules

## Common mistakes

- treating the admin token as a user-login system
- putting secret values in `wrangler.jsonc` or source code
- exposing drafts through public endpoints
- accepting `status`, timestamps, or ownership fields without server-side validation
- deploying before applying the production migration
- adding cross-origin browser access without a specific CORS policy
- using permanent deletion for a real editorial workflow without archive or recovery rules

## Related guides

- [`../../architectures/cms.md`](../../architectures/cms.md)
- [`../../playbooks/data-modeling-d1.md`](../../playbooks/data-modeling-d1.md)
- [`../../playbooks/api-design-contracts.md`](../../playbooks/api-design-contracts.md)
- [`../../prompts/cloudflare-binding-verification.md`](../../prompts/cloudflare-binding-verification.md)
- [`../../docs/production-readiness-checklist.md`](../../docs/production-readiness-checklist.md)
