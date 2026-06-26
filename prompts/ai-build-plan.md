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
- Do not rewrite the project unless absolutely necessary.
- Do not add advanced services unless the selected guide clearly requires them.
- Do not expose secrets or commit environment values.
- Do not run destructive migrations.
- Do not implement payments, AI, real-time, or complex workflows unless they are explicitly in version 1 scope.
- Keep changes small and reviewable.
- After each task, explain what changed and how to verify it.
- If the repository structure is unclear, ask before moving files.

Required output before coding:

# Build understanding
Summarize the project, selected architecture, and smallest useful version.

# Existing repo findings
List the files, config, and patterns found in the repository.

# Proposed architecture for this repo
Map frontend, API, database, storage, auth, background jobs, and deployment target.

# Version 1 task list
Create 5-10 small tasks. Each task must include:
- goal
- files likely affected
- risk level
- verification step
- rollback note

# Data and binding plan
List required tables, migrations, R2 buckets, KV namespaces, queues, secrets, and env vars by name only.

# Safety checks
Explain how you will avoid:
- cross-user or cross-tenant data leaks
- missing authorization checks
- unsafe file access
- broken deployment bindings
- destructive migrations
- unbounded cost or background retries

# First task only
Start with only the first task after the plan is approved.
```

## Best use

Use this after `cloudflare-architecture-recommendation.md` and before asking an AI agent to write code.

## Related guides

- [`./cloudflare-architecture-recommendation.md`](./cloudflare-architecture-recommendation.md)
- [`./cloudflare-binding-verification.md`](./cloudflare-binding-verification.md)
- [`./full-production-audit.md`](./full-production-audit.md)
- [`../architectures/README.md`](../architectures/README.md)
- [`../docs/production-readiness-checklist.md`](../docs/production-readiness-checklist.md)
