# CRM Architecture

A Cloudflare-first reference for managing contacts, leads, deals, tasks, notes, and follow-up work.

## Starting stack

| Need | Service |
| --- | --- |
| CRM app | Pages or Workers |
| API | Workers |
| Records | D1 |
| Attachments | R2 |
| Cache/config | KV |
| Notifications | Queues |
| Internal admin | Access |
| Public forms | Turnstile |
| Product events | Analytics Engine |

## Core model

```text
Workspace
  ↓
Contacts and companies
  ↓
Leads and deals
  ↓
Tasks, notes, and activities
```

Every tenant-owned record must include `workspace_id`.

## Suggested D1 tables

```text
users
workspaces
memberships
contacts
companies
leads
pipelines
pipeline_stages
deals
tasks
notes
activities
attachments
assignments
notifications
audit_logs
settings
```

## Core flow

```text
A public form creates a lead
  ↓
Lead is assigned to a team member
  ↓
Follow-up task is created
  ↓
Lead moves through stages
  ↓
Deal is won, lost, or paused
```

## Pipeline model

```text
new
contacted
qualified
proposal_sent
negotiation
won
lost
```

Track stage changes and ownership changes in an activity timeline.

## File model

Store attachments in R2 and metadata in D1.

```text
R2:
workspaces/{workspace_id}/crm/{lead_id}/{file_id}.pdf

D1 attachments:
id
workspace_id
lead_id
object_key
content_type
size
created_at
```

Private attachments require a Worker permission check before download.

## Public form flow

```text
Visitor submits form
  ↓
Turnstile verifies request
  ↓
Worker validates input
  ↓
Lead stored in D1
  ↓
Queue sends internal notification
```

## Security rules

- Every request loads the user and active workspace.
- Every query filters by `workspace_id`.
- Every write checks role and ownership.
- Admin routes are protected with Access.
- Sensitive changes create audit logs.
- Public forms are rate-limited and protected.

## Background jobs

Use Queues for task reminders, assignment notifications, follow-up emails, exports, and attachment processing.

Use Workflows for long onboarding or multi-step follow-up sequences.

## Production checklist

- [ ] Tenant isolation is enforced server-side
- [ ] Assignment history is stored
- [ ] Stage changes are logged
- [ ] Public forms use Turnstile
- [ ] Private files require permission checks
- [ ] Admin routes are protected
- [ ] Sensitive exports are restricted
- [ ] Backup and rollback plans exist

## Common mistakes

- trusting frontend workspace filters
- missing ownership history
- storing files in D1
- exposing contact data broadly
- skipping audit logs
- using public forms without abuse protection

## Related docs

- [`architectures/multi-tenant-saas.md`](./multi-tenant-saas.md)
- [`architectures/authentication-authorization.md`](./authentication-authorization.md)
- [`catalog/d1.md`](../catalog/d1.md)
- [`catalog/r2.md`](../catalog/r2.md)
- [`catalog/queues.md`](../catalog/queues.md)
- [`catalog/turnstile.md`](../catalog/turnstile.md)
- [`catalog/access.md`](../catalog/access.md)
