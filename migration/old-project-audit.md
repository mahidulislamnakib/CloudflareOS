# Old Project Audit

Use this before changing an existing project.

## Simple goal

Understand the current project before moving anything to Cloudflare.

## Audit checklist

```text
Project name:
Current stack:
Hosting:
Frontend:
Backend:
Database:
Storage:
Auth:
Email:
Cron/background jobs:
External APIs:
Deployment method:
Known problems:
```

## Questions to answer

1. What is currently working?
2. What is currently broken?
3. What is expensive or hard to maintain?
4. Which parts are safe to migrate first?
5. Which parts are risky?
6. What can remain outside Cloudflare for now?
7. What rollback path exists?

## Cloudflare fit map

| Current need | Possible Cloudflare fit |
| --- | --- |
| Static frontend | Pages |
| API/backend | Workers |
| SQL data | D1 or Hyperdrive |
| Files/uploads | R2 |
| Cache/settings | KV |
| Cron jobs | Scheduled Workers |
| Background jobs | Queues |
| Multi-step process | Workflows |
| Admin protection | Access |
| Spam protection | Turnstile |
| Analytics | Web Analytics / Logs |

## Output format

```text
Migration readiness:
Easy / Medium / Risky

Recommended first move:

Do not move yet:

Required Cloudflare services:

Main risks:

Rollback plan:

Next task:
```
