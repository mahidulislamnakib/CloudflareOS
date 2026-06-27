# AI Build Plan Prompt

Use this prompt after selecting a CloudflareOS architecture guide. It turns a project idea into a safe, reviewable, step-by-step implementation plan for an AI coding agent.

## Copy-paste prompt

```text
You are an AI coding agent working on a Cloudflare-first project.

Before writing code, read the selected CloudflareOS architecture guide and create a small, safe implementation plan. Do not build the whole product in one step.

Project:
[describe project]

Selected CloudflareOS guide:
[link or path, such as architectures/marketplace.md]

Current repository state:
- Existing stack: [framework/runtime]
- Existing database: [D1/other/none]
- Existing storage: [R2/other/none]
- Existing auth: [describe]
- Existing deployment target: [Workers/Pages/other]

Version 1 scope:
- [feature 1]
- [feature 2]
- [feature 3]

Strict rules:
- Inspect the existing repository first.
- Create or update a root-level BUILD-STATUS.md before changing code.
- Do not rewrite the project unless absolutely necessary.
- Do not add advanced services unless the selected guide clearly requires them.
- Do not expose secrets or commit environment values.
- Do not run destructive migrations.
- Do not implement payments, AI, real-time, or complex workflows unless they are explicitly in version 1 scope.
- Keep changes small and reviewable.
- Keep only one task In Progress unless parallel work is clearly independent and safe.
- Every task must have acceptance criteria, a verification reference, risk, recovery note, and completion evidence.
- Do not mark a task complete because code was written.
- For any changed page, component, route, API, form, database behavior, binding, or protected screen, run the local development server when possible and inspect the behavior before completion.
- Every page/component must record where it can be checked and which empty, loading, error, mobile, keyboard, and permission states matter.
- Use repeatable non-production test data for protected workflows and document the setup/reset path.
- Before a migration, record the user journey, ownership boundary, access rules, lifecycle states, first required queries, indexes, server-controlled fields, migration strategy, and verification plan.
- If the repository structure is unclear, ask before moving files.

Required output before coding:

# Build understanding
Summarize the project, selected architecture, and smallest useful version.

# Existing repo findings
List the files, config, scripts, routes, schema, bindings, and patterns found in the repository.

# Build status setup
Create or update BUILD-STATUS.md with:
- project goal and version 1 scope
- non-goals
- current stack, bindings, and local commands
- ordered task list
- verification matrix
- known risks and decisions
- next safe task

# Proposed architecture for this repo
Map frontend, API, database, storage, auth, background jobs, and deployment target.

# Version 1 task list
Create 5-10 small tasks. Each task must include:
- ID and status
- goal
- files likely affected
- dependencies
- acceptance criteria
- verification reference
- risk level
- rollback or recovery note

# Verification matrix
For each important page, component, route, API action, migration, and protected flow, define:
- where to inspect it
- expected result
- test data needed
- local command or manual flow
- relevant success and failure states

# Data and binding plan
List required tables, migrations, R2 buckets, KV namespaces, queues, secrets, and env vars by name only.

# Database decision records
For every new table or migration, include:
- user journey
- source of truth
- ownership or tenant scope
- read/write rules
- lifecycle states
- first queries and indexes
- server-controlled fields
- archive/deletion rule
- migration and verification plan

# Safety checks
Explain how you will avoid:
- cross-user or cross-tenant data leaks
- missing authorization checks
- unsafe file access
- broken deployment bindings
- destructive migrations
- unbounded cost or background retries
- unverified completion claims

# First task only
Start with only the first task after the plan is approved.

# After each task
Update BUILD-STATUS.md with:
- status
- files changed
- commands run and outcomes
- manual verification completed
- remaining risk or unverified behavior
- next smallest safe task
```

## Best use

Use this after `cloudflare-architecture-recommendation.md` and before asking an AI agent to write code.

## Related guides

- [`./cloudflare-architecture-recommendation.md`](./cloudflare-architecture-recommendation.md)
- [`./cloudflare-binding-verification.md`](./cloudflare-binding-verification.md)
- [`./full-production-audit.md`](./full-production-audit.md)
- [`../playbooks/agent-workflow.md`](../playbooks/agent-workflow.md)
- [`../templates/agent-build-status.md`](../templates/agent-build-status.md)
- [`../architectures/README.md`](../architectures/README.md)
- [`../docs/production-readiness-checklist.md`](../docs/production-readiness-checklist.md)
