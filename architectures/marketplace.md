# Marketplace Architecture

A Cloudflare-first architecture for building a marketplace with buyers, sellers, listings, orders, payments, reviews, uploads, messages, and disputes.

---

## Goal

Build a marketplace that starts simple, protects transactions, and can grow into a production platform.

This architecture is designed for:

- service marketplaces
- freelance platforms
- job/service portals
- digital product marketplaces
- local service directories
- booking marketplaces
- creator marketplaces

---

## Recommended starting stack

| Need | Service |
| --- | --- |
| Frontend | Pages or Workers |
| Backend/API | Workers |
| App database | D1 |
| Uploads/files | R2 |
| Cache/config | KV |
| Background jobs | Queues |
| Form protection | Turnstile |
| Admin protection | Access |
| Analytics | Analytics Engine |

Start with Workers, D1, R2, and Turnstile. Add Queues and Analytics Engine when order volume and business workflows grow.

---

## Architecture overview

```text
Buyer / Seller
  ↓
Pages or Workers frontend
  ↓
Workers API
  ├── D1 marketplace records
  ├── R2 uploads and delivery files
  ├── KV public config/cache
  ├── Queues async jobs
  └── Analytics Engine events

Admin / Support
  ↓
Cloudflare Access
  ↓
Admin dashboard
  ↓
Workers API
```

---

## Core actors

Start with these user types:

- buyer
- seller
- admin
- support/reviewer

Do not add too many roles too early. Add finance, dispute, verifier, or moderator roles only when the workflow needs them.

---

## Core flow

```text
Seller creates listing
  ↓
Admin or automated checks approve listing
  ↓
Buyer places order
  ↓
Payment is confirmed
  ↓
Seller delivers work or product
  ↓
Buyer accepts delivery
  ↓
Seller becomes eligible for payout
  ↓
Buyer leaves review
```

For an MVP, keep payment and payout logic simple and fully logged.

---

## Suggested D1 tables

Start with these tables:

```text
users
profiles
seller_profiles
buyer_profiles
categories
listings
listing_media
orders
order_messages
order_deliveries
payments
payouts
reviews
disputes
notifications
audit_logs
settings
```

Minimum listing fields:

```text
id
seller_id
category_id
title
slug
description
price
status
created_at
updated_at
```

Minimum order fields:

```text
id
buyer_id
seller_id
listing_id
status
amount
payment_status
delivery_status
created_at
updated_at
```

Recommended order statuses:

```text
pending_payment
paid
in_progress
delivered
accepted
disputed
cancelled
completed
```

---

## File storage model

Store files in R2 and metadata in D1.

```text
R2:
marketplace/{order_id}/delivery/{file_id}.zip
marketplace/{seller_id}/portfolio/{file_id}.webp

D1 files/media table:
id
owner_user_id
order_id
listing_id
object_key
content_type
size
visibility
created_at
```

Do not store uploaded files directly in D1.

---

## Payment model

Keep payment records separate from orders.

```text
Order
  ↓
Payment attempt
  ↓
Provider confirmation
  ↓
Order status update
  ↓
Payout eligibility
```

Important rules:

- never trust frontend payment status
- verify payment webhooks server-side
- store every provider event
- keep payout state separate from order state
- audit every manual finance action

---

## Messaging model

For MVP, order-based messages are enough.

```text
order_messages
- id
- order_id
- sender_id
- body
- attachment_id
- created_at
```

Avoid public direct messaging before the order flow is safe. Public free chat can create spam, abuse, and off-platform deals.

---

## Dispute model

A simple dispute flow:

```text
Buyer or seller opens dispute
  ↓
Order status becomes disputed
  ↓
Support reviews messages and delivery files
  ↓
Admin decision is recorded
  ↓
Payment or payout status is updated
```

Store dispute evidence in R2 and metadata in D1.

---

## API route plan

Public routes:

```text
/api/listings
/api/listings/:slug
/api/categories
/api/forms/contact
```

User routes:

```text
/api/me
/api/profile
/api/orders
/api/orders/:id/messages
/api/orders/:id/deliveries
/api/reviews
```

Seller routes:

```text
/api/seller/listings
/api/seller/orders
/api/seller/payouts
```

Admin routes:

```text
/api/admin/users
/api/admin/listings
/api/admin/orders
/api/admin/payments
/api/admin/disputes
/api/admin/audit-logs
```

Webhook routes:

```text
/api/webhooks/payments
/api/webhooks/notifications
```

---

## Security model

Every sensitive action should check:

```text
Authenticated user
  ↓
Correct role
  ↓
Owns or can access record
  ↓
Action allowed for current status
  ↓
Audit log created
```

Key checks:

- buyer can only access own orders
- seller can only access assigned orders
- seller cannot mark payment as paid
- buyer cannot modify seller delivery files
- public users cannot upload unlimited files
- admin actions are logged

---

## Background jobs

Use Queues for:

- send order notification
- verify provider webhook follow-up
- generate invoice or receipt
- process uploaded file metadata
- send review reminder
- update analytics events
- notify admin about disputes

---

## Caching strategy

Good cache targets:

- public category list
- public listing cards
- homepage sections
- static settings
- search filters

Do not cache carelessly:

- order pages
- payment status
- private messages
- dispute evidence
- admin dashboards

---

## Analytics

Use Analytics Engine for events such as:

- listing view
- seller profile view
- order started
- payment completed
- delivery submitted
- dispute opened
- review submitted

Do not store sensitive payment data in analytics events.

---

## Production checklist

Before launch:

- [ ] Order status flow is clearly defined
- [ ] Payment webhooks are verified server-side
- [ ] Payout logic is separated from payment logic
- [ ] R2 upload rules are enforced
- [ ] Buyer/seller access checks are tested
- [ ] Admin routes are protected
- [ ] Public forms use Turnstile
- [ ] Dispute flow exists
- [ ] Audit logs exist for finance/admin actions
- [ ] Reviews can only be created by real customers
- [ ] File size and file type limits exist
- [ ] Backup/export plan exists
- [ ] Rollback plan exists

---

## Common mistakes

- trusting frontend payment status
- allowing public direct chat too early
- storing delivery files in D1
- missing order ownership checks
- mixing order status and payment status
- skipping dispute workflow
- not logging admin finance changes
- allowing reviews without completed orders
- adding too many features before the transaction flow works

---

## Related docs

- [`docs/d1-vs-kv-vs-r2.md`](../docs/d1-vs-kv-vs-r2.md)
- [`catalog/workers.md`](../catalog/workers.md)
- [`catalog/d1.md`](../catalog/d1.md)
- [`catalog/r2.md`](../catalog/r2.md)
- [`catalog/kv.md`](../catalog/kv.md)
- [`catalog/queues.md`](../catalog/queues.md)
- [`catalog/turnstile.md`](../catalog/turnstile.md)
- [`catalog/access.md`](../catalog/access.md)
