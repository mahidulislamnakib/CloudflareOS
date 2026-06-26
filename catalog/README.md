# Cloudflare Product Catalog

The catalog explains Cloudflare products in a simple, practical, and production-aware way.

Each product guide should help answer one question:

> Should I use this Cloudflare service for my project?

---

## How to use this catalog

Use this folder when you need to choose the right Cloudflare service for a real project.

Start with the problem, not the product name.

| If you need... | Start with... |
| --- | --- |
| A frontend website | Pages or Workers |
| API/backend code | Workers |
| SQL database | D1 |
| File uploads/storage | R2 |
| Cache or small config values | KV |
| Background jobs | Queues |
| Shared live state | Durable Objects |
| Multi-step business process | Workflows |
| AI inference | Workers AI |
| AI routing/observability | AI Gateway |
| Form spam protection | Turnstile |
| Admin access protection | Access |
| Logs and monitoring | Workers Observability / Logs |

---

## Product domains

### Build

Services for application code, deployment, background work, and runtime behavior.

- Workers
- Pages
- Wrangler
- Durable Objects
- Queues
- Workflows
- Containers
- Browser Rendering
- Email Workers

### Data

Services for databases, file storage, cache, search, analytics, and data movement.

- D1
- R2
- KV
- Hyperdrive
- Vectorize
- Analytics Engine
- Pipelines
- R2 Data Catalog

### AI

Services for building, routing, observing, and improving AI-powered applications.

- Workers AI
- AI Gateway
- Agents
- AI Search
- Vectorize

### Media

Services for images, video, transformations, and realtime media features.

- Images
- Stream
- Realtime
- Image Transformations

### Security

Services for protecting apps, APIs, users, and forms.

- WAF
- Turnstile
- Rate Limiting
- API Shield
- Bot Management
- SSL/TLS

### Zero Trust

Services for securing private apps, teams, devices, and networks.

- Access
- Tunnel
- Gateway
- WARP
- Browser Isolation
- DLP

### Network & Delivery

Services for DNS, CDN, traffic routing, availability, and performance.

- DNS
- CDN
- Cache Rules
- Argo
- Load Balancing
- Waiting Room
- Spectrum

### Observe

Services for logs, analytics, audits, and operational visibility.

- Workers Observability
- Logs
- Web Analytics
- Health Checks
- Audit Logs

---

## Standard product guide format

Every product page should follow this structure:

```md
# Product Name

## Simple explanation

Explain the product in plain English.

## What problem it solves

Describe the real-world problem.

## When to use it

List practical use cases.

## When not to use it

Explain where it is a bad fit.

## Beginner example

Show a small example or scenario.

## Production notes

Mention limits, scaling, reliability, and operational concerns.

## Security notes

Mention secrets, permissions, user data, abuse protection, and safe defaults.

## Cost awareness

Explain what can affect cost.

## Common mistakes

List mistakes beginners and AI coding agents often make.

## Related Cloudflare services

Link nearby products.

## Official sources

Link official Cloudflare documentation.

## Freshness

Last checked: YYYY-MM-DD
Risk level: low / medium / high
```

---

## Decision shortcut

Use this quick rule when choosing services:

```text
Need to run code?        Workers
Need to host pages?      Pages
Need SQL?                D1
Need file storage?       R2
Need key-value cache?    KV
Need background jobs?    Queues
Need shared live state?  Durable Objects
Need bot/form defense?   Turnstile
Need private admin?      Access
Need AI inference?       Workers AI
```

---

## Catalog writing rules

- Explain simply first.
- Add engineering detail after the simple explanation.
- Prefer real project examples.
- Mention when **not** to use a service.
- Do not hide limits or tradeoffs.
- Use official Cloudflare docs as the source of truth.
- Add a freshness date for important guidance.
- Make the page useful for both humans and AI coding agents.

---

## Priority pages to add next

- [ ] Workers
- [ ] Pages
- [ ] D1
- [ ] R2
- [ ] KV
- [ ] Queues
- [ ] Durable Objects
- [ ] Workflows
- [ ] Turnstile
- [ ] Access
- [ ] Workers AI
- [ ] AI Gateway
- [ ] Analytics Engine
- [ ] Workers Observability

---

## Final standard

A good catalog page should let someone decide:

> Yes, I should use this service.

or

> No, this is not the right service for my project yet.
