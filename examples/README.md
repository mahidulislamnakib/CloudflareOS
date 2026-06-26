# Example Applications

Example applications are complete reference projects that show how CloudflareOS guidance works in real code.

Use this folder when you want to study an end-to-end app instead of only reading a guide, playbook, or template.

---

## What examples are for

Examples should show:

- complete app structure
- Cloudflare service bindings
- local development workflow
- deployment workflow
- database and storage setup
- basic security decisions
- production checklist links
- common mistakes and fixes

Examples are not meant to be huge production systems. They should be small, understandable, and easy to adapt.

---

## Example app workflow

```text
Read playbook
  ↓
Study example app
  ↓
Copy starter template
  ↓
Adapt to project
  ↓
Run locally
  ↓
Deploy to Cloudflare
  ↓
Use production checklist
```

---

## Planned examples

| Example | Status | Stack |
| --- | --- | --- |
| Mini CMS | Planned | Workers + D1 + R2 |
| News portal | Planned | Workers + D1 + R2 + Turnstile |
| AI chat app | Planned | Workers + Workers AI + D1 |
| File upload portal | Planned | Workers + R2 + D1 |
| Admin dashboard | Planned | Workers + D1 + Access |
| Marketplace MVP | Planned | Workers + D1 + R2 + Queues |
| Server-side tracking service | Planned | Workers + Queues + Analytics Engine |
| Webhook receiver | Planned | Workers + Queues + D1 |

---

## Standard example structure

Each example should follow this structure:

```text
example-name/
├── README.md
├── wrangler.jsonc.example
├── src/
├── schema/
├── public/
├── .env.example
└── docs/
```

Keep examples small. If an example becomes too large, split it into a playbook and a smaller template.

---

## Standard example README format

Every example README should include:

```md
# Example Name

## What this example shows

Short explanation.

## Cloudflare services used

List services and why they are used.

## Local setup

Commands and requirements.

## Cloudflare setup

Bindings, buckets, databases, queues, and secrets.

## Deploy

Deployment steps.

## Test

Basic smoke tests.

## Production notes

What must be improved before using in production.

## Related resources

Links to playbooks, templates, prompts, catalog pages, and checklists.
```

---

## Example rules

- Keep examples beginner-readable.
- Do not include real secrets.
- Prefer `.example` config files.
- Explain every Cloudflare binding.
- Add smoke tests where possible.
- Link to the matching playbook and template.
- Avoid unnecessary services.
- Make examples useful for both humans and AI coding agents.

---

## Related docs

- [`playbooks/README.md`](../playbooks/README.md)
- [`templates/README.md`](../templates/README.md)
- [`architectures/README.md`](../architectures/README.md)
- [`prompts/README.md`](../prompts/README.md)
- [`catalog/README.md`](../catalog/README.md)
- [`ROADMAP.md`](../ROADMAP.md)
