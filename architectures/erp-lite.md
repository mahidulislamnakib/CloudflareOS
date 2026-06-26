# ERP Lite Architecture

A Cloudflare-first reference for a lightweight business operations system with sales, purchasing, inventory, invoices, expenses, approvals, and reporting.

## Starting stack

| Need | Service |
| --- | --- |
| Business app | Pages or Workers |
| API | Workers |
| Operational records | D1 |
| Documents and invoices | R2 |
| Cache/config | KV |
| Notifications and exports | Queues |
| Long approval flows | Workflows |
| Internal access | Access |
| Product events | Analytics Engine |

Start with Workers, D1, R2, and Access. Add Queues for reminders, exports, and notifications.

## Core model

```text
Workspace
  ↓
Customers, suppliers, products
  ↓
Sales, purchases, inventory
  ↓
Invoices, expenses, payments
  ↓
Reports and audit history
```

Every business record should include `workspace_id`.

## Suggested D1 tables

```text
users
workspaces
memberships
customers
suppliers
products
product_variants
warehouses
inventory_items
inventory_movements
sales_orders
sales_order_items
purchase_orders
purchase_order_items
invoices
invoice_items
expenses
payments
approvals
attachments
audit_logs
settings
```

## Core flows

### Sales

```text
Create sales order
  ↓
Confirm stock and price
  ↓
Create invoice
  ↓
Record payment
  ↓
Fulfill order
```

### Purchasing

```text
Create purchase request
  ↓
Approval if needed
  ↓
Purchase order issued
  ↓
Goods received
  ↓
Inventory updated
  ↓
Supplier invoice recorded
```

### Inventory

```text
Stock received
  ↓
Inventory movement recorded
  ↓
Available stock updated
  ↓
Stock sold, adjusted, or transferred
```

Track inventory with movement records, not only one editable quantity field.

## Document model

Store invoices, receipts, quotations, and attachments in R2.

```text
R2:
workspaces/{workspace_id}/erp/invoices/{invoice_id}.pdf

D1 attachments:
id
workspace_id
resource_type
resource_id
object_key
content_type
size
created_at
```

Private documents require a Worker permission check before access.

## Approval model

Keep approvals separate from the record being approved.

```text
approvals
- id
- workspace_id
- resource_type
- resource_id
- requested_by_user_id
- approved_by_user_id
- status
- created_at
```

Use it for purchases, expenses, discounts, stock adjustments, and payment exceptions.

## API route plan

```text
/api/customers
/api/suppliers
/api/products
/api/inventory
/api/sales-orders
/api/purchase-orders
/api/invoices
/api/expenses
/api/payments
/api/approvals
/api/reports
/api/admin/audit-logs
```

## Security rules

- Every request loads user and active workspace.
- Every query filters by `workspace_id`.
- Sensitive actions require role and approval checks.
- Inventory adjustments are logged.
- Invoice and payment changes are audit-logged.
- Internal dashboards are protected with Access.
- Private documents require permission checks.

## Background jobs

Use Queues for:

- invoice emails
- low-stock alerts
- approval reminders
- recurring report exports
- document generation
- payment follow-up
- daily operational summaries

Use Workflows for multi-step approval, procurement, or month-end close processes.

## Analytics

Use Analytics Engine for non-sensitive operational events:

- sales order created
- purchase order approved
- low stock triggered
- invoice paid
- report exported

Do not send customer financial details or private documents into analytics events.

## Production checklist

- [ ] Tenant isolation is enforced server-side
- [ ] Sales and purchase statuses are defined
- [ ] Inventory movements are immutable or audited
- [ ] Sensitive adjustments require permissions
- [ ] Invoice and payment changes are logged
- [ ] Private files require permission checks
- [ ] Internal tools are protected
- [ ] Approval flow is defined
- [ ] Backup and rollback plans exist

## Common mistakes

- editing stock directly without movement history
- mixing invoices and payments
- allowing unrestricted expense edits
- trusting frontend totals
- storing documents in D1
- skipping audit logs for financial changes
- forgetting workspace filters on reports

## Related docs

- [`architectures/multi-tenant-saas.md`](./multi-tenant-saas.md)
- [`architectures/authentication-authorization.md`](./authentication-authorization.md)
- [`architectures/e-commerce.md`](./e-commerce.md)
- [`catalog/d1.md`](../catalog/d1.md)
- [`catalog/r2.md`](../catalog/r2.md)
- [`catalog/queues.md`](../catalog/queues.md)
- [`catalog/workflows.md`](../catalog/workflows.md)
- [`catalog/access.md`](../catalog/access.md)
