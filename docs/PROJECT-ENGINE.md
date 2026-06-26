# Project Engine

The Project Engine is the core planning layer of CloudflareOS.

Its job is to turn a project idea into a practical Cloudflare implementation plan.

---

## Goal

When someone has an idea, CloudflareOS should help them answer:

- What should I build first?
- Which Cloudflare services should I use?
- What should the architecture look like?
- What folder structure should I start with?
- What database and storage plan do I need?
- What starter template should I copy?
- What prompt should I give my AI coding tool?
- What deployment checklist should I follow?

---

## Core flow

```text
Project idea
  ↓
Project playbook
  ↓
Architecture decision
  ↓
Starter template
  ↓
AI build prompt
  ↓
Deployment workflow
  ↓
Production checklist
```

---

## 1. Project playbooks

Playbooks are ready-made guides for common applications.

Priority playbooks:

- Blog / CMS
- News portal
- AI chat app
- SaaS dashboard
- Admin dashboard
- Marketplace
- Job portal
- Travel agency website
- Course / LMS site
- E-commerce starter
- CRM
- API service
- File manager
- Server-side tracking service

Each playbook should include:

- problem and target user
- MVP feature list
- beginner architecture
- production architecture
- Cloudflare services used
- D1 schema direction
- R2 storage layout
- KV/cache usage if needed
- Queue/background job plan if needed
- authentication and admin access plan
- folder structure
- local setup
- deployment workflow
- scaling notes
- common mistakes
- AI build prompt
- production checklist

---

## 2. Starter templates

Starter templates are reusable starting points that can be copied into real projects.

Priority templates:

- Next.js on Cloudflare starter notes
- Simple Workers API
- D1 CRUD starter
- R2 upload starter
- KV config/cache starter
- Queue worker starter
- Durable Object starter
- Turnstile protected form
- Auth notes
- Server-side tracking worker
- Secure admin dashboard structure

Each template should include:

- folder structure
- required Cloudflare bindings
- example `wrangler.jsonc`
- local development notes
- deployment command
- environment/secrets checklist
- common failure fixes

---

## 3. AI prompt library

Prompts help AI coding tools follow CloudflareOS rules.

Priority prompts:

- Build a project from a playbook
- Review project for Cloudflare readiness
- Convert existing project to Cloudflare-first architecture
- Generate D1 schema from app requirements
- Add R2 upload system
- Add Queue-based background jobs
- Add Durable Object state management
- Add Turnstile protection
- Add server-side tracking
- Run production deployment audit
- Debug Cloudflare deployment failure
- Estimate Cloudflare service cost/risk
- Refactor project to simpler Cloudflare architecture
- Security review for Cloudflare app
- Performance review for Cloudflare app

---

## 4. Architecture decision engine

Decision guides help users choose the right Cloudflare service.

Priority decisions:

- Workers or Pages?
- D1 or KV?
- R2 or database storage?
- Queues or Durable Objects?
- Workers AI or external AI API?
- AI Gateway or direct model calls?
- Access or app-level admin auth?
- Turnstile or rate limiting?
- Analytics Engine or D1 event logs?
- Single Worker or multiple Workers?

Each decision guide should include:

- simple rule
- when to use option A
- when to use option B
- production tradeoffs
- cost/complexity notes
- example project choices

---

## 5. Production checklists

Every project playbook should link to a checklist covering:

- architecture review
- security review
- cost review
- performance review
- deployment review
- rollback plan
- observability plan
- secrets and environment variables
- database migration plan
- file upload safety

---

## Success criteria

The Project Engine is successful when a user can start with a simple project idea and CloudflareOS can guide them to:

- the right architecture
- required Cloudflare services
- database/storage plan
- folder structure
- starter template
- AI build prompt
- deployment workflow
- production checklist
