# Healthcare & Clinic Architecture

A Cloudflare-first reference for clinics that manage patients, appointments, practitioners, documents, reminders, invoices, and privacy-aware operations.

> This is a software architecture guide, not medical, legal, or compliance advice. Confirm local health-data, privacy, retention, and billing requirements before launch.

## Starting stack

| Need | Service |
| --- | --- |
| Patient website | Pages or Workers |
| API | Workers |
| Operational records | D1 |
| Reports and uploads | R2 |
| Small cache/config | KV |
| Reminders and exports | Queues |
| Long workflows | Workflows |
| Public appointment forms | Turnstile |
| Staff/admin access | Access |
| Non-sensitive events | Analytics Engine |

## Core model

```text
Clinic
  ↓
Practitioners and staff
  ↓
Patients
  ↓
Appointments
  ↓
Visits, documents, invoices, follow-ups
```

## Suggested D1 tables

```text
users
clinics
staff_members
practitioners
patients
appointments
appointment_status_history
visit_notes
documents
invoices
payments
reminders
consents
audit_logs
settings
```

Minimum appointment fields:

```text
id
clinic_id
patient_id
practitioner_id
starts_at
ends_at
status
reason
created_at
updated_at
```

## Appointment flow

```text
Patient requests appointment
  ↓
Turnstile verifies public form
  ↓
Worker validates availability
  ↓
Appointment is created
  ↓
Reminder job is queued
  ↓
Staff confirms, reschedules, or cancels
```

Do not expose practitioner schedules or patient details through public endpoints.

## Privacy and access model

Every request should follow:

```text
Load current staff user
  ↓
Check clinic membership
  ↓
Check role and patient relationship
  ↓
Validate action
  ↓
Write audit log for sensitive access/change
```

Important rules:

- patients access only their own records
- staff access is limited by clinic and role
- private documents require server-side permission checks
- sensitive exports are restricted and logged
- public forms collect only necessary data

## Document model

Store files in R2 and metadata in D1.

```text
R2:
clinics/{clinic_id}/patients/{patient_id}/{document_id}.pdf

D1 documents:
id
clinic_id
patient_id
object_key
content_type
size
visibility
created_at
```

Never expose private R2 files directly without verifying access.

## Reminder model

Use Queues for reminders such as:

- appointment confirmation
- upcoming appointment reminder
- missed appointment follow-up
- invoice reminder
- document-ready notification

Keep message content minimal and avoid putting sensitive details in notifications.

## Billing model

Keep clinical records, invoices, and payments as separate records.

```text
Appointment or visit
  ↓
Invoice
  ↓
Payment attempt
  ↓
Verified payment event
  ↓
Payment record updated
```

Verify payment provider events server-side.

## API route plan

```text
/api/appointments
/api/practitioners
/api/patients/me
/api/patient-documents
/api/invoices
/api/payments
/api/admin/patients
/api/admin/appointments
/api/admin/staff
/api/admin/audit-logs
/api/forms/appointment-request
```

## Security rules

- Protect staff dashboards with Access and application roles.
- Enforce clinic ID and role checks on every private query.
- Use encrypted secrets and never commit credentials.
- Rate-limit public forms and login endpoints.
- Log sensitive record access, exports, and edits.
- Define retention and deletion processes before launch.

## Analytics

Use Analytics Engine only for non-sensitive events:

- appointment requested
- appointment confirmed
- appointment completed
- reminder delivered
- form error

Do not put medical notes, diagnoses, patient identifiers, or private documents into analytics events.

## Production checklist

- [ ] Clinic and staff membership are checked server-side
- [ ] Patient records are access-controlled
- [ ] Private files require permission checks
- [ ] Appointment status rules are defined
- [ ] Reminder messages avoid sensitive details
- [ ] Staff dashboards are protected
- [ ] Sensitive actions are audit-logged
- [ ] Payment events are verified
- [ ] Data retention and export rules are documented
- [ ] Backup and rollback plans exist

## Common mistakes

- exposing private patient files with static URLs
- using frontend role checks as protection
- placing sensitive data in analytics or notification text
- mixing clinical notes, invoices, and payments in one table
- skipping audit logs for staff access
- collecting more data than an appointment form needs

## Related docs

- [`architectures/authentication-authorization.md`](./authentication-authorization.md)
- [`architectures/multi-tenant-saas.md`](./multi-tenant-saas.md)
- [`catalog/d1.md`](../catalog/d1.md)
- [`catalog/r2.md`](../catalog/r2.md)
- [`catalog/queues.md`](../catalog/queues.md)
- [`catalog/turnstile.md`](../catalog/turnstile.md)
- [`catalog/access.md`](../catalog/access.md)
