# Cloudflare Wrangler

Wrangler is Cloudflare's command-line tool for developing, configuring, testing, and deploying Cloudflare Workers and related services.

Use Wrangler when you need to run Cloudflare projects locally, manage bindings, create resources, apply D1 migrations, set secrets, and deploy safely.

---

## Simple explanation

Wrangler is the developer tool that connects your local project to Cloudflare.

It helps you run commands like:

```bash
npx wrangler dev
npx wrangler deploy
npx wrangler secret put MY_SECRET
npx wrangler d1 create my-db
```

---

## What problem it solves

Wrangler solves the problem of managing Cloudflare app development from your terminal.

It is useful for:

- local development
- Worker deployment
- D1 database creation
- D1 migrations
- R2 bucket creation
- KV namespace creation
- Queue creation
- Worker secrets
- bindings configuration
- preview/testing workflows

---

## When to use Wrangler

Use Wrangler when:

- building Workers apps
- deploying Cloudflare backend code
- configuring bindings
- setting secrets
- running local development
- applying D1 schema changes
- creating Cloudflare resources from CLI
- debugging deployment issues

Good examples:

- deploy a Worker API
- create a D1 database
- add R2 bucket binding
- set Turnstile secret
- run local Worker with bindings
- deploy server-side tracking Worker

---

## When not to use Wrangler

Wrangler is usually unnecessary when:

- you are only reading Cloudflare docs
- you are only using dashboard-managed settings
- you are not deploying Cloudflare code
- your project has no Workers/Pages Functions workflow

Even then, most CloudflareOS projects should eventually document their Wrangler commands.

---

## Beginner example

Basic Worker workflow:

```text
Create project
  ↓
Configure wrangler.jsonc
  ↓
Run locally with wrangler dev
  ↓
Set secrets if needed
  ↓
Deploy with wrangler deploy
```

Example commands:

```bash
npx wrangler dev
npx wrangler deploy
```

---

## Production notes

For production projects:

- commit example config, not real secrets
- use `wrangler.jsonc` or config files consistently
- document every binding
- separate local, preview, and production resources
- use Worker secrets for private values
- test migrations before remote execution
- avoid destructive commands without review
- keep Wrangler version predictable in CI when possible

---

## Security notes

Do:

- store secrets with `wrangler secret put`
- avoid committing real `.env` files
- review config before deploy
- protect production credentials
- document required environment variables
- use least-privilege API tokens where possible

Do not:

- paste real secrets into README files
- commit production credentials
- run production migrations blindly
- share account-scoped tokens casually
- use one unmanaged token everywhere

---

## Cost awareness

Wrangler itself is a tool, but commands can create resources that may generate cost.

Cost-related actions include:

- creating databases
- creating buckets
- creating queues
- deploying high-traffic Workers
- enabling services through bindings
- running workloads that generate reads/writes/requests

Always know what a command creates before running it in production.

---

## Common mistakes

- forgetting to add bindings to config
- using local resources but deploying without remote resources
- setting secrets locally but not in Cloudflare
- committing real secrets
- running remote D1 migrations without testing
- using outdated Wrangler versions
- not documenting setup commands
- mixing dashboard changes with undocumented CLI changes

---

## Related Cloudflare services

| Service | Relationship |
| --- | --- |
| Workers | Deployed and developed with Wrangler |
| D1 | Created and migrated with Wrangler |
| R2 | Buckets can be created and bound with Wrangler |
| KV | Namespaces can be created and bound with Wrangler |
| Queues | Queues can be created and configured with Wrangler |
| Durable Objects | Bindings and migrations are configured with Wrangler |
| Pages | Some workflows can use Wrangler or related CLI tooling |
| Secrets | Managed with Wrangler secret commands |

---

## Good starter templates

- [`templates/simple-workers-api`](../templates/simple-workers-api/README.md)
- [`templates/d1-crud-starter`](../templates/d1-crud-starter/README.md)
- [`templates/r2-upload-starter`](../templates/r2-upload-starter/README.md)
- [`templates/queue-worker-starter`](../templates/queue-worker-starter/README.md)

---

## Official sources

- Cloudflare Wrangler documentation
- Cloudflare Workers CLI documentation
- Cloudflare D1 Wrangler commands documentation

---

## Freshness

Last checked: 2026-06-27
Risk level: medium

Wrangler changes often. Always verify commands, config format, compatibility dates, and deployment behavior against the official Cloudflare documentation before production use.
