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

### T-007 — Workspace quality and security baseline
- Status: Ready for Verification
- Goal: make the current Worker safer to change before persistent data, identity, or autonomous AI capabilities are introduced.
- Delivered:
  - Zod request validation for the AI coach route, including actual request-byte limits.
  - Biome formatter and linter with `npm run check` as the combined local gate.
  - Cloudflare Workers Vitest configuration plus safety-boundary route tests.
  - GitHub Actions quality checks, CodeQL, Gitleaks, Zizmor, and Dependabot configuration.
  - `docs/tooling-roadmap.md`, which records installed tools and milestone-gated tools.
- Risk: no lockfile exists yet, so the first `npm install` must be reviewed and its generated `package-lock.json` committed after the quality checks pass.
- Recovery: revert the quality-foundation pull request. No production binding, D1 migration, deployment configuration, or private write route is changed.
- Remaining verification:
  - Run `npm install` and `npm run check` locally.
  - Confirm the pull request's Quality, CodeQL, Gitleaks, and Zizmor workflows pass.
  - Commit the generated lockfile only after the resolved dependency tree is reviewed.

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
- Local evidence added 2026-06-28:
  - `npm run typecheck` passed.
  - Local `wrangler dev --local --port 8787 --compatibility-date 2026-05-03` served `/`, `/api/health`, and `/api/workspace`.
  - Local `POST /api/ai/coach` returned `AI_PREVIEW_DISABLED` as expected.
  - Repository Worker config review found no production D1 binding or private D1 write route in `wrangler.jsonc` or `src/`.
- Remaining verification:
  - Connected-preview UI and keyboard review.
  - Protected enabled AI Guide response after preview access and rate limits are in place.
  - Worker dashboard migration to a Worker named `developerb-workspace` and subsequent custom-domain verification.
  - GitHub source-repository rename or replacement after a deliberate remote/integration migration plan.
- Local limitation:
  - Wrangler local runtime currently supports compatibility dates through `2026-05-03`; local route checks used that override instead of the configured `2026-06-27` date.
- Recovery: revert the naming branch; do not apply D1 migrations yet. Restore the previous Worker configuration only if the new Worker preview is not ready.

## Verification matrix

| ID | Area | Expected result | How to verify | Status |
| --- | --- | --- | --- | --- |
| V-001 | Product UI | DeveloperB appears in browser title, workspace, and generated prompts | Local route check passed for title; connected preview review still required | Partial |
| V-002 | Brand boundary | Provider names are factual technical references only | Review `BRAND-BOUNDARY.md`, UI, metadata, and docs | Pending |
| V-003 | Package name | Package reports `developerb-workspace` | Inspect `package.json` and run typecheck | Complete locally |
| V-004 | Worker config | Wrangler targets `developerb-workspace` | Inspect `wrangler.jsonc`; verify dashboard setup before deploy | Partial — config verified, dashboard pending |
| V-005 | Workspace APIs | Health and workspace APIs return safe DeveloperB data | Curl local routes; repeat on preview after Worker migration | Partial — local passed, preview pending |
| V-006 | Responsive and keyboard | Sidebar, views, actions, and discovery input are usable | Manual desktop/mobile review | Pending |
| V-007 | AI Guide guard | Guide stays disabled before enablement | Send valid request while disabled | Complete locally |
| V-008 | AI Guide response | Protected preview returns a bounded discovery answer after enablement | Apply access/rate limit then send one request | Pending |
| V-009 | Control-plane schema | `0001` and `0002` apply in rehearsal with valid foreign keys | SQLite/D1 rehearsal | Complete in SQLite rehearsal |
| V-010 | No persistence change | No D1 binding or private write route exists | Review `wrangler.jsonc` and Worker routes | Complete locally |
| V-011 | Quality baseline | Typecheck, formatting/linting, and Worker tests pass together | Run `npm install` then `npm run check` | Pending |
| V-012 | Security automation | CodeQL, secret scanning, and workflow analysis report no blocking configuration failure | Review pull request checks and GitHub Security findings | Pending |

## Next safe task

1. Review the **quality-foundation** pull request. Run `npm install` and `npm run check`, inspect the generated dependency lockfile, then verify the Quality, CodeQL, Gitleaks, and Zizmor workflow results.
2. Complete the **DeveloperB Worker migration**: create or rename the connected Worker to `developerb-workspace`, reconnect the Git build if needed, protect the preview, and verify `/`, `/api/health`, and `/api/workspace`.
3. Then begin **B-002**: attach a dedicated preview D1 database, apply both migrations with synthetic fixtures, and verify organization isolation plus discovery-to-blueprint-to-project queries.
