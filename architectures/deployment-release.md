# Deployment & Release Architecture

A Cloudflare-first reference for environments, preview deployments, secrets, migrations, production releases, rollbacks, and post-release checks.

## Goal

Ship changes safely without breaking production data, customer flows, or internal operations.

Use this architecture for:

- Workers APIs
- Pages frontends
- full-stack Cloudflare apps
- SaaS products
- marketplaces
- admin dashboards
- public content platforms

## Environment model

Use clear environments from the beginning.

```text
local
  ↓
development
  ↓
staging or preview
  ↓
production
```

Each environment should have separate configuration, secrets, and data boundaries where practical.

## Core release flow

```text
Developer creates branch
  ↓
Checks and tests run
  ↓
Preview deployment created
  ↓
Review and smoke test
  ↓
Production deployment
  ↓
Post-release verification
  ↓
Rollback if needed
```

Avoid deploying unreviewed changes directly to production.

## Recommended stack

| Need | Service / pattern |
| --- | --- |
| App deployment | Workers / Pages |
| Source control | GitHub |
| Preview environment | Branch or preview deployment |
| Configuration | Environment variables / bindings |
| Secrets | Worker secrets |
| Data migrations | Versioned D1 migrations |
| Release checks | CI and smoke tests |
| Incident visibility | Logs and audit records |

## Configuration model

Keep configuration separate from code.

```text
public configuration
runtime bindings
secrets
feature flags
environment-specific URLs
```

Do not commit API keys, database credentials, signing secrets, or production tokens to the repository.

## Secret rules

- Store secrets in the deployment platform, not source files.
- Use different secrets for development and production.
- Rotate secrets after exposure or staff changes.
- Keep secret access limited to the people and services that need it.
- Never print secrets in CI logs or error reports.

## Database migration flow

Treat schema changes as production changes.

```text
Migration written
  ↓
Run on local/development data
  ↓
Test application compatibility
  ↓
Run on staging/preview when possible
  ↓
Deploy app and migration safely
  ↓
Verify core queries
```

For risky changes, prefer additive migration steps:

```text
add new column/table
  ↓
ship compatible code
  ↓
backfill if needed
  ↓
switch reads/writes
  ↓
remove old field later
```

Avoid destructive schema changes in the same release as large application rewrites.

## Preview deployment checklist

Before production, verify:

- homepage or primary entry point
- authentication flow
- core create/update action
- file upload if used
- payment or webhook sandbox flow if used
- role-protected admin route
- mobile layout for key screens
- error handling for missing data

## Feature flag model

Use feature flags for risky or incomplete features.

```text
feature disabled in production
  ↓
release code safely
  ↓
enable for staff or selected workspace
  ↓
monitor behavior
  ↓
expand gradually
```

Do not leave unmaintained flags forever. Assign an owner and removal date.

## Release safety rules

- Keep releases small when possible.
- Separate database migration risk from UI-only changes.
- Verify production configuration before deploy.
- Use health checks or smoke tests after deployment.
- Keep a rollback path for every major release.
- Record deployment version, commit, and release time.

## Rollback model

```text
Issue detected
  ↓
Confirm impact
  ↓
Disable feature flag if possible
  ↓
Rollback app version or route traffic
  ↓
Protect data from further writes if needed
  ↓
Verify recovery
  ↓
Write incident note
```

A code rollback does not automatically reverse database or external side effects. Plan those separately.

## Webhook and integration releases

When changing webhook handlers or external APIs:

- support old and new payload versions temporarily
- make handlers idempotent
- log event IDs and processing status
- avoid changing endpoints without a migration window
- test against sandbox or preview systems first

## CI checks

Useful release checks:

```text
format/lint
unit tests
type checks
build check
migration validation
smoke test
secret scan
link check for public docs
```

Use checks that prevent real failures, not a large list that everyone ignores.

## Deployment audit record

Track release metadata:

```text
id
environment
commit_sha
release_version
deployed_by
started_at
completed_at
status
rollback_reference
```

This makes it easier to connect an incident to a recent change.

## Production checklist

- [ ] Development and production configuration are separated
- [ ] Secrets are not committed
- [ ] D1 migrations are versioned and tested
- [ ] Preview deployment is reviewed
- [ ] Core user flow smoke test passes
- [ ] Admin route protection is checked
- [ ] Rollback path is documented
- [ ] Deployment version is recorded
- [ ] Post-release logs are reviewed
- [ ] Feature flags protect risky functionality
- [ ] Data-impacting changes have a recovery plan

## Common mistakes

- deploying schema changes without a rollback plan
- sharing production secrets with local development
- merging large unrelated changes into one release
- testing only the happy path
- relying on code rollback to undo data changes
- changing webhook contracts without compatibility
- keeping stale feature flags forever
- not recording which version is live

## Related docs

- [`architectures/observability-operations.md`](./observability-operations.md)
- [`architectures/api-platform.md`](./api-platform.md)
- [`architectures/microservices.md`](./microservices.md)
- [`catalog/workers.md`](../catalog/workers.md)
- [`catalog/d1.md`](../catalog/d1.md)
- [`catalog/pages.md`](../catalog/pages.md)
- [`catalog/wrangler.md`](../catalog/wrangler.md)
