# Learning Management System Architecture

A Cloudflare-first architecture for courses, lessons, enrollments, progress tracking, certificates, and admin operations.

## Starting stack

| Need | Service |
| --- | --- |
| Student website | Pages or Workers |
| API | Workers |
| Course records | D1 |
| Videos, PDFs, attachments | R2 |
| Small cache/config | KV |
| Notifications and exports | Queues |
| Long learning workflows | Workflows |
| Public form protection | Turnstile |
| Internal admin | Access |
| Usage events | Analytics Engine |

Start with Workers, D1, R2, and Turnstile. Add Queues and Workflows only when the learning flow needs them.

## Core flow

```text
Student browses course
  ↓
Enrolls or gains access
  ↓
Opens lesson
  ↓
Progress is stored
  ↓
Completes required lessons
  ↓
Certificate becomes eligible
```

## Suggested D1 tables

```text
users
students
instructors
courses
course_modules
lessons
enrollments
lesson_progress
quizzes
quiz_attempts
certificates
course_files
payments
coupons
notifications
audit_logs
settings
```

Minimum course fields:

```text
id
slug
title
description
status
instructor_id
price
access_type
created_at
updated_at
```

Minimum enrollment fields:

```text
id
student_id
course_id
status
access_starts_at
access_ends_at
created_at
updated_at
```

## Content model

```text
Course
  ↓
Modules
  ↓
Lessons
  ↓
Video, document, quiz, or assignment content
```

Keep lesson content and access rules separate. A course can be published while some lessons remain draft.

## File model

Store files in R2 and metadata in D1.

```text
R2:
courses/{course_id}/lessons/{lesson_id}/{file_id}.pdf

D1 course_files:
id
course_id
lesson_id
object_key
content_type
size
visibility
created_at
```

Use permission checks before serving private lessons, downloads, or certificates.

## Progress model

Track progress as records, not only a percentage.

```text
lesson_progress
- id
- student_id
- lesson_id
- status
- completed_at
- last_position
- updated_at
```

A percentage can be calculated from completed lesson records.

## Access model

Every private course request should check:

```text
Authenticated student
  ↓
Enrollment exists
  ↓
Enrollment is active
  ↓
Lesson belongs to course
  ↓
Student may access lesson
```

Do not rely on hidden URLs for paid or private content.

## Payment model

Keep payment records separate from enrollments.

```text
Order or payment confirmed
  ↓
Webhook verified server-side
  ↓
Enrollment created or activated
  ↓
Student receives access
```

Do not grant paid access from browser callbacks alone.

## Certificate model

Certificates should be generated only after server-side checks.

```text
Required lessons completed
  ↓
Quiz or score requirements met
  ↓
Certificate record created
  ↓
Certificate PDF or page generated
```

Store certificate files in R2 and certificate metadata in D1.

## API route plan

```text
/api/courses
/api/courses/:slug
/api/enrollments
/api/lessons/:id
/api/progress
/api/quizzes/:id/attempts
/api/certificates
/api/admin/courses
/api/admin/lessons
/api/admin/enrollments
/api/webhooks/payments
```

## Security model

Important rules:

- students access only their own enrollments and progress
- instructors manage only their permitted course content
- admin routes are protected with Access and app roles
- private lessons and downloads require server checks
- payment events are verified server-side
- public signup and contact forms use Turnstile
- sensitive admin actions are audit-logged

## Background jobs

Use Queues for:

- enrollment emails
- certificate generation
- course completion notification
- reminder messages
- file processing
- analytics processing

Use Workflows for long onboarding, scheduled learning reminders, or multi-step certificate approval.

## Analytics

Use Analytics Engine for:

- course viewed
- enrollment started
- enrollment completed
- lesson opened
- lesson completed
- quiz submitted
- certificate issued

Do not store sensitive learner details in analytics events.

## Production checklist

- [ ] Course and lesson statuses are defined
- [ ] Private lessons require active enrollment
- [ ] Progress is stored server-side
- [ ] Payment events are verified
- [ ] Certificates are issued after server checks
- [ ] Course files are stored in R2
- [ ] Private files require permission checks
- [ ] Admin routes are protected
- [ ] Student and instructor access checks are tested
- [ ] Public forms are protected
- [ ] Backup and rollback plans exist

## Common mistakes

- exposing paid lesson URLs directly
- granting access from frontend payment callbacks
- storing large files in D1
- using one percentage field as the only progress record
- allowing instructors to edit unrelated courses
- generating certificates without completion checks
- skipping audit logs for admin changes

## Related docs

- [`architectures/authentication-authorization.md`](./authentication-authorization.md)
- [`docs/d1-vs-kv-vs-r2.md`](../docs/d1-vs-kv-vs-r2.md)
- [`catalog/d1.md`](../catalog/d1.md)
- [`catalog/r2.md`](../catalog/r2.md)
- [`catalog/queues.md`](../catalog/queues.md)
- [`catalog/workflows.md`](../catalog/workflows.md)
- [`catalog/turnstile.md`](../catalog/turnstile.md)
- [`catalog/access.md`](../catalog/access.md)
