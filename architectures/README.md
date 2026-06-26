# Architecture Patterns

Architecture patterns explain how Cloudflare services fit together for real application designs.

Use this folder when you need to understand the structure of a Cloudflare-first system before writing code.

---

## What architecture patterns are for

Architecture patterns help answer:

- Which Cloudflare services should work together?
- Where should frontend, API, database, storage, and background jobs live?
- What is the beginner version?
- What is the production version?
- What are the tradeoffs?
- What can go wrong?

---

## Pattern workflow

```text
Project requirement
  ↓
Choose architecture pattern
  ↓
Map services
  ↓
Choose template
  ↓
Build MVP
  ↓
Apply production checklist
```

---

## Planned architecture patterns

| Pattern | Status | Good for |
| --- | --- | --- |
| Static site + forms | Planned | Marketing sites, landing pages |
| Full-stack app on Workers | Planned | SaaS, dashboards, portals |
| Next.js on Cloudflare | Planned | Full-stack React apps |
| Worker API + D1 | Planned | API services and CRUD apps |
| R2 file upload system | Planned | Documents, images, media uploads |
| Queue-based background jobs | Planned | Email, tracking, webhooks, processing |
| Durable Object coordination | Planned | Realtime state, rooms, counters, locks |
| Server-side tracking | Planned | Analytics and conversion pipelines |
| Secure Mini CMS | Existing / improving | Content publishing systems |
| Admin dashboard with Access | Planned | Internal tools and admin panels |
| AI app with Workers AI | Planned | Chat, summarization, classification |
| Marketplace MVP | Planned | Jobs, orders, payouts, disputes |

---

## Standard architecture format

Every architecture guide should follow this structure:

```md
# Architecture Name

## Goal

What this architecture is designed to solve.

## Best for

Which projects should use it.

## Not ideal for

When this pattern is a bad fit.

## Beginner architecture

Smallest useful version.

## Production architecture

Safer and more scalable version.

## Cloudflare services used

List each service and why it is used.

## Data flow

Show how requests, files, jobs, and events move through the system.

## Folder structure

Recommended project structure.

## Required bindings

D1, R2, KV, Queues, Durable Objects, AI, etc.

## Deployment workflow

Local setup and production deploy steps.

## Security notes

Secrets, auth, abuse protection, upload safety, admin protection.

## Cost and scaling notes

What affects cost and complexity.

## Common mistakes

What beginners and AI agents often get wrong.

## Related playbooks and templates

Links to matching resources.
```

---

## Architecture rules

- Start with the simplest working design.
- Add production complexity only when needed.
- Explain why each Cloudflare service is used.
- Mention when a service is not required.
- Include data flow where possible.
- Include failure modes and common mistakes.
- Link related catalog pages, playbooks, prompts, and templates.
- Make the guide useful for both humans and AI coding agents.

---

## Related docs

- [`docs/PROJECT-ENGINE.md`](../docs/PROJECT-ENGINE.md)
- [`playbooks/README.md`](../playbooks/README.md)
- [`templates/README.md`](../templates/README.md)
- [`prompts/README.md`](../prompts/README.md)
- [`catalog/README.md`](../catalog/README.md)
- [`ROADMAP.md`](../ROADMAP.md)
