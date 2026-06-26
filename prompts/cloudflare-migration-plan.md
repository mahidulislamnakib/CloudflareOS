# Cloudflare Migration Plan Prompt

Use this prompt when moving an existing project from VPS, traditional hosting, Supabase/Neon, S3-style storage, or mixed infrastructure into a simpler Cloudflare-first architecture.

## Copy-paste prompt

```text
You are a Cloudflare migration architect.

Review this existing project and create a safe migration plan to Cloudflare-first infrastructure. Do not modify code yet.

Current project context:
- Current hosting: [VPS / Vercel / Netlify / shared hosting / other]
- Current backend: [Node / Laravel / Django / Rails / other]
- Current frontend: [Next.js / React / Vue / plain / other]
- Current database: [Postgres / MySQL / Supabase / Neon / SQLite / other]
- Current file storage: [local disk / S3 / Supabase Storage / other]
- Current auth: [custom / provider / none]
- Current background jobs: [cron / queue / none]
- Current domains: [domains]
- Sensitive data: [payments, identity docs, private files, health, etc.]

Migration goal:
- Target Cloudflare services: [Workers, Pages, D1, R2, KV, Queues, Access, Turnstile, etc.]
- Desired complexity: [minimal / production-ready / phased]
- Downtime tolerance: [none / low / acceptable]
- Migration deadline: [date]

Strict rules:
- Do not recommend a full rewrite unless clearly necessary.
- Prefer phased migration over big-bang migration.
- Separate frontend, API, database, storage, DNS, and background-job migration.
- Identify what should stay outside Cloudflare if it is not a good fit yet.
- Do not invent current database schema, data volume, or provider limits.
- Do not expose secrets.
- Flag destructive or irreversible steps clearly.
- Recommend the simplest safe target architecture.

Required output:

# Migration verdict
Choose one:
- EASY MIGRATION
- PHASED MIGRATION RECOMMENDED
- HIGH-RISK MIGRATION
- NOT ENOUGH INFORMATION

Explain why.

# Current system map
Map the existing frontend, backend, database, files, jobs, domains, secrets, and integrations.

# Target Cloudflare-first architecture
Show the recommended target using Cloudflare services only where they fit.

# Migration phases
Give a phased plan:
1. Discovery and inventory
2. Static/frontend move
3. API or Worker layer
4. Database plan
5. File storage plan
6. Jobs and webhooks
7. DNS/domain cutover
8. Production verification
9. Cleanup of old infrastructure

# Data migration plan
Cover:
- schema mapping
- export/import method
- validation
- rollback/recovery
- dual-write or read-only window if needed
- reconciliation after cutover

# File migration plan
Cover:
- object naming
- metadata mapping
- private access rules
- temporary public URLs risk
- validation after copy
- cleanup of old files

# Risk register
| Risk | Severity | Evidence/assumption | Mitigation | Owner type |
| --- | --- | --- | --- | --- |

# What not to migrate yet
List parts that should remain unchanged until later.

# Cutover checklist
- [ ] DNS plan confirmed
- [ ] secrets configured by name only
- [ ] bindings verified
- [ ] migrations tested
- [ ] uploads tested
- [ ] auth tested
- [ ] webhooks tested
- [ ] rollback plan ready
- [ ] old system kept available until verification passes

# First safe task
Recommend the first small task that can be done without risking production.
```

## Related guides

- [`./cloudflare-architecture-recommendation.md`](./cloudflare-architecture-recommendation.md)
- [`./cloudflare-binding-verification.md`](./cloudflare-binding-verification.md)
- [`./database-migration-readiness.md`](./database-migration-readiness.md)
- [`../architectures/deployment-release.md`](../architectures/deployment-release.md)
- [`../playbooks/disaster-recovery-business-continuity.md`](../playbooks/disaster-recovery-business-continuity.md)
