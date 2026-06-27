# CloudflareOS Workspace

This repository now contains a small Cloudflare Worker + Static Assets application at the repository root. It is the first graphical interface for CloudflareOS.

## What is included

- Developer-project style workspace interface at `/`
- `GET /api/health` health endpoint
- `GET /api/workspace` safe read-only seed data for the interface
- Sidebar views for architecture, tasks, database decisions, templates, verification, deployment, and debugging
- No login, saved workspaces, database binding, personal data, secrets, or AI provider dependency in this first release

## Why the first release is read-only

The goal is to validate the developer-workspace experience before introducing D1 records, authentication, permission rules, migrations, privacy obligations, or recovery workflows.

D1 should be added only after a user needs to save a workspace and return to it.

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

## Cloudflare deployment

The root `wrangler.jsonc` deploys this app. It uses a Worker entry point in `src/index.ts` and serves files from `public/` through the `ASSETS` binding.

For a Git-connected Cloudflare Worker deployment:

1. Connect this repository in Cloudflare.
2. Use the repository root as the build root.
3. Install dependencies with `npm install`.
4. Use `npx wrangler deploy` as the deploy command if the Cloudflare build configuration requires one.
5. Deploy a preview branch first, then verify `/`, `/api/health`, and `/api/workspace` before promoting it.

## Version 1 verification

A UI task is not complete until the following are checked:

- `npm run typecheck`
- `npm run dev`
- `/` loads and sidebar navigation works
- mobile layout is usable
- keyboard navigation reaches visible controls
- `/api/health` returns JSON
- `/api/workspace` returns JSON

Record results in [`WORKSPACE-STATUS.md`](WORKSPACE-STATUS.md).

## Next planned capability

A local-only project planning wizard that creates a project brief, version-one scope, task list, and Codex prompt in the browser. It should not create user accounts or persistence yet.
