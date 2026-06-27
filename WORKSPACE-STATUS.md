# DeveloperB Workspace Build Status

This file tracks the DeveloperB private-alpha workspace. `BUILD-STATUS.md` is the repository-wide handoff.

## Product direction

- Brand: **DeveloperB**.
- Promise: **From real problems to build-ready products.**
- First user journey: natural-language problem → discovery → solution decision → accepted blueprint → project workspace.
- Access: private alpha only. No public promotion or private write routes yet.
- Infrastructure: Cloudflare Worker and Static Assets now; gated Workers AI; later D1/R2/identity/provider routes as bounded tasks.

## Task ledger

### UI-001 — Workspace foundation
- Status: Ready for Verification
- Evidence: original Worker typecheck and isolated local API checks passed; connected-preview visual checks remain pending.

### UI-002 — Guarded AI Guide
- Status: Ready for Verification
- Evidence: local compilation, dry-run deployment, disabled-route response, and document enhancement were checked before merge; connected-preview checks remain pending.

### B-001 — DeveloperB rebrand and problem discovery foundation
- Status: Ready for Verification
- Goal: make the workspace independent from infrastructure branding and begin every user journey with a real problem.
- Scope: DeveloperB customer-facing copy, discovery-first UI, guided discovery prompt, discovery/solution/blueprint schema, provider capabilities, and documentation.
- Files: `public/index.html`, `public/app.js`, `public/ai-coach.js`, `src/workspace-app.ts`, `src/project-coach.ts`, `src/private-alpha/provider-types.ts`, `private-alpha/README.md`, `private-alpha/migrations/0002_discovery.sql`, `private-alpha/migrations/README.md`, `WORKSPACE.md`, `BUILD-STATUS.md`, `WORKSPACE-STATUS.md`.
- Acceptance criteria:
  - The first screen asks the user to explain what happened.
  - Discovery output distinguishes facts, assumptions, unanswered questions, solution options, recommendation, and what not to build yet.
  - A blueprint is required before a project is created.
  - Future providers can be selected for discovery, recommendation, teaching, planning, and coding capabilities.
  - No D1 binding, user write route, provider value, repository credential, or public rollout is introduced.
- Risk: medium.
- Recovery: revert the focused branch; `0002_discovery.sql` is not applied yet.
- Evidence: pending preview inspection, repository typecheck, migration rehearsal, and link review.

## Verification matrix

| ID | Area | Expected result | How to verify | Status |
| --- | --- | --- | --- | --- |
| WV-001 | DeveloperB workspace | `/` shows DeveloperB, problem discovery, blueprint flow, and build workspace navigation | Connected preview browser review | Pending |
| WV-002 | Health API | `/api/health` returns safe JSON | Curl preview route | Complete in isolated local Worker run |
| WV-003 | Workspace API | `/api/workspace` returns DeveloperB task data | Curl preview route | Pending after B-001 update |
| WV-004 | Responsive and keyboard | Sidebar, views, actions, and discovery input are usable | Manual desktop/mobile review | Pending |
| WV-005 | AI disabled guard | `POST /api/ai/coach` remains disabled before enablement | Send one valid request while disabled | Pending |
| WV-006 | AI discovery format | Protected preview returns facts, assumptions, questions, options, recommendation, and non-goals | Enable only after access/rate limit then test one request | Pending |
| WV-007 | Migration 0001 | Control-plane schema applies in SQLite-compatible rehearsal | Empty database rehearsal | Complete in prior rehearsal |
| WV-008 | Migration 0002 | Discovery schema applies after `0001` and foreign keys pass | Apply both then run `PRAGMA foreign_key_check` | Pending |
| WV-009 | Provider contract | Discovery capabilities compile under strict TypeScript | `npm run typecheck` | Pending |
| WV-010 | Documentation | Product/migration docs describe the problem-first boundary | Manual review and relative-link check | Pending |

## Decision records

### DB-001 — Problem-first control plane
- User journey: a user tells DeveloperB what happened in natural language. The system records a discovery intake, findings, solution options, and an accepted blueprint before a project exists.
- Source of truth: D1 for structured records; R2 for larger artifacts; provider route/model profile for AI dispatch; external repository host for code.
- Ownership: each discovery intake, blueprint, and project belongs to an organization.
- Access: server-side identity and membership checks are mandatory before returning or changing private records.
- Lifecycle: `discovery_intakes` move from discovery to solution review and blueprint readiness. `project_blueprints` move from draft to accepted to project conversion.
- First queries: discovery list; findings by discovery; solution options; blueprint-to-project conversion; projects by identity; pending approvals.
- Indexes: defined in `0001_control_plane.sql` and `0002_discovery.sql`.
- Recovery: migrations are append-only; use preview rehearsal and forward corrections.

### AI-001 — Provider-neutral problem guidance
- User journey: a natural-language message requests problem discovery, solution recommendation, teaching, planning, or future code reasoning.
- Source of truth: provider route and model profile records, not a hard-coded provider list.
- Provider scope: Workers AI, AI Gateway-native providers, OpenRouter through AI Gateway, compatible APIs, and future external coding agents.
- Safety: provider values remain outside D1; route status, capability, rate limits, and approval requirements gate use.
- Recovery: disable the route or preview variable without altering discovery/project records.

## Next safe task

- **B-002 — Preview D1 binding and fixture rehearsal.** Provision a dedicated preview database, bind it only to preview, apply `0001_control_plane.sql` then `0002_discovery.sql`, use synthetic fixtures, and verify discovery-to-blueprint-to-project queries plus organization isolation. Do not add public write routes, repository credentials, or stored conversation history.
