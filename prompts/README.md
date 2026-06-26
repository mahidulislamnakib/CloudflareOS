# Prompt Library

Copy-ready prompts for planning, building, auditing, debugging, and safely deploying Cloudflare-first projects with an AI coding agent.

Use this folder after you have an idea, an existing repository, or a deployment problem. Give the chosen prompt enough project context, review the output, then apply changes in small steps.

---

## Start here

| Your situation | Use this prompt |
| --- | --- |
| I have a new project idea | [Cloudflare Architecture Recommendation](./cloudflare-architecture-recommendation.md) |
| I selected an architecture and need a safe build plan | [AI Build Plan](./ai-build-plan.md) |
| I need to confirm Cloudflare configuration before deploy | [Cloudflare Binding Verification](./cloudflare-binding-verification.md) |
| I need a full pre-launch assessment | [Full Production Audit](./full-production-audit.md) |
| A deployment is failing | [Deployment Failure Diagnosis](./deployment-failure-diagnosis.md) |
| I am changing a D1 or SQL schema | [Database Migration Readiness](./database-migration-readiness.md) |
| I need a focused security review | [Security Risk Summary](./security-risk-summary.md) |
| I need cost and complexity guidance | [Cloudflare Cost & Risk Estimate](./cloudflare-cost-risk-estimate.md) |

---

## Recommended workflow

### New Cloudflare-first project

```text
Project idea
  ↓
Architecture Recommendation
  ↓
AI Build Plan
  ↓
Small, reviewable implementation tasks
  ↓
Binding Verification
  ↓
Full Production Audit
  ↓
Launch
```

### Existing repository or release

```text
Repository review
  ↓
Binding Verification
  ↓
Database Migration Readiness when schema changes
  ↓
Security Risk Summary
  ↓
Full Production Audit
  ↓
Deploy and smoke test
```

### Deployment failure

```text
Exact error log
  ↓
Deployment Failure Diagnosis
  ↓
Smallest safe fix
  ↓
Binding Verification
  ↓
Preview deploy and smoke test
```

---

## Available prompts

### Plan and build

| Prompt | Use for | Output |
| --- | --- | --- |
| [Cloudflare Architecture Recommendation](./cloudflare-architecture-recommendation.md) | Choosing the simplest safe design for a new project | MVP architecture, service map, first tasks, delayed features |
| [AI Build Plan](./ai-build-plan.md) | Turning an architecture into safe coding tasks | Repository findings, build plan, bindings, safety checks |
| [Cloudflare Cost & Risk Estimate](./cloudflare-cost-risk-estimate.md) | Evaluating complexity, cost drivers, and scaling risk | Service justification, cost controls, simplification plan |

### Audit and release

| Prompt | Use for | Output |
| --- | --- | --- |
| [Full Production Audit](./full-production-audit.md) | Final pre-launch review of a working project | Launch verdict, scorecard, blockers, action plan |
| [Cloudflare Binding Verification](./cloudflare-binding-verification.md) | Matching code with Workers/Pages configuration and bindings | Binding matrix, environment gaps, deployment risks |
| [Database Migration Readiness](./database-migration-readiness.md) | Reviewing D1 or SQL schema changes | Migration verdict, rollout, recovery, tests |
| [Security Risk Summary](./security-risk-summary.md) | Prioritizing application security issues | Risk register, remediation plan, verification steps |

### Debug

| Prompt | Use for | Output |
| --- | --- | --- |
| [Deployment Failure Diagnosis](./deployment-failure-diagnosis.md) | Investigating failed build, deploy, runtime, route, or binding behavior | Evidence-based diagnosis, smallest safe fix, verification checks |

---

## Universal AI-agent rules

Every prompt should make the AI agent:

- inspect the repository before suggesting changes
- separate evidence from assumptions
- choose the simplest architecture first
- explain why each Cloudflare service is used
- avoid adding advanced services without a clear need
- never expose or commit real secrets
- avoid destructive migrations and irreversible operations
- make changes in small, reviewable tasks
- include verification and rollback/recovery notes for production changes

---

## Provide this context

The AI agent will give better output when you provide:

```text
project goal
users and sensitive data
current stack and deployment target
Cloudflare services already used
core version 1 features
known error logs or failing behavior
database and storage details
production constraints, timeline, and budget sensitivity
```

Do not share secret values, access tokens, passwords, or private customer data in the prompt.

---

## Prompt quality rules

A CloudflareOS prompt should be:

- copy-friendly
- specific about required context
- grounded in repository evidence
- safe around secrets, production data, and migrations
- clear about uncertainty
- focused on practical actions and verification
- useful for Codex, Cursor, Claude Code, Copilot, ChatGPT, Gemini CLI, and similar tools

---

## Related docs

- [`AGENTS.md`](../AGENTS.md)
- [`START-HERE.md`](../START-HERE.md)
- [`architectures/README.md`](../architectures/README.md)
- [`playbooks/README.md`](../playbooks/README.md)
- [`docs/production-readiness-checklist.md`](../docs/production-readiness-checklist.md)
- [`ROADMAP.md`](../ROADMAP.md)
