# E-commerce Architecture

A Cloudflare-first reference for an online store with products, carts, checkout, orders, files, and admin operations.

## Starting stack

| Need | Service |
| --- | --- |
| Storefront | Pages or Workers |
| API | Workers |
| Store records | D1 |
| Images and invoices | R2 |
| Public cache/config | KV |
| Background tasks | Queues |
| Public form protection | Turnstile |
| Internal admin | Access |
| Custom events | Analytics Engine |

Start with Workers, D1, R2, and Turnstile. Add the rest only when needed.

## Core flow

```text
Customer browses product
  ↓
Adds item to cart
  ↓
Starts checkout
  ↓
Order is created
  ↓
Payment provider confirmation is verified server-side
  ↓
Order becomes paid
  ↓
Fulfillment starts
```

Never trust payment status, prices, discounts, or stock values received only from the browser.

## Suggested D1 tables

```text
users
customers
products
product_variants
product_categories
product_images
inventory_items
carts
cart_items
orders
order_items
payments
shipping_addresses
shipments
coupons
coupon_redemptions
refunds
audit_logs
settings
```

## Product model

Use a parent product and purchasable variants.

```text
Product: T-shirt
  ↓
Variants:
- Small / Black
- Medium / Black
- Large / White
```

Track price and stock against variants where possible.

## Cart and checkout rules

A cart is temporary state. At checkout, the server must re-check:

- product availability
- variant status
- current price
- coupon eligibility
- stock quantity
- customer permissions

Store a price snapshot on order items so later product price changes do not rewrite historical orders.

## Payment rules

Keep order status separate from payment status.

```text
Order created
  ↓
Payment attempt
  ↓
Verified provider event
  ↓
Payment record updated
  ↓
Order status updated
```

Store provider event IDs and make webhook processing safe to retry.

## Media model

Store files in R2 and metadata in D1.

```text
R2:
products/{product_id}/images/{file_id}.webp

D1 product_images:
id
product_id
object_key
alt_text
sort_order
created_at
```

Do not store image files directly in D1.

## API route plan

```text
/api/products
/api/products/:slug
/api/categories
/api/cart
/api/checkout
/api/coupons/validate
/api/my-orders
/api/admin/products
/api/admin/inventory
/api/admin/orders
/api/admin/coupons
/api/webhooks/payments
```

## Security model

```text
Request
  ↓
Authenticate user where required
  ↓
Check role or order ownership
  ↓
Validate request data
  ↓
Recalculate sensitive values server-side
  ↓
Apply action
  ↓
Audit sensitive admin changes
```

Important rules:

- buyers see only their own orders
- admin routes are protected with Access and app roles
- checkout totals are always calculated server-side
- coupon checks happen server-side
- private invoices and documents require permission checks

## Background jobs

Use Queues for:

- order confirmation
- invoice generation
- stock update follow-up
- shipment notification
- review request
- analytics processing

Use Workflows for delayed reminders, refund review, or long-running fulfillment flows.

## Caching

Cache public product pages, categories, images, and store settings.

Do not treat cached inventory, carts, payment status, customer orders, or admin data as public cache targets.

## Production checklist

- [ ] Product and variant statuses are defined
- [ ] Stock is checked server-side
- [ ] Cart totals are recalculated server-side
- [ ] Payment events are verified server-side
- [ ] Payment state is separate from order state
- [ ] Product images are stored in R2
- [ ] Customer order access is checked
- [ ] Admin routes are protected
- [ ] Coupons are revalidated at checkout
- [ ] Admin changes are audit-logged
- [ ] Public checkout is rate-limited and protected
- [ ] Backup and rollback plans exist

## Common mistakes

- trusting browser-provided totals
- combining payment and order states
- storing product images in D1
- skipping provider event verification
- allowing coupons without server validation
- exposing internal order tools publicly
- treating cached inventory as the only source of truth

## Related docs

- [`architectures/marketplace.md`](./marketplace.md)
- [`architectures/authentication-authorization.md`](./authentication-authorization.md)
- [`docs/d1-vs-kv-vs-r2.md`](../docs/d1-vs-kv-vs-r2.md)
- [`catalog/d1.md`](../catalog/d1.md)
- [`catalog/r2.md`](../catalog/r2.md)
- [`catalog/queues.md`](../catalog/queues.md)
- [`catalog/turnstile.md`](../catalog/turnstile.md)
- [`catalog/access.md`](../catalog/access.md)
