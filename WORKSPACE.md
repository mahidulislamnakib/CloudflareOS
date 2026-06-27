# DeveloperB Workspace

> **From real problems to build-ready products.**

This repository serves the DeveloperB private-alpha workspace through a Cloudflare Worker with Static Assets. DeveloperB is the product name; Cloudflare is the underlying infrastructure.

## Purpose

DeveloperB begins with a real problem in natural language. It should clarify facts, assumptions, unanswered questions, and possible solution paths before anyone creates a software project.

```text
Real problem
→ discovery conversation
→ solution options
→ accepted project blueprint
→ build workspace
→ tasks, evidence, approvals, and delivery
```

A project should be created only after a blueprint is accepted.

## Current routes

- `/` — DeveloperB workspace
- `/api/health` — safe health response
- `/api/workspace` — read-only workspace metadata
- `POST /api/ai/coach` — guarded DeveloperB Guide

## Preview controls

Keep the preview limited to approved developers. The Guide remains disabled unless `AI_PREVIEW_ENABLED=true` is set in a protected environment. Add a rate limit for `POST /api/ai/*` before enabling it.

The Guide accepts one `message` field, limited to 600 characters, and does not store conversation history.

## Future provider routes

DeveloperB will choose providers by capability and approved model profile, not by a hard-coded vendor. Planned route types include Workers AI, AI Gateway-supported providers, OpenRouter through AI Gateway, compatible APIs, and future external coding-agent adapters after verification.

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

The current Worker name and `cf.openpathfy.com` domain remain technical preview infrastructure. Treat a Worker rename as a separate deployment task after this preview is verified.
