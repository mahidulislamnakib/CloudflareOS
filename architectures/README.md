# Architecture Patterns

Architecture patterns explain how Cloudflare services fit together for real application designs.

Use this folder before writing code to choose the smallest useful design, understand data flow, and identify the production controls that matter.

---

## Start here

Choose the guide closest to your product:

| Need | Guide |
| --- | --- |
| Content, articles, resources | [CMS](./cms.md) or [News Portal](./news-portal.md) |
| Workspace product | [SaaS](./saas.md) or [Multi-tenant SaaS](./multi-tenant-saas.md) |
| Buyers and sellers | [Marketplace](./marketplace.md) |
| Online store | [E-commerce](./e-commerce.md) |
| Courses and certificates | [LMS](./lms.md) |
| Travel leads and quotations | [Travel Platform](./travel-platform.md) |
| AI assistant or document Q&A | [AI Chatbot](./ai-chatbot.md) |
| Live rooms, chat, collaboration | [Real-time Collaboration](./realtime-collaboration.md) |
| Public or partner API | [API Platform](./api-platform.md) |

---

## Available architecture guides

### Product and business systems

- [News Portal](./news-portal.md)
- [CMS](./cms.md)
- [SaaS](./saas.md)
- [Multi-tenant SaaS](./multi-tenant-saas.md)
- [Marketplace](./marketplace.md)
- [E-commerce](./e-commerce.md)
- [Learning Management System](./lms.md)
- [Travel Platform](./travel-platform.md)
- [Event Management](./event-management.md)
- [Healthcare & Clinic](./healthcare-clinic.md)
- [POS](./pos.md)
- [IoT Platform](./iot-platform.md)

### Platform and engineering systems

- [Authentication & Authorization](./authentication-authorization.md)
- [AI Chatbot](./ai-chatbot.md)
- [API Platform](./api-platform.md)
- [Microservices](./microservices.md)
- [Real-time Collaboration](./realtime-collaboration.md)
- [Search & Discovery](./search-discovery.md)
- [Data Pipeline & Reporting](./data-pipeline-reporting.md)
- [Notifications & Communication](./notifications-communication.md)
- [Internationalization & Localization](./internationalization-localization.md)
- [Security & Threat Modeling](./security-threat-modeling.md)
- [Observability & Operations](./observability-operations.md)
- [Deployment & Release](./deployment-release.md)

---

## Pattern workflow

```text
Project requirement
  ↓
Choose closest architecture
  ↓
Build the smallest useful version
  ↓
Add data, storage, and access rules
  ↓
Apply production checklist
  ↓
Use deployment and operations guides before launch
```

---

## Standard architecture format

New or substantially revised architecture guides should include:

```md
# Architecture Name

## Goal
## Best for
## Not ideal for
## Smallest useful version
## Production upgrades
## Cloudflare services used
## Data and request flow
## Security and access rules
## Background jobs and failure handling
## Deployment and verification
## Cost and scaling notes
## Production checklist
## Common mistakes
## Related guides
```

A guide may use a shorter format only when it links clearly to shared foundation patterns.

---

## Freshness metadata

Cloudflare services change. New or substantially revised guides should include this block near the top:

```md
> Source: Official Cloudflare documentation
> Last checked: YYYY-MM-DD
> Risk level: Low / Medium / High
```

Use **Low** for stable general guidance, **Medium** for product behavior or pricing-sensitive advice, and **High** for preview, beta, or fast-changing features.

---

## Architecture rules

- Start with the simplest working design.
- Explain why each Cloudflare service is used.
- Say when a service is not required.
- Keep authentication, authorization, tenant isolation, and file permissions server-side.
- Use queues for work that does not need to block the user.
- Include failure modes and common mistakes.
- Link related catalog pages, playbooks, prompts, and templates.
- Keep Cloudflare facts fresh against official sources.
- Make the guide useful for both humans and AI coding agents.

---

## Related docs

- [`docs/PROJECT-ENGINE.md`](../docs/PROJECT-ENGINE.md)
- [`playbooks/README.md`](../playbooks/README.md)
- [`templates/README.md`](../templates/README.md)
- [`prompts/README.md`](../prompts/README.md)
- [`catalog/README.md`](../catalog/README.md)
- [`ROADMAP.md`](../ROADMAP.md)
