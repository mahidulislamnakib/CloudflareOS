# Server-side Tracking Playbook

Build a Cloudflare-first server-side tracking service for analytics, conversion events, lead tracking, and marketing attribution.

---

## Goal

A server-side tracking service collects important website or app events through your own Cloudflare endpoint, validates them, and forwards them to analytics or advertising platforms from the server side.

This gives you more control, cleaner data, and a reusable tracking layer across multiple projects.

---

## Best for

Use this playbook for:

- lead generation sites
- travel agency websites
- e-commerce starters
- SaaS apps
- course/LMS sites
- marketplaces
- campaign landing pages
- news portals with conversion goals

---

## MVP events

Start with only the events that matter:

```text
page_view
lead_submit
signup
login
checkout_start
purchase
```

Do not start with dozens of events. Track the few events that answer business questions.

---

## Beginner architecture

```text
Website/App
  ↓
Cloudflare Worker /track endpoint
  ↓
Validate event
  ↓
Log event
  ↓
Return success
```

Good first version:

| Need | Cloudflare service |
| --- | --- |
| Event endpoint | Workers |
| Event log | D1 |
| Bot protection | Turnstile or rate limiting |
| Secrets | Worker secrets |

---

## Production architecture

```text
Website/App
  ↓
Cloudflare Worker /track endpoint
  ↓
Validate + normalize event
  ↓
Cloudflare Queue
  ↓
Background Worker
  ├── GA4 Measurement Protocol
  ├── Meta Conversions API
  ├── TikTok Events API
  ├── D1 event log
  └── Analytics Engine
```

Use a Queue so the user request stays fast and provider API failures do not slow down the website.

---

## Cloudflare services used

### Workers

Receives tracking events from websites and apps.

### Queues

Processes events in the background and retries delivery safely.

### D1

Stores a lightweight event log, delivery status, and debugging data.

### Analytics Engine

Stores high-volume analytics when event volume grows.

### KV

Stores simple runtime config, provider toggles, or sampling settings.

### Turnstile / Rate Limiting

Protects tracking endpoints from abuse.

---

## Event payload direction

Minimum event shape:

```json
{
  "event_name": "lead_submit",
  "event_id": "unique-event-id",
  "client_id": "anonymous-client-id",
  "url": "https://example.com/contact",
  "referrer": "https://google.com",
  "payload": {
    "form": "contact"
  }
}
```

Server should add:

```text
ip country or region if needed
user agent
received timestamp
request source
validation status
provider delivery status
```

Avoid collecting sensitive personal data unless there is a clear legal and business reason.

---

## D1 data model direction

Start with these tables:

```text
tracking_events
tracking_deliveries
tracking_sources
```

Minimum `tracking_events` fields:

```text
id
event_name
event_id
client_id
user_id
source
url
referrer
payload_json
created_at
```

Minimum `tracking_deliveries` fields:

```text
id
event_id
provider
status
attempts
last_error
created_at
updated_at
```

---

## Privacy and safety rules

Never collect or forward:

- passwords
- full payment card data
- passport/NID numbers
- private documents
- raw sensitive health data
- unnecessary personal information

Be careful with:

- phone numbers
- email addresses
- names
- precise location
- IP addresses

Use hashing where providers support it and where your legal/privacy rules allow it.

---

## Provider mapping

| Internal event | GA4 | Meta CAPI | TikTok |
| --- | --- | --- | --- |
| page_view | page_view | PageView | PageView |
| lead_submit | generate_lead | Lead | SubmitForm |
| signup | sign_up | CompleteRegistration | CompleteRegistration |
| checkout_start | begin_checkout | InitiateCheckout | InitiateCheckout |
| purchase | purchase | Purchase | CompletePayment |

Keep one internal event name and map it to each provider separately.

---

## Folder structure

```text
tracking-service/
├── src/
│   ├── index.ts
│   ├── events.ts
│   ├── validation.ts
│   ├── queue.ts
│   ├── providers/
│   │   ├── ga4.ts
│   │   ├── meta.ts
│   │   └── tiktok.ts
│   └── db.ts
├── schema/
│   └── tracking.sql
├── wrangler.jsonc
└── README.md
```

Inside a larger app:

```text
lib/tracking/
├── client.ts
├── server.ts
├── events.ts
└── providers/
```

---

## Starter template

Recommended starting templates:

- Simple Workers API
- Queue worker starter
- D1 CRUD starter
- Server-side tracking worker

Until templates are complete, use this playbook as the planning source.

---

## AI build prompt

```text
Use CloudflareOS guidance to build a server-side tracking service.

Create the smallest useful version first:
- Cloudflare Worker /track endpoint
- event validation
- D1 event log
- Queue-based background processing
- provider adapter structure for GA4, Meta CAPI, and TikTok

Do not include real provider secrets.
Use environment variables and Worker secrets.
Explain the folder structure, wrangler bindings, D1 schema, local testing steps, deployment steps, privacy rules, and production checklist.
```

---

## Deployment workflow

```text
1. Create Worker project
2. Create D1 database
3. Create Queue
4. Add bindings in wrangler config
5. Add provider secrets
6. Run locally
7. Send test event
8. Confirm event is queued
9. Confirm provider delivery logs
10. Deploy
```

Suggested resources:

```text
D1 database: tracking-db
Queue: tracking-events
KV namespace: tracking-config
```

---

## Production checklist

Before production:

- [ ] Event names are standardized
- [ ] Event IDs are unique
- [ ] Sensitive data is filtered
- [ ] Provider secrets are stored as secrets
- [ ] Queue retries are understood
- [ ] Failed deliveries are logged
- [ ] Endpoint has abuse protection
- [ ] Test events are separated from production events
- [ ] Consent requirements are documented
- [ ] Privacy policy is updated
- [ ] Event payload size is limited
- [ ] Provider mapping is documented

---

## Common mistakes

- sending events directly from frontend to every provider
- collecting too much personal data
- blocking page load while calling provider APIs
- not using unique event IDs
- not separating test and production events
- not logging provider failures
- hardcoding provider tokens
- skipping consent and privacy review

---

## When to add advanced features

| Feature | Add when |
| --- | --- |
| Analytics Engine | Event volume grows |
| Provider retries | Provider API failures matter |
| Consent mode | Legal/privacy requirements demand it |
| Deduplication | Browser + server events both exist |
| Sampling | Event volume becomes expensive |
| Dashboard | Business team needs visibility |
| Multi-tenant sources | Tracking many projects |

---

## Related resources

- [`playbooks/README.md`](README.md)
- [`templates/README.md`](../templates/README.md)
- [`architectures/README.md`](../architectures/README.md)
- [`catalog/README.md`](../catalog/README.md)
- [`prompts/README.md`](../prompts/README.md)
