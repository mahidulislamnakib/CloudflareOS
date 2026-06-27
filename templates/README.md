# Starter Templates

Starter templates are reusable project foundations for Cloudflare-first applications.

Use this folder when you want a safe starting point that can be copied into a real project and adapted.

---

## Available templates

| Template | Best for | Includes |
| --- | --- | --- |
| [Mini CMS Worker](./mini-cms-worker/README.md) | Blog, news, resources, or simple content backend | Workers API, D1 schema, public posts, admin-protected CRUD, local setup, deploy and smoke tests |

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
Choose architecture or playbook
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
Deploy preview
  ↓
Use checklist before production
```

---

## Planned starter templates

| Template | Best for |
| --- | --- |
| Simple Workers API | Backend/API projects |
| Next.js on Cloudflare | Full-stack web apps |
| D1 CRUD starter | Apps needing SQL data |
| R2 upload starter | File upload systems |
| KV config/cache starter | Cache, flags, small config |
| Queue worker starter | Background jobs |
| Durable Object starter | Shared live state |
| Turnstile protected form | Spam-safe forms |
| Auth starter notes | Login and sessions |
| Secure admin dashboard | Admin-only tools |
| Server-side tracking worker | Analytics and conversion tracking |
| Webhook receiver worker | Payment/webhook integrations |

---

## Standard template structure

Each template should follow this structure:

```text
template-name/
├── README.md
├── wrangler.jsonc.example
├── src/
│   └── index.ts
├── migrations/
│   └── 0001_example.sql
├── .dev.vars.example
└── notes.md
```

Not every template needs every file. Keep the template as small as possible, but include a realistic local and deployment path.

---

## Standard template README format

Every template README should include:

```md
# Template Name

## What this template does
## Best for
## Cloudflare services used
## Folder structure
## Required bindings
## Required secrets
## Local setup
## Deploy
## Test
## Production upgrades
## Common mistakes
```

---

## Template rules

- Keep templates small and understandable.
- Never include real secrets.
- Prefer `.example` files for configuration.
- Explain each Cloudflare binding.
- Add local and deploy commands.
- Include a smoke test when possible.
- Avoid advanced services unless the template requires them.
- Make templates easy for AI coding agents to copy correctly.
- Link each template to the closest architecture, playbook, and production checklist.

---

## Related docs

- [`../architectures/README.md`](../architectures/README.md)
- [`../playbooks/README.md`](../playbooks/README.md)
- [`../prompts/README.md`](../prompts/README.md)
- [`../docs/production-readiness-checklist.md`](../docs/production-readiness-checklist.md)
- [`../ROADMAP.md`](../ROADMAP.md)
