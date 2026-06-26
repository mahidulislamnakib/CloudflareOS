# Notifications & Communication Architecture

A Cloudflare-first reference for email, SMS, push, in-app notifications, user preferences, delivery tracking, retries, and admin communication controls.

## Goal

Build a communication layer that is reliable, consent-aware, retry-safe, and separate from normal request handling.

Use this architecture for:

- account alerts
- order and booking updates
- lead follow-up
- course reminders
- system announcements
- password reset and verification messages
- marketing opt-in campaigns
- in-app notification centers

## Starting stack

| Need | Service |
| --- | --- |
| Notification API | Workers |
| Notification records | D1 |
| Background delivery | Queues |
| Long schedules | Workflows |
| Templates and attachments | R2 |
| Preferences/cache | KV |
| Internal communication tools | Access |
| Delivery analytics | Analytics Engine |

Start with Workers, D1, and Queues. Keep sending work outside user-facing requests.

## Core model

```text
Business event happens
  ↓
Notification record created
  ↓
Queue receives delivery job
  ↓
Channel provider sends message
  ↓
Delivery outcome stored
  ↓
User sees in-app status or receives external message
```

## Suggested D1 tables

```text
notifications
notification_templates
notification_preferences
notification_deliveries
notification_channels
announcements
user_devices
email_verifications
password_resets
audit_logs
settings
```

Minimum notification fields:

```text
id
workspace_id
user_id
type
channel
status
template_key
payload_reference
created_at
sent_at
read_at
```

Minimum delivery fields:

```text
id
notification_id
provider
provider_message_id
status
attempt_count
last_error
sent_at
delivered_at
```

## Notification event pattern

Use business events rather than sending messages directly from every module.

```text
order.paid
booking.confirmed
lead.assigned
course.completed
password.reset_requested
invoice.overdue
```

The event creates a notification request. A separate worker or queue consumer decides how and when to deliver it.

## Channel model

Common channels:

```text
in_app
email
sms
push
webhook
```

A user may allow some channels and refuse others. Keep urgent security messages separate from marketing preferences where local rules permit.

## Preference model

Store user preferences explicitly.

```text
notification_preferences
- id
- user_id
- channel
- notification_type
- enabled
- updated_at
```

Examples:

- order updates: enabled
- learning reminders: enabled
- marketing email: disabled
- push notifications: enabled

Do not send optional marketing messages when preference is disabled.

## In-app notification flow

```text
Business event
  ↓
Notification record created in D1
  ↓
User opens app
  ↓
Worker returns unread notifications
  ↓
User marks notification read
```

In-app notifications are useful even when external delivery fails.

## External delivery flow

```text
Notification request created
  ↓
Queue consumer loads template and user preference
  ↓
Provider request sent
  ↓
Provider result stored
  ↓
Retry if transient failure
```

Do not keep retrying permanently. Define maximum attempts, expiry, and escalation rules.

## Template model

Keep templates versioned and separate from business logic.

```text
notification_templates
- id
- key
- channel
- locale
- subject
- body
- status
- version
```

Template data should be structured and validated before rendering.

## Attachments and exports

Store large attachments or generated documents in R2.

```text
R2:
notifications/{notification_id}/attachments/{file_id}.pdf
```

Only generate or link private files after checking the recipient's access.

## Scheduling and reminders

Use Queues for immediate asynchronous delivery.

Use Workflows for:

- appointment reminders
- abandoned checkout reminders
- multi-step onboarding
- scheduled report delivery
- escalation sequences
- delayed follow-up after no response

Every scheduled message should be cancellable when the related business state changes.

## API route plan

```text
/api/notifications
/api/notifications/unread
/api/notifications/:id/read
/api/preferences/notifications
/api/admin/templates
/api/admin/announcements
/api/admin/deliveries
```

Keep provider webhooks separate from user-facing notification APIs.

## Security rules

- Verify recipient ownership before returning private notifications.
- Protect internal template and announcement tools with Access.
- Do not expose provider keys in frontend code.
- Validate message payload data before rendering templates.
- Keep sensitive details out of SMS, push, and broad notifications.
- Audit announcement, template, and preference changes.
- Verify provider webhooks when delivery providers support signatures.

## Observability

Track:

- notification created
- queued
- sent
- delivered
- failed
- retried
- opened or read when available
- provider webhook failure

Do not log full private message content, tokens, or sensitive customer data in analytics events.

## Production checklist

- [ ] Notification sending runs asynchronously
- [ ] Delivery attempts are tracked
- [ ] Retries are bounded and idempotent
- [ ] User preferences are enforced
- [ ] Critical and marketing messages are distinguished
- [ ] Templates are versioned
- [ ] Private attachments require permission checks
- [ ] Provider credentials are stored as secrets
- [ ] Admin communication tools are protected
- [ ] Delivery failures are visible
- [ ] Scheduled reminders can be cancelled
- [ ] Backup and rollback plans exist

## Common mistakes

- sending email or SMS inside a user request
- retrying messages forever
- ignoring user preferences
- putting sensitive information in push or SMS text
- hard-coding templates in business modules
- exposing provider credentials in browser code
- not tracking delivery outcomes
- forgetting to cancel reminders after the underlying event changes

## Related docs

- [`architectures/observability-operations.md`](./observability-operations.md)
- [`architectures/api-platform.md`](./api-platform.md)
- [`architectures/data-pipeline-reporting.md`](./data-pipeline-reporting.md)
- [`catalog/workers.md`](../catalog/workers.md)
- [`catalog/d1.md`](../catalog/d1.md)
- [`catalog/r2.md`](../catalog/r2.md)
- [`catalog/kv.md`](../catalog/kv.md)
- [`catalog/queues.md`](../catalog/queues.md)
- [`catalog/workflows.md`](../catalog/workflows.md)
- [`catalog/access.md`](../catalog/access.md)
