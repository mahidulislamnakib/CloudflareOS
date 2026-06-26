# Data Pipeline & Reporting Architecture

A Cloudflare-first reference for importing data, processing events, building reports, generating exports, and keeping operational data traceable.

## Goal

Build reporting and data workflows that are reliable, retry-safe, and separate from normal user requests.

Use this architecture for:

- business dashboards
- recurring reports
- imports from CSV or external systems
- analytics summaries
- invoice and sales exports
- audit-ready operational reporting
- scheduled data cleanup

## Starting stack

| Need | Service |
| --- | --- |
| Ingestion/API | Workers |
| Operational records | D1 |
| Raw uploads and exports | R2 |
| Async processing | Queues |
| Multi-step jobs | Workflows |
| Small config/cache | KV |
| Event analytics | Analytics Engine |
| Internal operations | Access |

Start with Workers, D1, R2, and Queues. Add Workflows when reports or imports involve multiple steps, waiting periods, or approvals.

## Core model

```text
Source data
  ↓
Worker validates request
  ↓
Raw file or event stored
  ↓
Queue receives processing job
  ↓
Data is transformed and recorded
  ↓
Report or export generated
  ↓
Authorized user downloads result
```

## Suggested D1 tables

```text
imports
import_rows
import_errors
report_definitions
report_runs
exports
scheduled_jobs
metrics_snapshots
audit_logs
settings
```

Minimum import fields:

```text
id
workspace_id
source_type
file_object_key
status
submitted_by_user_id
started_at
completed_at
created_at
```

Minimum report run fields:

```text
id
workspace_id
report_definition_id
status
parameters
result_object_key
started_at
completed_at
created_at
```

## Import flow

```text
User uploads CSV or file
  ↓
R2 stores raw file
  ↓
D1 import record created
  ↓
Queue processes file in background
  ↓
Rows are validated and transformed
  ↓
Errors are saved separately
  ↓
Import status is updated
```

Do not parse large files inside a normal browser request and make the user wait.

## Import safety rules

- Validate file type and size before accepting upload.
- Treat every row as untrusted input.
- Keep raw upload separate from transformed records.
- Store row-level validation errors.
- Use idempotency keys for repeated uploads.
- Support dry-run or preview for high-impact imports.
- Never overwrite newer records without explicit rules.

## Reporting flow

```text
User requests report
  ↓
Worker checks permissions
  ↓
Report run created
  ↓
Queue or Workflow generates report
  ↓
CSV/PDF stored in R2
  ↓
User receives authorized download link
```

Use R2 for generated report files. Store report metadata and permissions in D1.

## Scheduled reporting

Use scheduled jobs for:

- daily sales summary
- weekly lead report
- monthly finance export
- low-stock summary
- inactive customer report
- audit-log export

Keep schedule definitions in D1 or configuration, then make execution retry-safe.

## Metrics snapshot model

For expensive dashboards, compute snapshots asynchronously.

```text
Operational records
  ↓
Queue or scheduled job
  ↓
Daily/hourly metrics snapshot
  ↓
Dashboard reads precomputed summary
```

This reduces repeated heavy queries for every dashboard page load.

## Export permissions

Before an export starts:

```text
Authenticate user
  ↓
Resolve workspace
  ↓
Check role and data scope
  ↓
Create export request
  ↓
Generate asynchronously
  ↓
Serve only to authorized requester
```

Private exports must not be exposed using permanent public URLs.

## API route plan

```text
/api/imports
/api/imports/:id
/api/imports/:id/errors
/api/reports
/api/reports/:id/runs
/api/exports
/api/admin/report-definitions
/api/admin/scheduled-jobs
/api/admin/audit-logs
```

## Queue and workflow use

Use Queues for:

- import processing
- report generation
- export delivery
- metric refresh
- retryable sync jobs
- data validation follow-up

Use Workflows for:

- long-running imports
- multi-stage data approval
- scheduled reporting sequences
- bulk migration or backfill jobs

## Observability

Track:

- import accepted
- import failed
- rows processed
- rows rejected
- report run started
- export completed
- job retry count
- queue delay

Do not log sensitive rows or full private exports in analytics events.

## Security rules

- Every import and report uses workspace isolation.
- Uploads have file-type and size limits.
- Generated exports require permission checks.
- High-impact imports are audit-logged.
- Admin schedule changes are audit-logged.
- Background jobs are idempotent.
- Secrets for source integrations are stored securely.

## Production checklist

- [ ] Imports run asynchronously
- [ ] Raw files are stored separately from transformed records
- [ ] Row-level errors are available
- [ ] Repeated jobs are idempotent
- [ ] Reports are generated asynchronously when expensive
- [ ] Private exports require permission checks
- [ ] Dashboard snapshots are used where needed
- [ ] Queue failures are visible
- [ ] High-impact operations are audit-logged
- [ ] Backup and rollback plans exist

## Common mistakes

- processing large imports inside a request
- allowing unlimited export size
- overwriting data without a preview or audit trail
- exposing private reports with permanent URLs
- running expensive reports on every dashboard request
- retrying imports without idempotency
- mixing raw uploaded files with normalized records

## Related docs

- [`architectures/observability-operations.md`](./observability-operations.md)
- [`architectures/api-platform.md`](./api-platform.md)
- [`architectures/microservices.md`](./microservices.md)
- [`catalog/d1.md`](../catalog/d1.md)
- [`catalog/r2.md`](../catalog/r2.md)
- [`catalog/queues.md`](../catalog/queues.md)
- [`catalog/workflows.md`](../catalog/workflows.md)
- [`catalog/analytics-engine.md`](../catalog/analytics-engine.md)
- [`catalog/access.md`](../catalog/access.md)
