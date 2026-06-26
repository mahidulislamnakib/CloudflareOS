# Real-time Collaboration Architecture

A Cloudflare-first reference for shared documents, live dashboards, chat rooms, presence, comments, and coordinated updates.

## Starting stack

| Need | Service |
| --- | --- |
| Realtime API | Workers |
| Shared live state | Durable Objects |
| Durable records | D1 |
| Attachments | R2 |
| Small config/cache | KV |
| Background tasks | Queues |
| Internal admin | Access |
| Product events | Analytics Engine |

Start with Workers, Durable Objects, and D1. Use Durable Objects only where ordered shared state or live coordination is needed.

## Core model

```text
Workspace
  ↓
Document, room, or channel
  ↓
Participants
  ↓
Live updates and presence
  ↓
Persisted snapshots and activity history
```

## Suggested D1 tables

```text
users
workspaces
memberships
documents
rooms
comments
attachments
activity_logs
notifications
audit_logs
settings
```

Use D1 for durable records, ownership, permissions, document metadata, and snapshots.

## Live room model

Use one Durable Object per collaboration boundary.

```text
One document
or
One chat room
or
One dashboard session
```

```text
Client connects
  ↓
Worker authenticates user
  ↓
Worker routes user to room Durable Object
  ↓
Durable Object manages live state and connections
  ↓
Updates broadcast to authorized participants
```

## Durable Object responsibilities

Good responsibilities:

- track connected participants
- manage presence
- order updates
- coordinate shared counters
- validate room-level permissions
- broadcast updates
- create periodic snapshots

Do not store every large file or full historical dataset inside one Durable Object.

## Document update flow

```text
User edits document
  ↓
Worker checks workspace membership
  ↓
Update reaches document Durable Object
  ↓
Object orders and broadcasts update
  ↓
Snapshot or operation log is persisted to D1
  ↓
Queue handles secondary work
```

Use version numbers, operation IDs, or idempotency keys to avoid duplicate application of retried updates.

## Presence model

Presence should be treated as temporary state.

```text
User joined
User active
User idle
User disconnected
```

Do not treat a presence event as permanent audit data unless the product requires it.

## Chat model

For chat rooms:

```text
Room Durable Object
  ↓
Orders messages
  ↓
Broadcasts to active members
  ↓
Stores durable message record in D1
```

Use D1 for searchable chat history and Durable Objects for real-time delivery and ordering.

## Permission model

Every connection and message should verify:

```text
Authenticated user
  ↓
Workspace membership
  ↓
Room/document access
  ↓
Role permission
  ↓
Allowed action
```

Never trust room IDs, user IDs, or role data coming only from the browser.

## File model

Store attachments in R2 and metadata in D1.

```text
R2:
workspaces/{workspace_id}/documents/{document_id}/{file_id}
```

Private file access requires a Worker permission check.

## API route plan

```text
/api/documents
/api/documents/:id
/api/rooms
/api/rooms/:id/messages
/api/comments
/api/presence
/api/attachments
/api/admin/audit-logs
```

Keep real-time connection routes and normal CRUD routes separate.

## Background jobs

Use Queues for:

- notification delivery
- mention processing
- document export
- search indexing
- activity digest
- analytics processing

Use Workflows for long export, approval, or content-review processes.

## Security rules

- Verify membership before allowing a live connection.
- Enforce room/document permissions server-side.
- Rate-limit messages and connection attempts.
- Validate update size and schema.
- Log sensitive access and admin actions.
- Protect internal tools with Access.
- Use idempotency or operation IDs for retry-safe updates.

## Analytics

Use Analytics Engine for non-sensitive events:

- room joined
- document opened
- update accepted
- comment created
- file attached
- connection error

Do not put document content, private chat messages, or secrets in analytics events.

## Production checklist

- [ ] Each room has a clear ownership boundary
- [ ] Live connections verify membership
- [ ] Update ordering is defined
- [ ] Retries are idempotent
- [ ] Durable snapshots are stored outside live state
- [ ] Private files require permission checks
- [ ] Message and update rate limits exist
- [ ] Admin actions are audit-logged
- [ ] Reconnection behavior is tested
- [ ] Backup and rollback plans exist

## Common mistakes

- using a Durable Object for ordinary CRUD
- trusting browser-supplied room permissions
- storing all collaboration history only in memory
- missing retry protection for updates
- broadcasting private content to unauthorized users
- treating presence as durable business data
- allowing unlimited message or connection rates

## Related docs

- [`architectures/multi-tenant-saas.md`](./multi-tenant-saas.md)
- [`architectures/authentication-authorization.md`](./authentication-authorization.md)
- [`architectures/microservices.md`](./microservices.md)
- [`catalog/workers.md`](../catalog/workers.md)
- [`catalog/d1.md`](../catalog/d1.md)
- [`catalog/r2.md`](../catalog/r2.md)
- [`catalog/queues.md`](../catalog/queues.md)
- [`catalog/durable-objects.md`](../catalog/durable-objects.md)
- [`catalog/access.md`](../catalog/access.md)
