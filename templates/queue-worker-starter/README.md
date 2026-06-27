# Queue Worker Starter

A runnable Cloudflare Worker + Queues + D1 starter for safe background jobs.

It accepts a small job request through an admin-protected HTTP route, records the job in D1, sends it to a Queue, processes it asynchronously, retries transient failures with a delay, and records jobs that reach the dead-letter queue.

> Source: [Official Cloudflare Queues documentation](https://developers.cloudflare.com/queues/)
>
> Last checked: 2026-06-27
>
> Risk level: Medium

## What this template does

- queues `email`, `report`, and `image` job messages
- stores job status, attempt count, timestamps, and a safe failure summary in D1
- uses one Worker as both Queue producer and consumer
- retries failed primary-queue messages with a bounded backoff delay
- routes repeatedly failing primary jobs to a dead-letter queue
- records dead-lettered jobs and acknowledges them for deliberate manual review
- protects HTTP enqueue and status routes with an `ADMIN_API_TOKEN` secret
- keeps the actual provider action as a safe placeholder until you add your provider

This is a reference for email delivery, report generation, image processing, notifications, search indexing, and webhooks. It is not a full workflow/orchestration engine.

## Cloudflare services used

| Service | Why it is used |
| --- | --- |
| Workers | HTTP producer and queue consumer logic |
| Queues | Moves non-critical work off the user request path |
| D1 | Job ledger, idempotency check, attempt tracking, and dead-letter status |

## Folder structure

```text
queue-worker-starter/
├── README.md
├── package.json
├── tsconfig.json
├── wrangler.jsonc.example
├── .dev.vars.example
├── .gitignore
├── migrations/
│   └── 0001_create_background_jobs.sql
└── src/
    └── index.ts
```

## Flow

```text
Admin request
  ↓
Validate job input
  ↓
Create queued D1 record
  ↓
Send message to primary Queue
  ↓
Consumer loads current job state
  ↓
Process once or retry with delay
  ↓
Mark completed, retrying, or dead-lettered in D1
```

## API routes

### Public

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Basic health response |

### Admin

All admin routes require:

```text
Authorization: Bearer YOUR_ADMIN_API_TOKEN
```

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/admin/jobs` | Queue a background job |
| `GET` | `/api/admin/jobs/:jobId` | Read safe job status and attempt information |

### Queue a job

```json
{
  "kind": "email",
  "payload": {
    "template": "welcome",
    "recipientReference": "user_123"
  }
}
```

Allowed kinds:

```text
email
report
image
```

The starter deliberately does not send an email, generate a report, or process an image. It writes a safe event log. Replace the placeholder in `performJob()` only after adding provider-specific validation, secrets, idempotency, and monitoring.

## Required bindings

Copy `wrangler.jsonc.example` to `wrangler.jsonc`, then replace:

```text
REPLACE_WITH_D1_DATABASE_ID
```

This template expects:

```text
DB     D1 database binding
JOBS   Queue producer binding
```

Queue consumer bindings are configured in `wrangler.jsonc`.

## Create queues

Create the primary and dead-letter queues before deploying:

```bash
npx wrangler queues create background-jobs
npx wrangler queues create background-jobs-dlq
```

The template configures `background-jobs` with a small batch, bounded retry count, and `background-jobs-dlq` as its dead-letter queue.

## Required secret

Set a long random token. Do not put it in source code, `wrangler.jsonc`, or commits.

```bash
npx wrangler secret put ADMIN_API_TOKEN
```

For local development, copy `.dev.vars.example` to `.dev.vars` and set a local value.

## Local setup

```bash
npm install
cp wrangler.jsonc.example wrangler.jsonc
cp .dev.vars.example .dev.vars
```

Create a D1 database, place its ID in `wrangler.jsonc`, then apply the local migration:

```bash
npm run db:migrate:local
npm run dev
```

Use a separate local or preview database during development. Do not point local tests at a production database.

## Deploy

```bash
npm run typecheck
npm run db:migrate:remote
npx wrangler secret put ADMIN_API_TOKEN
npm run deploy
```

Before production deployment, confirm that the queue names, D1 binding, migration target, and secret are correct for that environment.

## Smoke test

With the Worker running locally:

```bash
curl http://127.0.0.1:8787/health

curl -X POST http://127.0.0.1:8787/api/admin/jobs \
  -H "Authorization: Bearer replace-this-for-local-dev" \
  -H "Content-Type: application/json" \
  -d '{"kind":"email","payload":{"template":"welcome","recipientReference":"user_123"}}'
```

Copy the returned `jobId`, then inspect the status:

```bash
curl http://127.0.0.1:8787/api/admin/jobs/JOB_ID \
  -H "Authorization: Bearer replace-this-for-local-dev"
```

To test retry and dead-letter behavior locally, enqueue a non-production simulation job:

```bash
curl -X POST http://127.0.0.1:8787/api/admin/jobs \
  -H "Authorization: Bearer replace-this-for-local-dev" \
  -H "Content-Type: application/json" \
  -d '{"kind":"report","payload":{"simulateFailure":true}}'
```

The primary consumer intentionally retries this job. After the configured retry budget, the dead-letter consumer records it as `dead_lettered` in D1. Remove `simulateFailure` before adapting this starter for real use.

## Job status values

| Status | Meaning |
| --- | --- |
| `queued` | Stored and sent to the primary queue |
| `processing` | A consumer is handling the job |
| `completed` | The current job handler finished successfully |
| `retrying` | A primary consumer attempt failed and the message was retried |
| `dead_lettered` | The primary queue exhausted retries and the DLQ consumer recorded the job |
| `enqueue_failed` | The D1 record was created but queue publishing failed; manual recovery is needed |

## Production upgrades

Add these only when the product needs them:

- replace the admin token with real identity, roles, tenant permissions, and audit logs
- create job-specific payload schemas instead of one generic payload object
- add an outbox/dispatcher pattern when strong database-to-queue delivery guarantees are required
- add provider idempotency keys and reconciliation for email, payments, exports, or webhooks
- add a restricted internal DLQ review screen and safe requeue workflow
- add alerting for queue backlog, dead-lettered jobs, repeated failures, and growing retry counts
- separate producers and consumers when traffic, deploy isolation, or team ownership requires it
- add rate limits and quotas for actions that can enqueue expensive work
- use object storage for large inputs and place only references in queue messages

## Common mistakes

- treating queued as the same as completed
- performing payment, email, export, or image work directly in the user request
- retrying permanent validation failures forever
- throwing for one bad message and causing an entire batch to retry unnecessarily
- replaying a dead-letter job without understanding why it failed
- storing secret values or private documents directly in queue payloads
- using a message ID as the only idempotency guarantee for a business action
- forgetting that a D1 write and Queue publish are not one atomic transaction
- allowing normal users to enqueue arbitrary provider actions without validation and rate limits
- deleting job records before support, reconciliation, or audit needs are understood

## Related guides

- [`../../catalog/queues.md`](../../catalog/queues.md)
- [`../../catalog/d1.md`](../../catalog/d1.md)
- [`../../architectures/observability-operations.md`](../../architectures/observability-operations.md)
- [`../../playbooks/api-design-contracts.md`](../../playbooks/api-design-contracts.md)
- [`../../playbooks/data-modeling-d1.md`](../../playbooks/data-modeling-d1.md)
- [`../../playbooks/testing-strategy.md`](../../playbooks/testing-strategy.md)
- [`../../playbooks/disaster-recovery-business-continuity.md`](../../playbooks/disaster-recovery-business-continuity.md)
- [`../../prompts/cloudflare-binding-verification.md`](../../prompts/cloudflare-binding-verification.md)
