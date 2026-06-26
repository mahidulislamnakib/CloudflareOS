# Cloudflare AI Gateway

Cloudflare AI Gateway helps applications manage AI requests across providers with features for observability, caching, rate controls, retries, and request governance.

Use AI Gateway when your product calls external AI models and you want one controlled layer between your app and AI providers.

---

## Simple explanation

AI Gateway sits between your application and AI providers.

```text
User request
  ↓
Worker or app backend
  ↓
AI Gateway
  ↓
AI provider or model
  ↓
Response returns to your app
```

It helps you see, control, and improve AI traffic without rewriting every feature separately.

---

## What problem it solves

AI Gateway helps reduce the complexity of using AI in production.

It is useful for:

- AI request observability
- provider routing
- caching repeated requests
- rate limiting
- retries and error handling
- cost control
- request logs
- evaluation and testing workflows
- team-wide AI governance

---

## When to use AI Gateway

Use AI Gateway when:

- you call one or more external AI providers
- you need visibility into AI requests
- multiple app features use AI
- you want to reduce duplicate AI calls
- you need central controls for AI traffic
- you want to compare providers or models

Good examples:

- chatbot using an external model provider
- AI writing assistant
- internal support copilot
- AI content moderation layer
- SaaS platform with several AI features
- multi-provider fallback strategy

---

## When not to use AI Gateway

AI Gateway may be unnecessary when:

- you do not use AI models
- a single low-volume prototype call is enough
- you use only Workers AI and do not need gateway controls yet
- no shared AI observability is needed

Use Workers AI for Cloudflare-native model inference.

Use AI Gateway when you need a control layer around AI traffic, especially external providers.

---

## Beginner example

A customer-support assistant flow:

```text
Visitor asks question
  ↓
Worker checks permissions and limits
  ↓
AI Gateway sends request to configured model provider
  ↓
Gateway records request behavior
  ↓
Worker returns answer
```

---

## Production notes

For production projects:

- centralize provider configuration
- version prompts used by important features
- use different gateway settings for preview and production
- set usage limits for public AI tools
- define fallback behavior for provider errors
- cache safe repeated requests where appropriate
- log enough metadata for debugging without storing sensitive data
- review cost and latency by feature
- keep application authorization outside the model response

---

## Security notes

Do:

- keep provider API keys in secrets
- protect expensive AI endpoints
- rate limit public AI features
- minimize personal and sensitive data in prompts
- apply authentication before model calls
- review logs and access permissions

Do not:

- expose provider credentials in frontend code
- trust model output as an authorization decision
- send secrets or private documents unnecessarily
- allow unlimited anonymous requests
- treat gateway logs as a substitute for secure audit logs

---

## Cost awareness

AI Gateway can help identify repeated calls, expensive features, and high-usage routes.

Watch:

- request volume
- input and output size
- cache hit rate
- provider/model choice
- retries
- user-level usage limits

Use the smallest suitable model and only call AI when it adds real value.

---

## Common mistakes

- adding AI Gateway but still exposing provider keys in the client
- using AI output as a final security decision
- not setting public usage limits
- logging sensitive prompt content carelessly
- making every app action call a model
- skipping fallback behavior
- treating observability as the same thing as evaluation

---

## Related Cloudflare services

| Service | Relationship |
| --- | --- |
| Workers | Runs authorization and application logic around AI calls |
| Workers AI | Provides Cloudflare-native model inference |
| Vectorize | Supports semantic search and retrieval patterns |
| R2 | Stores source files and AI inputs/outputs when appropriate |
| D1 | Stores AI feature settings, user usage, and reviewed output |
| Queues | Processes slow AI jobs asynchronously |
| Workflows | Coordinates multi-step AI processes |
| Access | Protects internal AI tools and dashboards |

---

## Good starter use cases

- External-provider chatbot
- AI writing assistant
- Support-ticket classifier
- Multi-provider AI prototype
- AI usage and cost monitoring layer

---

## Official sources

- Cloudflare AI Gateway documentation
- AI Gateway provider integration documentation
- AI Gateway observability and caching documentation

---

## Freshness

Last checked: 2026-06-26
Risk level: high

AI Gateway capabilities, providers, limits, and pricing can change quickly. Always verify current official documentation before production use.
