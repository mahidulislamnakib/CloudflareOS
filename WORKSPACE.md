# DeveloperB Workspace

> **From real problems to build-ready products.**

DeveloperB is an independent product. The private-alpha workspace uses Cloudflare Worker infrastructure and Static Assets because they fit the current technical needs.

## Purpose

DeveloperB begins with a real problem in natural language. It clarifies facts, assumptions, unanswered questions, and solution paths before anyone creates a software project.

```text
Real problem
→ discovery conversation
→ solution options
→ accepted project blueprint
→ build workspace
→ tasks, evidence, approvals, and delivery
```

A project is created only after a blueprint is accepted.

## Current routes

- `/` — DeveloperB workspace
- `/api/health` — safe health response
- `/api/workspace` — read-only workspace metadata
- `POST /api/ai/coach` — guarded DeveloperB Guide

## Preview controls

Keep the preview limited to approved developers. The Guide remains disabled unless `AI_PREVIEW_ENABLED=true` is set in a protected environment. Add a rate limit for `POST /api/ai/*` before enabling it.

The Guide accepts one `message` field, limited to 600 characters, and does not store conversation history.

## Future provider routes

DeveloperB chooses providers by capability and approved model profile, not by a hard-coded vendor. Planned routes include Workers AI, AI Gateway-supported providers, OpenRouter through AI Gateway, compatible APIs, and future external coding-agent adapters after verification.

## Local verification

```bash
npm install
npm run typecheck
npm run dev
curl http://127.0.0.1:8787/api/health
curl http://127.0.0.1:8787/api/workspace
```

## Data foundation

The private-alpha migrations in [`private-alpha/migrations/`](private-alpha/migrations/) are not connected to the live Worker yet. Apply them only to a dedicated preview database after a local rehearsal with synthetic fixtures.

## Deployment migration

`wrangler.jsonc` now uses the Worker name `developerb-workspace`. Before deploying this branch through the connected Cloudflare build, create or rename the corresponding Worker in the Cloudflare dashboard and reconnect the Git build if needed. Move the preview custom domain only after the new Worker passes route and access-control checks.

See [`BRAND-BOUNDARY.md`](BRAND-BOUNDARY.md) for the naming rule.
