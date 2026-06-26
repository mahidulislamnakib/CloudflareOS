# Cloudflare Workflows

Cloudflare Workflows helps you build durable, multi-step processes that can continue across retries, delays, and failures.

Use Workflows when a task has several steps and you need the process itself to remember where it is.

---

## Simple explanation

A Workflow is a long-running process made from steps.

Each step can finish, retry, wait, or fail independently.

```text
Start workflow
  ↓
Validate input
  ↓
Create record
  ↓
Wait for external event or delay
  ↓
Send notification
  ↓
Finish
```

---

## What problem it solves

Workflows solve the problem of coordinating business processes that should survive failures, retries, and time gaps.

They are useful for:

- onboarding sequences
- approval flows
- order processing
- payment follow-up
- reminder schedules
- multi-step AI jobs
- document processing pipelines
- campaign automation
- delayed notifications

---

## When to use Workflows

Use Workflows when:

- a process has multiple dependent steps
- you need durable retries
- a process may wait for hours or days
- you need clear state between steps
- failure handling matters
- the process should continue even if one request ends

Good examples:

```text
New customer signup
  ↓
Create account
  ↓
Send welcome email
  ↓
Wait 3 days
  ↓
Check activation
  ↓
Send follow-up only if needed
```

---

## When not to use Workflows

Workflows are usually unnecessary when:

- work is one quick request
- you only need simple background processing
- you only need a message queue
- there is no step-to-step state
- a normal Worker function is enough

Use:

- Workers for short request-time logic
- Queues for independent background jobs
- Durable Objects for coordinated shared state
- D1 for queryable application records

---

## Beginner example

A report export flow:

```text
User requests export
  ↓
Start Workflow
  ↓
Prepare data
  ↓
Generate file
  ↓
Store file in R2
  ↓
Send download notification
```

---

## Production notes

For production projects:

- keep each step small and focused
- design retries to be safe
- store business records in D1
- store generated files in R2
- log workflow identifiers and key outcomes
- define clear failure behavior
- avoid mixing unrelated processes in one workflow
- document timeouts and delay behavior
- test duplicate starts and retries

---

## Security notes

Do:

- validate data before starting a workflow
- authenticate who can start sensitive workflows
- keep secrets in Worker secrets
- minimize sensitive data passed between steps
- verify permissions before irreversible actions

Do not:

- treat workflow state as your only database
- include secrets inside workflow input
- skip authorization for admin-triggered flows
- assume a step runs only once without making it safe to retry

---

## Cost awareness

Workflow cost can be affected by:

- number of workflow instances
- number of steps
- retries
- waits and long-running processes
- connected services such as D1, R2, Queues, and AI APIs

Use Workflows for true multi-step processes, not simple operations.

---

## Common mistakes

- using a Workflow for a one-line task
- putting permanent business data only in workflow state
- writing steps that are unsafe to retry
- combining unrelated business processes
- ignoring failure notifications
- starting duplicate workflows without a plan
- storing files or secrets in workflow data

---

## Related Cloudflare services

| Service | Relationship |
| --- | --- |
| Workers | Starts and interacts with Workflows |
| Queues | Handles independent async jobs around a workflow |
| D1 | Stores application records and workflow references |
| R2 | Stores generated files and exports |
| Durable Objects | Coordinates live shared state when needed |
| KV | Stores lightweight config or cache |
| Workers AI | Can power AI steps in a workflow |
| Wrangler | Deploys and configures Workflows |

---

## Good starter use cases

- User onboarding sequence
- Approval workflow
- Delayed reminder system
- Report generation pipeline
- Multi-step AI content process

---

## Official sources

- Cloudflare Workflows documentation
- Cloudflare Workflows API documentation
- Cloudflare Workflows limits and pricing documentation

---

## Freshness

Last checked: 2026-06-26
Risk level: medium

Workflows are actively evolving. Always verify current APIs, limits, retry behavior, pricing, and production guidance in the official Cloudflare documentation before launch.
