# Multi-tenant SaaS Architecture

A Cloudflare-first architecture for building SaaS products where multiple customers, companies, or workspaces share one application safely.

---

## Goal

Build a multi-tenant SaaS app where each tenant's data is isolated, permissions are enforced server-side, and operational complexity stays manageable.

This architecture is designed for:

- B2B SaaS products
- client dashboards
- agency portals
- CRM tools
- project management apps
- booking platforms
- AI tools with workspaces
- marketplace admin systems

---

## Recommended starting stack

| Need | Service |
| --- | --- |
| Frontend | Pages or Workers |
| Backend/API | Workers |
| Tenant data | D1 |
| Files/uploads | R2 |
| Config/cache | KV |
| Background jobs | Queues |
| Long workflows | Workflows |
| Internal admin | Access |
| Public protection | Turnstile |
| Product analytics | Analytics Engine |

Start with Workers, D1, R2, and application authentication. Add Access for internal admin and Queues when workflows grow.

---

## Core tenant model

Use a workspace or organization as the tenant boundary.

```text
user
  ↓
membership
  ↓
workspace
```

A user can belong to many workspaces. A workspace owns business data.

---

## Tenant isolation rule

Every tenant-owned table should include `workspace_id`.

```text
projects
orders
files
messages
settings
reports
```

Every query must filter by the active workspace.

```text
WHERE workspace_id = :active_workspace_id
```

Do not rely on frontend filtering.

---

## Suggested D1 tables

```text
users
workspaces
memberships
invitations
roles
permissions
workspace_settings
projects
files
notifications
billing_customers
billing_events
audit_logs
security_events
```

Minimum workspace fields:

```text
id
name
slug
owner_user_id
plan
status
created_at
updated_at
```

Minimum membership fields:

```text
id
workspace_id
user_id
role
status
created_at
updated_at
```

---

## Request authorization flow

Every protected request should follow this order:

```text
1. Load current user
2. Load active workspace
3. Confirm membership
4. Check role permission
5. Validate input
6. Apply workspace_id filter
7. Perform action
8. Write audit log if sensitive
```

This pattern prevents cross-tenant data leaks.

---

## Role model

Start with simple workspace roles:

```text
owner
admin
member
viewer
```

Use global roles only for platform staff.

```text
platform_admin
support
billing_admin
```

Do not mix platform roles and workspace roles casually.

---

## Workspace switching

A user may belong to more than one workspace.

```text
User logs in
  ↓
App lists available workspaces
  ↓
User selects active workspace
  ↓
All future queries use active workspace_id
```

Store active workspace in the session or request context. Always verify membership server-side.

---

## File storage model

Store tenant files in R2 and metadata in D1.

```text
R2:
workspaces/{workspace_id}/files/{file_id}.pdf

D1 files table:
id
workspace_id
owner_user_id
object_key
content_type
size
visibility
created_at
```

Private files must go through a Worker permission check before access.

---

## Billing model

Billing usually belongs to the workspace, not the individual user.

```text
workspace
  ↓
billing_customer
  ↓
billing_subscription
  ↓
plan/status updates
```

Important rules:

- verify billing webhooks server-side
- store billing events
- keep plan/status in D1
- avoid trusting frontend billing state
- log manual billing overrides

---

## Internal admin model

Protect internal admin tools with Cloudflare Access.

```text
Platform staff
  ↓
Cloudflare Access
  ↓
Internal admin dashboard
  ↓
Platform role check
  ↓
Audit log
```

Access controls entry. Application roles still control actions.

---

## API route plan

User routes:

```text
/api/me
/api/workspaces
/api/workspaces/:id
/api/memberships
/api/invitations
```

Tenant routes:

```text
/api/workspaces/:id/projects
/api/workspaces/:id/files
/api/workspaces/:id/settings
/api/workspaces/:id/notifications
```

Admin routes:

```text
/api/admin/workspaces
/api/admin/users
/api/admin/billing-events
/api/admin/audit-logs
```

Webhook routes:

```text
/api/webhooks/billing
/api/webhooks/integrations
```

---

## Caching strategy

Good cache targets:

- public plan config
- feature flags
- non-sensitive settings
- dashboard summary cache
- static lookup data

Do not cache carelessly:

- permissions
- billing status as source of truth
- private workspace records
- admin dashboards
- user-specific secrets

---

## Background jobs

Use Queues for:

- invitation emails
- billing webhook follow-up
- export generation
- file processing
- notification delivery
- usage report generation

Use Workflows for:

- onboarding sequences
- approval processes
- long-running imports
- workspace migration tasks

---

## Analytics

Use Analytics Engine for product events:

- workspace created
- invitation sent
- member added
- feature used
- export generated
- plan changed
- limit reached

Do not store sensitive tenant data in analytics events.

---

## Production checklist

Before launch:

- [ ] Every tenant-owned table has `workspace_id`
- [ ] Every protected query filters by active workspace
- [ ] Membership is checked server-side
- [ ] Role checks exist for write actions
- [ ] Internal admin is protected by Access
- [ ] Private files require permission checks
- [ ] Billing webhooks are verified
- [ ] Audit logs exist for sensitive actions
- [ ] Invitations expire and can be revoked
- [ ] Public endpoints are rate-limited
- [ ] Backup/export plan exists
- [ ] Rollback plan exists

---

## Common mistakes

- forgetting `workspace_id` on business tables
- trusting frontend workspace selection
- mixing platform admin and tenant roles
- caching private tenant data carelessly
- storing tenant files without ownership metadata
- skipping webhook verification
- letting support staff access data without audit logs
- adding complex permission systems before the simple role model works

---

## Related docs

- [`architectures/saas.md`](./saas.md)
- [`architectures/authentication-authorization.md`](./authentication-authorization.md)
- [`docs/d1-vs-kv-vs-r2.md`](../docs/d1-vs-kv-vs-r2.md)
- [`catalog/workers.md`](../catalog/workers.md)
- [`catalog/d1.md`](../catalog/d1.md)
- [`catalog/r2.md`](../catalog/r2.md)
- [`catalog/kv.md`](../catalog/kv.md)
- [`catalog/queues.md`](../catalog/queues.md)
- [`catalog/access.md`](../catalog/access.md)
