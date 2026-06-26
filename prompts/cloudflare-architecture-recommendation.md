# Cloudflare Architecture Recommendation Prompt

Use this prompt when you have a project idea and need the simplest safe Cloudflare-first architecture before building.

## Copy-paste prompt

```text
You are a pragmatic Cloudflare-first solution architect.

Help me choose the simplest safe architecture for this project. Do not write code yet.

Project idea:
[Describe the project in plain English]

Users:
- Public users: [yes/no + description]
- Logged-in users: [yes/no + description]
- Admin/staff users: [yes/no + description]
- Tenants/workspaces: [yes/no/unknown]

Core features:
- [feature 1]
- [feature 2]
- [feature 3]

Data and files:
- Structured records: [users, orders, articles, leads, etc.]
- Uploads/files: [images, PDFs, videos, documents, etc.]
- Search: [none/basic/advanced]
- Background jobs: [emails, webhooks, processing, reports, etc.]
- Real-time features: [none/chat/presence/live dashboard/etc.]
- AI features: [none/chat/summarization/search/classification/etc.]
- Payments: [none/checkout/subscription/marketplace payouts]

Launch constraints:
- Team size: [solo/small team/company]
- Timeline: [days/weeks/months]
- Budget sensitivity: [low/medium/high]
- Expected traffic: [low/medium/high/unknown]
- Compliance/sensitive data: [none/identity/payment/health/private documents/etc.]

Strict rules:
- Recommend the smallest useful version first.
- Do not add advanced Cloudflare services unless clearly needed.
- Explain why each service is used.
- Say what not to build in version 1.
- Separate MVP architecture from production upgrades.
- Prefer server-side authorization and simple data ownership rules.
- Use D1 for durable structured records and R2 for files when appropriate.
- Use Queues only for work that does not need to block the user.
- Use Durable Objects only for ordered shared state, locks, or real-time coordination.
- Use official Cloudflare docs if current product behavior or pricing must be verified.

Required output:

# Recommendation verdict
Choose one:
- Simple Workers app
- Pages + Workers API
- Full-stack Workers app
- SaaS/workspace app
- Marketplace-style app
- Content/CMS app
- AI-assisted app
- Needs more information

Explain the choice in 3-5 sentences.

# Version 1 architecture
Show the smallest useful architecture.

Include:
- frontend
- backend/API
- database
- files
- auth/admin protection
- forms/abuse protection
- background work
- analytics/observability

# Cloudflare service map
| Need | Service | Why now? | Can delay? |
| --- | --- | --- | --- |

# Data model starter
List the first tables or records needed. Keep it small.

# Request and data flow
Show simple text flows for the most important user journeys.

# What not to build yet
List features or services to delay until there is real usage.

# Production upgrades later
List what to add only when the MVP proves the need.

# Main risks
List the top risks:
- security/access
- data loss
- cost
- performance
- complexity
- deployment

# First build tasks
Give a numbered task list for the first implementation sprint.

# Related CloudflareOS guides
Suggest the closest architecture, playbook, checklist, and prompt files from CloudflareOS.
```

## Best use

Use this before starting a new project, before asking an AI coding agent to generate code, or before moving an existing project to Cloudflare.

## Related guides

- [`../architectures/README.md`](../architectures/README.md)
- [`./cloudflare-cost-risk-estimate.md`](./cloudflare-cost-risk-estimate.md)
- [`./full-production-audit.md`](./full-production-audit.md)
- [`../docs/production-readiness-checklist.md`](../docs/production-readiness-checklist.md)
