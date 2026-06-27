# Build Status

Read this file before every AI-assisted coding session. It is the repository-wide handoff for the DeveloperB private alpha and the Cloudflare-first handbook in this repository.

## Project snapshot

- Product: **DeveloperB**.
- Promise: **From real problems to build-ready products.**
- Product flow: natural-language problem → discovery → solution decision → accepted blueprint → project workspace → verified delivery.
- Current access: private alpha only. Do not publicly promote or expose private write actions.
- Infrastructure: Cloudflare Worker, Static Assets, Workers AI, and later D1/R2/AI Gateway as needed. Cloudflare is infrastructure, not the product brand.
- Current task: **B-001 — DeveloperB rebrand and problem discovery foundation**.

## Local runbook

```text
Install: npm install
Typecheck: npm run typecheck
Local Worker: npm run dev
Build check: npm run build
Preview routes: /, /api/health, /api/workspace, POST /api/ai/coach
Prepared migrations: private-alpha/migrations/0001_control_plane.sql and 0002_discovery.sql
```

## Product operating rules

- Start with the real-world problem, not a framework or a feature list.
- Make confirmed facts, assumptions, questions, risks, and success measures visible.
- Compare build, buy, automate, process improvement, and do-not-build options.
- Create a project only after an accepted blueprint exists.
- Keep one bounded task in progress and record verification evidence before completion.
- Private data routes require server-side organization and membership authorization.
- Provider and repository values stay outside D1, source files, logs, fixtures, and artifacts.
- High-impact actions require an approval record.

## Task ledger

### T-001 to T-006 — Handbook and production-readiness foundation
- Status: Complete
- Delivered: persistent build record plus rollback, incident, environment/secret, data recovery, and cost-readiness documentation.

### UI-001 — Developer workspace foundation
- Status: Ready for Verification
- Evidence: isolated Worker typecheck, API checks, and static asset routing checks passed before merge.
- Remaining: connected preview review at desktop/mobile widths and keyboard flow.

### UI-002 — Guarded AI Guide
- Status: Ready for Verification
- Evidence: local typecheck, dry-run deployment, disabled-route response, and document enhancement checks passed before merge.
- Remaining: connected-preview disabled/validation checks and one protected enabled request.

### B-001 — DeveloperB rebrand and problem discovery foundation
- Status: Ready for Verification
- Goal: make DeveloperB independent from infrastructure branding and make natural-language problem discovery the first product journey.
- Scope: user-facing rebrand, discovery-first workspace, problem-oriented AI guide, discovery control-plane migration, provider capability additions, and handoff documentation.
- Files: `public/index.html`, `public/app.js`, `public/ai-coach.js`, `src/workspace-app.ts`, `src/project-coach.ts`, `src/private-alpha/provider-types.ts`, `private-alpha/README.md`, `private-alpha/migrations/0002_discovery.sql`, `private-alpha/migrations/README.md`, `WORKSPACE.md`, `WORKSPACE-STATUS.md`, `BUILD-STATUS.md`.
- Acceptance criteria:
  - DeveloperB is the customer-facing brand in the workspace and private-alpha documentation.
  - The first user journey is problem discovery, with facts, assumptions, questions, solution options, recommendations, and what not to build.
  - The schema can persist discovery intakes, findings, solution options, blueprints, blueprint versions, and a project source blueprint.
  - AI provider capabilities include discovery, solution recommendation, and learning explanation.
  - No D1 binding, user write route, provider value, repository credential, or public rollout is added.
- Verification references: V-009 through V-015.
- Risk: medium.
- Recovery: revert the focused UI/documentation/code changes; the new migration remains un-applied until B-002.
- Evidence: pending repository-level typecheck, migration rehearsal, link review, and connected-preview inspection.

## Verification matrix

| ID | Area | Expected result | How to verify | Status |
| --- | --- | --- | --- | --- |
| V-001 | Handbook status | Root build record accurately reflects current work | Review file | Complete |
| V-002 | Production checklists | Existing handbook docs remain linked | Relative-link review when touched | Complete |
| V-003 | Workspace UI | DeveloperB private preview loads at `/` | Browser review | Pending |
| V-004 | Workspace APIs | Health and workspace APIs return safe JSON | Curl preview routes | Complete in isolated local Worker run |
| V-005 | Responsive and keyboard | Sidebar, views, actions, and discovery input are usable | Manual desktop/mobile review | Pending |
| V-006 | AI Guide guard | Guide stays disabled before enablement | Send a valid request while disabled | Pending |
| V-007 | AI Guide response | Protected preview returns a bounded discovery answer after enablement | Apply access/rate limit then make one request | Pending |
| V-008 | Provider safety | No provider value appears in source or schema | Review changed files | Pending |
| V-009 | Control-plane schema | `0001` applies in a local SQLite-compatible rehearsal | Empty database rehearsal | Complete in prior SQLite rehearsal |
| V-010 | Discovery schema | `0002` applies after `0001` and foreign keys pass | Empty database rehearsal | Pending |
| V-011 | Provider contract | Discovery capabilities compile in strict TypeScript | `npm run typecheck` | Pending |
| V-012 | Migration runbook | Both migrations, fixtures, first queries, and recovery are documented | Manual review and link check | Pending |
| V-013 | Brand boundary | Customer-facing workspace uses DeveloperB; Cloudflare remains infrastructure wording only | Search UI/documentation and inspect preview | Pending |
| V-014 | Problem-first rule | No workflow implies a project is created before blueprint acceptance | Review UI, schema, and docs | Pending |
| V-015 | No persistence change | Deployed Worker has no D1 binding or private write route | Review `wrangler.jsonc` and Worker routes | Pending |

## Database decision records

### DB-001 — Problem discovery before project creation
- User journey: a person describes a real problem in natural language; DeveloperB clarifies it, offers solution options, and produces an accepted blueprint before creating a project.
- Source of truth: D1 for discovery, solution, blueprint, project, task, approval, and audit records; R2 for larger artifacts.
- Ownership: an organization owns each discovery intake, blueprint, and project.
- Roles: owner, admin, developer, reviewer, viewer. Server-side access checks are required before private records are returned.
- Lifecycle: discovery intake → solution review → blueprint ready → blueprint accepted → project conversion. A rejected or deferred solution remains traceable.
- First queries: discovery list by organization; findings by discovery; solution options by discovery; blueprint-to-project conversion; project list by identity; pending approvals.
- Indexes: defined in the two prepared migrations.
- Recovery: migrations are append-only; rehearse in preview; use forward corrections after application.

### DB-002 — Provider-neutral AI routing
- User journey: a discovery or build request is assigned a capability, selected model profile, provider route, and approval requirement.
- Capabilities: fast chat, problem discovery, solution recommendation, learning explanation, planning, code reasoning, embedding, vision, and tool use.
- Provider scope: Workers AI, AI Gateway-native, OpenRouter via Gateway, compatible APIs, future external coding agents, and custom HTTPS adapters.
- Secret rule: D1 holds route/reference metadata only. Provider values remain outside the database.

## Session handoff

```text
current task: B-001 ready for verification
implemented: DeveloperB brand, problem discovery workspace, discovery-first AI guide prompt, discovery migration, blueprint-to-project design, provider capabilities, migration and product documentation
unverified: repository typecheck, migration 0002 rehearsal, markdown link review, connected preview UI, private-preview AI guide checks
known risks: Worker technical name/domain remain unchanged intentionally; no D1 binding or server-side identity exists yet
next safe task: B-002 preview D1 binding, both migration rehearsals, synthetic fixtures, and tenant-isolation queries
```

## Next safe task

- **B-002 — Preview D1 binding and fixture rehearsal.** Provision a dedicated non-production D1 database, bind it only in preview, apply `0001_control_plane.sql` then `0002_discovery.sql` locally and in preview, seed synthetic fixtures, and verify discovery-to-blueprint-to-project queries plus organization isolation. Do not add public write routes, repository credentials, or persistent conversation history.
