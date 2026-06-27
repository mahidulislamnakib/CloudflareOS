# AI Agent Workflow

Use this playbook to keep AI-assisted software work focused, testable, and easy to continue after context is lost.

Copy [`../templates/agent-build-status.md`](../templates/agent-build-status.md) into a real project as `BUILD-STATUS.md`. Read it before every coding session.

## Required loop

```text
Read BUILD-STATUS.md
  ↓
Inspect the repository and current configuration
  ↓
Confirm one small active task
  ↓
Define acceptance criteria and verification first
  ↓
Make focused changes
  ↓
Run checks and inspect the changed behavior locally
  ↓
Record evidence and next task
```

Do not re-plan the whole product when the status file already documents the active task and past decisions.

## Task rule

Every task needs:

```text
goal
scope
files affected
dependencies
acceptance criteria
verification reference
risk
rollback or recovery note
evidence
next safe task
```

Do not mark a task complete because code was written. It is complete only after the applicable checks and evidence are recorded.

## Local verification rule

For UI, route, API, form, database, binding, or access-control changes:

```text
Run repository checks
  ↓
Start the local development server
  ↓
Open the changed page or call the changed endpoint
  ↓
Check expected behavior and a relevant failure state
  ↓
Record commands and results in BUILD-STATUS.md
```

Every page or component must record where it can be inspected, what test data it needs, and its expected state for mobile, empty, loading, error, and permissions when relevant.

## Non-production role fixtures

When a project has protected screens or role-dependent behavior, create repeatable local test fixtures for the important permission levels. Keep those fixtures out of production and record the seed/reset command and local verification path in `BUILD-STATUS.md`.

Test unauthenticated, allowed, and denied behavior before calling access-control work complete.

## Database decision rule

Before a migration, record:

```text
user journey
source of truth
owner or tenant scope
read/write roles
lifecycle states
first required queries
indexes for those queries
server-controlled fields
archive/deletion policy
migration and recovery plan
test data and verification flow
```

Start with the smallest useful schema. Keep ownership explicit, enforce access server-side, add indexes for real queries, and prefer additive migrations.

## Session handoff

Before ending a session, update:

```text
completed tasks
current task status
files changed
commands run and results
manual checks completed
unverified behavior
schema, binding, and access decisions
known risks
next smallest safe task
```

## Related guides

- [`../templates/agent-build-status.md`](../templates/agent-build-status.md)
- [`../AGENTS.md`](../AGENTS.md)
- [`../prompts/ai-build-plan.md`](../prompts/ai-build-plan.md)
- [`./data-modeling-d1.md`](./data-modeling-d1.md)
- [`./testing-strategy.md`](./testing-strategy.md)
