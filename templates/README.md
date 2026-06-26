# Starter Templates

Starter templates are reusable project foundations for Cloudflare-first applications.

Use this folder when you want a safe starting point that can be copied into a real project and adapted.

---

## What templates are for

Templates should help users avoid starting from a blank folder.

Each template should answer:

- What problem does this starter solve?
- Which Cloudflare services does it use?
- What bindings are required?
- What files should be copied?
- How do I run it locally?
- How do I deploy it?
- What common mistakes should I avoid?

---

## Copy workflow

```text
Choose playbook
  ↓
Choose matching template
  ↓
Copy template files
  ↓
Add Cloudflare bindings
  ↓
Set secrets/environment variables
  ↓
Run locally
  ↓
Deploy
  ↓
Use checklist before production
```

---

## Planned starter templates

| Template | Status | Best for |
| --- | --- | --- |
| Simple Workers API | Planned | Backend/API projects |
| Next.js on Cloudflare | Planned | Full-stack web apps |
| D1 CRUD starter | Planned | Apps needing SQL data |
| R2 upload starter | Planned | File upload systems |
| KV config/cache starter | Planned | Cache, flags, small config |
| Queue worker starter | Planned | Background jobs |
| Durable Object starter | Planned | Shared live state |
| Turnstile protected form | Planned | Spam-safe forms |
| Auth starter notes | Planned | Login and sessions |
| Secure admin dashboard | Planned | Admin-only tools |
| Server-side tracking worker | Planned | Analytics and conversion tracking |
| Webhook receiver worker | Planned | Payment/webhook integrations |

---

## Standard template structure

Each template should follow this structure:

```text
template-name/
├── README.md
├── wrangler.jsonc.example
├── src/
│   └── index.ts
├── schema/
│   └── example.sql
├── .env.example
└── notes.md
```

Not every template needs every file. Keep the template as small as possible.

---

## Standard template README format

Every template README should include:

```md
# Template Name

## What this template does

Short explanation.

## Best for

When to use this template.

## Cloudflare services used

- Workers
- D1
- R2
- KV
- Queues

## Folder structure

Show the copied files.

## Required bindings

List D1, R2, KV, Queue, Durable Object, or AI bindings.

## Required secrets

List secrets without real values.

## Local setup

Commands to run locally.

## Deploy

Commands to deploy.

## Test

Basic smoke test commands.

## Common mistakes

Known issues and fixes.
```

---

## Template rules

- Keep templates small and understandable.
- Never include real secrets.
- Prefer `.example` files for configs.
- Explain each Cloudflare binding.
- Add local and deploy commands.
- Include a smoke test when possible.
- Avoid advanced services unless the template requires them.
- Make templates easy for AI coding agents to copy correctly.

---

## Related docs

- [`docs/PROJECT-ENGINE.md`](../docs/PROJECT-ENGINE.md)
- [`playbooks/README.md`](../playbooks/README.md)
- [`catalog/README.md`](../catalog/README.md)
- [`ROADMAP.md`](../ROADMAP.md)
