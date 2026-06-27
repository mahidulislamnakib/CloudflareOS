# CloudflareOS Workspace Build Status

This file tracks the graphical interface and private-alpha workspace product. `BUILD-STATUS.md` is the repository-wide handoff.

## Product direction

- Product: CloudflareOS Private Alpha.
- Purpose: protected developer workspace for project context, AI-assisted planning, controlled agent runs, evidence, approval, repository handoff, and deployment readiness.
- Current access: private developer preview only. Do not publicly promote or expose unrestricted write actions.
- AI scope: provider-neutral routes for Workers AI, AI Gateway-supported providers, OpenRouter via AI Gateway, compatible APIs, and future external coding-agent adapters after their contracts are verified.
- Deployment: root Cloudflare Worker with Static Assets; D1/R2/identity appear only through bounded private-alpha tasks.

## Task ledger

### UI-001 — Workspace foundation
- Status: Ready for Verification
- Evidence: original Worker typecheck and isolated local API checks passed; connected-preview visual checks remain pending.
- Recovery: revert to the prior static workspace version.

### UI-002 — Cloudflare theme and guarded Project Coach
- Status: Ready for Verification
- Evidence: local compilation, dry-run deployment, disabled-route response, and document enhancement were checked before merge; connected-preview checks remain pending.
- Recovery: disable the preview variable and revert the theme/coach route.

### P-001A — Private-alpha control-plane foundation
- Status: Ready for Verification
- Goal: define the persistent product model and provider-neutral AI routing contract before private write routes.
- Scope: D1 migration preparation, schema runbook, private-alpha architecture record, and compile-safe provider route types only.
- Files: `private-alpha/README.md`, `private-alpha/migrations/0001_control_plane.sql`, `private-alpha/migrations/README.md`, `src/private-alpha/provider-types.ts`, `WORKSPACE-STATUS.md`, `BUILD-STATUS.md`.
- Dependencies: UI-001/UI-002 merged; dedicated preview D1 database still needs owner provisioning before P-001B.
- Acceptance criteria:
  - Tenant, project, repository, workspace, task, agent, approval, artifact, deployment, audit, provider route, and model profile records are defined.
  - Every secret is represented as a reference only, never a raw value.
  - Provider routing supports future Workers AI, AI Gateway, OpenRouter, compatible API, and external coding-agent adapters without hard-coding one vendor.
  - First queries, indexes, user journey, roles, lifecycle, access boundaries, and recovery are recorded.
  - The deployed Worker remains unchanged until a D1 binding is deliberately provisioned.
- Verification reference: WV-009 through WV-012.
- Risk: medium.
- Recovery: no live binding or data exists. Redesign/remove the un-applied migration before P-001B if needed; once applied, use only a forward correction migration.
- Evidence:
  - SQLite 3.46.1 successfully applied the schema to an empty database.
  - Result: 16 tables, 23 named indexes, and zero errors from `PRAGMA foreign_key_check`.
  - TypeScript 5.8.3 completed strict no-emit compilation for `src/private-alpha/provider-types.ts`.
  - Full repository dependency installation/typecheck remains pending because this environment cannot resolve GitHub or the package registry.
- Notes: Do not attach the schema to the deployed Worker in this task. P-001B will provision a dedicated preview database, apply migration locally first, and then add guarded data access.

## Verification matrix

| ID | Area | Reference | Expected result | How to verify | Status |
| --- | --- | --- | --- | --- | --- |
| WV-001 | Workspace UI | `/` | Developer-project workspace loads with sidebar, task board, console card, and verification panel | Open connected preview at desktop/mobile widths | Pending |
| WV-002 | Health API | `/api/health` | Safe JSON health response | `curl <preview>/api/health` | Complete in isolated local Worker run |
| WV-003 | Workspace API | `/api/workspace` | Safe seed project/workspace JSON | `curl <preview>/api/workspace` | Complete in isolated local Worker run |
| WV-004 | Responsive UI | `/` | Sidebar and panels remain usable on small screens and keyboard navigation works | Browser manual check | Pending |
| WV-005 | Theme asset | `/` | Cloudflare-inspired visual layer loads with workspace layout intact | Open connected preview | Pending |
| WV-006 | AI disabled guard | `POST /api/ai/coach` | Disabled response while preview variable is not true | Send one valid JSON request before enablement | Pending |
| WV-007 | AI validation | `POST /api/ai/coach` | Invalid JSON, wrong shape, and oversized message are rejected | Send focused negative requests | Pending |
| WV-008 | AI protected preview | `POST /api/ai/coach` | Short answer after approved access controls and explicit enablement | Protect preview, set variable, then send one request | Pending |
| WV-009 | Schema parse | `private-alpha/migrations/0001_control_plane.sql` | SQLite-compatible DDL parses without error | Empty SQLite/D1 rehearsal | Complete in SQLite rehearsal |
| WV-010 | Schema safety | `private-alpha/migrations/0001_control_plane.sql` | Foreign keys and indexes support named first queries | `PRAGMA foreign_key_check` and manual review | Complete in SQLite rehearsal |
| WV-011 | Provider contract | `src/private-alpha/provider-types.ts` | Provider-neutral types compile | Strict TypeScript no-emit check | Complete standalone check |
| WV-012 | Migration runbook | `private-alpha/migrations/README.md` | Preview-only setup, fixture, recovery, and first-query guidance are complete | Relative-link check and manual review | Pending |

## Decision records

### UI-DB-001 — Private-alpha persistence boundary
- User journey: approved developers return to projects, tasks, evidence, approvals, and agent session records.
- Source of truth: D1 for structured private-alpha data; R2 for artifacts; external repository host for source code; provider route settings for AI dispatch.
- Ownership: organization owns projects; memberships and project memberships control access.
- Access: server-side identity resolution and authorization are mandatory before any private D1 route is added.
- Secret rule: D1 contains a secret reference name only; provider values live in approved secret or managed-key storage.
- Lifecycle: organizations, users, memberships, projects, tasks, sessions, runs, approvals, and routes use explicit status values rather than destructive user-facing deletion.
- First queries: project list by identity, task board by project, pending approvals, agent runs by session, artifacts by run, and deployments by project.
- Indexes: defined in the migration around those first queries.
- Recovery: migrations are append-only. Rehearse on preview first; use a forward correction migration after application.
- Verification: P-001B must apply the schema in a preview database and check foreign keys before exposing any write route.

### UI-AI-001 — Provider-neutral AI routing
- User journey: a developer requests planning, code reasoning, or another capability; policy resolves an approved route and model profile.
- Source of truth: provider route and model-profile records, not a hard-coded UI model list.
- Access: only authorized owners/admins can change routes or model profiles. Developer requests select from approved profiles only.
- Provider scope: Workers AI, AI Gateway-native providers, OpenRouter through AI Gateway, compatible APIs, and future external coding agents.
- Cost and safety: route status, capability matching, usage/audit records, rate limits, and human approvals gate high-impact actions.
- Recovery: disable route status or secret reference without changing task data; retain audit records.
- Verification: add a provider adapter only in a later focused task with an official integration contract.

## Next safe task

- P-001B: provision a dedicated preview D1 database, bind it only in a preview configuration, apply `0001_control_plane.sql` locally first, load synthetic fixtures, and verify tenant isolation plus first queries. Do not add public write routes, repository credentials, or persistent AI conversation history yet.
