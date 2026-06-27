# CloudflareOS Workspace

This repository contains a Cloudflare Worker + Static Assets application at the repository root. It is the first graphical interface for CloudflareOS.

## What is included

- Developer-project style workspace interface at `/`
- `GET /api/health` health endpoint
- `GET /api/workspace` safe read-only seed data for the interface
- `POST /api/ai/coach` guarded Workers AI Project Coach endpoint
- Sidebar views for architecture, tasks, database decisions, templates, verification, deployment, and debugging
- Cloudflare-inspired developer-preview visual theme
- No login, saved workspaces, database binding, personal data, or AI chat history storage

## Why the first release is read-only

The goal is to validate the developer-workspace experience before introducing D1 records, authentication, permission rules, migrations, privacy obligations, or recovery workflows.

D1 should be added only after a user needs to save a workspace and return to it.

## Workers AI Project Coach

The Project Coach is deliberately disabled unless the `AI_PREVIEW_ENABLED` Worker variable is set to `true`.

Before enabling it:

1. Protect the developer-preview audience with Cloudflare Access or another approved access layer.
2. Add a Cloudflare rate-limiting rule for `POST /api/ai/*`.
3. Enable the `AI_PREVIEW_ENABLED=true` Worker variable only for the protected preview environment.
4. Monitor Workers AI usage in the Cloudflare dashboard.

The endpoint accepts one JSON field only:

```json
{
  "message": "I need a private upload flow for a small team. What is the smallest safe Cloudflare-first version?"
}
```

It limits input to 600 characters, does not store prompts or responses, and returns a concise task-oriented answer. It uses `@cf/meta/llama-3.2-1b-instruct` for the developer preview.

Workers AI includes a daily free allocation of 10,000 Neurons; usage above that requires Workers Paid. Limits reset at 00:00 UTC. Pricing and model availability can change, so verify the current Cloudflare documentation before expanding the preview.

## Local development

```bash
npm install
npm run typecheck
npm run dev
```

Then open:

```text
http://127.0.0.1:8787/
```

Verify the Worker API separately:

```bash
curl http://127.0.0.1:8787/api/health
curl http://127.0.0.1:8787/api/workspace
```

The AI binding accesses the Cloudflare account even during local development. Keep `AI_PREVIEW_ENABLED` disabled until the developer-preview controls are in place.

## Cloudflare deployment

The root `wrangler.jsonc` deploys this app. It uses `src/workspace-app.ts` as the Worker entry point, serves files from `public/` through the `ASSETS` binding, and exposes a Workers AI binding named `AI`.

For a Git-connected Cloudflare Worker deployment:

1. Connect this repository in Cloudflare.
2. Use the repository root as the build root.
3. Install dependencies with `npm install`.
4. Use `npx wrangler deploy` as the deploy command if the Cloudflare build configuration requires one.
5. Deploy a preview branch first, then verify `/`, `/api/health`, and `/api/workspace` before promoting it.
6. Protect the preview before setting `AI_PREVIEW_ENABLED=true`.

## Version 1 verification

A UI task is not complete until the following are checked:

- `npm run typecheck`
- `npm run dev`
- `/` loads and sidebar navigation works
- Cloudflare-style visual theme is visible
- mobile layout is usable
- keyboard navigation reaches visible controls
- `/api/health` returns JSON
- `/api/workspace` returns JSON
- the Project Coach returns the disabled response before it is enabled
- after preview protection and explicit enablement, one valid Project Coach request returns a bounded answer

Record results in [`WORKSPACE-STATUS.md`](WORKSPACE-STATUS.md).

## Next planned capability

A local-only project planning wizard that creates a project brief, version-one scope, task list, and Codex prompt in the browser. It should not create user accounts or persistence yet.
