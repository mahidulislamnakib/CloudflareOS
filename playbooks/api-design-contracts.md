# API Design & Contract Playbook

A practical guide for designing APIs that stay understandable as a product grows. It helps Cloudflare-first projects avoid fragile frontend/backend coupling, unsafe access patterns, unclear errors, accidental breaking changes, and hard-to-debug integrations.

## Goal

Create APIs that are:

- easy for the frontend, mobile app, admin panel, and integrations to use
- safe around authentication, authorization, tenant boundaries, and private data
- predictable when data is empty, invalid, delayed, or unavailable
- efficient with pagination, filtering, uploads, and background work
- stable enough to change without breaking existing users
- observable when something goes wrong

An API contract is a product promise. It defines what callers may send, what they may receive, what errors mean, and which actions are allowed.

---

## Start with the critical journey

Choose the most important action before writing endpoints.

```text
customer opens product → adds to cart → completes checkout
member signs in → sees workspace → updates a record
staff reviews application → approves or rejects → notification is sent
visitor submits form → receives confirmation → team follows up
```

For each journey, define:

```text
who can perform it
what input is required
what permission is required
what data changes
what user-visible result is returned
what may happen asynchronously
what error/recovery path exists
```

---

## Contract-first thinking

Do not begin with database tables alone. Start with a task and define the contract around it.

```text
User goal
  ↓
Allowed action
  ↓
Request shape
  ↓
Server-side validation
  ↓
Authorization and ownership check
  ↓
Focused data operation
  ↓
Consistent response or error
  ↓
Audit event and async follow-up where needed
```

Before implementing an endpoint, answer:

- What problem does this action solve?
- Who is allowed to call it?
- Which fields can the caller control?
- Which fields must the server set itself?
- What is the smallest useful response?
- What happens if the request is repeated?
- What happens if a provider, database, or queue is unavailable?

---

## Resource and action design

Use names that match the product language.

Good examples:

```text
GET    /api/projects
GET    /api/projects/:projectId
POST   /api/projects
PATCH  /api/projects/:projectId
POST   /api/projects/:projectId/archive
GET    /api/orders/:orderId/invoice
POST   /api/uploads/prepare
POST   /api/reports/:reportId/submit
```

Avoid vague routes such as:

```text
/api/doThing
/api/updateData
/api/getAll
/api/handleRequest
```

### Use a resource when data is managed over time

```text
projects
orders
articles
members
applications
bookings
invoices
```

### Use an explicit action when it represents a meaningful state change

```text
approve
reject
archive
publish
cancel
submit
verify
resend
```

Keep the action meaningful and auditable. Do not create vague catch-all actions such as `process` or `updateStatus` when a product-specific action is clearer.

---

## Request design

### Keep inputs small and intentional

Only accept fields the caller is truly allowed to set.

```json
{
  "title": "Spring campaign",
  "description": "Public launch content",
  "dueDate": "2026-07-15"
}
```

Do not accept server-controlled fields from the client unless there is a specific, authorized reason:

```text
ownerId
workspaceId
role
paymentStatus
approvedAt
internalNotes
createdAt
updatedAt
```

The server should derive ownership, tenant context, role, timestamps, audit information, and security-sensitive state from trusted context.

### Validate at the boundary

Validate before business logic runs:

- required fields
- data type and format
- allowed values
- maximum length and size
- cross-field rules
- uploaded file metadata
- tenant or workspace context
- role and ownership requirements

Return one clear response format for invalid input.

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Please correct the highlighted fields.",
    "fields": {
      "email": "Enter a valid email address.",
      "title": "Title must be 120 characters or fewer."
    }
  }
}
```

Do not expose internal stack traces, SQL details, secret names, or provider credentials in client-facing responses.

---

## Response design

A response should help the client complete the next user-visible step.

### Success response

```json
{
  "data": {
    "id": "prj_123",
    "title": "Spring campaign",
    "status": "active",
    "createdAt": "2026-06-26T12:00:00Z"
  }
}
```

### List response

```json
{
  "data": [
    {
      "id": "prj_123",
      "title": "Spring campaign",
      "status": "active"
    }
  ],
  "meta": {
    "nextCursor": "cursor_value_or_null",
    "hasMore": false
  }
}
```

### Error response

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "The requested project was not found."
  }
}
```

### Response rules

- Keep field names stable and readable.
- Return only data the current caller is permitted to see.
- Keep dates and machine-readable states consistent.
- Return summaries for lists and full detail only when required.
- Include metadata only when it helps the client make the next request.
- Do not make clients parse human error text to decide what to do.

---

## Status and error semantics

Use a predictable error model so frontend and integration code can recover safely.

| Situation | Example code | Client behavior |
| --- | --- | --- |
| Missing or invalid login | `UNAUTHENTICATED` | Send user to sign in or refresh session |
| Logged in but not allowed | `FORBIDDEN` | Hide unsafe action and show clear explanation |
| Record does not exist or is not visible | `NOT_FOUND` | Show not-found state without exposing private data |
| Invalid input | `VALIDATION_FAILED` | Highlight field and preserve safe input |
| Duplicate/repeated action | `CONFLICT` or `ALREADY_PROCESSED` | Explain current state and avoid duplicate write |
| Provider temporarily unavailable | `SERVICE_UNAVAILABLE` | Offer retry or queued status when safe |
| Too many requests | `RATE_LIMITED` | Ask caller to wait and reduce retry behavior |
| Unexpected server failure | `INTERNAL_ERROR` | Show safe message and log correlation details server-side |

Do not use authorization errors to reveal private record existence. The safe behavior depends on the product and threat model.

---

## Authentication, authorization, and tenant boundaries

Authentication answers:

```text
Who is calling?
```

Authorization answers:

```text
May this caller perform this action on this specific resource?
```

Every protected endpoint should follow a server-side sequence:

```text
Read authenticated identity
  ↓
Resolve tenant/workspace context where relevant
  ↓
Load only a record scoped to that identity or tenant
  ↓
Check role and action permission
  ↓
Perform allowed operation
  ↓
Return permitted data only
```

### Do not trust client identifiers alone

Never treat these as proof of access:

```text
userId in request body
workspaceId in query string
role stored in browser state
hidden admin button
record ID guessed from another page
```

Use server-side checks for every read, update, download, export, approval, deletion, and background action.

### Multi-tenant rule

For workspace, vendor, school, agency, or team products, scope data at the query boundary.

```text
requested record ID
  + authenticated identity
  + tenant/workspace scope
  + action permission
```

Then test cross-tenant behavior explicitly for direct URLs, search, exports, files, analytics, and background jobs.

---

## Pagination, filtering, and search

Lists grow. Design for bounded responses from the first version.

### List rules

- Use a maximum page size.
- Return a sensible default page size.
- Keep sorting explicit and allow only known fields.
- Validate filter values.
- Return a next cursor or equivalent continuation signal.
- Do not fetch all records and filter them in the browser.
- Keep search results scoped to permissions and tenant access.

Example:

```text
GET /api/orders?status=pending&sort=createdAt.desc&limit=25&cursor=...
```

The exact parameter names can vary. Consistency across the product matters more than the chosen style.

### Filter safety

Do not pass raw client filter or sort strings directly into database query construction. Map allowed filters and sort options explicitly.

---

## Idempotency and duplicate actions

Users, browsers, webhooks, and integrations can retry.

Design important write actions so duplicate requests do not create duplicate outcomes.

High-value examples:

```text
payment confirmation
booking creation
payout request
invoice generation
membership renewal
webhook processing
form submission with follow-up workflow
```

### Idempotency workflow

```text
Receive request with stable action key
  ↓
Check whether the action already completed
  ↓
Return the original safe result when appropriate
  ↓
Otherwise perform the action once
  ↓
Store outcome and audit event
```

Use this pattern for operations where duplication creates financial, legal, or user-trust risk.

---

## Async work and long-running actions

A user request should return quickly when the result does not need to be immediate.

Good candidates for background work:

- email or notification delivery
- image/video processing
- exports and report generation
- document conversion
- analytics events
- search indexing
- provider retry workflows

### Async contract

```json
{
  "data": {
    "jobId": "job_123",
    "status": "queued",
    "message": "Your report is being prepared."
  }
}
```

The product should give users a way to understand progress, completion, failure, and retry when an asynchronous outcome matters.

Do not claim an action succeeded merely because it was queued. Distinguish:

```text
accepted
queued
processing
completed
failed
cancelled
```

---

## File upload and download contracts

Files are data plus permissions, metadata, and lifecycle rules.

For an upload, define:

```text
who may upload
accepted type and maximum size
what object key or record is created
whether scanning/processing is required
who may view or download
how replacement and deletion work
how expired temporary files are cleaned up
```

For private files:

- authorize the download request server-side
- do not expose predictable object paths as proof of permission
- store file ownership and purpose in durable application records
- log sensitive downloads where appropriate
- return useful file status when processing is incomplete

### Safer upload flow

```text
Client asks to prepare upload
  ↓
Server authenticates, authorizes, validates file intent
  ↓
Client uploads through approved path
  ↓
Server records final metadata and ownership
  ↓
Optional background processing runs
  ↓
Client sees ready, processing, or failed state
```

---

## Webhooks and third-party integrations

Treat all incoming webhooks and provider callbacks as untrusted until verified.

For each integration, define:

```text
signature verification method
expected event types
idempotency key or event ID
retry behavior
timeout behavior
failure recovery
reconciliation path
internal audit record
```

### Safe webhook flow

```text
Receive provider event
  ↓
Verify signature and expected source
  ↓
Check whether event was processed already
  ↓
Validate event type and required data
  ↓
Persist minimal trusted event record
  ↓
Process synchronously or queue follow-up
  ↓
Record result for reconciliation
```

Do not trust a browser redirect as final proof of payment, booking, identity verification, or delivery state when a verified provider event is available.

---

## Versioning and safe change management

Breaking API changes cause hidden production failures. Prefer additive change.

### Safer changes

- add a new optional field
- add a new endpoint
- add a new response property
- support an old and new input during a transition
- introduce a new action with a clear lifecycle

### Higher-risk changes

- removing or renaming fields
- changing a field type
- changing default authorization behavior
- changing pagination shape
- changing success/error formats
- changing webhook expectations
- changing enum values without compatibility review

### Change workflow

```text
Identify callers
  ↓
Add compatible behavior
  ↓
Update frontend, integrations, and tests
  ↓
Measure usage of old behavior
  ↓
Communicate deprecation window
  ↓
Remove only after verification
```

Keep API contract changes visible in pull-request review and release notes.

---

## Rate limits, quotas, and abuse controls

Protect the actions that can be expensive, sensitive, or repeatedly triggered.

Consider controls for:

- public forms
- sign-in and reset flows
- OTP or verification-code sends
- search and autocomplete
- AI requests
- file uploads
- exports
- webhook retry endpoints
- create/update actions that trigger external providers

A useful rule is to apply limits based on the risk of the action, not a single universal number.

When rejecting a request, return a clear recoverable response and avoid teaching attackers unnecessary internal details.

---

## Observability and supportability

When an API action fails, support staff should be able to answer:

```text
what action was attempted
which actor or tenant was involved
which record was affected
when it happened
whether the operation completed, failed, or retried
which provider or job was involved
how the user can recover
```

For high-impact actions, record an audit event with safe identifiers and outcome. Avoid logging passwords, tokens, full payment data, private documents, or unnecessary personal information.

Use a correlation or request identifier where helpful so a user-visible error can be connected to server-side logs without exposing internal details.

---

## API testing workflow

Test the contract, not only the happy-path UI.

### Minimum tests for an important endpoint

- valid request succeeds
- invalid input returns actionable validation output
- unauthenticated caller is handled safely
- unauthorized caller cannot access or change data
- another tenant cannot access the record
- empty list and missing record states are clear
- pagination/filter limits behave as expected
- repeated request does not duplicate high-risk actions
- provider or queue failure has a safe response
- error shape stays consistent

### Release regression checks

```text
Create record
Read record as allowed user
Try direct access as another user or tenant
Update allowed fields
Try updating server-controlled fields
Delete/archive if applicable
Retry important write
Check audit event or background job outcome
```

---

## API review checklist

Before a new endpoint or change is approved:

- [ ] Endpoint name matches a real product action or resource.
- [ ] Request fields are intentionally allowlisted.
- [ ] Server sets ownership, tenant, role, and sensitive state.
- [ ] Validation happens before business logic.
- [ ] Authorization is enforced server-side.
- [ ] Private records and files are scoped to the caller.
- [ ] Response contains only needed permitted data.
- [ ] Error codes and messages are consistent and actionable.
- [ ] Lists have limits, pagination, and safe filters.
- [ ] High-risk writes handle retries or duplicates safely.
- [ ] Webhooks verify source and prevent duplicate processing.
- [ ] Long work has a user-visible async status model.
- [ ] Logs and audit events are useful without exposing secrets.
- [ ] Contract changes have a compatible rollout plan.

---

## Common mistakes

- exposing database-shaped records directly as public API responses
- accepting `userId`, `role`, `tenantId`, or `status` from the browser without server checks
- using a hidden frontend button as the only authorization control
- returning every record with no pagination
- allowing raw sort or filter input to alter database queries
- returning stack traces or provider errors to users
- treating a queued job as completed work
- processing the same webhook or payment action more than once
- creating unclear routes like `/doThing`
- changing response shape without reviewing callers
- logging private data for easier debugging
- testing only happy-path frontend behavior

---

## Related guides

- [`../architectures/api-platform.md`](../architectures/api-platform.md)
- [`../architectures/authentication-authorization.md`](../architectures/authentication-authorization.md)
- [`../architectures/security-threat-modeling.md`](../architectures/security-threat-modeling.md)
- [`../architectures/multi-tenant-saas.md`](../architectures/multi-tenant-saas.md)
- [`../architectures/observability-operations.md`](../architectures/observability-operations.md)
- [`./testing-strategy.md`](./testing-strategy.md)
- [`./performance-optimization.md`](./performance-optimization.md)
- [`../docs/production-readiness-checklist.md`](../docs/production-readiness-checklist.md)
