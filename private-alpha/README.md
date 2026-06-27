# DeveloperB Private Alpha

> **From real problems to build-ready products.**

DeveloperB is a private-alpha workspace for people who have a real problem but need help turning it into a clear decision, useful documentation, and a safe implementation path.

It is not a public launch plan. Access is limited to approved developers while the product, identity, data controls, and approval flow are verified.

## Product journey

```text
Natural language problem
→ discovery conversation
→ confirmed facts, assumptions, and unanswered questions
→ solution options
→ recommended decision
→ accepted project blueprint
→ project, repository, tasks, and agent workspace
→ evidence, approval, and delivery
```

A project is not the starting point. A project is created only after a solution option and blueprint are accepted.

## Solution options

DeveloperB must not always recommend custom software. Every discovery should consider:

1. Do not build yet.
2. Use an existing tool.
3. Improve the current manual process.
4. Automate one workflow.
5. Build a lightweight internal tool.
6. Build a full software product.

Every recommendation should show confirmed facts, assumptions, unanswered questions, benefits, tradeoffs, cost direction, complexity, and what should not be built yet.

## Private-alpha access model

| Role | Can do |
| --- | --- |
| Owner | Manage organizations, members, provider routes, approvals, and release policy |
| Admin | Manage projects and members within delegated scope |
| Developer | Start discovery, plan work, and request controlled actions |
| Reviewer | Review evidence and approve or reject controlled actions |
| Viewer | Inspect permitted records and evidence |

A future identity adapter maps approved-preview identity claims to `users.identity_subject`, then resolves organization and project membership server-side before returning a private record.

## AI provider strategy

DeveloperB routes requests by capability and approved model profile, not by a hard-coded vendor.

```text
Discovery or build request
→ required capability
→ policy and model profile
→ provider route
→ response, artifact, approval, and audit record
```

Provider route categories:

- `workers_ai`
- `ai_gateway_native`
- `openrouter_via_gateway`
- `openai_compatible`
- `external_coding_agent`
- `custom_https`

Cloudflare AI Gateway is a possible provider-control layer for compatible routes. No provider values belong in D1; the control plane stores only route/reference data.

## Control-plane data

| Area | Tables |
| --- | --- |
| Access | `organizations`, `users`, `memberships`, `project_memberships` |
| Discovery | `discovery_intakes`, `discovery_sessions`, `discovery_findings`, `solution_options` |
| Blueprint | `project_blueprints`, `blueprint_versions` |
| Delivery | `projects`, `repositories`, `workspaces`, `tasks` |
| AI and agent work | `ai_provider_routes`, `ai_model_profiles`, `agent_sessions`, `agent_runs` |
| Safety and evidence | `approvals`, `artifacts`, `deployment_records`, `audit_events` |

D1 stores structured control-plane records. R2 will store larger artifacts. Provider credentials, repository credentials, and production values stay outside D1.

## Migrations

- [`migrations/0001_control_plane.sql`](migrations/0001_control_plane.sql) defines organizations, projects, tasks, AI routing, approvals, artifacts, and audits.
- [`migrations/0002_discovery.sql`](migrations/0002_discovery.sql) adds discovery, solution options, blueprints, and a project-to-blueprint link.

Neither migration is connected to the deployed Worker yet. Apply both only to a dedicated preview database after local rehearsal with synthetic fixtures.

## Build order

1. **B-001 — In progress:** DeveloperB rebrand and problem discovery foundation.
2. **B-002:** Preview D1 binding, migration rehearsal, synthetic fixtures, and isolation queries.
3. **B-003:** Protected identity, organization bootstrap, and server-side authorization.
4. **B-004:** Editable problem discovery workspace.
5. **B-005:** Solution recommendation and blueprint acceptance.
6. **B-006:** Project workspace, tasks, evidence, and approval workflow.
7. **B-007:** Provider routing, chat, planning, and teaching.
8. **B-008:** Repository connection and codebase context.
9. **B-009:** Isolated agent execution, diffs, tests, and pull request handoff.

## Non-negotiable rules

- Keep one focused task in progress.
- Never hide assumptions as facts.
- Do not create a project before blueprint acceptance.
- Keep sensitive values outside source files, D1, logs, and artifacts.
- Require approval before high-impact actions.
- Record verification evidence and the next safe task at every handoff.
