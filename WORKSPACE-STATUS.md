# CloudflareOS Workspace Build Status

This file tracks the graphical interface work separately while the root `BUILD-STATUS.md` continues to track handbook/checklist work.

## Product direction

- Product: CloudflareOS Workspace
- Purpose: a developer-project style interface for browsing CloudflareOS knowledge and planning an implementation in small verified tasks.
- First release: public, read-only workspace shell with static project data from the Worker API. No login, database, GitHub sync, saved projects, secrets, or AI API.
- Deployment: Cloudflare Worker with Static Assets from this repository root.

## Task ledger

### UI-001 — Workspace foundation
- Status: Ready for Verification
- Goal: Add a deployable Cloudflare Worker static-assets application with a developer-project workspace interface.
- Scope: Root Worker config, static application shell, and read-only seed API only.
- Files: `package.json`, `tsconfig.json`, `wrangler.jsonc`, `src/index.ts`, `public/index.html`, `public/styles.css`, `public/app.js`, `.gitignore`, `WORKSPACE.md`, `WORKSPACE-STATUS.md`.
- Dependencies: Cloudflare Worker Git deployment is connected by the project owner.
- Acceptance criteria:
  - The Worker serves the workspace shell at `/`.
  - `GET /api/health` returns safe JSON.
  - `GET /api/workspace` returns non-sensitive seed data for the interface.
  - The UI is responsive, keyboard-usable, and visibly resembles a developer project workspace.
  - No D1 binding, auth flow, account data, secret, or production credential is required.
- Verification reference: WV-001 through WV-004.
- Risk: medium.
- Rollback or recovery: Remove root Worker files and restore this repository to documentation-only deployment configuration.
- Evidence:
  - `npx tsc --noEmit` passed against the Worker source after setting TypeScript to use the Workers type package without the duplicate `WebWorker` standard library.
  - `npx wrangler dev --config wrangler.jsonc --local --port 8791` started successfully in an isolated local copy of the Worker configuration.
  - `GET /api/health` returned HTTP 200 JSON with the expected service and timestamp fields.
  - `GET /api/workspace` returned HTTP 200 JSON with the expected read-only workspace data.
  - Static asset routing was confirmed with a local fixture asset using the same Worker configuration. The actual repository interface still needs browser verification through the connected Worker preview.
  - `WORKSPACE.md` records the local and Cloudflare verification path.
- Notes: D1 is deliberately deferred until users need saved workspaces. Content/API responses are static seed data in version 1. Do not mark this task complete until the actual interface is opened in a browser at desktop and mobile widths.

## Verification matrix

| ID | Area | Reference | Expected result | How to verify | Status |
| --- | --- | --- | --- | --- | --- |
| WV-001 | Workspace UI | `/` | Developer-project workspace loads with sidebar, task board, console card, and verification panel | `npm install`, `npm run dev`, open `/` | Pending |
| WV-002 | Health API | `/api/health` | Safe JSON health response | `curl http://127.0.0.1:8787/api/health` | Complete in isolated local Worker run |
| WV-003 | Workspace API | `/api/workspace` | Safe seed project/workspace JSON | `curl http://127.0.0.1:8787/api/workspace` | Complete in isolated local Worker run |
| WV-004 | Responsive UI | `/` | Sidebar and panels remain usable on small screens and keyboard navigation works | Browser manual check at desktop/mobile widths | Pending |

## Decision records

### UI-DB-001 — No persistence in interface foundation
- User journey: Visitor explores the interface and understands the CloudflareOS planning workflow.
- Source of truth: Static seed data returned by the Worker for the initial interface.
- Ownership: No user records in this release.
- Access: Public read-only interface.
- Why no D1 yet: Saved projects, tasks, accounts, and permissions are not yet a validated user need. Adding D1 before that would create migration, privacy, authorization, and recovery work without immediate product value.
- Upgrade trigger: Add D1 only when users can save a workspace, return to it, or collaborate.
- Verification: Confirm no database binding is present in `wrangler.jsonc` and no user/project data is written.

## Next safe task

- Complete WV-001 and WV-004 using the connected Cloudflare Worker preview. After that, add a small project-planning wizard that generates a local-only draft build plan in the browser. Do not add login or persistence yet.
