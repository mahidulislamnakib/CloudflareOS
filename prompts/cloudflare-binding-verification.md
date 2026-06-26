# Cloudflare Binding Verification Prompt

Use this prompt to verify that a Cloudflare-first project has the correct bindings, secrets, environment variables, routes, and deployment configuration before launch.

## Copy-paste prompt

```text
You are a Cloudflare deployment and configuration auditor.

Inspect this repository and verify whether the Cloudflare bindings and deployment configuration match the application code.

Do not change files yet. First produce a clear audit report.

Project context:
- Expected deployment target: [Workers / Pages / Pages Functions / Next.js on Cloudflare / other]
- Expected environments: [local, preview, production]
- Expected Cloudflare services: [D1, R2, KV, Queues, Durable Objects, Workflows, Workers AI, Vectorize, Turnstile, Access, etc.]
- Production domain: [domain]
- Main config file: [wrangler.toml / wrangler.jsonc / other]

Audit these files and areas:
1. wrangler configuration
2. package scripts
3. environment examples
4. source code references to env bindings
5. database migration files
6. queue producer and consumer code
7. R2 upload/download code
8. KV cache/config usage
9. Durable Object declarations
10. Workers AI, Vectorize, or AI bindings
11. Turnstile site key and secret usage
12. CI/deployment workflow files
13. documentation that mentions setup or deploy steps

Strict rules:
- Do not invent missing bindings or resources.
- Do not expose secret values.
- If a binding is referenced in code but missing in config, flag it.
- If a binding exists in config but is unused, flag it as cleanup or verify.
- Check local, preview, and production environments separately if the config supports them.
- Check that secret names are documented without values.
- Check that destructive setup or migration commands are clearly marked.
- Prefer the smallest safe fix.

Required output:

# Binding Verification Verdict
Choose one:
- READY
- READY WITH FIXES
- NOT READY

Explain in 3-5 sentences.

# Binding Matrix
| Binding / variable | Referenced in code | Declared in config | Environment coverage | Status | Action |
| --- | --- | --- | --- | --- | --- |

Include D1, R2, KV, Queues, Durable Objects, Workflows, AI, Vectorize, Turnstile, secrets, routes, and public variables where relevant.

# Missing bindings
List every code reference that is not declared in the Cloudflare config.

For each item include:
- Name
- Type guessed from usage
- Evidence file/path
- Required environment
- Suggested fix

# Unused or suspicious config
List bindings, variables, scripts, or routes that are declared but not clearly used.

# Environment mismatch
Compare local, preview, and production.

Check:
- database names
- bucket names
- queue names
- KV namespaces
- route/domain targets
- environment variables
- secrets required
- migration commands

# Deployment risk
List any issue that could cause:
- failed deployment
- runtime crash
- missing database/table
- broken upload/download
- queue messages not processed
- wrong environment data access
- secret exposure
- production data mutation from local or preview

# Safe fix plan
Give a numbered plan with the smallest safe steps.

# Verification commands or checks
Provide exact commands only when supported by repository evidence.

Examples may include:
- npm run build
- npm test
- wrangler types
- wrangler deploy --dry-run
- wrangler d1 migrations list [database]
- wrangler queues list

Do not invent commands if the repository does not support them.

# Final checklist
- [ ] All code-referenced bindings are declared
- [ ] Required secrets are documented by name only
- [ ] Local and production resources are separated
- [ ] Migration workflow is clear
- [ ] Upload/download bindings are verified
- [ ] Queue producers and consumers match
- [ ] Deployment route/domain is correct
- [ ] No secret value is committed
```

## Best use

Run this before any production deployment, especially after adding D1, R2, KV, Queues, Durable Objects, Workers AI, Vectorize, or Turnstile.

## Related guides

- [`./full-production-audit.md`](./full-production-audit.md)
- [`../docs/production-readiness-checklist.md`](../docs/production-readiness-checklist.md)
- [`../architectures/deployment-release.md`](../architectures/deployment-release.md)
- [`../architectures/security-threat-modeling.md`](../architectures/security-threat-modeling.md)
