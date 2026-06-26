# Cloudflare Cost & Risk Estimate Prompt

Use this prompt before building or scaling a Cloudflare-first application to estimate likely cost drivers, operational risks, and simpler alternatives.

## Copy-paste prompt

```text
You are a Cloudflare architecture, cost, and operational-risk reviewer.

Review this project plan or repository and estimate the likely cost drivers, scaling risks, and unnecessary complexity. Do not make changes yet.

Project context:
- Product type: [describe product]
- Expected users in first 3 months: [estimate]
- Expected monthly requests: [estimate or unknown]
- Expected file uploads/storage: [estimate]
- Expected background jobs: [estimate]
- Expected AI usage: [none / low / medium / high]
- Expected third-party providers: [payments, email, SMS, maps, AI, etc.]
- Proposed Cloudflare services: [Workers, D1, R2, KV, Queues, Durable Objects, Workflows, Workers AI, Vectorize, etc.]
- Multi-tenant: [yes/no]
- Real-time features: [yes/no]
- Launch budget: [monthly budget or unknown]

Audit scope:
1. Whether each proposed Cloudflare service is justified
2. Main likely usage meters and cost drivers
3. Cost risks from requests, storage, retries, AI, media, and third parties
4. Simpler architecture alternatives
5. Scaling risks that could create surprise cost or reliability problems
6. Need for rate limits, quotas, retention, cleanup, caching, and feature flags
7. Cost ownership and monitoring requirements
8. What cannot be estimated without current pricing or real traffic data

Strict rules:
- Do not invent current Cloudflare prices, limits, or plan details.
- Use official Cloudflare documentation only when current pricing or product behavior must be verified.
- Separate estimates from facts.
- Prefer a cost-driver model over fake precision.
- Recommend the simplest safe architecture.
- Do not recommend extra services unless there is a clear product need.
- Flag assumptions explicitly.

Required output:

# Executive recommendation
Choose one:
- SIMPLE AND COST-AWARE
- VIABLE WITH CONTROLS
- OVERCOMPLEX FOR CURRENT STAGE
- HIGH COST / HIGH RISK

Explain in plain English.

# Service justification matrix
| Service | Why it is proposed | Necessary now? | Main risk | Simpler alternative | Recommendation |
| --- | --- | --- | --- | --- | --- |

# Cost-driver model
For each relevant area, describe what increases cost:

| Area | Primary driver | Secondary driver | Risk level | Control |
| --- | --- | --- | --- | --- |
| Workers |  |  |  |  |
| D1 |  |  |  |  |
| R2 |  |  |  |  |
| KV |  |  |  |  |
| Queues |  |  |  |  |
| Durable Objects |  |  |  |  |
| AI |  |  |  |  |
| Third parties |  |  |  |  |

# Top cost and scaling risks
List the highest-impact risks with:
- evidence or assumption
- why it matters
- likely trigger
- smallest safe control
- owner type

# Simplification opportunities
List services, features, or workflows that can be delayed until usage justifies them.

# Required controls before launch
Check for:
- rate limits
- pagination
- file size limits
- queue retry limits
- AI input/output limits
- tenant quotas
- temporary-file cleanup
- dashboard/report limits
- provider budget alerts
- feature flags for expensive features

# Monitoring plan
Provide a small monthly review table:
| Metric | Why it matters | Alert threshold | Owner | Action when exceeded |
| --- | --- | --- | --- | --- |

# What cannot be estimated yet
List missing traffic, storage, provider, or pricing details that must be confirmed before setting a hard budget.

# Final action plan
Give the 5 most important actions in priority order.
```

## Related guides

- [`../playbooks/cost-optimization.md`](../playbooks/cost-optimization.md)
- [`./full-production-audit.md`](./full-production-audit.md)
- [`../architectures/observability-operations.md`](../architectures/observability-operations.md)
- [`../architectures/deployment-release.md`](../architectures/deployment-release.md)
