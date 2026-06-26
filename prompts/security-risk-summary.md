# Security Risk Summary Prompt

Use this prompt to identify the highest-impact security risks in a Cloudflare-first application and turn them into a small, prioritized remediation plan.

## Copy-paste prompt

```text
You are an application security reviewer for a Cloudflare-first product.

Review this repository and produce a practical security risk summary. Do not modify code yet.

Project context:
- Product type: [describe product]
- Users: [public users / staff / vendors / customers / tenants]
- Authentication method: [describe if known]
- Sensitive data handled: [payments, identity documents, health data, private files, etc.]
- Cloudflare services used: [Workers, D1, R2, KV, Queues, Durable Objects, Turnstile, Access, etc.]
- Multi-tenant: [yes/no]
- Public endpoints: [list]
- Admin endpoints: [list]

Inspect:
1. Authentication and session handling
2. Authorization, roles, tenant isolation, and object ownership
3. Public forms, APIs, rate limits, CORS, and abuse controls
4. File upload/download permissions and object storage access
5. Secrets, tokens, environment variables, and logging
6. Webhook signature verification and idempotency
7. Payment, refund, payout, or booking actions if present
8. Admin access, audit logs, and sensitive internal actions
9. Input validation, output handling, and error messages
10. Dependencies and risky third-party integrations
11. Deployment configuration and production-only exposure risks
12. Incident response and recovery readiness

Strict rules:
- Do not invent vulnerabilities, test results, or missing controls.
- Separate Evidence Found from Needs Verification.
- Do not reveal secret values.
- Prioritize realistic application risks over generic security theory.
- Prefer the smallest safe remediation.
- Treat cross-tenant data access, private file exposure, payment misuse, and secret leakage as high severity.
- Explain uncertainty clearly.

Required output:

# Security verdict
Choose one:
- ACCEPTABLE FOR LIMITED LAUNCH
- NEEDS SECURITY FIXES BEFORE LAUNCH
- HIGH-RISK / DO NOT LAUNCH

Give a plain-English explanation.

# Risk summary
| ID | Severity | Area | Evidence | Impact | Smallest safe fix |
| --- | --- | --- | --- | --- | --- |

Use severity: Critical, High, Medium, Low.

# Critical and high risks
For each risk include:
- exact evidence or missing verification
- likely attack or failure path
- affected users/data
- smallest safe fix
- how to verify the fix
- owner type

# Tenant and object-access review
Check explicitly:
- IDs in routes and queries
- workspace/tenant filters
- ownership checks
- admin-only routes
- private file download paths
- exports and search results

# Secrets and deployment review
Check:
- committed secret risk
- secret names and environment coverage
- logging risk
- preview/production separation
- Access protection for internal tools

# Abuse and integration review
Check:
- rate limits
- Turnstile or equivalent where needed
- upload limits
- webhook signatures
- duplicate event handling
- provider failure behavior

# Remediation plan
Give a prioritized table:
| Priority | Action | Risk reduced | Estimated effort | Verification |
| --- | --- | --- | --- | --- |

# What could not be verified
List missing evidence, configuration, provider settings, or production-only controls that require manual review.

End with the 5 most important next actions.
```

## Related guides

- [`./full-production-audit.md`](./full-production-audit.md)
- [`./cloudflare-binding-verification.md`](./cloudflare-binding-verification.md)
- [`../architectures/security-threat-modeling.md`](../architectures/security-threat-modeling.md)
- [`../architectures/authentication-authorization.md`](../architectures/authentication-authorization.md)
- [`../docs/production-readiness-checklist.md`](../docs/production-readiness-checklist.md)
