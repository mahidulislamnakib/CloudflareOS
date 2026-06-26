# GitHub and Update Workflow

GitHub is not only a place to store code. It is how a project stays organized, reviewable, and recoverable.

## Simple rule

> Every meaningful change should be trackable.

Do not let AI agents make large unreviewed changes directly on the main branch.

## Basic GitHub flow

1. Create or choose an issue/task.
2. Create a branch.
3. Make one focused change.
4. Commit with a clear message.
5. Open a pull request.
6. Review the files changed.
7. Run checks.
8. Merge when safe.

## Branch naming

Use clear branch names:

```text
feat/news-portal-admin
fix/d1-missing-table
refactor/project-structure
docs/setup-guide
chore/update-dependencies
```

Avoid:

```text
update
final
new-work
fix2
test
```

## Commit message examples

Good:

```text
feat: add article create API
fix: correct D1 binding name
docs: add local setup guide
chore: update wrangler dependency
```

Bad:

```text
changes
update files
final
working now
```

## Pull request checklist

Every PR should answer:

- What changed?
- Why was it needed?
- What files were touched?
- How was it tested?
- Any risk?
- Any rollback note?

## Issue/task checklist

Good issue format:

```text
Goal:
Why:
Scope:
Not included:
Files likely affected:
Acceptance checklist:
```

## AI agent GitHub rules

AI agents should:

- Work on a branch, not directly on main
- Keep PRs small
- Avoid unrelated file changes
- Explain changed files
- Leave a clear next task list
- Avoid rewriting history unless explicitly requested
- Never commit secrets

## Stay up to date

Projects should regularly check:

- Cloudflare docs and changelog
- Wrangler version
- Framework dependencies
- Security advisories
- Package updates
- Browser and runtime changes
- GitHub Actions versions

## Safe update habit

Do not update everything at once.

Use this order:

1. Check what is outdated.
2. Read changelogs for major packages.
3. Update one group at a time.
4. Run tests locally.
5. Open a PR.
6. Deploy after review.

## Commands

```powershell
git status
git checkout -b feat/my-task
git add .
git commit -m "feat: describe the change"
git push origin feat/my-task
```

Dependency checks:

```powershell
npm outdated
npm audit
```

Cloudflare check:

```powershell
npx wrangler --version
```

## Done means reviewable

A task is not complete if nobody can understand what changed.

A task is complete when the GitHub diff is clean, focused, and reviewable.
