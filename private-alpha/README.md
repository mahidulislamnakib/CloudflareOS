# CloudflareOS Private Alpha

CloudflareOS is moving from a handbook with a workspace preview into a private-alpha AI coding workspace for the user's own projects and a small approved developer group.

This is not a public launch plan. There is no public signup, marketplace, or unrestricted agent endpoint in this phase.

## Product boundary

The private alpha should eventually support the full coding-assistant journey:

```text
Project and repository connection
→ codebase discovery and context
→ AI chat, planning, and architecture review
→ scoped agent run
→ tests and evidence
→ diff and approval
→ pull request or deployment handoff
→ audit and rollback record
```

The first runtime interface remains intentionally small. The control-plane schema in `migrations/0001_control_plane.sql` prepares the product for persistence without attaching a database to the deployed Worker yet.

## Operating principles

1. **Private by default.** Only approved developers access the preview.
2. **Human approval before impact.** Code writes, migrations, repository writes, secret changes, external requests, and deployments require an approval record.
3. **No provider lock-in.** Requests target a capability and model profile rather than a hard-coded vendor.
4. **No secret material in D1.** D1 stores a secret reference name only. Actual values remain in Worker secrets, AI Gateway managed key storage, or a future approved identity-based integration.
5. **Evidence before completion.** Agent actions carry task links, command/test evidence, artifacts, approvals, and audit events.
6. **One safe task at a time.** An agent run cannot silently expand into unrelated work.

## Private-alpha access model

| Level | Access | Can do |
| --- | --- | --- |
| Owner | Organization and project owner | Manage members, routes, approvals, and release policy |
| Admin | Organization operator | Manage projects and members within delegated scope |
| Developer | Builder | Plan, chat, create safe agent requests, and act after approval |
| Reviewer | Quality gate | Review diffs, evidence, and approve/reject controlled actions |
| Viewer | Read-only | Inspect project state, architecture, tasks, and evidence |

A future identity adapter will map protected-preview identity claims to `users.identity_subject`. It must create the user server-side, then resolve organization and project membership before returning any private record.

## AI provider strategy

Every model request should use a provider route and model profile.

```text
Agent request
→ intended capability (fast chat, planning, code reasoning, tool use, embedding)
→ policy chooses a model profile
→ model profile chooses a provider route
→ provider adapter sends the request
→ artifact, usage, approval, and audit record are written
```

Supported route categories are intentionally generic:

- `workers_ai` for Cloudflare-hosted models.
- `ai_gateway_native` for a provider supported directly by Cloudflare AI Gateway.
- `openrouter_via_gateway` for OpenRouter routed through AI Gateway.
- `openai_compatible` for APIs that implement a compatible request contract.
- `external_coding_agent` for tools such as OpenCode after its exact integration contract is verified.
- `custom_https` for future provider APIs that need an explicit adapter.

Cloudflare AI Gateway should be the central observability and control layer when a provider is compatible: it supports provider routing, logging/analytics, rate limiting, caching, retries, and model fallback. Do not store provider keys in the control-plane database.

## Control-plane data

The initial schema is in [`migrations/0001_control_plane.sql`](migrations/0001_control_plane.sql).

| Area | Tables | Reason |
| --- | --- | --- |
| Tenancy | `organizations`, `users`, `memberships`, `project_memberships` | Resolve who owns and can access a project |
| Product work | `projects`, `repositories`, `workspaces`, `tasks` | Keep project intent, repo context, and small verified tasks together |
| AI routing | `ai_provider_routes`, `ai_model_profiles` | Route requests by capability without storing private values |
| Agent execution | `agent_sessions`, `agent_runs` | Record planning, reads, writes, test, indexing, and review runs |
| Human safety | `approvals`, `audit_events` | Preserve reviewable approval and action history |
| Evidence | `artifacts`, `deployment_records` | Point to R2 artifacts and deployment verification without embedding large logs in D1 |

## D1 and R2 boundary

- **D1:** structured, queryable control-plane records and small safe summaries.
- **R2:** artifacts such as diffs, reports, command logs, index files, and exports.
- **Worker secrets / managed provider storage:** provider credentials and integration secrets.
- **Do not store:** raw keys, OAuth refresh material, client private data by default, or unrestricted prompt archives.

## Migration preparation

The migration is committed but deliberately not bound to the live Worker yet. This keeps the current preview deployable while the following are prepared:

1. Create a dedicated D1 database for the private alpha.
2. Add a non-production database binding with its actual database identifier outside version-controlled documentation.
3. Apply the migration in a local or preview database first.
4. Seed only non-production fixture data.
5. Verify tenant isolation, role checks, task status transitions, approval queries, and deletion/archival behavior before exposing write routes.

## Current build order

1. **P-001A — Ready for verification:** define private-alpha control-plane schema and provider-neutral routing contract. SQLite schema rehearsal and standalone TypeScript validation passed; repository-level checks and link review remain.
2. **P-001B — Next:** provision the D1 database, bind it in preview, and apply the migration with repeatable fixture data.
3. **P-002:** protected identity and organization bootstrap.
4. **P-003:** GitHub repository connection and safe repository import.
5. **P-004:** codebase index plus project-context explorer.
6. **P-005:** AI chat, planning, and model routing UI.
7. **P-006:** isolated agent execution, approvals, diffs, and pull-request workflow.

## Verification for this foundation

- Validate the SQL schema in SQLite-compatible tooling before applying it to D1.
- Confirm every foreign-key relationship and index serves a defined first query.
- Confirm no table has a raw credential field.
- Confirm all public routes remain read-only until protected identity and server-side authorization exist.
