# Cloudflare Analytics Engine

Cloudflare Analytics Engine is a service for writing and querying high-volume custom analytics events from Workers.

Use Analytics Engine when your application needs event data such as page actions, API usage, tracking events, performance measurements, or product activity without using your main application database for every event.

---

## Simple explanation

Analytics Engine is a place to send event-style data from Workers.

```text
User action or API request
  ↓
Worker records event
  ↓
Analytics Engine stores event data
  ↓
Dashboard or query reads aggregate insights
```

It is best for understanding patterns, not for storing your app's main business records.

---

## What problem it solves

Analytics Engine helps you capture large numbers of lightweight events without putting unnecessary write pressure on D1 or an external database.

It is useful for:

- product analytics
- server-side tracking
- API request analytics
- feature usage tracking
- campaign attribution
- custom performance metrics
- conversion events
- operational event logging
- dashboard counters and trends

---

## When to use Analytics Engine

Use Analytics Engine when:

- you need many event records
- you want trends, counts, and breakdowns
- the data is primarily analytical
- you do not need relational business queries for every event
- you want Worker-native event collection

Good examples:

- track page events from a Worker
- collect server-side conversion events
- measure API endpoint usage
- track search queries and filter use
- record performance timings
- measure feature adoption in a SaaS app

---

## When not to use Analytics Engine

Analytics Engine is usually not the right choice when:

- you need user accounts or orders as primary records
- you need transactional updates
- you need complex relational queries
- you need file storage
- you need exact shared live state

Use:

- D1 for structured business records
- R2 for files
- KV for lightweight config/cache
- Durable Objects for coordinated state
- Queues for background processing

---

## Beginner example

A server-side tracking flow:

```text
Visitor completes form
  ↓
Worker validates request
  ↓
Worker stores lead in D1
  ↓
Worker writes tracking event to Analytics Engine
  ↓
Dashboard reads conversion trends
```

---

## Production notes

For production projects:

- define a stable event naming convention
- document each field and its meaning
- avoid putting raw sensitive data into events
- keep events small and focused
- separate analytics from business truth
- use consistent timestamps and identifiers
- sample or reduce noisy events when needed
- create dashboards around useful questions
- review retention and query needs before launch

---

## Security notes

Do:

- minimize personal data in events
- hash or pseudonymize identifiers when appropriate
- validate client-provided tracking values
- keep analytics writes inside trusted Worker code
- restrict dashboard access

Do not:

- store passwords, tokens, or secrets in events
- treat analytics data as a secure audit trail by default
- send unvalidated user input directly into analytics fields
- use analytics events as the only record of a critical business action

---

## Cost awareness

Analytics cost and operational load can be affected by:

- number of events written
- event dimensions and data size
- query frequency
- high-cardinality fields
- noisy client behavior

Track events that answer real business or engineering questions. Avoid collecting every possible click without a purpose.

---

## Common mistakes

- using Analytics Engine as the primary database
- storing sensitive data in events
- tracking too many low-value events
- using inconsistent event names
- creating fields without documentation
- confusing analytics with audit logs
- expecting relational database behavior
- building dashboards before defining the decisions they support

---

## Related Cloudflare services

| Service | Relationship |
| --- | --- |
| Workers | Writes custom events and serves analytics APIs |
| Queues | Buffers or processes event-related background work |
| D1 | Stores business records linked to analytical events |
| R2 | Stores exports, reports, or raw files |
| Web Analytics | Provides website-focused analytics alongside custom events |
| Workers Observability | Helps inspect Worker behavior and logs |
| AI Gateway | Can provide AI usage data for AI applications |
| Wrangler | Configures Analytics Engine bindings |

---

## Good starter use cases

- Server-side conversion tracking
- API usage dashboard
- SaaS feature adoption tracking
- Product event analytics
- Search and filter usage insights

---

## Official sources

- Cloudflare Analytics Engine documentation
- Analytics Engine Workers binding documentation
- Analytics Engine query and dataset documentation

---

## Freshness

Last checked: 2026-06-26
Risk level: medium

Analytics Engine capabilities, query options, limits, and pricing can change. Always verify current guidance in the official Cloudflare documentation before production use.
