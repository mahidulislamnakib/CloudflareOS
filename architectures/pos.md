# POS Architecture

A Cloudflare-first reference for a point-of-sale system with counter sales, products, inventory, receipts, returns, staff roles, and branch operations.

## Starting stack

| Need | Service |
| --- | --- |
| POS web app | Pages or Workers |
| API | Workers |
| Sales and inventory | D1 |
| Receipts and documents | R2 |
| Small cache/config | KV |
| Sync and notifications | Queues |
| Internal access | Access |
| Staff login protection | Turnstile / app auth |
| Operational events | Analytics Engine |

Start with Workers, D1, R2, and app authentication. Add Queues when receipt delivery, reporting, and stock alerts grow.

## Core model

```text
Business
  ↓
Branches
  ↓
Products and stock
  ↓
Counter sale
  ↓
Payment and receipt
  ↓
Inventory movement and reports
```

## Suggested D1 tables

```text
users
workspaces
branches
staff_members
products
product_variants
inventory_items
inventory_movements
sales
sale_items
payments
receipts
customers
returns
cash_sessions
cash_movements
attachments
audit_logs
settings
```

Minimum sale fields:

```text
id
workspace_id
branch_id
cashier_user_id
customer_id
status
subtotal
discount_total
tax_total
grand_total
created_at
updated_at
```

## Sale flow

```text
Cashier selects products
  ↓
System validates price and stock
  ↓
Sale is created
  ↓
Payment is recorded
  ↓
Inventory movement is created
  ↓
Receipt is generated
```

Do not trust prices, discounts, or stock values coming only from the client interface.

## Inventory model

Use immutable or audited inventory movements.

```text
inventory_movements
- id
- branch_id
- variant_id
- type
- quantity_change
- sale_id
- reason
- created_at
```

Examples:

```text
stock_received
sale_completed
return_received
manual_adjustment
transfer_out
transfer_in
```

A live stock number may be stored for speed, but movement history should remain the source for investigation and reconciliation.

## Cash session model

Track each cashier shift separately.

```text
cash_sessions
- id
- branch_id
- cashier_user_id
- opened_at
- opening_cash
- closed_at
- closing_cash
- status
```

Use cash movement records for cash in, cash out, and adjustments.

## Returns model

Keep returns separate from the original sale.

```text
returns
- id
- sale_id
- branch_id
- requested_by_user_id
- approved_by_user_id
- status
- reason
- created_at
```

A completed return should create a corresponding inventory movement and payment adjustment record.

## Receipt and document model

Store generated receipt files in R2 and metadata in D1.

```text
R2:
workspaces/{workspace_id}/branches/{branch_id}/receipts/{sale_id}.pdf
```

Private receipts should require an ownership or staff-permission check.

## Offline-tolerant pattern

Do not pretend a browser-only POS is fully offline-safe by default.

For temporary connection loss:

```text
POS saves pending actions locally
  ↓
Connection returns
  ↓
Worker receives queued actions
  ↓
Server validates stock, price, and idempotency key
  ↓
Action is accepted or rejected
```

Every syncable sale needs a unique client-generated idempotency key to prevent duplicate sales.

## API route plan

```text
/api/products
/api/inventory
/api/sales
/api/sales/:id
/api/payments
/api/returns
/api/cash-sessions
/api/branches
/api/admin/products
/api/admin/inventory-adjustments
/api/admin/reports
```

## Security rules

- Every request checks workspace and branch access.
- Cashiers can create sales only for allowed branches.
- Discounts, returns, and manual stock changes require role checks.
- Sensitive actions create audit records.
- Internal dashboards are protected with Access.
- Receipt and report downloads require permission checks.

## Background jobs

Use Queues for:

- receipt email or message delivery
- low-stock alerts
- end-of-day report generation
- branch summary notification
- sync retry follow-up
- analytics processing

## Analytics

Use Analytics Engine for non-sensitive events:

- sale completed
- return completed
- cash session opened
- low stock triggered
- receipt generated

Do not place customer payment details or personal data into analytics events.

## Production checklist

- [ ] Branch access is checked server-side
- [ ] Price and stock are validated server-side
- [ ] Inventory movements are tracked
- [ ] Returns create matching stock/payment adjustments
- [ ] Cash sessions are recorded
- [ ] Offline sync uses idempotency keys
- [ ] Sensitive actions are audit-logged
- [ ] Private receipts require permission checks
- [ ] Admin tools are protected
- [ ] Backup and rollback plans exist

## Common mistakes

- allowing client-side price changes
- editing stock without a movement record
- mixing returns with original sale rows
- skipping cash-session tracking
- treating offline queued actions as automatically valid
- creating duplicate sales during sync retries
- exposing reports or receipts without permission checks

## Related docs

- [`architectures/e-commerce.md`](./e-commerce.md)
- [`architectures/erp-lite.md`](./erp-lite.md)
- [`architectures/authentication-authorization.md`](./authentication-authorization.md)
- [`catalog/d1.md`](../catalog/d1.md)
- [`catalog/r2.md`](../catalog/r2.md)
- [`catalog/queues.md`](../catalog/queues.md)
- [`catalog/access.md`](../catalog/access.md)
