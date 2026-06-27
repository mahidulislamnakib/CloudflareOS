# Private Alpha Migration Runbook

`0001_control_plane.sql` is the first private-alpha control-plane migration. It is migration-ready, but it is not attached to the live Worker in this change.

## Before applying

Confirm these decisions are true:

- The database belongs only to the private-alpha workspace product.
- Preview and production use separate D1 databases.
- Preview access is protected before any private records are exposed.
- Provider credentials remain outside D1.
- R2 is available before storing large artifacts or command logs.
- A rollback decision has been recorded: schema migrations are append-only; do not delete or edit an applied migration.

## First D1 setup

Create a dedicated non-production database, then add its binding only in the environment configuration used for the private alpha. Do not paste the database identifier into public documentation or source files.

Apply the migration to the preview database only after the binding exists:

```bash
npx wrangler d1 migrations apply <PRIVATE_ALPHA_DATABASE> --remote --config wrangler.private-alpha.jsonc
```

For a local rehearsal:

```bash
npx wrangler d1 migrations apply <PRIVATE_ALPHA_DATABASE> --local --config wrangler.private-alpha.jsonc
```

The example configuration file is intentionally deferred to P-001B because it needs the actual database binding selected by the project owner.

## Fixture data

Use only non-production fixture records:

- one organization
- two users with synthetic identity subjects
- owner, developer, and reviewer memberships
- one project with one repository reference
- two tasks: one ready for verification and one requiring approval
- one disabled provider route and model profile

Do not use real customer details, provider keys, repository credentials, or production deployment identifiers in fixtures.

## First verification queries

After applying the migration, verify:

```sql
SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name;

SELECT name FROM sqlite_master WHERE type = 'index' ORDER BY name;

PRAGMA foreign_key_check;
```

Then verify the application queries that will drive the first private-alpha screens:

```sql
-- Project list available to one identity.
SELECT p.id, p.name, p.status
FROM projects p
JOIN project_memberships pm ON pm.project_id = p.id
JOIN memberships m ON m.id = pm.membership_id
JOIN users u ON u.id = m.user_id
WHERE u.identity_subject = ? AND m.status = 'active'
ORDER BY p.updated_at DESC;

-- Active task board for a project.
SELECT id, title, status, priority, risk_level, approval_status
FROM tasks
WHERE project_id = ?
ORDER BY CASE status WHEN 'in_progress' THEN 0 WHEN 'ready_for_verification' THEN 1 ELSE 2 END, priority, updated_at DESC;

-- Pending actions awaiting a human review.
SELECT id, action_type, request_summary, created_at
FROM approvals
WHERE project_id = ? AND status = 'pending'
ORDER BY created_at ASC;
```

## Recovery

- Before deployment: delete the preview database and recreate it, then replay migrations.
- After an applied migration: create a new forward-only corrective migration. Do not edit the existing file.
- If the product is rolled back to read-only mode: disable private write routes and provider routes, preserving audit and approval records for investigation.
