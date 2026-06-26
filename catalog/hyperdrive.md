# Cloudflare Hyperdrive

Cloudflare Hyperdrive helps Workers connect efficiently to existing PostgreSQL or MySQL databases by improving connection handling and reducing repeated connection overhead.

Use Hyperdrive when your application already depends on an external relational database and you want Workers to access it more safely and efficiently.

---

## Simple explanation

Hyperdrive sits between a Worker and an existing database.

```text
Worker
  ↓
Hyperdrive
  ↓
Existing PostgreSQL or MySQL database
```

It helps avoid the common problem of opening too many database connections from many Worker requests.

---

## What problem it solves

Hyperdrive helps when a Worker needs to talk to a traditional database that is not D1.

It is useful for:

- existing PostgreSQL applications
- existing MySQL applications
- gradual migrations to Cloudflare
- SaaS apps with an external primary database
- apps where D1 is not the chosen database
- connection-heavy serverless database traffic

---

## When to use Hyperdrive

Use Hyperdrive when:

- you already have PostgreSQL or MySQL
- you are moving frontend/API traffic to Workers
- you want to reduce direct connection pressure on the database
- you need a Cloudflare-first edge layer without replacing the current database
- a gradual migration is safer than a database rewrite

Good examples:

- Laravel/PostgreSQL app adding Workers API endpoints
- Next.js app using an existing managed PostgreSQL database
- SaaS platform moving traffic to Cloudflare gradually
- internal dashboard using Workers with an existing MySQL database

---

## When not to use Hyperdrive

Hyperdrive is usually unnecessary when:

- D1 is enough for the project
- you do not use PostgreSQL or MySQL
- you need file storage
- you only need simple cache/config values
- you are building a brand-new small Cloudflare-first app and do not need an external database

Use:

- D1 for Cloudflare-native SQL storage
- R2 for files
- KV for lightweight config/cache
- Durable Objects for coordinated state

---

## Beginner example

A gradual migration flow:

```text
Existing PostgreSQL database
  ↓
Cloudflare Hyperdrive
  ↓
Workers API
  ↓
New frontend on Pages or Workers
```

This lets a team improve the edge/API layer without migrating all database data immediately.

---

## Production notes

For production projects:

- keep database credentials in secrets
- use least-privilege database users
- document which service owns each table
- add indexes for real query patterns
- use pagination for list endpoints
- keep long reports and heavy jobs out of request paths
- monitor slow queries
- plan database backups separately
- define a gradual migration strategy if moving toward D1

---

## Security notes

Do:

- use secure database credentials
- keep connection strings in Worker secrets
- validate all input
- use parameterized queries
- restrict database user permissions
- protect admin endpoints with Access or app auth
- log errors without leaking credentials

Do not:

- expose database URLs in client code
- trust raw user input in SQL
- use one all-powerful database user everywhere
- assume Hyperdrive replaces database backups or authorization
- place secrets in repository config files

---

## Cost awareness

Hyperdrive can reduce operational strain from repeated database connections, but the external database still has its own cost, limits, storage, and performance profile.

Watch:

- database compute usage
- query volume
- storage growth
- slow queries
- connection limits
- data transfer costs from your database provider

---

## Common mistakes

- using Hyperdrive when D1 would be simpler
- treating Hyperdrive as a database replacement
- exposing database credentials
- skipping indexes and pagination
- running slow reports in request-time APIs
- not planning backups for the external database
- using raw SQL strings with user input
- assuming connection pooling fixes poor queries

---

## Related Cloudflare services

| Service | Relationship |
| --- | --- |
| Workers | Runs application code that connects through Hyperdrive |
| Pages | Hosts frontend that can call Workers APIs |
| D1 | Cloudflare-native SQL alternative for some projects |
| Queues | Handles slow database-adjacent background jobs |
| R2 | Stores files linked to database records |
| Access | Protects internal apps and admin systems |
| Wrangler | Configures Hyperdrive bindings for Workers |

---

## Good starter use cases

- Add Workers APIs to an existing PostgreSQL app
- Move a frontend to Cloudflare while keeping the current database
- Build a gradual Cloudflare migration path
- Reduce connection pressure from serverless-style traffic

---

## Official sources

- Cloudflare Hyperdrive documentation
- Hyperdrive Workers binding documentation
- Hyperdrive setup and configuration documentation

---

## Freshness

Last checked: 2026-06-26
Risk level: medium

Hyperdrive setup, supported database behavior, limits, and pricing can change. Always verify current guidance in the official Cloudflare documentation before production use.
