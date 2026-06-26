# SaaS Architecture

A Cloudflare-first architecture for building a software-as-a-service application with accounts, workspaces, roles, billing hooks, file storage, background jobs, and admin controls.

---

## Goal

Build a SaaS app that starts simple but has a safe path toward production.

This architecture is designed for:

- subscription web apps
- internal tools sold to clients
- multi-tenant dashboards
- lightweight CRM products
- AI tools with user accounts
- marketplace admin systems
- booking or workflow platforms

---

## Recommended starting stack

| Need | Service |
| --- | --- |
| Frontend | Pages or Workers |
| Backend/API | Workers |
| App database | D1 |
| File storage | R2 |
| Small config/cache | KV |
| Background jobs | Queues |
| Admin/internal protection | Access |
| Public form protection | Turnstile |
| Product analytics | Analytics Engine |

Start with Workers, D1, and R2. Add Queues, KV, Access, and Analytics Engine only when the product needs them.

---

## Architecture overview

```text
Users
  ↓
Pages or Workers frontend
  ↓
Workers API
  ├── D1 app records
  ├── R2 uploads and exports
  ├── KV config/cache
  ├── Queues background jobs
  └── Analytics Engine events

Admins
  ↓
Cloudflare Access
  ↓
Admin dashboard
  ↓
Workers API
```

---

## Tenant model

Most SaaS apps need a tenant model.

Use this simple structure first:

```text
workspace
  ↓
memberships
  ↓
users
```

A user can belong to one or more workspaces. A workspace owns business records.

Example:

```text
workspace_id on:
projects
tasks
orders
files
settings
```

---

## Suggested D1 tables

Start with these tables:

```text
users
workspaces
memberships
roles
invitations
projects
files
settings
audit_logs
billing_customers
billing_events
notifications
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

## Auth and access model

Use app-level authentication for customers and Cloudflare Access for internal/admin tools.

```text
Customer user
  ↓
App login
  ↓
Workspace membership check
  ↓
Role permission check
  ↓
Action allowed or denied
```

Admin tools can be protected separately:

```text
Admin user
  ↓
Cloudflare Access
  ↓
Admin dashboard
  ↓
App-level admin role check
```

---

## Role model

Start with simple roles:

```text
owner
admin
member
viewer
```

Avoid complex permissions too early. Add granular permissions only when real customers need them.

---

## File storage model

Store uploaded files in R2 and metadata in D1.

```text
R2:
workspaces/{workspace_id}/uploads/{file_id}.pdf

D1 files table:
id
workspace_id
owner_user_id
object_key
content_type
size
status
created_at
```

Never store file bodies in D1.

---

## Background jobs

Use Queues for slow or retryable work.

Good queue jobs:

- send invitation email
- process uploaded file
- send notification
- sync billing webhook
- generate export
- update analytics
- run AI task

---

## Billing integration

Keep billing state separate from application permissions.

Suggested pattern:

```text
Payment provider webhook
  ↓
Worker verifies event
  ↓
Store event in D1
  ↓
Queue billing sync job
  ↓
Update workspace plan/status
```

Do not trust frontend billing changes. Use verified server-side events.

---

## API route plan

Public/app routes:

```text
/api/auth/*
/api/workspaces
/api/workspaces/:id
/api/members
/api/invitations
/api/files
/api/settings
```

Admin routes:

```text
/api/admin/users
/api/admin/workspaces
/api/admin/audit-logs
/api/admin/billing-events
```

Webhook routes:

```text
/api/webhooks/billing
/api/webhooks/integrations
```

---

## Caching strategy

Use caching carefully.

Good KV/cache targets:

- public config
- feature flags
- static plan information
- dashboard summary cache
- non-sensitive lookup data

Do not cache:

- private user data without care
- permissions
- billing status as the only source of truth
- admin-only responses
- secrets

---

## Security model

Important rules:

- every business record should include `workspace_id`
- every query should enforce workspace access
- every write action should check role permissions
- every webhook should be verified server-side
- every file should have ownership metadata
- every admin action should be audit-logged

---

## Analytics

Use Analytics Engine for product events such as:

- signup
- workspace created
- invitation accepted
- feature used
- file uploaded
- export generated
- plan upgraded

Do not store sensitive personal data in analytics events.

---

## Deployment workflow

```text
1. Create app project
2. Create D1 database
3. Create R2 bucket
4. Configure bindings
5. Add secrets
6. Create auth flow
7. Add workspace model
8. Add role checks
9. Add file upload flow
10. Add billing webhook handling
11. Test tenant isolation
12. Deploy preview
13. Deploy production
```

---

## Production checklist

Before launch:

- [ ] Workspace access is enforced on every query
- [ ] Role checks exist for write actions
- [ ] Admin routes are protected
- [ ] Webhooks are verified server-side
- [ ] R2 files have metadata in D1
- [ ] Upload size and type are limited
- [ ] Billing events are stored
- [ ] Audit logs exist for admin actions
- [ ] D1 migrations are tested
- [ ] Secrets are not committed
- [ ] Rate limits exist for public endpoints
- [ ] Backup/export plan exists
- [ ] Rollback plan exists

---

## Common mistakes

- building multi-tenant complexity too early
- forgetting `workspace_id` filters
- trusting frontend role checks
- storing files in D1
- handling billing only in the browser
- skipping webhook verification
- caching permissions carelessly
- adding too many roles before product-market fit

---

## Related docs

- [`docs/d1-vs-kv-vs-r2.md`](../docs/d1-vs-kv-vs-r2.md)
- [`catalog/workers.md`](../catalog/workers.md)
- [`catalog/d1.md`](../catalog/d1.md)
- [`catalog/r2.md`](../catalog/r2.md)
- [`catalog/kv.md`](../catalog/kv.md)
- [`catalog/queues.md`](../catalog/queues.md)
- [`catalog/access.md`](../catalog/access.md)
- [`catalog/analytics-engine.md`](../catalog/analytics-engine.md)
