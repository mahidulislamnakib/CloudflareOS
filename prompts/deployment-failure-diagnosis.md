# Deployment Failure Diagnosis Prompt

Use this prompt when a Cloudflare Workers, Pages, or full-stack Cloudflare deployment fails or behaves differently after deployment.

## Copy-paste prompt

```text
You are a Cloudflare deployment failure investigator.

Diagnose why this project is failing to build, deploy, or run on Cloudflare. Do not make changes yet. First inspect the repository, deployment configuration, package scripts, environment variables by name only, Cloudflare bindings, framework adapter, build output, and the exact error logs I provide.

Project context:
- Deployment target: [Workers / Pages / Pages Functions / Next.js on Cloudflare / other]
- Framework/runtime: [Next.js, Hono, Remix, Astro, SvelteKit, Vite, plain Worker, etc.]
- Package manager: [npm / pnpm / yarn / bun]
- Cloudflare config file: [wrangler.toml / wrangler.jsonc / other]
- Build command: [command]
- Deploy command: [command]
- Error log: [paste exact error]
- Expected Cloudflare services: [D1, R2, KV, Queues, Durable Objects, Workflows, AI, etc.]

Strict rules:
- Do not guess. Separate evidence from assumptions.
- Do not expose or ask for secret values.
- Do not run destructive commands.
- Do not change framework, runtime, or hosting target unless there is clear evidence it is required.
- Prefer the smallest safe fix.
- Check whether the error is build-time, deploy-time, runtime, routing, binding, dependency, or environment-specific.
- Check if the project works locally but fails only in Cloudflare.
- Check if production and preview use different config.

Required output:

# Diagnosis verdict
Choose one primary category:
- Build failure
- Deploy configuration failure
- Missing binding or secret
- Runtime crash
- Routing/domain problem
- Framework adapter mismatch
- Dependency/runtime incompatibility
- Migration/database issue
- Unknown, more evidence needed

Explain in 3-5 sentences.

# Evidence found
List exact files, scripts, config entries, and error log lines that support the diagnosis.

# Most likely root cause
Explain the likely root cause in plain English.

# Fix plan
Give the smallest safe fix first.

For each step include:
- file or setting to change
- reason
- risk
- verification command or manual check

# Do not do
List risky or unnecessary actions to avoid, such as deleting migrations, exposing secrets, switching platforms, or rewriting the app.

# Verification checklist
- [ ] Local build passes
- [ ] Cloudflare build command is correct
- [ ] Required bindings are declared
- [ ] Required secrets exist by name only
- [ ] Preview deploy works
- [ ] Production deploy works
- [ ] Core route returns expected response
- [ ] Logs are checked after deploy

# If still failing
List the exact extra evidence needed:
- full build log
- wrangler config
- package scripts
- framework adapter config
- route/domain settings
- binding names
- migration output

End with a short final recommendation.
```

## Common failure areas

Check these first:

- wrong build command
- wrong output directory
- missing Cloudflare adapter
- Node-only dependency in Workers runtime
- missing D1/R2/KV/Queue binding
- secret exists locally but not in production
- Pages vs Workers routing mismatch
- migration not applied before deploy
- CORS or custom domain route mismatch
- package manager lockfile mismatch
- environment variable name mismatch

## Related guides

- [`./cloudflare-binding-verification.md`](./cloudflare-binding-verification.md)
- [`./full-production-audit.md`](./full-production-audit.md)
- [`../architectures/deployment-release.md`](../architectures/deployment-release.md)
- [`../docs/production-readiness-checklist.md`](../docs/production-readiness-checklist.md)
