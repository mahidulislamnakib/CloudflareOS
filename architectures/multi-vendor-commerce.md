# Multi-vendor Commerce Architecture

A Cloudflare-first reference for a marketplace where multiple vendors manage products, receive orders, fulfill sales, and become eligible for payouts.

## Starting stack

| Need | Service |
| --- | --- |
| Marketplace frontend | Pages or Workers |
| API | Workers |
| Core marketplace data | D1 |
| Product and delivery files | R2 |
| Cache/config | KV |
| Notifications and payout jobs | Queues |
| Long approval flows | Workflows |
| Public protection | Turnstile |
| Internal admin | Access |
| Marketplace events | Analytics Engine |

Start with Workers, D1, R2, and Turnstile. Add Queues when fulfillment, notifications, vendor review, and payout processing grow.

## Core model

```text
Platform
  ↓
Vendors
  ↓
Products and variants
  ↓
Customer orders
  ↓
Fulfillment
  ↓
Commission and payout eligibility
```

## Suggested D1 tables

```text
users
vendors
vendor_members
vendor_verifications
products
product_variants
product_images
categories
inventory_items
orders
order_items
vendor_orders
shipments
payments
commissions
payouts
returns
disputes
reviews
notifications
audit_logs
settings
```

Every vendor-owned record should include `vendor_id`. Every platform-owned record should use clear ownership rules.

## Vendor onboarding flow

```text
Vendor signs up
  ↓
Vendor profile created
  ↓
Documents or business details submitted
  ↓
Admin or automated review
  ↓
Vendor becomes approved
  ↓
Vendor can publish products
```

Keep approval and verification status separate from the vendor profile itself.

## Catalog ownership

```text
Vendor
  ↓
Product
  ↓
Variants
  ↓
Inventory
  ↓
Media
```

Every product write must verify that the acting user belongs to the correct vendor.

## Order splitting model

One customer cart may include products from different vendors.

```text
Customer order
  ↓
Vendor order A
Vendor order B
Vendor order C
```

Keep the customer-facing order separate from vendor-specific fulfillment records.

Suggested states:

```text
Customer order:
pending_payment
paid
partially_fulfilled
fulfilled
cancelled

Vendor order:
pending
accepted
processing
shipped
delivered
cancelled
```

## Commission and payout model

Keep payment, commission, and payout states separate.

```text
Customer payment confirmed
  ↓
Vendor order fulfilled
  ↓
Return/dispute window passes
  ↓
Commission calculated
  ↓
Vendor becomes payout-eligible
  ↓
Payout is processed
```

Do not treat order completion as an automatic payout without your business, legal, and payment-provider rules being defined.

## Suggested payout records

```text
commissions
- id
- vendor_id
- order_item_id
- gross_amount
- platform_fee
- net_amount
- status

payouts
- id
- vendor_id
- amount
- status
- requested_at
- processed_at
```

## Product media model

Store product images and delivery files in R2, with metadata in D1.

```text
R2:
vendors/{vendor_id}/products/{product_id}/{file_id}.webp
```

Private delivery files must be served through a Worker permission check.

## API route plan

```text
/api/products
/api/vendors/:slug
/api/cart
/api/checkout
/api/orders
/api/vendor/products
/api/vendor/orders
/api/vendor/payouts
/api/admin/vendors
/api/admin/verifications
/api/admin/commissions
/api/admin/payouts
/api/webhooks/payments
```

## Security rules

- Customers access only their own orders.
- Vendors access only their own products, vendor orders, and payouts.
- Platform staff use Access plus app-level roles.
- Vendor verification actions are audit-logged.
- Prices, coupons, commissions, and stock are recalculated server-side.
- Payment provider events are verified server-side.
- Payout actions require explicit authorization and audit records.

## Background jobs

Use Queues for:

- vendor approval notifications
- order assignment notifications
- fulfillment reminders
- payout eligibility checks
- review reminders
- shipment updates
- analytics processing

Use Workflows for staged vendor onboarding, dispute handling, returns, and payout review flows.

## Analytics

Use Analytics Engine for non-sensitive events:

- vendor application submitted
- product published
- order created
- order split created
- vendor order shipped
- payout requested
- payout completed

Do not store payment credentials, sensitive verification documents, or private customer details in analytics events.

## Production checklist

- [ ] Vendor approval status is defined
- [ ] Product ownership is checked server-side
- [ ] Customer orders and vendor orders are separated
- [ ] Payments, commissions, and payouts are separate records
- [ ] Vendor payout eligibility is explicit
- [ ] Vendor files use permission checks
- [ ] Returns and disputes are defined
- [ ] Admin actions are audit-logged
- [ ] Payment webhooks are verified
- [ ] Backup and rollback plans exist

## Common mistakes

- treating customer orders and vendor orders as the same record
- exposing one vendor’s data to another vendor
- calculating commissions in browser code
- paying vendors immediately without return/dispute rules
- storing vendor verification files without access controls
- allowing vendor staff to access platform-wide reports
- skipping audit logs for payout decisions

## Related docs

- [`architectures/marketplace.md`](./marketplace.md)
- [`architectures/e-commerce.md`](./e-commerce.md)
- [`architectures/authentication-authorization.md`](./authentication-authorization.md)
- [`catalog/d1.md`](../catalog/d1.md)
- [`catalog/r2.md`](../catalog/r2.md)
- [`catalog/queues.md`](../catalog/queues.md)
- [`catalog/workflows.md`](../catalog/workflows.md)
- [`catalog/turnstile.md`](../catalog/turnstile.md)
- [`catalog/access.md`](../catalog/access.md)
