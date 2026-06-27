# Build Status

Read this file before every AI-assisted coding session. It keeps CloudflareOS work focused, verifiable, and easy to resume.

## Project snapshot

- Product goal: Provide a practical Cloudflare-first engineering handbook for planning, building, debugging, deploying, and improving production-ready applications.
- Version 1 outcome: A stable public knowledge base with beginner onboarding, architecture patterns, Cloudflare service catalog pages, safe starter templates, prompts, playbooks, and production-readiness checklists.
- Non-goals: Building a deployed application inside this repository, storing production secrets, replacing official Cloudflare documentation, or adding advanced services without a concrete project need.
- Stack and deployment target: Markdown-first repository with Cloudflare Workers/Pages-oriented templates and Wrangler example configuration files.
- Current environment: Documentation/template repository; no root package manager file, no root Wrangler configuration, and no active local application runtime discovered.
- Last updated: 2026-06-27
- Current task: T-001 — Repository discovery and persistent build record.

## Local runbook

```text
Install: Not required at the repository root; individual templates may include their own package.json.
Typecheck: Run per-template when a template includes package.json and tsconfig.json.
Lint: No root lint command discovered.
Tests: No root test command discovered.
Dev server: Not applicable at the repository root; run per-template Workers dev server after copying/configuring a template.
Database migration local: Not applicable at the repository root; D1 examples include template migrations only.
Test data seed/reset: Not applicable at the repository root; define per real project before protected workflows or migrations.
```

## Token-safe decision plan

- System type: Cloudflare engineering operating-system repository, not a single runnable app.
- Version 1 goal: Make the repository usable as a trustworthy planning/build companion for Cloudflare-native projects.
- Must-have modules: Beginner path, architecture guides, service catalog, starter templates, prompts, debugging guides, production/deployment checklists, and persistent build workflow.
- What not to build yet: A custom web app, live deployment pipeline, paid-service integrations, analytics collection, or new Cloudflare bindings without a specific template/project requirement.
- Cloudflare services needed: None for this repository-level documentation task. Templates document Workers, Pages, D1, R2, KV, Queues, Durable Objects, Turnstile, and related services as applicable.
- Professional product checklist: Keep guidance clear, safe, beginner-friendly, accessible in Markdown, security-aware, privacy-conscious, rollback-aware, and explicit about verification.
- Database tables: None for repository-level work. Template-specific D1 examples keep migrations in their own directories.
- External APIs and private values: None for repository-level work. Never commit API tokens, account IDs, credentials, or production secrets.
- Dependency risks: Some templates have independent package files; root-level checks cannot assume one package manager or one Wrangler project.
- Build order: Maintain project workflow first, then improve one bounded guide/template/checklist at a time with evidence.
- First small implementation task: Add this root `BUILD-STATUS.md` so future sessions have a durable task ledger and verification handoff.

## Task ledger

### T-001 — Repository discovery and persistent build record
- Status: Complete
- Goal: Inspect the repository shape and create the required root-level build record from the project workflow template.
- Scope: Repository metadata and workflow documentation only.
- Files: `BUILD-STATUS.md`
- Dependencies: `AGENTS.md`, `templates/agent-build-status.md`, `playbooks/agent-workflow.md`, `README.md`
- Acceptance criteria:
  - Root `BUILD-STATUS.md` exists.
  - It records the project snapshot, local runbook, token-safe decision plan, verification matrix, risks, and next safe task.
  - It does not introduce application code, bindings, migrations, secrets, or deployment claims.
- Verification reference: V-001
- Risk: low
- Rollback or recovery: Remove `BUILD-STATUS.md` or restore from `templates/agent-build-status.md` if the record needs to be reset.
- Evidence:
  - `rg --files -g 'AGENTS.md' -g 'BUILD-STATUS.md' -g 'package.json' -g 'wrangler*' -g 'templates/agent-build-status.md' -g 'playbooks/agent-workflow.md'`
  - `sed -n '1,220p' README.md`
  - `sed -n '1,220p' templates/agent-build-status.md`
  - `sed -n '1,180p' playbooks/agent-workflow.md`
  - `git status --short --branch`
- Notes: Repository inspection found many documentation, architecture, catalog, playbook, prompt, and template files, but no root package.json or root Wrangler config.

### T-002 — Choose the next bounded content improvement
- Status: Not Started
- Goal: Pick one high-value guide, template, or checklist improvement based on roadmap priority and verify it with Markdown review.
- Scope: One documentation or template area only.
- Files: To be selected before implementation.
- Dependencies: `ROADMAP.md`, relevant `docs/`, `architectures/`, `catalog/`, `playbooks/`, or `templates/` files.
- Acceptance criteria:
  - One specific improvement is selected before editing.
  - The change stays Cloudflare-native, beginner-safe, and production-aware.
  - Verification commands and manual review notes are recorded here before completion.
- Verification reference: V-002
- Risk: low
- Rollback or recovery: Revert the focused documentation/template change.
- Evidence:
- Notes:

## Status definitions

| Status | Meaning |
| --- | --- |
| Not Started | Defined but untouched |
| In Progress | The active task |
| Blocked | Exact blocker and required decision are recorded |
| Ready for Verification | Code changed but checks are incomplete |
| Complete | Acceptance criteria and evidence are recorded |
| Deferred | Intentionally outside version 1 |

A task is not complete because code exists. It needs local checks and recorded evidence.

## Verification matrix

| ID | Area | Reference | Expected result | How to verify | Status |
| --- | --- | --- | --- | --- | --- |
| V-001 | Repository workflow | `BUILD-STATUS.md` | Build record exists and accurately reflects repository discovery | Review file content and confirm Git sees the new file | Complete |
| V-002 | Next content improvement | To be selected | One bounded documentation/template change improves the handbook without scope creep | Review changed Markdown/template and run any available focused checks | Pending |
| V-003 | Template runtime | Template-specific path | Template starts or typechecks with documented setup after copying/configuration | Run the template's package or Wrangler command when a template is changed | Pending |
| V-004 | Database guidance | Template/playbook migration path | Migration guidance includes owner, lifecycle, first queries, indexes, and recovery plan | Review migration/readme and apply locally only for a configured real project | Pending |

## Database decision records

### DB-001 — Repository-level status
- User journey: Future coding agents and maintainers need durable context before editing this repository.
- Source of truth: Markdown files in this repository.
- Owner / tenant scope: Repository maintainers.
- Read and write roles: Contributors may edit via normal Git review; no runtime roles apply.
- Lifecycle / allowed status transitions: Task statuses move through Not Started, In Progress, Blocked, Ready for Verification, Complete, or Deferred.
- Required first queries: Not applicable; no database introduced.
- Needed indexes: Not applicable.
- Server-controlled fields: Not applicable.
- File/job relationships: Not applicable.
- Archive or deletion rule: Keep session history concise; archive obsolete tasks by marking Deferred or replacing with current tasks through Git review.
- Migration strategy: No migration.
- Test data needed: None.
- Verification: Confirm `BUILD-STATUS.md` exists and contains no secrets or deployment claims.

## Session handoff

```text
completed tasks: T-001 repository discovery and persistent build record
active or blocked task: T-002 not started
changed files: BUILD-STATUS.md
commands run and results: repository discovery commands completed successfully; git status confirmed a new untracked BUILD-STATUS.md before staging
manual checks completed: README, AGENTS.md, build-status template, and workflow playbook reviewed
unverified behavior: no runnable root app behavior exists to inspect
schema/binding/auth decisions: no schema, binding, route, secret, or auth changes made
known risks: root repository has no package manager or automated Markdown validation command discovered
next smallest safe task: select one roadmap-aligned documentation/template improvement before editing
```

## Next safe task

- Task ID: T-002
- Why this is next: The repository now has the required persistent build record, so future work should improve one bounded guide/template with recorded evidence.
- Required context before starting: Read `BUILD-STATUS.md`, `ROADMAP.md`, and the target file(s) for the selected improvement.
