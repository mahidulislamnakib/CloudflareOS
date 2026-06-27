# Build Status

Copy this file to a project root as `BUILD-STATUS.md`. Read it before every AI-assisted coding session.

## Project snapshot

- Product goal:
- Version 1 outcome:
- Non-goals:
- Stack and deployment target:
- Current environment:
- Last updated:
- Current task:

## Local runbook

```text
Install:
Typecheck:
Lint:
Tests:
Dev server:
Database migration local:
Demo seed/reset:
```

## Task ledger

### T-001 — Repository discovery and first small plan
- Status: Not Started
- Goal:
- Scope:
- Files:
- Dependencies:
- Acceptance criteria:
- Verification reference:
- Risk: low / medium / high
- Rollback or recovery:
- Evidence:
- Notes:

### T-002 —
- Status: Not Started
- Goal:
- Scope:
- Files:
- Dependencies:
- Acceptance criteria:
- Verification reference:
- Risk: low / medium / high
- Rollback or recovery:
- Evidence:
- Notes:

## Status definitions

| Status | Meaning |
| --- | --- |
| Not Started | Defined but untouched |
| In Progress | The active task |
| Blocked | Exact blocker and required decision are recorded |
| Ready for Verification | Code changed but checks are incomplete |
| Complete | Acceptance criteria and evidence are recorded |
| Deferred | Intentionally outside version 1 |

A task is not complete because code exists. It needs local checks and recorded evidence.

## Verification matrix

| ID | Area | Reference | Expected result | How to verify | Status |
| --- | --- | --- | --- | --- | --- |
| V-001 | Page | `/route-name` | Correct content and responsive layout | Run local server, open route, test mobile width and keyboard | Pending |
| V-002 | Component | `components/Name.tsx` | Correct states and actions | Open parent route with fixtures | Pending |
| V-003 | API | `POST /api/resource` | Valid response and useful validation errors | Local test or curl | Pending |
| V-004 | Database | `migrations/000x_name.sql` | Migration applies and core query works | Apply locally and run user flow | Pending |
