# DeveloperB Private Alpha Migration Runbook

The DeveloperB preview uses two un-applied migrations:

1. `0001_control_plane.sql` — organizations, access, projects, tasks, AI routes, agent runs, approvals, artifacts, deployments, and audit records.
2. `0002_discovery.sql` — natural-language discovery, findings, solution options, project blueprints, blueprint versions, and a project-to-blueprint reference.

They are migration-ready but are not attached to the live Worker in this change.

## Before applying

Confirm all of the following:

- The database is dedicated to DeveloperB private alpha.
- Preview and production use different D1 databases.
- Preview access is protected before private records are exposed.
- Provider and repository values remain outside D1.
- Large reports, logs, and exports have an R2 plan before they are stored.
- Migrations are append-only. Do not edit a migration after it is applied.

## First D1 setup

Create one non-production database and add its binding only to a preview configuration. Do not place its actual identifier in public documentation or source files.

Rehearse locally, then apply to the preview database:

```bash
npx wrangler d1 migrations apply <PRIVATE_ALPHA_DATABASE> --local --config wrangler.private-alpha.jsonc
npx wrangler d1 migrations apply <PRIVATE_ALPHA_DATABASE> --remote --config wrangler.private-alpha.jsonc
```

The preview configuration belongs to B-002 because it needs the database chosen by the project owner.

## Synthetic fixtures

Use only fictional records:

- one organization;
- three users and owner, developer, reviewer memberships;
- one discovery intake about a scattered lead-follow-up process;
- findings for one confirmed fact, one assumption, and one unanswered question;
- at least two solution options with one recommendation;
- one accepted blueprint that becomes one project;
- one repository reference, task, approval, disabled provider route, and model profile.

Do not use real client details, provider values, repository credentials, or production deployment identifiers.

## First verification queries

```sql
SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name;
SELECT name FROM sqlite_master WHERE type = 'index' ORDER BY name;
PRAGMA foreign_key_check;
```

```sql
-- Discovery records available through one approved organization.
SELECT d.id, d.title, d.status, d.problem_summary
FROM discovery_intakes d
WHERE d.organization_id = ?
ORDER BY d.updated_at DESC;

-- Facts, assumptions, and unanswered questions for one discovery.
SELECT finding_type, statement, confidence, review_status
FROM discovery_findings
WHERE discovery_intake_id = ?
ORDER BY created_at ASC;

-- Solution options before a project is created.
SELECT option_type, title, complexity, cost_direction, status, recommendation_reason
FROM solution_options
WHERE discovery_intake_id = ?
ORDER BY recommended_rank ASC, created_at ASC;

-- Blueprint accepted before conversion to a project.
SELECT b.id, b.title, b.status, p.id AS project_id
FROM project_blueprints b
LEFT JOIN projects p ON p.source_blueprint_id = b.id
WHERE b.id = ?;

-- Project list available to one identity.
SELECT p.id, p.name, p.status
FROM projects p
JOIN project_memberships pm ON pm.project_id = p.id
JOIN memberships m ON m.id = pm.membership_id
JOIN users u ON u.id = m.user_id
WHERE u.identity_subject = ? AND m.status = 'active'
ORDER BY p.updated_at DESC;

-- Pending actions awaiting human review.
SELECT id, action_type, request_summary, created_at
FROM approvals
WHERE project_id = ? AND status = 'pending'
ORDER BY created_at ASC;
```

## Recovery

- Before use: delete and recreate the preview database, then replay both migrations.
- After an applied migration: create a new forward-only correction migration.
- If DeveloperB returns to read-only mode: disable private write routes and provider routes while retaining audit and approval evidence for review.
