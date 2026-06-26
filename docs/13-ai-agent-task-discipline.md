# AI Agent Task Discipline

Some AI agents try to take a large responsibility at once. That often creates hallucination, messy folders, unwanted files, and broken architecture.

Cloudflare Engineering OS should guide agents to work step by step.

## Core rule

> Small task. Clear output. Verify. Commit. Then continue.

Do not ask an agent to build a whole product in one pass.

## Required task flow

Every agent should follow this order:

1. Understand the user need.
2. Write a task list.
3. Pick the first small task.
4. Inspect existing files.
5. Explain the change.
6. Change only related files.
7. Run checks if possible.
8. Summarize what changed.
9. List remaining tasks.
10. Wait for the next task or continue only if clearly requested.

## Task list format

Use this format:

```text
Goal:
Current step:
Tasks:
[ ] 1. Understand requirement
[ ] 2. Decide version 1 scope
[ ] 3. Create project structure
[ ] 4. Add database schema
[ ] 5. Build first API
[ ] 6. Build first UI page
[ ] 7. Add auth/security
[ ] 8. Add upload/asset handling
[ ] 9. Add SEO/professional basics
[ ] 10. Test locally
[ ] 11. Deploy
[ ] 12. Review production readiness
```

## Workspace cleanliness rules

Agents must not leave a messy workspace.

Before finishing a task, check:

- Did I create duplicate folders?
- Did I create unused files?
- Did I leave temporary test files?
- Did I add demo files outside the correct folder?
- Did I update README or docs when structure changed?
- Did I remove unused imports and dependencies?
- Did I keep generated files out of Git when needed?

## What agents should avoid

Avoid:

- Building frontend, backend, auth, database, upload, and deployment all at once
- Creating random folders without explaining why
- Adding packages without need
- Leaving unused components
- Creating several competing architectures
- Renaming many files in one task
- Rewriting working code without evidence
- Making production changes without a rollback plan

## Done means clean

A task is not done just because code was generated.

A task is done when:

- The purpose is clear
- Files are in the right place
- No obvious unused files remain
- The next step is known
- The user can understand what changed
- The change can be reviewed in GitHub

## AI agent instruction

Never accept a vague big task as one implementation step.

Break it into a checklist, complete one small slice, and keep the workspace clean.
