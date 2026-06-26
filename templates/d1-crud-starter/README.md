# D1 CRUD Starter

A minimal Cloudflare Workers + D1 starter for basic database-backed APIs.

---

## What this template does

This starter gives you a small D1 API pattern with:

- D1 database binding
- example SQL schema
- list records
- create record
- read single record
- update record
- local testing commands
- deployment notes

---

## Best for

Use this template for:

- CMS data
- news articles
- admin dashboards
- job listings
- directory apps
- settings tables
- small SaaS apps
- prototype APIs

For production, add validation, authentication, audit logs, and a backup/export plan.

---

## Cloudflare services used

| Service | Purpose |
| --- | --- |
| Workers | Runs the API |
| D1 | Stores SQL data |
| Wrangler | Local dev, migrations, deployment |

Optional later:

| Service | Add when |
| --- | --- |
| R2 | Records need file uploads |
| KV | You need cache or config |
| Queues | You need background jobs |
| Access | You need admin protection |

---

## Folder structure

```text
d1-crud-starter/
├── README.md
├── wrangler.jsonc.example
├── schema/
│   └── 0001_create_items.sql
└── src/
    └── index.ts
```

---

## Required binding

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "my-app-db",
      "database_id": "PASTE_DATABASE_ID"
    }
  ]
}
```

---

## Setup

Create a D1 database:

```bash
npx wrangler d1 create my-app-db
```

Apply schema locally:

```bash
npx wrangler d1 execute my-app-db --local --file=schema/0001_create_items.sql
```

Run locally:

```bash
npx wrangler dev
```

Deploy:

```bash
npx wrangler deploy
```

---

## Common mistakes

- forgetting to apply schema before testing
- using the wrong local or remote database
- missing the `DB` binding in `wrangler.jsonc`
- trusting user input without validation
- exposing write routes publicly without auth
- changing schema manually without a migration plan

---

## Production notes

Before production:

- add authentication
- add role checks
- validate request bodies
- add pagination
- add audit logs
- add rate limiting for public routes
- add backup/export plan
- review schema changes before applying them

---

## Related resources

- [`templates/README.md`](../README.md)
- [`templates/simple-workers-api`](../simple-workers-api/README.md)
- [`playbooks/news-portal.md`](../../playbooks/news-portal.md)
- [`catalog/README.md`](../../catalog/README.md)
