# Prompt Library

The prompt library helps AI coding agents use CloudflareOS consistently.

Use this folder when you want an AI tool to build, review, migrate, debug, or deploy a Cloudflare-first project.

---

## What these prompts are for

Prompts should make AI coding tools follow the same engineering rules as CloudflareOS:

- simple first
- Cloudflare-first when it fits
- production-aware
- beginner-safe explanations
- no unnecessary services
- clear deployment steps
- safe handling of secrets and data

---

## Prompt workflow

```text
Choose project or task
  ↓
Choose matching prompt
  ↓
Add project context
  ↓
Run with AI coding agent
  ↓
Review output
  ↓
Apply safely
  ↓
Audit before deploy
```

---

## Planned prompt packs

| Prompt | Status | Use for |
| --- | --- | --- |
| Build from playbook | Planned | Generate a project plan or scaffold from a playbook |
| Cloudflare readiness review | Planned | Check if a repo is ready for Cloudflare |
| Migration to Cloudflare | Planned | Convert an existing app to Cloudflare-first architecture |
| D1 schema generator | Planned | Design SQL schema for D1 |
| R2 upload system | Planned | Add safe file upload/storage |
| Queue background jobs | Planned | Add async jobs and event processing |
| Durable Object state | Planned | Add shared live state or coordination |
| Turnstile protection | Planned | Protect forms from bots/spam |
| Server-side tracking | Planned | Add Worker + Queue tracking architecture |
| Production deployment audit | Planned | Check before launch |
| Deployment failure debug | Planned | Diagnose Workers/Pages deployment errors |
| Cost and risk review | Planned | Estimate Cloudflare complexity and cost risk |
| Security review | Planned | Check secrets, auth, uploads, APIs, and admin access |
| Performance review | Planned | Find speed and scaling problems |

---

## Standard prompt format

Every prompt should follow this structure:

```md
# Prompt Name

## Purpose

What this prompt helps with.

## Use when

When this prompt is appropriate.

## Do not use when

When this prompt is not appropriate.

## Prompt

The actual reusable prompt.

## Required context

What the user must provide.

## Expected output

What the AI should return.

## Safety rules

Rules about secrets, production data, migrations, and destructive actions.

## Review checklist

What the user should check before applying output.
```

---

## Universal AI-agent rules

Every prompt should remind AI tools to:

- read `START-HERE.md` and `AGENTS.md` when working inside this repo
- choose the simplest architecture first
- explain why each Cloudflare service is used
- avoid adding advanced services without need
- never expose real secrets
- avoid destructive database changes without warning
- include local test steps
- include deployment steps
- include rollback or recovery notes for production changes

---

## Example base instruction

```text
Use CloudflareOS as the source of guidance.
Read START-HERE.md, AGENTS.md, and the relevant playbook/template first.
Recommend the simplest Cloudflare-first solution that fits the project.
Do not add advanced Cloudflare services unless they are needed.
Explain the implementation step by step.
Include local testing, deployment, and production safety checks.
```

---

## Prompt quality rules

- Prompts must be copy-friendly.
- Prompts must ask for missing context clearly.
- Prompts must discourage unsafe assumptions.
- Prompts must include practical output requirements.
- Prompts must be usable by Codex, Cursor, Claude Code, Copilot, ChatGPT, Gemini CLI, and similar tools.
- Prompts must be updated when Cloudflare guidance changes.

---

## Related docs

- [`AGENTS.md`](../AGENTS.md)
- [`docs/PROJECT-ENGINE.md`](../docs/PROJECT-ENGINE.md)
- [`playbooks/README.md`](../playbooks/README.md)
- [`templates/README.md`](../templates/README.md)
- [`ROADMAP.md`](../ROADMAP.md)
