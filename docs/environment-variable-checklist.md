# Environment Variable and Secret Checklist

Use this checklist before adding, changing, deploying, rotating, or removing configuration values in a Cloudflare-first application.

> Treat configuration as part of the release. A correct code deploy can still fail production if a binding, route, secret, environment variable, or feature flag points to the wrong resource.

## What counts as configuration

Track these values deliberately:

- public runtime configuration such as public URLs, feature labels, and analytics IDs
- private secrets such as API tokens, signing keys, webhook secrets, and password reset secrets
- Cloudflare bindings such as D1 databases, R2 buckets, KV namespaces, Queues, Durable Object namespaces, service bindings, and Vectorize indexes
- environment-specific routes, domains, redirect targets, CORS origins, and callback URLs
- feature flags, kill switches, rollout percentages, and maintenance-mode flags
- third-party provider IDs, endpoints, regions, account names, and sandbox/production modes

## 1. Classify each value

Before adding a value, record what it is and where it belongs.

- [ ] The value has a clear owner.
- [ ] The value has a documented purpose.
- [ ] The value is marked as public, private, binding, feature flag, or operational setting.
- [ ] The value is required only in the environments that actually use it.
- [ ] The value name is stable and descriptive.
- [ ] The value does not duplicate another setting with a different name.
- [ ] Private values are never required in frontend/browser code.

## 2. Naming standard

Use names that are easy to audit and hard to confuse.

- [ ] Names use uppercase snake case, such as `PAYMENT_WEBHOOK_SECRET`.
- [ ] Public values are explicitly named as public when they are safe for browsers, such as `PUBLIC_APP_URL`.
- [ ] Private values avoid vague names like `TOKEN`, `KEY`, or `SECRET` without a service prefix.
- [ ] Sandbox and production values are not mixed under one unclear name.
- [ ] Binding names in code match Wrangler configuration exactly.
- [ ] Old names have a removal plan before new names are introduced.

## 3. Storage rules

Store values in the safest place for their type.

- [ ] Real secrets are not committed to source control.
- [ ] Real secrets are not stored in README files, tickets, screenshots, chat logs, or AI prompts.
- [ ] Local-only Worker values use `.dev.vars` or another ignored local file.
- [ ] Safe examples use `.env.example`, `.dev.vars.example`, or documentation placeholders.
- [ ] Production private values are stored as platform-managed secrets.
- [ ] Cloudflare resource references are configured as bindings rather than free-form strings when a binding exists.
- [ ] CI/CD values are scoped to the minimum project, branch, and environment needed.

## 4. Environment separation

Keep local, preview, staging, and production boundaries clear.

- [ ] Each environment has its own required-value list.
- [ ] Preview/staging does not point at production D1, R2, KV, Queue, Durable Object, or third-party production resources unless explicitly approved.
- [ ] Production callback URLs, webhook URLs, and CORS origins are production-only.
- [ ] Sandbox payment, email, analytics, and AI provider modes are not used in production.
- [ ] Production secrets are not copied into local development without an approved reason.
- [ ] Test tenants, users, and API keys are clearly separate from real users and real integrations.

## 5. Wrangler and binding verification

Verify bindings before deploy, not after the incident starts.

- [ ] Wrangler environment names match the release target.
- [ ] Every binding used in code is present in the target environment config.
- [ ] Every binding in config has a current purpose or removal note.
- [ ] D1 database bindings point to the intended database for that environment.
- [ ] R2 bucket bindings point to the intended public/private bucket boundary.
- [ ] KV namespace bindings are not used as the source of truth for transactional data.
- [ ] Queue producer and consumer bindings point to the intended queue.
- [ ] Durable Object namespace bindings match the expected class and migration state.
- [ ] Service bindings and external URLs point to the intended service version.

## 6. Deployment checklist

Before releasing a config change:

- [ ] The change is included in the release notes or deployment checklist.
- [ ] The old value and new value are understood without exposing the secret value itself.
- [ ] Any required secret is set before code that depends on it is deployed.
- [ ] Any required binding is configured before the route receives production traffic.
- [ ] Feature flags default to safe behavior if the value is missing.
- [ ] Startup or request-time validation fails safely when required private configuration is absent.
- [ ] A rollback plan explains whether old code can work with the new configuration.

## 7. Rotation and removal

Rotate and remove values deliberately.

- [ ] Rotation has an owner and maintenance window when user impact is possible.
- [ ] New value is added and verified before the old value is revoked when dual-running is required.
- [ ] Webhook providers, OAuth apps, and API clients are updated in the correct environment.
- [ ] Old values are revoked after the application no longer uses them.
- [ ] Removed values are deleted from local examples, CI/CD, platform secrets, and documentation.
- [ ] Exposed values are treated as compromised and rotated immediately.

## 8. Logging and debugging safety

Configuration debugging must not leak secrets.

- [ ] Logs never print full secret values, authorization headers, cookies, session tokens, or private keys.
- [ ] Debug endpoints do not return full environment objects.
- [ ] Error messages say which value is missing without exposing its value.
- [ ] Support and incident notes record value names, not secret contents.
- [ ] Screenshots of dashboards, CI logs, or terminals are reviewed for secret exposure before sharing.

## 9. Local development reset

Make local setup repeatable without production access.

- [ ] `.env.example` or `.dev.vars.example` lists all required local values with safe placeholders.
- [ ] Local setup docs explain how to create local D1, R2, KV, Queue, or Durable Object resources when needed.
- [ ] Local test data can be recreated without production data.
- [ ] Developers know how to clear local values when switching projects or tenants.
- [ ] Missing local values produce clear setup errors.

## Configuration inventory template

```md
# Configuration Inventory

Environment:
Owner:
Last reviewed:

| Name | Type | Required? | Scope | Owner | Rotation/removal note |
| --- | --- | --- | --- | --- | --- |
| PUBLIC_APP_URL | public | yes | browser/server |  |  |
| D1_DB | binding | yes | server |  |  |
| PAYMENT_WEBHOOK_SECRET | secret | yes | server |  | rotate after provider change |
```

## Related guides

- [`cost-checklist.md`](cost-checklist.md)
- [`11-external-api-env-dependency-standard.md`](11-external-api-env-dependency-standard.md)
- [`production-readiness-checklist.md`](production-readiness-checklist.md)
- [`rollback-checklist.md`](rollback-checklist.md)
- [`incident-response-checklist.md`](incident-response-checklist.md)
- [`../prompts/cloudflare-binding-verification.md`](../prompts/cloudflare-binding-verification.md)
- [`../debug/missing-binding.md`](../debug/missing-binding.md)
- [`../debug/secret-missing.md`](../debug/secret-missing.md)
