# Project Playbooks

Playbooks turn common Cloudflare-first product and engineering work into practical, production-aware implementation guidance.

Use this folder when you know what you need to build, launch, improve, or recover—but want a safer path than starting from a blank prompt.

---

## Start with the right guide

| Your situation | Start here |
| --- | --- |
| I need a product architecture | [`../architectures/README.md`](../architectures/README.md) |
| I need a safe pre-launch checklist | [Production Readiness Checklist](../docs/production-readiness-checklist.md) |
| I need disciplined AI-agent task tracking and verification | [AI Agent Workflow](./agent-workflow.md) |
| I need to model product data or D1 tables | [Data Modeling & D1 Design](./data-modeling-d1.md) |
| I need to test a feature or release | [Testing Strategy](./testing-strategy.md) |
| I need a recovery and continuity plan | [Disaster Recovery & Business Continuity](./disaster-recovery-business-continuity.md) |
| I need to reduce avoidable cost | [Cost Optimization](./cost-optimization.md) |
| I need faster core journeys | [Performance Optimization](./performance-optimization.md) |
| I need a more usable, inclusive interface | [Accessibility & Inclusive UX](./accessibility-inclusive-ux.md) |
| I need an AI-agent prompt for a task | [`../prompts/README.md`](../prompts/README.md) |

---

## Recommended workflow

```text
Project idea or existing product
  ↓
Choose architecture guide
  ↓
Define smallest useful scope
  ↓
Create BUILD-STATUS.md and task ledger
  ↓
Model core records and access boundaries
  ↓
Build in small, reviewable tasks
  ↓
Verify locally and record evidence
  ↓
Test, audit, and deploy safely
  ↓
Measure, improve, and document lessons
```

---

## Available engineering playbooks

| Playbook | Use for | Key outcomes |
| --- | --- | --- |
| [AI Agent Workflow](./agent-workflow.md) | Preventing lost context and unverified completion during AI-assisted builds | Persistent task ledger, verification references, local checks, handoff discipline |
| [Data Modeling & D1 Design](./data-modeling-d1.md) | Designing durable records, ownership, tenant scope, workflows, migrations, and common query patterns | Clear schema direction, safe access boundaries, indexes, audit history, migration plan |
| [Testing Strategy](./testing-strategy.md) | Creating meaningful coverage for core flows and releases | Test layers, risk-based cases, smoke checks, release gates |
| [Disaster Recovery & Business Continuity](./disaster-recovery-business-continuity.md) | Preparing for outages, bad deploys, data problems, and provider failures | Response roles, recovery flows, communication, exercises |
| [Cost Optimization](./cost-optimization.md) | Preventing avoidable infrastructure, AI, storage, and provider spend | Cost inventory, limits, monthly review, incident response |
| [Performance Optimization](./performance-optimization.md) | Improving real user speed across frontend, API, D1, R2, caching, and mobile | Performance budget, bottleneck checks, resilience, release QA |
| [Accessibility & Inclusive UX](./accessibility-inclusive-ux.md) | Making core journeys usable across devices, input methods, languages, and abilities | Keyboard access, forms, content, mobile, testing, acceptance criteria |

---

## Project playbook direction

Product-specific architecture guides live in [`../architectures/README.md`](../architectures/README.md). Use those for the overall product design, then use this folder for the engineering practices that apply across products.

Typical combinations:

```text
Marketplace architecture
  + AI Agent Workflow
  + Data Modeling & D1 Design
  + Testing Strategy
  + Accessibility & Inclusive UX
  + Cost Optimization
  + Disaster Recovery

News portal architecture
  + AI Agent Workflow
  + Data Modeling & D1 Design
  + Performance Optimization
  + Accessibility & Inclusive UX
  + Disaster Recovery

SaaS architecture
  + AI Agent Workflow
  + Data Modeling & D1 Design
  + Testing Strategy
  + Cost Optimization
  + Performance Optimization
  + Disaster Recovery
```

---

## Standard playbook format

Each new playbook should include:

```md
# Playbook Name

## Goal
## Best for
## Start with the critical journey
## Practical implementation guidance
## Testing workflow
## Production checklist
## Common mistakes
## Related guides
```

A playbook should explain both the smallest safe version and the upgrades that are worth adding only when the product needs them.

---

## Playbook rules

- Start with the smallest useful version.
- Do not add advanced Cloudflare services without a clear need.
- Tie advice to a real user or operational journey.
- Keep private data, permissions, tenant boundaries, and secrets safe.
- Include practical tests and verification steps.
- Include recovery or rollback notes for production-impacting work.
- Keep guidance useful for solo builders and small teams.
- Link to the related architecture, checklist, prompt, or catalog guide.

---

## Related docs

- [`../architectures/README.md`](../architectures/README.md)
- [`../prompts/README.md`](../prompts/README.md)
- [`../docs/production-readiness-checklist.md`](../docs/production-readiness-checklist.md)
- [`../catalog/README.md`](../catalog/README.md)
- [`../ROADMAP.md`](../ROADMAP.md)
