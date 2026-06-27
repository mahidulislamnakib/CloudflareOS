# Build Status

Read this file before every AI-assisted coding session. It is the repository-wide handoff for the DeveloperB private alpha and its Cloudflare-friendly technical toolkit.

## Project snapshot

- Product: **DeveloperB**.
- Promise: **From real problems to build-ready products.**
- Product flow: real problem → discovery → solution decision → accepted blueprint → project workspace → verified delivery.
- Access: private alpha only. Do not publicly promote or expose private write actions.
- Infrastructure: Cloudflare services may be used where technically appropriate. DeveloperB is independent and must not imply provider affiliation.
- Current task: **B-001 — DeveloperB naming and problem discovery foundation** (Ready for Verification).

## Current names

```text
Public product: DeveloperB
npm package: developerb-workspace
Wrangler Worker name: developerb-workspace
Health service name: developerb-workspace
Legacy GitHub repository name: migration still required outside this code change
```

## Product operating rules

- Start with the real-world problem, not a framework or feature list.
- Make confirmed facts, assumptions, questions, risks, and success measures visible.
- Compare build, buy, automate, process improvement, and do-not-build options.
- Create a project only after an accepted blueprint exists.
- Keep one bounded task in progress and record verification evidence before completion.
- Private data routes require server-side organization and membership authorization.
- Provider and repository values stay outside D1, source files, logs, fixtures, and artifacts.
- High-impact actions require approval records.

## Task ledger

### T-001 to T-006 — Handbook and production-readiness foundation
- Status: Complete
- Delivered: persistent build record plus rollback, incident, environment/secret, data recovery, and cost-readiness documentation.

### UI-001 — Workspace foundation
- Status: Ready for Verification
- Remaining: connected preview review at desktop/mobile widths and keyboard flow.

### UI-002 — Guarded AI Guide
- Status: Ready for Verification
- Remaining: connected-preview disabled/validation checks and one protected enabled request.

### B-001 — DeveloperB naming and problem discovery foundation
- Status: Ready for Verification
- Goal: make DeveloperB the sole product identity and make natural-language problem discovery the first product journey.
- Scope: independent product copy, workspace UI, discovery guide, discovery/solution/blueprint schema, provider capabilities, naming boundary, package name, Worker configuration name, and migration documentation.
- Acceptance criteria:
  - Product UI, metadata, API service label, package name, and Worker config use DeveloperB naming.
  - Cloudflare appears only in factual infrastructure and technical-learning contexts.
  - No provider logo, affiliation claim, sponsorship claim, or product-name combination appears in the product workspace.
  - The first user journey is problem discovery, with facts, assumptions, questions, solution options, recommendations, and what not to build.
  - A project is created only after a blueprint is accepted.
  - No D1 binding, user write route, provider value, repository credential, or public rollout is added.
- Evidence:
  - `0001_control_plane.sql` completed a SQLite rehearsal with zero foreign-key errors.
  - `0002_discovery.sql` completed a SQLite rehearsal with zero foreign-key errors.
  - Brand-boundary and deployment-migration documentation added.
- Remaining verification:
  - `npm run typecheck`.
  - Connected-preview UI and keyboard review.
  - Disabled AI Guide response, then one protected enabled response.
  - Worker dashboard migration to a Worker named `developerb-workspace` and subsequent custom-domain verification.
  - GitHub source-repository rename or replacement after a deliberate remote/integration migration plan.
- Recovery: revert the naming branch; do not apply D1 migrations yet. Restore the previous Worker configuration only if the new Worker preview is not ready.

## Verification matrix

| ID | Area | Expected result | How to verify | Status |
| --- | --- | --- | --- | --- |
| V-001 | Product UI | DeveloperB appears in browser title, workspace, and generated prompts | Connected preview review | Pending |
| V-002 | Brand boundary | Provider names are factual technical references only | Review `BRAND-BOUNDARY.md`, UI, metadata, and docs | Pending |
| V-003 | Package name | Package reports `developerb-workspace` | Inspect `package.json` and run install/typecheck | Pending |
| V-004 | Worker config | Wrangler targets `developerb-workspace` | Inspect `wrangler.jsonc`; verify dashboard setup before deploy | Pending |
| V-005 | Workspace APIs | Health and workspace APIs return safe DeveloperB data | Curl preview routes | Pending after Worker migration |
| V-006 | Responsive and keyboard | Sidebar, views, actions, and discovery input are usable | Manual desktop/mobile review | Pending |
| V-007 | AI Guide guard | Guide stays disabled before enablement | Send valid request while disabled | Pending |
| V-008 | AI Guide response | Protected preview returns a bounded discovery answer after enablement | Apply access/rate limit then send one request | Pending |
| V-009 | Control-plane schema | `0001` and `0002` apply in rehearsal with valid foreign keys | SQLite/D1 rehearsal | Complete in SQLite rehearsal |
| V-010 | No persistence change | No D1 binding or private write route exists | Review `wrangler.jsonc` and Worker routes | Pending |

## Next safe task

1. Complete the **DeveloperB Worker migration**: create or rename the connected Worker to `developerb-workspace`, reconnect the Git build if needed, protect the preview, and verify `/`, `/api/health`, and `/api/workspace`.
2. Then begin **B-002**: attach a dedicated preview D1 database, apply both migrations with synthetic fixtures, and verify organization isolation plus discovery-to-blueprint-to-project queries.
