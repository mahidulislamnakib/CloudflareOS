# Event Management Architecture

A Cloudflare-first reference for events, registrations, tickets, attendees, payments, check-in, certificates, and organizer operations.

## Starting stack

| Need | Service |
| --- | --- |
| Event website | Pages or Workers |
| API | Workers |
| Event records | D1 |
| Tickets, certificates, media | R2 |
| Cache/config | KV |
| Notifications | Queues |
| Multi-step event flows | Workflows |
| Public form protection | Turnstile |
| Organizer/admin access | Access |
| Usage events | Analytics Engine |

Start with Workers, D1, R2, and Turnstile. Add Queues for confirmations, reminders, and certificate delivery.

## Core model

```text
Organizer
  ↓
Event
  ↓
Ticket types
  ↓
Registrations
  ↓
Attendees
  ↓
Check-in and certificates
```

## Suggested D1 tables

```text
users
organizers
events
venues
ticket_types
registrations
attendees
payments
checkins
certificates
speakers
sessions
sponsors
attachments
notifications
audit_logs
settings
```

Minimum event fields:

```text
id
slug
title
description
organizer_id
venue_id
starts_at
ends_at
status
created_at
updated_at
```

Minimum registration fields:

```text
id
event_id
attendee_id
ticket_type_id
status
payment_status
checkin_status
created_at
updated_at
```

## Registration flow

```text
Visitor opens event page
  ↓
Selects ticket type
  ↓
Submits registration
  ↓
Payment is confirmed if required
  ↓
Registration becomes active
  ↓
Ticket or confirmation is delivered
```

Do not confirm paid registration from browser callbacks alone.

## Ticket model

Use ticket types for access rules.

```text
General Admission
VIP
Student
Free Guest
Organizer Pass
```

Each registration should have a unique ticket or check-in reference.

## Check-in flow

```text
Staff scans ticket reference
  ↓
Worker validates event and registration
  ↓
Check-in status is updated
  ↓
Activity/audit record is created
```

Prevent duplicate check-in unless a staff role explicitly overrides it.

## Payment model

Keep payment records separate from registrations.

```text
Registration created
  ↓
Payment attempt created
  ↓
Verified provider event received
  ↓
Payment record updated
  ↓
Registration activated
```

## File model

Store media, tickets, and certificates in R2 and metadata in D1.

```text
R2:
events/{event_id}/certificates/{certificate_id}.pdf

D1 attachments:
id
event_id
resource_type
resource_id
object_key
content_type
size
created_at
```

Private certificates and organizer files require permission checks.

## API route plan

```text
/api/events
/api/events/:slug
/api/registrations
/api/tickets
/api/checkins
/api/certificates
/api/admin/events
/api/admin/registrations
/api/admin/checkins
/api/webhooks/payments
```

## Security rules

- Public registration forms use Turnstile.
- Attendees access only their own registration data.
- Organizers manage only permitted events.
- Check-in endpoints require staff permission.
- Payment events are verified server-side.
- Sensitive organizer changes are audit-logged.
- Private certificates require permission checks.

## Background jobs

Use Queues for:

- registration confirmation
- payment receipt delivery
- event reminder
- ticket generation
- certificate delivery
- waitlist notification
- post-event feedback request

Use Workflows for long approval, waitlist, or certificate processes.

## Analytics

Use Analytics Engine for:

- event viewed
- registration started
- registration completed
- payment completed
- attendee checked in
- certificate issued

Do not store sensitive attendee details in analytics events.

## Production checklist

- [ ] Event and ticket statuses are defined
- [ ] Paid registration is activated only after verified payment
- [ ] Check-in references are unique
- [ ] Duplicate check-in rules are defined
- [ ] Attendee access checks are tested
- [ ] Organizer/admin routes are protected
- [ ] Public forms use Turnstile
- [ ] Tickets and certificates are stored in R2
- [ ] Sensitive event changes are audit-logged
- [ ] Backup and rollback plans exist

## Common mistakes

- trusting frontend payment confirmation
- exposing attendee lists publicly
- allowing duplicate check-in without rules
- storing ticket PDFs in D1
- skipping organizer access checks
- sending unprotected certificate links
- using public forms without abuse protection

## Related docs

- [`architectures/authentication-authorization.md`](./authentication-authorization.md)
- [`architectures/e-commerce.md`](./e-commerce.md)
- [`docs/d1-vs-kv-vs-r2.md`](../docs/d1-vs-kv-vs-r2.md)
- [`catalog/d1.md`](../catalog/d1.md)
- [`catalog/r2.md`](../catalog/r2.md)
- [`catalog/queues.md`](../catalog/queues.md)
- [`catalog/workflows.md`](../catalog/workflows.md)
- [`catalog/turnstile.md`](../catalog/turnstile.md)
- [`catalog/access.md`](../catalog/access.md)
