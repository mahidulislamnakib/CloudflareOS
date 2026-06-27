# Data Modeling & D1 Design Playbook

A practical guide to designing durable application data for Cloudflare-first products using D1 or another relational SQL database.

## Goal

Create a data model that is:

- simple enough to build and operate as a small team
- safe around users, roles, tenants, private files, and payments
- clear for AI coding agents and future developers
- efficient for the queries that power real screens
- compatible with safe migrations and product changes
- auditable when high-impact actions happen

A schema is not only a list of tables. It is a set of product rules made durable.

---

## Start with the critical journey

Model the most valuable product action first.

```text
customer creates booking → staff reviews → provider confirms → customer receives update
member joins workspace → creates project → invites teammate → work is tracked
visitor submits application → staff verifies → applicant receives result
buyer completes order → payment is confirmed → fulfillment begins
```

For each journey, write down:

```text
who performs the action
which record starts the flow
which records change
who may read each record
which status changes are allowed
which actions need an audit event
which files or notifications are attached
```

Do not begin by creating every table you can imagine. Begin with the smallest set of records needed for one complete, valuable flow.

---

## Model product concepts, not screens

A screen can change quickly. A product concept should remain stable.

Prefer durable concepts:

```text
users
workspaces
memberships
projects
orders
bookings
applications
documents
payments
notifications
audit_events
```

Avoid table names based only on a current UI section:

```text
dashboard_cards
home_data
form_page_2
admin_table_rows
```

A useful rule:

```text
If the product would still need this data after a complete UI redesign,
it is probably a real model.
```

---

## Smallest useful schema

Start with core records and add supporting records only when they protect a real product rule.

Example for a workspace product:

```text
users
workspaces
workspace_members
projects
project_members
activity_events
```

Example for a marketplace:

```text
users
provider_profiles
client_profiles
jobs
job_applications
orders
payments
disputes
files
audit_events
```

Example for a content product:

```text
users
articles
categories
tags
article_tags
media_assets
article_revisions
audit_events
```

Before adding a new table, ask:

- Does this need its own lifecycle?
- Does it need its own permissions?
- Will it be queried independently?
- Does it need history, ownership, or files?
- Would a simple column on an existing model be enough for version 1?

---

## Ownership, tenancy, and access boundaries

The most important data-modeling rule for multi-user products is clear ownership.

Every sensitive record should have an obvious answer to:

```text
Who owns this?
Which tenant or workspace contains it?
Who may read it?
Who may change it?
Who may delete, archive, or export it?
```

### Single-user ownership

For a user-owned record:

```text
records
  id
  owner_user_id
  ...
```

Use the authenticated user on the server to scope reads and writes. Do not accept `owner_user_id` from the browser as proof of ownership.

### Workspace or tenant ownership

For a team, agency, vendor, school, clinic, or organization product:

```text
workspaces
  id
  name

workspace_members
  workspace_id
  user_id
  role

projects
  id
  workspace_id
  created_by_user_id
  ...
```

The safe query boundary is:

```text
record id
  + authenticated identity
  + workspace membership
  + permitted action
```

Do not rely on a `workspaceId` passed by the frontend without checking that the caller belongs to it.

### Cross-tenant test cases

Test these explicitly:

- direct record URL from another tenant
- search result from another tenant
- export query with another tenant ID
- private file attached to another tenant record
- background job with missing tenant context
- admin action performed by a normal member
- shared or cached response returning the wrong tenant data

---

## IDs and public references

Use identifiers intentionally.

### Internal versus public IDs

A record may need:

```text
internal primary identifier
public identifier used in URLs or API responses
human-readable reference for support or invoices
```

Example:

```text
orders
  id                 internal record key
  public_id          safe external reference
  order_number       human-friendly support reference
```

### ID rules

- Do not assume an ID is authorization.
- Do not expose sequential references when they create an avoidable enumeration risk.
- Keep public references stable once shared externally.
- Do not reuse an ID after deletion or archival.
- Keep human-readable references separate from database structure when possible.

---

## Columns and data types

Choose fields based on how data is created, changed, searched, reported, and retained.

### Common column groups

```text
identity
ownership and tenant scope
business data
status and lifecycle
created/updated timestamps
audit and actor references
archival/deletion markers
```

Example:

```text
applications
  id
  workspace_id
  applicant_user_id
  status
  submitted_at
  reviewed_at
  reviewed_by_user_id
  created_at
  updated_at
  archived_at
```

### Field design rules

- Use required fields only when the product cannot function without them.
- Add defaults only when the default is safe and meaningful.
- Do not store the same fact in several columns unless there is a deliberate synchronization rule.
- Keep money, time, status, permissions, and ownership fields explicit.
- Store large files in object storage; keep metadata and access rules in the database.
- Store derived values only when they provide a real query or reporting benefit.

---

## Statuses and state transitions

A `status` column is a product workflow. Treat it as one.

Example:

```text
draft
submitted
under_review
approved
rejected
cancelled
archived
```

Define allowed transitions before implementation:

```text
draft → submitted
submitted → under_review
under_review → approved | rejected
approved → archived
rejected → draft only when resubmission is allowed
```

### Status rules

- Give each status a clear user-visible meaning.
- Define who may move a record into each state.
- Prevent impossible transitions server-side.
- Record the actor and time for high-impact transitions.
- Keep old status values compatible during a transition period.
- Do not use a vague catch-all `active` status for unrelated states.

For complex workflows, a separate history table can be clearer than overwriting the only evidence of change.

```text
application_status_events
  application_id
  from_status
  to_status
  actor_user_id
  note
  created_at
```

---

## Relationships and join tables

Model relationships explicitly.

### One-to-many

```text
workspace → projects
project → tasks
user → notifications
order → order_items
```

The child record usually holds the parent reference.

### Many-to-many

Use a join table when both sides can have many relationships.

```text
users ↔ workspaces
articles ↔ tags
projects ↔ members
products ↔ collections
```

Example:

```text
project_members
  project_id
  user_id
  role
  added_at
```

A join table can carry meaningful metadata such as role, permission, sort order, assigned date, or approval state.

### Avoid overloaded relationships

Do not use a generic `entity_type` and `entity_id` pattern for every relationship from day one. It often makes validation, constraints, queries, and access checks harder. Use it only when the flexibility is genuinely needed and well controlled.

---

## Permissions and roles

Permissions should be modeled around actions, not only labels.

A role is a shorthand for a set of allowed actions:

```text
viewer: read
editor: read + create + update selected records
manager: approve, assign, export
admin: manage members and settings
owner: manage billing and destructive operations
```

### Role data patterns

For small products, a role can live on membership:

```text
workspace_members
  workspace_id
  user_id
  role
```

For more granular products, model permissions separately only when there is a real business need.

### Permission rules

- Enforce actions server-side.
- Do not trust a role stored in browser state.
- Keep sensitive roles rare and visible in audit history.
- Avoid using a single `isAdmin` flag for complex tenant products.
- Check permissions for file downloads, exports, background jobs, and webhooks—not only page routes.

---

## Files and R2 metadata

Object storage holds bytes. The database should hold product meaning.

A file record may include:

```text
id
workspace_id or owner_user_id
parent record type and reference
object key
original filename
content type
size
purpose
visibility
processing status
uploaded_by_user_id
created_at
removed_at
```

### File rules

- Authorize file access through the parent record or file ownership.
- Do not treat an object key as a permission check.
- Keep original upload, preview, derived file, and temporary export purposes separate.
- Define whether a file is public, private, tenant-visible, or time-limited.
- Record the final file metadata only after the upload succeeds.
- Clean up failed, abandoned, or expired temporary files on a defined schedule.

---

## Audit history and event records

Use audit records for actions that matter to users, staff, security, finance, content visibility, or compliance.

Good audit candidates:

```text
role changes
permission changes
approval/rejection
payment status changes
refunds or payouts
publication/unpublication
private document access
exports
deletions and restorations
critical configuration changes
```

Example:

```text
audit_events
  id
  workspace_id
  actor_user_id
  event_type
  target_type
  target_id
  summary
  created_at
```

Do not put secrets, passwords, full payment data, or unnecessary sensitive content in audit fields.

For detailed historical data, store a safe summary and a limited structured change set rather than entire private records.

---

## Soft deletion, archival, and retention

Deleting a row is not always the right product action.

### Use archive or soft deletion when

- staff may need to restore a record
- records affect reports or financial history
- other records still reference it
- legal, support, or audit history matters
- users need a reversible removal action

Example fields:

```text
archived_at
archived_by_user_id
deleted_at
retention_expires_at
```

### Rules

- Archived records should be excluded from normal queries deliberately.
- Deletion should not silently break linked records.
- Define who can restore a record and for how long.
- Define a retention policy for private uploads, logs, exports, and stale drafts.
- Treat permanent deletion as a separate, high-risk workflow with confirmation and audit history.

---

## Indexes and query-first design

Indexes should serve the queries that power real screens and jobs.

Before adding an index, write the expected query:

```text
List pending applications for workspace, newest first
Find active orders for a customer
Load project tasks by status and due date
Find unprocessed webhook events
```

Then model the common filter, scope, and sort shape.

### Common query patterns

```text
workspace_id + created_at
workspace_id + status + updated_at
owner_user_id + status
parent_id + sort_order
provider_event_id
public_id
```

### Index rules

- Index fields used repeatedly for scoped filtering and sorting.
- Keep tenant/workspace scope near the front of common access patterns.
- Avoid adding indexes without a clear query need.
- Review indexes when adding a new busy admin list, search filter, dashboard metric, or background job.
- Validate that pagination order is stable.

Do not use an index as a substitute for pagination, permission checks, or a clear query contract.

---

## Query patterns for safe screens

A page should not need to load an entire database table.

### List screen pattern

```text
Authenticate caller
  ↓
Resolve allowed tenant/workspace
  ↓
Validate filters and cursor
  ↓
Query scoped summary fields only
  ↓
Return bounded list and continuation metadata
```

### Detail screen pattern

```text
Authenticate caller
  ↓
Query one record scoped to tenant/owner
  ↓
Check action permission
  ↓
Load only needed related summaries
  ↓
Return permitted detail
```

### Dashboard pattern

```text
Load small summary metrics
  ↓
Load paginated action queue
  ↓
Defer deep reports or exports to a background task
```

Avoid N+1 query behavior, unbounded related-record loads, and recalculating expensive reports on every dashboard view.

---

## Derived data and reporting

Some values are derived from other records:

```text
order total
unread count
profile completion
monthly revenue
application status summary
search index text
```

### Default approach

Compute from source records when the query is small and infrequent.

### Add stored derived data when

- the calculation is expensive
- it is needed on a busy screen
- it supports a real report or filter
- the update rule is clear and testable

When storing derived data, define:

```text
source of truth
update trigger
failure/retry behavior
reconciliation method
owner of correction workflow
```

Do not create multiple conflicting “truth” fields without a recovery plan.

---

## Background jobs and data integrity

A queue or background job must preserve enough context to operate safely.

A job payload should generally identify:

```text
event type
safe record ID
tenant/workspace context when needed
request or correlation ID
attempt or retry metadata
```

Before the job changes data:

```text
load current record
  ↓
confirm tenant and permission context
  ↓
confirm operation is still valid
  ↓
check idempotency or prior completion
  ↓
perform action
  ↓
record outcome
```

Do not rely on stale job payload values for ownership, status, or permissions when the database can be checked again.

---

## Migration strategy

Prefer additive, compatible changes.

### Safer sequence

```text
Add new optional column or table
  ↓
Deploy code that supports old and new shape
  ↓
Backfill data in controlled steps if needed
  ↓
Verify reads and writes
  ↓
Make new path primary
  ↓
Remove old behavior only after evidence
```

### Higher-risk changes

- dropping a table or column
- renaming a field used by many callers
- tightening a nullable field without a backfill
- changing ownership or tenant scope
- changing status semantics
- changing money or time storage behavior
- changing a primary relationship

### Migration rules

- Keep migrations ordered and reviewable.
- Do not edit applied production migration history.
- Test on representative non-production data where possible.
- Include a rollback or containment plan.
- Separate schema change, code rollout, and backfill when risk is high.
- Confirm existing critical records remain readable after migration.

---

## Data quality checks

Data quality problems become product and support problems.

Define checks for:

```text
missing ownership
orphaned child records
invalid status
impossible timestamps
duplicate provider event
missing file metadata
cross-tenant reference
unfinished background job
failed payment reconciliation
```

For high-impact domains, create a repair path that is deliberate, logged, and permission-protected.

---

## Testing workflow

Test the model through product actions, not only SQL syntax.

### Minimum tests for a sensitive record

- create with valid input
- reject invalid input
- allowed user can read and update
- unauthorized user cannot read or update
- another tenant cannot access it
- status transition rules are enforced
- archive/delete behavior is correct
- linked file access is authorized
- repeated high-risk request does not duplicate outcome
- migration preserves existing records

### Migration test flow

```text
Start with representative existing data
  ↓
Apply migration
  ↓
Run key read and write flows
  ↓
Check indexes and scoped queries
  ↓
Verify data integrity checks
  ↓
Rehearse rollback or containment path
```

---

## Data model review checklist

Before approving a schema or model change:

- [ ] Every sensitive record has clear ownership or tenant scope.
- [ ] Server-side queries enforce ownership and permission boundaries.
- [ ] Core workflows have explicit statuses and allowed transitions.
- [ ] Public IDs are not treated as authorization.
- [ ] Client-controlled fields are intentionally allowlisted.
- [ ] Files have durable metadata, purpose, visibility, and owner rules.
- [ ] High-impact actions have audit history.
- [ ] Lists are designed for bounded, scoped, paginated queries.
- [ ] Common access patterns have appropriate indexes.
- [ ] Derived data has a source of truth and reconciliation plan.
- [ ] Background jobs re-check current state and prevent duplicate processing.
- [ ] Migrations are additive or have a clear recovery plan.
- [ ] Archive, deletion, and retention behavior are defined.
- [ ] Cross-tenant access tests exist for critical records.

---

## Common mistakes

- designing tables from the current UI rather than product concepts
- accepting owner, tenant, role, or status fields from the client without server control
- querying a record by ID without tenant or ownership scope
- using one vague status for an entire complex workflow
- exposing sequential IDs as a substitute for access control
- storing large uploads directly in relational records
- creating indexes without a real query pattern
- returning all records with no pagination
- calculating expensive reports on every page load
- using queue payloads as the sole source of truth
- editing production migration history
- deleting records without understanding linked data and audit needs
- treating an audit log as a dump of private data

---

## Related guides

- [`../catalog/d1.md`](../catalog/d1.md)
- [`../docs/d1-vs-kv-vs-r2.md`](../docs/d1-vs-kv-vs-r2.md)
- [`./api-design-contracts.md`](./api-design-contracts.md)
- [`./testing-strategy.md`](./testing-strategy.md)
- [`../prompts/database-migration-readiness.md`](../prompts/database-migration-readiness.md)
- [`../architectures/multi-tenant-saas.md`](../architectures/multi-tenant-saas.md)
- [`../architectures/security-threat-modeling.md`](../architectures/security-threat-modeling.md)
- [`../architectures/data-pipeline-reporting.md`](../architectures/data-pipeline-reporting.md)
- [`../docs/production-readiness-checklist.md`](../docs/production-readiness-checklist.md)
