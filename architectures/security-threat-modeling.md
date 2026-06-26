# Security & Threat Modeling Architecture

A Cloudflare-first reference for identifying risks, protecting identities, reducing abuse, securing data, and preparing a practical response to security incidents.

## Goal

Build security into product design before the application grows difficult to change.

This guide focuses on common web-app risks:

- account takeover
- unauthorized data access
- tenant data leaks
- abusive traffic
- leaked secrets
- unsafe file uploads
- webhook forgery
- privilege misuse
- insecure admin tools
- accidental data exposure

## Start with assets and boundaries

List what must be protected.

```text
user accounts
sessions
private documents
customer records
payments and payout state
admin settings
API keys
webhooks
production secrets
```

Then list where trust changes.

```text
browser → Worker
public form → API
Worker → database
Worker → R2 file
external provider → webhook endpoint
staff → admin dashboard
service → service
```

A trust boundary is where data must be validated, authenticated, authorized, or logged.

## Recommended Cloudflare-first controls

| Risk area | Useful control |
| --- | --- |
| Internal tool access | Access |
| Bot and form abuse | Turnstile |
| Application logic | Workers |
| Sensitive records | D1 with server-side access checks |
| Private file access | R2 behind Worker checks |
| Async work isolation | Queues |
| Ordered coordination | Durable Objects when needed |
| Security events | Audit logs and Analytics Engine |
| Secret storage | Worker secrets |

## Threat-model workflow

Use a small repeatable process for each major feature.

```text
Feature
  ↓
What data does it handle?
  ↓
Who can call it?
  ↓
What can go wrong?
  ↓
What controls reduce risk?
  ↓
How will failures be detected?
  ↓
How will access be revoked or recovered?
```

## Identity and session controls

Important rules:

- authenticate on the server
- use secure HTTP-only cookies for browser sessions when appropriate
- expire and revoke sessions
- rate-limit login and password-reset endpoints
- require server-side role checks
- never trust role claims from the frontend alone
- use separate staff/admin access controls

See the authentication blueprint for full session and role design.

## Authorization controls

Every sensitive request should follow:

```text
Identify caller
  ↓
Check authentication
  ↓
Check role or scope
  ↓
Check workspace/tenant access
  ↓
Check resource ownership
  ↓
Perform action
  ↓
Write audit record when sensitive
```

Do not rely on hidden UI buttons as authorization.

## Tenant isolation

For multi-tenant apps, every tenant-owned query must use the active tenant boundary.

```text
WHERE workspace_id = :authorized_workspace_id
```

Check membership before resolving the workspace. Never accept a client-provided tenant ID without verifying access.

## Public endpoint protection

Use layered controls for public forms and APIs.

```text
Turnstile
  ↓
Rate limit
  ↓
Input validation
  ↓
Abuse logging
  ↓
Business rule checks
```

Apply lower limits to high-risk endpoints such as signup, login, password reset, upload, checkout, and lead forms.

## File upload protection

For uploads:

- enforce file size limits
- allow only necessary content types
- generate object keys server-side
- store metadata in D1
- scan or review files when the product requires it
- keep private uploads private by default
- check permission again before download

Never trust a filename or MIME type supplied by the browser as the only validation.

## Secrets management

Use Worker secrets for:

- signing secrets
- provider credentials
- webhook secrets
- encryption keys
- API credentials

Rules:

- do not commit secrets
- separate development and production values
- rotate after exposure
- limit who can read or deploy with secrets
- never include secrets in logs or analytics

## Webhook security

For incoming webhooks:

```text
Receive request
  ↓
Verify provider signature
  ↓
Check event ID for duplicate processing
  ↓
Validate expected event type
  ↓
Process safely
  ↓
Record status and audit event
```

Do not trust a webhook just because it comes from a familiar IP range or contains a recognizable payload shape.

## Safe error handling

Public responses should not reveal stack traces, secrets, internal IDs, or permission details.

Use clear categories:

```text
validation_error
authentication_error
authorization_error
not_found
rate_limited
conflict
internal_error
```

Keep detailed diagnostic context in protected logs.

## Admin security

Protect staff tools with:

```text
Cloudflare Access
  ↓
Application session
  ↓
Admin role check
  ↓
Audit log
```

Require stronger review for actions that affect users, payments, permissions, exports, or production settings.

## Audit logging

Audit high-impact actions such as:

```text
user.role_changed
workspace.member_removed
api_key.created
api_key.revoked
payment.status_changed
payout.approved
file.downloaded
settings.changed
export.generated
```

Audit logs should be append-only or strongly protected from casual edits.

## Security incident flow

```text
Suspicious event detected
  ↓
Confirm scope and impact
  ↓
Contain access or disable risky feature
  ↓
Rotate affected credentials if needed
  ↓
Review logs and recent deploys
  ↓
Recover and verify
  ↓
Document incident and prevention work
```

## Security checklist

- [ ] Every sensitive route has server-side authorization
- [ ] Tenant isolation is enforced in queries
- [ ] Public forms are protected and rate-limited
- [ ] Private files require permission checks
- [ ] Secrets are stored outside source code
- [ ] Webhooks verify signatures and prevent duplicates
- [ ] Admin tools are protected with Access and roles
- [ ] Sensitive actions are audit-logged
- [ ] Error responses do not leak internals
- [ ] Session revocation and secret rotation are possible
- [ ] Incident response and rollback steps exist

## Common mistakes

- treating UI visibility as access control
- trusting browser-provided roles or prices
- exposing private R2 objects directly
- accepting webhooks without signature checks
- logging tokens or full customer payloads
- using one shared credential for all integrations
- forgetting workspace filters
- allowing broad admin powers without audit logs

## Related docs

- [`architectures/authentication-authorization.md`](./authentication-authorization.md)
- [`architectures/multi-tenant-saas.md`](./multi-tenant-saas.md)
- [`architectures/api-platform.md`](./api-platform.md)
- [`architectures/observability-operations.md`](./observability-operations.md)
- [`catalog/workers.md`](../catalog/workers.md)
- [`catalog/d1.md`](../catalog/d1.md)
- [`catalog/r2.md`](../catalog/r2.md)
- [`catalog/turnstile.md`](../catalog/turnstile.md)
- [`catalog/access.md`](../catalog/access.md)
- [`catalog/queues.md`](../catalog/queues.md)
