# Authentication & Authorization Architecture

A Cloudflare-first architecture for protecting users, admin dashboards, APIs, files, and multi-tenant application data.

---

## Goal

Build a safe authentication and authorization foundation that works for real applications without adding unnecessary complexity too early.

This architecture is designed for:

- SaaS apps
- admin dashboards
- marketplaces
- CMS platforms
- travel platforms
- AI apps
- internal tools
- customer portals

---

## Recommended starting stack

| Need | Service |
| --- | --- |
| App/API logic | Workers |
| User/session records | D1 |
| Private files | R2 |
| Admin protection | Access |
| Public form protection | Turnstile |
| Rate limiting | WAF / Rate Limiting |
| Background security jobs | Queues |
| Audit events | D1 / Analytics Engine |

Use Cloudflare Access for internal/admin protection. Use application authentication for customer-facing accounts.

---

## Core distinction

There are two different layers:

```text
Cloudflare Access
  = protects who can reach an internal app

Application auth
  = controls what a logged-in user can do inside the app
```

Do not treat Access as a full replacement for app permissions when users need different roles, records, or business access.

---

## Basic auth flow

```text
User submits login
  ↓
Worker validates credentials or identity provider response
  ↓
Session is created
  ↓
Session stored or verified server-side
  ↓
Secure cookie is returned
  ↓
Future requests check session
```

For most web apps, secure HTTP-only cookies are easier to protect than exposing tokens to frontend JavaScript.

---

## Authorization flow

```text
Request reaches API
  ↓
Load current user
  ↓
Check authentication
  ↓
Check role
  ↓
Check resource ownership or tenant access
  ↓
Allow or deny action
  ↓
Write audit log when needed
```

Authentication answers: **who is this?**

Authorization answers: **what can they do?**

---

## Suggested D1 tables

```text
users
sessions
roles
permissions
user_roles
workspaces
memberships
password_resets
email_verifications
mfa_factors
audit_logs
security_events
```

Minimum user fields:

```text
id
email
name
status
email_verified_at
created_at
updated_at
```

Minimum session fields:

```text
id
user_id
session_hash
expires_at
created_at
last_seen_at
revoked_at
```

---

## Role model

Start simple.

```text
super_admin
admin
editor
member
viewer
```

For SaaS and multi-tenant apps, roles often belong to a workspace membership, not only the global user.

```text
user
  ↓
membership
  ↓
workspace role
```

---

## Multi-tenant access rule

Every tenant-owned record should include a tenant or workspace ID.

```text
workspace_id on:
projects
orders
files
messages
settings
```

Every query must enforce tenant access.

```text
WHERE workspace_id = current_user_workspace_id
```

Do not rely on frontend filtering.

---

## Protected API pattern

Each protected route should follow this order:

```text
1. Parse request
2. Load session
3. Check user status
4. Check role or membership
5. Validate input
6. Check resource ownership
7. Perform action
8. Write audit log if sensitive
9. Return safe response
```

---

## Admin protection

For internal admin systems:

```text
Cloudflare Access
  ↓
Admin dashboard
  ↓
Application admin role check
  ↓
Audit log
```

Access keeps outsiders away from the admin app. App roles still decide what an admin can do.

---

## Public form protection

Use Turnstile for public forms such as:

- signup
- login
- password reset
- contact form
- quote request
- lead submission
- file upload request

Turnstile is not authentication. It only helps reduce automated abuse.

---

## Private file access

Store files in R2 and metadata in D1.

```text
Request private file
  ↓
Worker checks session
  ↓
Worker checks ownership or role
  ↓
Worker returns file or signed access
```

Never expose private R2 object keys directly without permission checks.

---

## Password reset flow

```text
User requests reset
  ↓
Turnstile verifies form
  ↓
Worker creates short-lived reset token
  ↓
Token hash stored in D1
  ↓
Email sent through background job
  ↓
User submits new password
  ↓
Token verified and revoked
```

Store token hashes, not raw reset tokens.

---

## Email verification flow

```text
User signs up
  ↓
Verification token created
  ↓
Token hash stored in D1
  ↓
Email sent
  ↓
User verifies
  ↓
email_verified_at is set
```

Restrict sensitive actions until email is verified when the product requires it.

---

## Audit logging

Audit sensitive actions.

Good audit events:

- login
- logout
- password changed
- role changed
- admin action
- billing change
- file access denied
- tenant membership changed
- data export requested

Minimum audit fields:

```text
id
actor_user_id
action
resource_type
resource_id
metadata
created_at
```

---

## Security rules

Important rules:

- store secrets in Worker secrets
- use HTTP-only secure cookies
- check authorization on the server
- validate every request
- protect admin routes with Access
- rate limit public auth endpoints
- log sensitive admin actions
- revoke sessions on password change
- never trust frontend roles

---

## Production checklist

Before launch:

- [ ] Login flow is server-validated
- [ ] Session cookies are secure and HTTP-only
- [ ] Public auth endpoints are rate-limited
- [ ] Turnstile protects high-abuse forms
- [ ] Admin routes are protected by Access
- [ ] App-level role checks exist
- [ ] Tenant-owned queries enforce tenant access
- [ ] Private files require permission checks
- [ ] Password reset tokens are hashed
- [ ] Email verification flow exists if required
- [ ] Audit logs exist for sensitive actions
- [ ] Secrets are not committed
- [ ] Session revocation is supported
- [ ] Rollback plan exists

---

## Common mistakes

- confusing authentication with authorization
- trusting frontend role checks
- exposing tokens to browser JavaScript unnecessarily
- skipping tenant filters in queries
- using Access as the only app permission system
- exposing private R2 files directly
- storing raw password reset tokens
- not rate limiting login and reset endpoints
- skipping audit logs for admin actions

---

## Related docs

- [`catalog/workers.md`](../catalog/workers.md)
- [`catalog/d1.md`](../catalog/d1.md)
- [`catalog/r2.md`](../catalog/r2.md)
- [`catalog/access.md`](../catalog/access.md)
- [`catalog/turnstile.md`](../catalog/turnstile.md)
- [`catalog/queues.md`](../catalog/queues.md)
- [`architectures/saas.md`](./saas.md)
- [`architectures/marketplace.md`](./marketplace.md)
