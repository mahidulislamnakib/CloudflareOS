# Testing Strategy Playbook

A practical testing strategy for Cloudflare-first applications: what to test, where to test it, and how to keep releases safe without creating a slow, fragile test suite.

## Goal

Catch high-impact failures before users do.

Prioritize tests for:

- authentication and permissions
- tenant isolation
- payments and webhooks
- data writes and migrations
- uploads and private files
- queue consumers and retries
- core user journeys
- production deployment checks

---

## Testing pyramid

```text
Few end-to-end tests
  ↑
Integration tests
  ↑
Many focused unit tests
```

Use each layer for a different job.

| Test type | Best for | Avoid using it for |
| --- | --- | --- |
| Unit | business rules, validation, transforms | full browser flows |
| Integration | Worker routes, D1, queues, bindings | every UI detail |
| End-to-end | critical user journeys | every edge case |
| Smoke | post-deploy confirmation | deep regression coverage |
| Manual exploratory | UX, mobile, unclear edge cases | repeatable checks |

---

## Test the risk, not every line

For each feature, ask:

```text
What can lose money?
What can expose private data?
What can corrupt records?
What can block the primary user journey?
What can silently fail in the background?
```

Write tests for those answers first.

---

## Unit tests

Use unit tests for deterministic rules.

Good targets:

```text
price and discount calculation
commission calculation
permission decision helpers
input validation
slug generation
status transition rules
notification preference rules
idempotency checks
locale fallback logic
```

Keep unit tests fast and independent from network calls, real secrets, and shared databases.

---

## Integration tests

Integration tests verify that parts of the application work together.

Good targets:

```text
Worker route + authentication
Worker route + D1 query
R2 upload authorization
Queue producer + consumer payload
Webhook signature validation
D1 migration compatibility
Durable Object room access rule
```

Use test bindings, fixtures, and isolated test data. Do not run destructive tests against production resources.

---

## End-to-end tests

Use end-to-end tests only for the core journeys users depend on.

Recommended flows:

```text
sign up or login
create primary record
edit primary record
upload a permitted file
complete checkout or booking sandbox flow
receive a role-protected admin action
view private tenant-scoped data
logout and session expiry
```

Keep the suite small, stable, and focused on real user value.

---

## Authorization test matrix

Every sensitive endpoint needs explicit allow/deny tests.

| Actor | Resource owner? | Expected result |
| --- | --- | --- |
| Anonymous visitor | No | Denied |
| Logged-in user | No | Denied or limited |
| Resource owner | Yes | Allowed |
| Same workspace member | Depends on role | Explicit rule |
| Other workspace member | No | Denied |
| Admin | Depends on policy | Allowed and audited |

Test object IDs from another user or workspace. This catches common insecure direct object reference failures.

---

## Webhook tests

For payment, email, SMS, or other provider webhooks, test:

- valid signature accepted
- invalid signature rejected
- duplicate event processed safely
- unsupported event ignored safely
- out-of-order event handled safely
- provider timeout or retry does not duplicate business action
- failed processing is visible for investigation

Store only safe fixture payloads in the repository.

---

## Queue and background-job tests

Test the job contract, not just the producer.

```text
Producer creates expected message
  ↓
Consumer validates payload
  ↓
Consumer action is idempotent
  ↓
Transient error retries safely
  ↓
Permanent failure is recorded
```

For irreversible actions such as payouts, emails, or status changes, verify that duplicate messages do not repeat the action.

---

## Migration tests

Before production schema changes:

```text
1. Run migration on a clean database.
2. Run migration on representative existing data.
3. Verify old application version behavior if rolling deploys are possible.
4. Verify new application version behavior.
5. Test rollback or recovery plan for risky changes.
```

Prefer additive changes first: new columns, new tables, compatibility code, backfill, then cleanup later.

---

## File upload tests

Test:

- allowed type accepted
- prohibited type rejected
- oversized file rejected
- object key generated server-side
- unauthorized user cannot upload to another workspace
- unauthorized user cannot download private object
- failed upload does not leave confusing metadata

Do not rely only on browser MIME type checks.

---

## AI feature tests

For AI features, test behavior boundaries rather than exact wording.

```text
input length limit
output size limit
authorization before inference
fallback when model/provider fails
safe handling of empty or malformed output
quota/rate limit enforcement
private data excluded from logs
```

Use fixed mocks or deterministic fixtures for most tests. Reserve real-model checks for a small scheduled validation suite.

---

## Performance and resilience checks

Before launch, verify:

- list endpoints use pagination
- reports and exports have limits
- expensive work moves to queues
- public endpoints have rate limits
- main mobile page works on a slow network
- third-party failure gives a safe response
- repeated requests do not create duplicate writes

---

## CI pipeline order

A practical default:

```text
format
  ↓
lint
  ↓
type check
  ↓
unit tests
  ↓
integration tests
  ↓
build
  ↓
small end-to-end suite
  ↓
preview deploy
  ↓
manual smoke test
```

Do not block every small documentation change on expensive end-to-end tests unless the repository needs it.

---

## Production smoke test

After deployment, verify the real environment.

```text
homepage or entry route
login/session check
primary create/read/update action
one permission-denied check
one upload or file access check if relevant
one webhook/integration health check if relevant
error logs and alerts
```

Record who ran the smoke test, release version, time, and result.

---

## Test data rules

- Never use production secrets in tests.
- Never copy real sensitive customer data into fixtures.
- Use clear fixture ownership and workspace IDs.
- Make test data easy to clean up.
- Keep tests independent so order does not matter.
- Use factories or builders for complex records.

---

## Minimum release gate

Before production, require:

- [ ] Lint/type/build checks pass.
- [ ] Unit tests pass for changed business rules.
- [ ] Integration tests cover changed sensitive routes.
- [ ] Core end-to-end journeys pass when affected.
- [ ] Migrations are tested when schema changed.
- [ ] Webhook/idempotency tests pass when integrations changed.
- [ ] Preview deployment is reviewed.
- [ ] Production smoke test owner is assigned.
- [ ] Rollback plan exists for high-risk change.

---

## Common mistakes

- testing only happy paths
- relying only on end-to-end tests
- skipping cross-tenant access tests
- using production data in fixtures
- not testing duplicate webhooks or queue messages
- making tests depend on execution order
- running destructive migration tests on shared environments
- treating a green build as proof that production is safe

---

## Related guides

- [`../docs/production-readiness-checklist.md`](../docs/production-readiness-checklist.md)
- [`../architectures/deployment-release.md`](../architectures/deployment-release.md)
- [`../architectures/security-threat-modeling.md`](../architectures/security-threat-modeling.md)
- [`../architectures/observability-operations.md`](../architectures/observability-operations.md)
- [`../architectures/payments-billing.md`](../architectures/payments-billing.md)
- [`../playbooks/disaster-recovery-business-continuity.md`](./disaster-recovery-business-continuity.md)
