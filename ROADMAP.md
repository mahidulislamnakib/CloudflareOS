# DeveloperB Roadmap

> **From real problems to build-ready products.**

DeveloperB is an independent problem-to-product workspace. This repository also maintains Cloudflare-friendly engineering guidance for teams that choose those services because they fit the technical need.

## Product direction

```text
Real problem
→ discovery and teaching
→ solution decision
→ accepted blueprint
→ project workspace
→ tasks, AI assistance, evidence, approval, and delivery
```

The private alpha stays private until access control, data safety, quality gates, and core user journeys are reliable.

## Current product stages

| Stage | Status | Focus |
| --- | --- | --- |
| B-001 Problem discovery foundation | Ready for verification | Independent brand, discovery flow, blueprint-first data model |
| B-002 Preview D1 rehearsal | Next | Preview-only database, synthetic fixtures, and isolation queries |
| B-003 Identity and memberships | Planned | Approved users, organizations, server-side authorization |
| B-004 Discovery workspace | Planned | Editable natural-language problem discovery |
| B-005 Blueprint acceptance | Planned | Solution recommendation and project conversion |
| B-006 Build workspace | Planned | Tasks, evidence, approvals, and delivery records |
| B-007 AI routing and teaching | Planned | Provider-neutral chat, planning, explanation, and cost controls |
| B-008 Repository context | Planned | GitHub connection and codebase understanding |
| B-009 Controlled agent execution | Planned | Isolated runs, diffs, tests, and pull-request handoff |

## Cloudflare-friendly technical toolkit

The repository continues to maintain guides for common infrastructure decisions:

- Workers, D1, R2, KV, Queues, Durable Objects, Workflows, and Wrangler
- Workers AI, AI Gateway, Vectorize, Browser Rendering, Images, and Analytics Engine
- Turnstile, Access, WAF, rate limits, observability, deployment, recovery, and cost controls
- Architecture guides, starter templates, prompts, and production checklists

## Handbook standards

Every technical guide should be:

- simple enough for beginners;
- justified by a real project need;
- clear about when not to use a service;
- safe for production work;
- understandable by AI coding agents;
- checked against official provider sources when facts may change.

## Private-alpha rules

- Do not promote publicly yet.
- Do not expose private write actions before server-side identity and authorization.
- Do not store provider values, repository credentials, or production secrets in D1, source files, fixtures, logs, or artifacts.
- Do not create a project before a solution and blueprint are accepted.
- Require human approval before high-impact actions.
- Keep one focused task in progress and record verification evidence.

## Long-term outcome

DeveloperB should help a non-technical person explain a real problem, learn the available choices, receive an honest recommendation, and hand a clear blueprint to a team or AI coding assistant.
