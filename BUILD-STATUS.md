# Build Status

Read this file before every AI-assisted coding session. It is the repository-wide source of truth for the CloudflareOS handbook and private-alpha workspace.

## Project snapshot

- Product: **CloudflareOS** — a Cloudflare-first engineering handbook plus a private-alpha AI coding workspace.
- Private-alpha purpose: approved developers manage project context, task plans, evidence, AI-assisted work, approvals, repository handoff, and deployment readiness.
- Public position: do not promote the workspace publicly yet. Keep developer preview access restricted.
- Runtime: root Cloudflare Worker with Static Assets, a guarded Workers AI Project Coach, and read-only workspace APIs.
- Planned control plane: D1 for structured private-alpha records; R2 for artifacts; provider values only in approved secret or managed-key storage.
- Last updated: 2026-06-28.
- Current task: **P-001A — Private-alpha control-plane foundation** (Ready for Verification).

## Local runbook

```text
Install: npm install
Typecheck: npm run typecheck
Local Worker: npm run dev
Build check: npm run build
Deploy: npm run deploy
Current routes: /, /api/health, /api/workspace, POST /api/ai/coach
Prepared migration: private-alpha/migrations/0001_control_plane.sql
```

## Product operating rules

- Keep one bounded task per session; do not start unrelated work.
- A task is not complete without recorded commands, behavior checks, and remaining-risk notes.
- All private data access must be server-authorized by organization and project membership.
- Code writes, migrations, external requests, repository writes, secret changes, and deployments require explicit approval records.
- No provider lock-in: route by capability and model profile rather than a hard-coded vendor.
- Never store raw provider values, repository credentials, or production credentials in D1, source files, fixtures, logs, prompts, or artifacts.
- Provider scope: Workers AI, Cloudflare AI Gateway supported providers, OpenRouter through AI Gateway, compatible APIs, and external coding-agent adapters after their contracts are verified.

## Task ledger

### T-001 to T-006 — Handbook and production-readiness foundation
- Status: Complete
- Delivered: persistent build record; rollback, incident, environment/secret, data recovery, and cost-readiness documentation.
- Evidence: Markdown review, relative-link checks, and whitespace checks recorded in the earlier checklist work.

### UI-001 — Developer workspace foundation
- Status: Ready for Verification
- Goal: Serve a developer-project-style workspace UI with static data and safe read-only APIs.
- Evidence: isolated typecheck, local Worker API checks, and static asset routing checks passed before merge.
- Remaining: connected Worker preview inspection at desktop/mobile widths and keyboard flow.

### UI-002 — Cloudflare theme and guarded Project Coach
- Status: Ready for Verification
- Goal: Cloudflare-style interface layer and bounded Workers AI guidance for protected developer preview.
- Evidence: local typecheck, Wrangler dry-run, disabled-route response, and document enhancement checks passed before merge.
- Remaining: connected-preview UI, disabled/validation checks, then one protected enabled request.

### P-001A — Private-alpha control-plane foundation
- Status: Ready for Verification
- Goal: Define the persistent product model and provider-neutral routing contract before private write routes exist.
- Scope: migration-ready D1 schema, migration runbook, private-alpha architecture, and TypeScript provider route types.
- Files: `private-alpha/README.md`, `private-alpha/migrations/0001_control_plane.sql`, `private-alpha/migrations/README.md`, `src/private-alpha/provider-types.ts`, `BUILD-STATUS.md`, `WORKSPACE-STATUS.md`.
- Dependencies: UI-001/UI-002 merged. Dedicated preview D1 database remains unprovisioned.
- Acceptance criteria:
  - Tenancy, membership, project, repository, workspace, task, AI route/model, agent session/run, approval, artifact, deployment, and audit records are defined.
  - Every secret is a reference name only; no raw value field exists.
  - Provider categories cover Workers AI, AI Gateway-native, OpenRouter via Gateway, compatible APIs, future external coding agents, and custom HTTPS adapters.
  - First queries, indexes, roles, lifecycle, access boundaries, and recovery path are documented.
  - The deployed Worker stays unchanged by a D1 binding in this task.
- Verification references: V-009 through V-012.
- Risk: medium.
- Recovery: no live data exists; redesign/remove the un-applied migration before P-001B. After it is applied, use forward-only corrections.
- Evidence:
  - SQLite 3.46.1 rehearsal applied `0001_control_plane.sql` to an empty database successfully.
  - Result: 16 tables, 23 named indexes, and `PRAGMA foreign_key_check` returned zero errors.
  - TypeScript 5.8.3 passed strict no-emit compilation for `src/private-alpha/provider-types.ts`.
  - Full root `npm install` and `npm run typecheck` were not run because this environment cannot resolve `github.com` to clone the branch or fetch dependencies.
- Remaining: run the repository-level typecheck after the PR branch is available in the connected preview/build environment; apply the migration only in the future dedicated preview D1 database.

## Verification matrix

| ID | Area | Expected result | How to verify | Status |
| --- | --- | --- | --- | --- |
| V-001 | Handbook status | Root build record accurately reflects current repository | Review this file | Complete |
| V-002 | Production checklists | Existing checklists remain linked and readable | Relative-link check when touching docs | Complete |
| V-003 | Workspace UI | Developer workspace works at `/` | Connected preview browser review | Pending |
| V-004 | Workspace APIs | `/api/health` and `/api/workspace` return safe JSON | Curl preview routes | Complete in isolated local Worker run |
| V-005 | Responsive and keyboard | Sidebar, views, and actions usable on mobile/keyboard | Manual desktop/mobile review | Pending |
| V-006 | Project Coach guard | AI route stays disabled before enablement | Send a valid request while disabled | Pending |
| V-007 | Project Coach protected use | Protected preview yields a bounded response after enablement | Apply access/rate limit, set variable, send one request | Pending |
| V-008 | Provider safety | No raw provider value is committed or stored in D1 design | Search changed files for unsafe fields | Pending |
| V-009 | P-001A SQL parse | Control-plane DDL applies to an empty SQLite-compatible database | SQLite rehearsal | Complete |
| V-010 | P-001A relationships | Foreign keys and indexes support first queries | `PRAGMA foreign_key_check` and manual review | Complete in SQLite rehearsal |
| V-011 | P-001A TypeScript | Provider route types compile strictly | Standalone `tsc --noEmit --strict` check | Complete |
| V-012 | P-001A documentation | Migration/runbook links resolve and safety scope is clear | Relative-link check and manual review | Pending |

## Database decision records

### DB-001 — Private-alpha control plane
- User journeys: protected developer enters a project, sees tasks/context, starts an AI session, receives a proposed action, reviews evidence, and approves or rejects high-impact work.
- Source of truth: D1 for structured records; R2 for large artifacts; external repository host for code; AI Gateway/provider route for model dispatch.
- Ownership: `organizations` own projects. `memberships` and `project_memberships` determine access.
- Roles: owner, admin, developer, reviewer, viewer. Server-side route guards must resolve roles before returning private data.
- Lifecycle: status fields retain record history; physical deletion is not an initial product path.
- First queries: projects available to identity; project task board; pending approvals; agent runs by session; artifacts by run; deployments by project.
- Indexes: migration indexes those routes.
- Server-controlled fields: record IDs, identity mapping, role decisions, timestamps, approval decisions, audit entries, artifact storage keys, deployment states.
- Relationships: agent runs connect to sessions/tasks; approvals and artifacts connect to runs; deployment records connect to projects/repos; audit events connect to organization/project actions.
- Migration strategy: apply first in a dedicated preview D1 database; migrations are append-only; use forward corrections only.
- Fixture rule: synthetic people/projects/repositories only. Never use client data, provider keys, OAuth material, or production deployment IDs.
- Recovery: disable write routes/provider routes and retain audit evidence; restore from preview rebuild or a validated backup/export plan.

### DB-002 — Provider routing boundary
- User journey: a developer requests planning or code reasoning; policy selects an approved model profile and provider route.
- Source of truth: `ai_provider_routes` and `ai_model_profiles`, not a static frontend model list.
- Secret rule: `secret_reference` is only a lookup name. Values reside outside D1.
- Safety rule: route status, capability, usage limits, and approval requirements gate higher-impact work.
- Future adapter rule: do not add a provider adapter until its current official contract is verified.

## Session handoff

```text
completed: handbook T-001 through T-006; workspace UI foundation and guarded Project Coach merged; P-001A drafted and locally rehearsed in this branch
current status: P-001A ready for verification; no active task after this handoff
P-001A evidence: SQLite schema rehearsal succeeded (16 tables, 23 indexes, zero foreign-key errors); strict TypeScript contract check succeeded
unverified: repository-level dependency install/typecheck, relative-link check, connected Worker preview UI, Project Coach protection/enabled response, D1 binding and migration application
known risks: no D1 binding or server-side identity exists yet; do not expose private write routes
next smallest safe task: P-001B — provision a dedicated preview D1 database, bind it in preview only, apply the migration locally then in preview, and load synthetic fixtures
```

## Next safe task

- **P-001B — Preview D1 binding and fixture rehearsal.** Provision a dedicated non-production D1 database, configure it only for private-alpha preview, apply `private-alpha/migrations/0001_control_plane.sql` locally first, then in preview, seed synthetic fixtures, and verify tenant isolation plus the six first queries. Do not add public write routes, GitHub repository credentials, or stored AI conversation history in that task.
