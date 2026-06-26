# Payments & Billing Architecture

A Cloudflare-first reference for checkout, provider webhooks, subscriptions, invoices, refunds, payouts, and financial audit trails.

> This is a software architecture guide, not legal, tax, accounting, or payment-provider compliance advice. Confirm local requirements with qualified professionals and your payment provider.

## Goal

Build payment flows that are verifiable, retry-safe, and traceable without trusting browser callbacks or mixing money state into unrelated records.

Use this architecture for:

- e-commerce checkout
- SaaS subscriptions
- bookings and reservations
- marketplaces
- service platforms
- invoice payment portals

## Starting stack

| Need | Service |
| --- | --- |
| Checkout/API | Workers |
| Payment and billing records | D1 |
| Invoices and receipts | R2 |
| Async notifications | Queues |
| Long billing workflows | Workflows |
| Internal finance tools | Access |
| Public checkout protection | Turnstile |
| Operational events | Analytics Engine |

## Core principle

Keep these records separate:

```text
order or subscription
payment attempt
provider event
invoice or receipt
refund
payout
```

A paid order is not the same thing as a successful provider event, an issued invoice, or a completed vendor payout.

## Core flow

```text
Customer starts checkout
  ↓
Worker creates internal order/payment attempt
  ↓
Customer completes provider flow
  ↓
Provider sends signed webhook
  ↓
Worker verifies signature and event ID
  ↓
Payment record updates
  ↓
Order/subscription state updates
  ↓
Queue sends confirmation and receipt
```

Do not mark payment as complete only because the browser returns to a success page.

## Suggested D1 tables

```text
customers
orders
subscriptions
payment_attempts
payment_provider_events
invoices
invoice_items
refunds
payouts
payout_items
billing_customers
tax_records
audit_logs
settings
```

Minimum payment attempt fields:

```text
id
workspace_id
order_id
provider
provider_payment_id
amount
currency
status
idempotency_key
created_at
updated_at
```

Minimum provider event fields:

```text
id
provider
event_id
event_type
signature_valid
payment_attempt_id
status
received_at
processed_at
```

## Webhook verification flow

```text
Webhook arrives
  ↓
Verify signature
  ↓
Check provider event ID
  ↓
Already processed? Return safe success
  ↓
Validate expected event type
  ↓
Update internal records transactionally
  ↓
Queue secondary work
```

Store provider event IDs and process them idempotently.

## Subscription model

For recurring billing:

```text
Customer
  ↓
Subscription
  ↓
Provider billing event
  ↓
Subscription status update
  ↓
Feature entitlement check
```

Keep entitlement state explicit. Do not infer active access only from a recent browser checkout response.

Suggested subscription states:

```text
trialing
active
past_due
paused
cancelled
expired
```

## Invoice and receipt model

Generate invoices or receipts after a verified billing event.

```text
Verified event
  ↓
Invoice/receipt record created
  ↓
PDF generated asynchronously
  ↓
File stored in R2
  ↓
Authorized customer can download
```

Store document metadata in D1 and files in R2.

## Refund model

Keep refunds as separate records.

```text
Refund requested
  ↓
Eligibility/review
  ↓
Provider refund action
  ↓
Verified provider event
  ↓
Refund record updated
  ↓
Order/subscription state updated if needed
```

Every refund or manual adjustment should create an audit record.

## Marketplace payout model

For vendor or provider payouts:

```text
Customer payment confirmed
  ↓
Order fulfilled
  ↓
Return/dispute window rules checked
  ↓
Commission calculated
  ↓
Payout becomes eligible
  ↓
Payout processed and recorded
```

Do not treat a completed checkout as automatic payout authorization.

## Idempotency rules

Use idempotency keys for actions such as:

- create checkout session
- create payment attempt
- create refund request
- create payout request
- process provider webhook

A retry must not create duplicate charges, invoices, refunds, or payouts.

## API route plan

```text
/api/checkout
/api/payments
/api/subscriptions
/api/invoices
/api/refunds
/api/payouts
/api/webhooks/payments
/api/admin/payments
/api/admin/refunds
/api/admin/payouts
/api/admin/audit-logs
```

Keep customer, provider webhook, and internal finance routes separate.

## Security rules

- Verify all provider webhook signatures.
- Never store raw card details unless your provider explicitly supports and requires it.
- Keep provider secrets in Worker secrets.
- Recalculate price, discount, and tax inputs server-side.
- Restrict finance and payout actions with roles and audit logs.
- Protect internal billing tools with Access.
- Do not expose payment-provider error payloads directly to customers.

## Background jobs

Use Queues for:

- payment confirmation email
- invoice/receipt PDF generation
- payment reconciliation follow-up
- failed payment reminder
- refund status notification
- payout eligibility check
- analytics processing

Use Workflows for multi-step dispute, collection, or payout review processes.

## Analytics

Record non-sensitive events such as:

- checkout started
- payment confirmed
- payment failed
- subscription changed
- invoice generated
- refund requested
- payout completed

Do not send payment credentials, full billing addresses, or raw provider payloads to analytics events.

## Production checklist

- [ ] Payment state is separate from order state
- [ ] Provider webhook signatures are verified
- [ ] Provider events are idempotent
- [ ] Browser callbacks do not grant paid access alone
- [ ] Refunds and payouts have separate records
- [ ] Finance actions are role-protected and audit-logged
- [ ] Invoices and receipts are stored privately in R2
- [ ] Price and discount rules are recalculated server-side
- [ ] Secrets are stored outside source code
- [ ] Backup and rollback plans exist

## Common mistakes

- trusting frontend payment success
- skipping webhook signature verification
- processing duplicate provider events twice
- mixing invoice and payment records
- creating payouts before dispute/return rules are evaluated
- logging raw provider payloads with sensitive fields
- treating code rollback as financial rollback

## Related docs

- [`architectures/e-commerce.md`](./e-commerce.md)
- [`architectures/marketplace.md`](./marketplace.md)
- [`architectures/multi-vendor-commerce.md`](./multi-vendor-commerce.md)
- [`architectures/api-platform.md`](./api-platform.md)
- [`architectures/observability-operations.md`](./observability-operations.md)
- [`catalog/workers.md`](../catalog/workers.md)
- [`catalog/d1.md`](../catalog/d1.md)
- [`catalog/r2.md`](../catalog/r2.md)
- [`catalog/queues.md`](../catalog/queues.md)
- [`catalog/workflows.md`](../catalog/workflows.md)
- [`catalog/access.md`](../catalog/access.md)
