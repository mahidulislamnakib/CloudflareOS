# Project Playbooks

Project playbooks turn common app ideas into practical Cloudflare-first implementation plans.

Use this folder when you know what you want to build but need help choosing the right architecture, services, folder structure, starter template, prompts, and deployment path.

---

## How playbooks work

Each playbook should guide a project from idea to deployable plan.

```text
Project idea
  ↓
MVP scope
  ↓
Cloudflare architecture
  ↓
Data and storage plan
  ↓
Folder structure
  ↓
Starter template
  ↓
AI build prompt
  ↓
Deployment checklist
```

---

## Priority playbooks

| Playbook | Status | Starting stack |
| --- | --- | --- |
| Blog / CMS | Planned | Workers or Pages + D1 + R2 |
| News portal | Planned | Workers + D1 + R2 + Turnstile |
| AI chat app | Planned | Workers + Workers AI + D1 |
| SaaS dashboard | Planned | Workers + D1 + R2 + Queues |
| Admin dashboard | Planned | Workers + D1 + Access |
| Marketplace | Planned | Workers + D1 + R2 + Queues |
| Job portal | Planned | Workers + D1 + R2 + Queues |
| Travel agency website | Planned | Pages or Workers + D1 + R2 |
| Course / LMS site | Planned | Workers + D1 + R2 + Queues |
| E-commerce starter | Planned | Workers + D1 + R2 + Queues |
| CRM | Planned | Workers + D1 + Queues |
| API service | Planned | Workers + D1/KV + Queues |
| File manager | Planned | Workers + R2 + D1 |
| Server-side tracking service | Planned | Workers + Queues + Analytics Engine |

---

## Standard playbook format

Every playbook should follow this structure:

```md
# Project Name

## Goal

What this project helps users do.

## Best for

Who should build this and when.

## MVP features

Smallest useful version.

## Beginner architecture

Simple Cloudflare-first setup.

## Production architecture

Safer, more scalable setup.

## Cloudflare services used

List each service and why it is used.

## Data model direction

Core D1 tables or data entities.

## File storage plan

R2 bucket layout and upload rules.

## Background jobs

Queue usage if needed.

## Auth and access

User login, admin protection, permissions.

## Folder structure

Recommended project structure.

## Starter template

Which template to copy.

## AI build prompt

Prompt for Codex, Cursor, Claude Code, Copilot, or ChatGPT.

## Deployment workflow

Local setup, bindings, secrets, deploy command.

## Production checklist

Security, performance, cost, rollback, observability.

## Common mistakes

What beginners and AI agents often get wrong.
```

---

## Playbook rules

- Start with the smallest useful version.
- Do not add advanced Cloudflare services unless needed.
- Explain why each service is used.
- Include both beginner and production architecture.
- Keep examples practical and copy-friendly.
- Link to related catalog pages, templates, and prompts.
- Make the guidance clear enough for AI coding agents.

---

## Related docs

- [`docs/PROJECT-ENGINE.md`](../docs/PROJECT-ENGINE.md)
- [`catalog/README.md`](../catalog/README.md)
- [`ROADMAP.md`](../ROADMAP.md)
