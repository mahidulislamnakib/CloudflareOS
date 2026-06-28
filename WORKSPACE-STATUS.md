# DeveloperB Workspace Build Status

This file tracks the DeveloperB private-alpha workspace. `BUILD-STATUS.md` is the repository-wide handoff.

## Product direction

- Brand: **DeveloperB**.
- Promise: **From real problems to build-ready products.**
- First user journey: natural-language problem → discovery → solution decision → accepted blueprint → project workspace.
- Access: private alpha only. No public promotion or private write routes yet.
- Infrastructure: Cloudflare services can be used where technically appropriate. They are not part of the DeveloperB product identity.

## Task ledger

### UI-001 — Workspace foundation
- Status: Ready for Verification
- Remaining: connected-preview visual and keyboard checks.

### UI-002 — Guarded AI Guide
- Status: Ready for Verification
- Remaining: disabled/validation checks and one protected enabled response.

### B-001 — DeveloperB naming and problem discovery foundation
- Status: Ready for Verification
- Goal: make DeveloperB the sole customer-facing product identity and begin every user journey with a real problem.
- Scope: independent branding, discovery-first UI, guided discovery prompt, discovery/solution/blueprint schema, provider capabilities, package/Worker names, and deployment migration documentation.
- Current implementation names:
  - package: `developerb-workspace`
  - Worker config: `developerb-workspace`
  - health service: `developerb-workspace`
- Acceptance criteria:
  - Product UI and metadata use DeveloperB.
  - Provider names remain factual technical references only.
  - No provider logo, product-name combination, or affiliation claim appears in the workspace.
  - A blueprint is required before project creation.
  - No D1 binding, user write route, provider value, repository credential, or public rollout is introduced.
- Evidence: both prepared D1 migrations passed SQLite rehearsal with zero foreign-key errors.
- Local evidence added 2026-06-28:
  - `npm run typecheck` passed.
  - Local `wrangler dev --local --port 8787 --compatibility-date 2026-05-03` served the root page and workspace APIs.
  - Local disabled AI Guide request returned `AI_PREVIEW_DISABLED`.
  - Repository config/route review found no production D1 binding or private write route.
- Remaining verification:
  - Connected-preview interface/API checks.
  - Manual visual, mobile, and keyboard review.
  - One protected enabled AI Guide response after access/rate limits are in place.
  - Worker dashboard migration and custom-domain verification.
  - GitHub source-repository rename/replacement planned as a separate remote and integration migration.
- Local limitation:
  - Wrangler local runtime currently supports compatibility dates through `2026-05-03`; local route checks used that override instead of the configured `2026-06-27` date.
- Recovery: retain the previous Worker until `developerb-workspace` is deployed and verified; do not apply D1 migrations yet.

## Verification matrix

| ID | Area | Expected result | How to verify | Status |
| --- | --- | --- | --- | --- |
| WV-001 | Product UI | `/` shows DeveloperB and the problem-to-product flow | Local title check passed; connected preview browser review remains | Partial |
| WV-002 | Health API | `/api/health` returns safe DeveloperB JSON | Curl local route; repeat on preview after Worker migration | Partial — local passed, preview pending |
| WV-003 | Workspace API | `/api/workspace` returns DeveloperB task data | Curl local route; repeat on preview after Worker migration | Partial — local passed, preview pending |
| WV-004 | Responsive and keyboard | Sidebar, views, actions, and discovery input are usable | Manual desktop/mobile review | Pending |
| WV-005 | AI disabled guard | `POST /api/ai/coach` remains disabled before enablement | Send one valid request while disabled | Complete locally |
| WV-006 | AI discovery format | Protected preview returns facts, assumptions, questions, options, recommendation, and non-goals | Enable only after access/rate limit then test one request | Pending |
| WV-007 | Migration rehearsal | `0001` and `0002` apply with valid foreign keys | SQLite/D1 rehearsal | Complete in SQLite rehearsal |
| WV-008 | Brand boundary | UI, package, Worker config, and docs use independent naming | Review `BRAND-BOUNDARY.md` and preview | Pending |
| WV-009 | No persistence change | No D1 binding or private write route exists | Review config and Worker routes | Complete locally |

## Decision records

### DB-001 — Problem-first control plane
- User journey: a user tells DeveloperB what happened in natural language. The system records a discovery intake, findings, solution options, and an accepted blueprint before a project exists.
- Source of truth: D1 for structured records; R2 for larger artifacts; provider route/model profile for AI dispatch; external repository host for code.
- Ownership: each discovery intake, blueprint, and project belongs to an organization.
- Access: server-side identity and membership checks are mandatory before returning or changing private records.
- Lifecycle: discovery intake → solution review → blueprint readiness → blueprint accepted → project conversion.
- Recovery: migrations are append-only; use preview rehearsal and forward corrections.

## Next safe task

1. Create or rename the connected Worker to `developerb-workspace`, reconnect the Git build if required, protect the preview, and verify its routes.
2. Then start B-002: attach a dedicated preview D1 database, apply both migrations with synthetic fixtures, and verify isolation queries.
