# Rollback Checklist

Use this checklist before and during a Cloudflare-first production rollback.

> A rollback is not only redeploying old code. It is a controlled recovery plan for application code, configuration, data, user trust, and operations.

## When to use it

Use this checklist when a release causes or may cause:

- broken login, signup, checkout, publishing, upload, admin, or API flows
- data corruption, missing records, duplicate jobs, or unsafe writes
- severe latency, error spikes, or resource exhaustion
- bad configuration, missing bindings, wrong routes, or exposed debug behavior
- privacy, security, or authorization risk
- third-party integration failures that affect core user journeys

## Rollback roles

| Role | Responsibility |
| --- | --- |
| Incident owner | Decides whether to rollback and coordinates communication. |
| Release owner | Knows the changed code, config, migrations, bindings, and feature flags. |
| Data owner | Confirms whether data writes are safe to continue or must be paused. |
| Support/contact owner | Handles user-facing messaging and collects affected examples. |

For small teams, one person may hold multiple roles, but every role should still be named before production launch.

## 1. Pre-release rollback plan

Complete this before deploying production changes.

- [ ] The release has a named owner and rollback owner.
- [ ] The previous known-good commit, build, or deployment is recorded.
- [ ] Production environment, route, and domain are known.
- [ ] Required Worker or Pages bindings are listed by environment.
- [ ] Required secrets and environment variables are listed by name, not value.
- [ ] Feature flags or kill switches exist for risky features.
- [ ] Any D1 migration has an explicit recovery plan.
- [ ] Any R2, KV, Queue, Durable Object, or external integration behavior change is documented.
- [ ] Post-deploy smoke tests are written before the release.
- [ ] Customer/support communication path is known.

## 2. Rollback decision trigger

Rollback or disable the release quickly when any critical condition is true.

- [ ] Authentication or authorization is broken.
- [ ] Users can see or modify another user's or tenant's data.
- [ ] Payments, orders, refunds, payouts, or invoices are unsafe.
- [ ] Writes are corrupting D1 records or object metadata.
- [ ] Uploads expose private files or overwrite the wrong objects.
- [ ] Queue consumers, webhooks, or scheduled tasks are duplicating irreversible actions.
- [ ] Error rate or latency makes a core journey unusable.
- [ ] A secret, token, or debug endpoint may be exposed.
- [ ] Required production bindings or routes are missing or pointed at the wrong resource.

If user data may be at risk, prefer stopping unsafe writes before spending time on a perfect diagnosis.

## 3. Immediate containment

Run the safest containment action that reduces harm first.

- [ ] Disable the risky feature flag or kill switch.
- [ ] Pause public write actions if data integrity is uncertain.
- [ ] Pause or drain queue consumers if retries are making the issue worse.
- [ ] Disable affected scheduled jobs or webhooks if duplicate work is occurring.
- [ ] Protect admin-only operations with Cloudflare Access or temporarily remove public routes.
- [ ] Confirm whether the issue affects all users, one tenant, one region, one route, or one integration.
- [ ] Preserve logs, request IDs, affected account IDs, timestamps, and deployment IDs.

## 4. Code rollback

Use the deployment mechanism that is already safest for the project.

- [ ] Identify the previous known-good deployment or commit.
- [ ] Confirm the old version is compatible with the current data shape.
- [ ] Redeploy the previous Worker or Pages build, or revert and deploy a hotfix.
- [ ] Do not rollback code that expects removed secrets, missing bindings, or deleted schema.
- [ ] Verify routes, custom domains, compatibility date, and environment target after rollback.
- [ ] Run the post-rollback smoke tests.

## 5. Configuration and binding rollback

Configuration can be the incident even when code is correct.

- [ ] Verify the deployed environment is the intended production environment.
- [ ] Verify every required binding name matches the code and Wrangler configuration.
- [ ] Verify D1 database, R2 bucket, KV namespace, Queue, Durable Object namespace, and service bindings point to the intended production resources.
- [ ] Verify CORS, cache, redirect, and route changes did not expose unsafe behavior.
- [ ] Restore previous feature flag values if the new values caused the incident.
- [ ] Rotate any secret that may have been exposed in logs, responses, or source control.

## 6. Data rollback and recovery

Treat data recovery as a separate decision from code rollback.

- [ ] Identify the exact tables, rows, objects, keys, jobs, or tenants affected.
- [ ] Stop additional unsafe writes before modifying data.
- [ ] Confirm backup/export availability before destructive recovery work.
- [ ] Prefer forward repair scripts over destructive rollback when records were legitimately created after the release.
- [ ] Record every manual query or repair command.
- [ ] Test the repair against non-production or copied data when practical.
- [ ] Verify the application can read and write after repair.
- [ ] Keep an audit note of affected data and recovery actions.

## 7. Smoke test after rollback

Verify the real user journeys that could have been affected.

- [ ] Homepage or primary entry point loads.
- [ ] Login/logout or session refresh works.
- [ ] Core create/update/read journey works.
- [ ] Admin or staff-only route remains protected.
- [ ] Upload/download flow works if R2 is used.
- [ ] Webhook, queue, or scheduled workflow is safe to resume.
- [ ] Payment or financial state is not advanced by browser-only success pages.
- [ ] Mobile and slow-network behavior is acceptable for the critical path.
- [ ] Error logs show no continuing spike for the rolled-back route.

## 8. Communication

Keep communication factual and short during the incident.

- [ ] Internal stakeholders know the current status, owner, and next update time.
- [ ] Support/contact path has a plain-language summary.
- [ ] Public status or user messaging is prepared if users are affected.
- [ ] The team avoids exposing private data, secrets, or speculative root cause in public messages.
- [ ] Affected users or tenants are tracked for follow-up when appropriate.

## 9. Post-rollback review

Do this after service is stable.

- [ ] Record the incident timeline with concrete timestamps.
- [ ] Record the release version, rollback version, and commands used.
- [ ] Identify why pre-release checks did not catch the issue.
- [ ] Add or update a test, checklist item, alert, or runbook.
- [ ] Decide whether to retry, redesign, or abandon the change.
- [ ] Remove temporary flags, routes, or mitigations when safe.
- [ ] Document any user, support, privacy, or compliance follow-up.

## Rollback report template

```md
# Rollback Report

Date:
Incident owner:
Release owner:
Environment:
Affected routes/features:
Release version:
Rollback version:

Trigger:
Containment action:
Data impact:
User impact:
Verification commands:
Smoke test result:
Current status:
Follow-up tasks:
Owner and due date:
```

## Related guides

- [`cost-checklist.md`](cost-checklist.md)
- [`data-backup-export-checklist.md`](data-backup-export-checklist.md)
- [`environment-variable-checklist.md`](environment-variable-checklist.md)
- [`incident-response-checklist.md`](incident-response-checklist.md)
- [`production-readiness-checklist.md`](production-readiness-checklist.md)
- [`04-production-readiness-scorecard.md`](04-production-readiness-scorecard.md)
- [`../architectures/deployment-release.md`](../architectures/deployment-release.md)
- [`../architectures/observability-operations.md`](../architectures/observability-operations.md)
- [`../prompts/deploy-safely.md`](../prompts/deploy-safely.md)
- [`../prompts/cloudflare-binding-verification.md`](../prompts/cloudflare-binding-verification.md)
