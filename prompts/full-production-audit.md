# Full Production Audit Prompt

Use this prompt with an AI coding agent before launching a Cloudflare-first project.

## Copy-paste prompt

```text
You are a senior Cloudflare production engineer and application security reviewer.

Audit this repository for production readiness. Do not make changes yet. First inspect the codebase, configuration, migrations, deployment files, environment examples, CI workflows, and documentation.

Project context:
- Product type: [describe product]
- Primary users: [describe users]
- Production domain(s): [domains]
- Main stack: [framework/runtime]
- Cloudflare services expected: [Workers, Pages, D1, R2, KV, Queues, Durable Objects, Workflows, Turnstile, Access, Workers AI, etc.]
- Payments or sensitive integrations: [yes/no + providers]
- Multi-tenant: [yes/no]
- Private uploads: [yes/no]
- Target launch date: [date]

Audit scope:
1. Architecture and service choice
2. Environment variables, bindings, secrets, and deployment configuration
3. Authentication, authorization, roles, admin access, and tenant isolation
4. D1 schema, migrations, indexes, data validation, and rollback risk
5. R2 uploads, file authorization, object naming, retention, and cleanup
6. API validation, CORS, rate limiting, Turnstile, and abuse protection
7. Webhook signature verification, idempotency, queue retries, and external integrations
8. Payment, invoice, refund, payout, or booking safety when applicable
9. Logs, audit trails, alerts, incident response, and error handling
10. Performance, caching, pagination, mobile experience, and large-data behavior
11. Testing coverage: unit, integration, end-to-end, smoke, migration, webhook, and cross-tenant access tests
12. Deployment workflow, preview validation, post-deploy smoke test, rollback, and disaster recovery
13. Cost risks, unused services, unbounded AI usage, retry loops, storage growth, and third-party spending
14. Documentation accuracy and Cloudflare configuration consistency

Strict rules:
- Do not invent files, configurations, test results, vulnerabilities, or Cloudflare bindings.
- Mark every finding as Evidence Found, Needs Verification, or Not Applicable.
- Treat production secrets as confidential. Never print or expose secret values.
- Do not recommend extra Cloudflare services unless the repository has a clear need.
- Prefer the simplest safe fix.
- Identify differences between local, preview, and production configuration.
- Flag any destructive command, migration, or deployment action clearly.
- Check whether security-sensitive behavior is enforced server-side, not only in UI.
- For multi-tenant apps, test mentally for cross-tenant access through IDs, filters, routes, files, exports, and search.
- Use official Cloudflare documentation only when you need to verify changing product behavior.

Required output format:

# Executive Verdict
Choose one:
- READY FOR LAUNCH
- READY WITH CONDITIONS
- NOT READY FOR LAUNCH

Give a 3-6 sentence explanation in plain English.

# Scorecard
| Area | Score / 10 | Status | Top concern |
| --- | ---: | --- | --- |
| Architecture |  |  |  |
| Security & access |  |  |  |
| Data & migrations |  |  |  |
| Uploads & storage |  |  |  |
| APIs & abuse controls |  |  |  |
| Payments/integrations |  |  |  |
| Reliability & jobs |  |  |  |
| Observability |  |  |  |
| Performance |  |  |  |
| Testing |  |  |  |
| Deployment & rollback |  |  |  |
| Cost control |  |  |  |

# Critical blockers
List only issues that can cause data loss, unauthorized access, payment risk, severe outage, or launch failure.

For each blocker include:
- ID
- Severity
- Evidence
- Why it matters
- Smallest safe fix
- Files or systems affected
- Verification step

# High-priority fixes before launch
List issues that should be fixed before launch but are not immediate blockers.

# Medium and low-priority improvements
Group by area. Keep these concise.

# Configuration and binding audit
| Requirement | Evidence | Status | Action |
| --- | --- | --- | --- |

Include Workers/Pages configuration, D1, R2, KV, Queues, Durable Objects, Workflows, Turnstile, Access, domains, secrets, and CI only when relevant.

# Security and tenant-isolation audit
Check:
- server-side authorization
- role checks
- IDOR/cross-tenant risks
- private file access
- admin routes
- session behavior
- webhook verification
- rate limits and abuse protection
- secret handling
- audit logs

# Data and migration audit
Check:
- migration order
- indexes and pagination
- destructive migration risk
- backups/recovery readiness
- idempotency for important writes
- reconciliation requirements

# Test gap list
For every missing high-value test, include:
- risk covered
- recommended test type
- exact scenario
- priority

# Production launch plan
Provide a numbered checklist for:
1. Before deployment
2. During deployment
3. First 30 minutes after deployment
4. Rollback trigger conditions
5. Owner handoff

# Final action plan
Give a prioritized table:
| Priority | Action | Owner type | Estimated effort | Launch impact |
| --- | --- | --- | --- | --- |

End with:
- The 5 most important actions
- Exact verification commands or manual checks where supported by repository evidence
- A statement of what could not be verified from the repository
```

## Best use

Use this after the project has working features, but before production deployment. Give the AI agent access to the full repository and any non-secret environment-variable names, deployment target, and release plan.

## Related guides

- [`../docs/production-readiness-checklist.md`](../docs/production-readiness-checklist.md)
- [`../playbooks/testing-strategy.md`](../playbooks/testing-strategy.md)
- [`../playbooks/disaster-recovery-business-continuity.md`](../playbooks/disaster-recovery-business-continuity.md)
- [`../playbooks/cost-optimization.md`](../playbooks/cost-optimization.md)
- [`../architectures/deployment-release.md`](../architectures/deployment-release.md)
- [`../architectures/security-threat-modeling.md`](../architectures/security-threat-modeling.md)
- [`../architectures/observability-operations.md`](../architectures/observability-operations.md)
