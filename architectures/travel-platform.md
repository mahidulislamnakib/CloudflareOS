# Travel Platform Architecture

A Cloudflare-first architecture for building a travel platform with leads, quotations, visa services, tickets, document uploads, agency assignment, booking workflows, and admin operations.

---

## Goal

Build a travel platform that can collect customer requests, assign leads, manage documents, and support operational workflows without becoming too complex too early.

This architecture is designed for:

- travel agencies
- visa service platforms
- manpower/travel lead systems
- Hajj/Umrah service portals
- medical tourism platforms
- student visa platforms
- agency quotation marketplaces

---

## Recommended starting stack

| Need | Service |
| --- | --- |
| Frontend | Pages or Workers |
| Backend/API | Workers |
| App database | D1 |
| Documents/files | R2 |
| Cache/config | KV |
| Background jobs | Queues |
| Long workflows | Workflows |
| Public form protection | Turnstile |
| Admin/internal protection | Access |
| Analytics | Analytics Engine |

Start with Workers, D1, R2, and Turnstile. Add Queues and Workflows when assignment, reminders, and document processing become important.

---

## Architecture overview

```text
Customer
  ↓
Travel request form
  ↓
Workers API
  ├── D1 leads, agencies, quotations, bookings
  ├── R2 passports, documents, attachments
  ├── KV public config/cache
  ├── Queues notifications and follow-ups
  └── Workflows long service processes

Admin / Agency
  ↓
Access or app login
  ↓
Dashboard
  ↓
Workers API
```

---

## Core actors

Start with these roles:

- customer
- agency user
- lead manager
- admin
- support/reviewer

Add finance, document officer, or verifier roles only when operations require them.

---

## Core flow

```text
Customer submits travel request
  ↓
Turnstile verifies public form
  ↓
Lead is stored in D1
  ↓
Documents are stored in R2
  ↓
Admin reviews lead
  ↓
Lead assigned to agency or staff
  ↓
Agency sends quotation
  ↓
Customer accepts or requests changes
  ↓
Booking/service process begins
```

---

## Suggested D1 tables

```text
users
customers
agencies
agency_users
service_types
countries
leads
lead_documents
assignments
quotations
bookings
payments
status_updates
messages
notifications
audit_logs
settings
```

Minimum lead fields:

```text
id
customer_id
service_type
country
travel_date
budget
status
assigned_agency_id
created_at
updated_at
```

Recommended lead statuses:

```text
new
reviewing
assigned
quoted
accepted
in_progress
completed
cancelled
rejected
```

---

## Document storage model

Store documents in R2 and metadata in D1.

```text
R2:
travel/{lead_id}/documents/{document_id}.pdf
travel/{booking_id}/vouchers/{file_id}.pdf

D1 lead_documents table:
id
lead_id
owner_user_id
object_key
document_type
content_type
size
status
created_at
```

Do not store passports, PDFs, images, or vouchers directly in D1.

---

## Assignment model

Use an assignment table instead of only storing one assigned user field.

```text
assignments
- id
- lead_id
- assigned_to_type
- assigned_to_id
- assigned_by_user_id
- status
- note
- created_at
```

This keeps assignment history clear.

---

## Quotation model

Quotations should be separate from leads.

```text
quotations
- id
- lead_id
- agency_id
- amount
- currency
- inclusions
- exclusions
- validity_until
- status
- created_at
```

Recommended quotation statuses:

```text
draft
sent
accepted
rejected
expired
revised
```

---

## API route plan

Public routes:

```text
/api/leads
/api/forms/travel-request
/api/service-types
/api/countries
```

Customer routes:

```text
/api/me
/api/my-leads
/api/my-documents
/api/my-quotations
```

Agency routes:

```text
/api/agency/leads
/api/agency/quotations
/api/agency/bookings
```

Admin routes:

```text
/api/admin/leads
/api/admin/agencies
/api/admin/assignments
/api/admin/quotations
/api/admin/bookings
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
Role or agency membership
  ↓
Lead/document access permission
  ↓
Status allows the action
  ↓
Audit log created
```

Important rules:

- public forms use Turnstile
- agencies see only assigned leads
- customers see only their own requests
- documents require permission checks
- admin assignment changes are logged
- payment status is verified server-side

---

## Background jobs

Use Queues for:

- notify admin about new lead
- notify agency about assignment
- send customer quotation email
- remind agency about pending quotation
- process uploaded document metadata
- update analytics events
- send status update messages

Use Workflows for:

- visa process tracking
- document collection steps
- booking confirmation process
- long-running customer follow-up
- multi-step approval flow

---

## Caching strategy

Good cache targets:

- country list
- service type list
- public package categories
- homepage sections
- public settings

Do not cache:

- lead details
- customer documents
- agency assignments
- payment status
- admin dashboards

---

## Analytics

Use Analytics Engine for events such as:

- lead submitted
- quotation sent
- quotation accepted
- document uploaded
- booking started
- service completed
- form abandoned

Do not store passport numbers, document details, or sensitive customer data in analytics events.

---

## Production checklist

Before launch:

- [ ] Public forms use Turnstile
- [ ] Agencies can only see assigned leads
- [ ] Customers can only see own records
- [ ] Document upload limits exist
- [ ] R2 objects have D1 metadata
- [ ] Assignment history is stored
- [ ] Quotation statuses are clear
- [ ] Payment webhook is verified server-side
- [ ] Admin actions are audit-logged
- [ ] Sensitive data is not in analytics
- [ ] Backup/export plan exists
- [ ] Rollback plan exists

---

## Common mistakes

- giving agencies access to all leads
- storing documents in D1
- trusting frontend payment status
- skipping assignment history
- mixing lead status and booking status
- collecting too much sensitive data too early
- sending document links without permission checks
- building complex workflows before lead intake works

---

## Related docs

- [`docs/d1-vs-kv-vs-r2.md`](../docs/d1-vs-kv-vs-r2.md)
- [`catalog/workers.md`](../catalog/workers.md)
- [`catalog/d1.md`](../catalog/d1.md)
- [`catalog/r2.md`](../catalog/r2.md)
- [`catalog/kv.md`](../catalog/kv.md)
- [`catalog/queues.md`](../catalog/queues.md)
- [`catalog/workflows.md`](../catalog/workflows.md)
- [`catalog/turnstile.md`](../catalog/turnstile.md)
- [`catalog/access.md`](../catalog/access.md)
