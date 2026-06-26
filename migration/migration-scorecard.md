# Migration Scorecard

Use this to decide if a project is ready to move toward Cloudflare.

Score each area:

- 0 = unknown or risky
- 1 = partial
- 2 = clear and safe

## Scorecard

| Area | Question | Score |
| --- | --- | --- |
| Project understanding | Do we understand the current stack and purpose? | /2 |
| Frontend | Can the frontend move to Pages or Workers safely? | /2 |
| Backend/API | Can API routes move to Workers in small slices? | /2 |
| Database | Is D1 or Hyperdrive the right database path? | /2 |
| Storage | Can uploads/files move to R2? | /2 |
| Auth | Is auth understood and safe to migrate or keep? | /2 |
| Jobs | Can cron/background work map to Scheduled Workers, Queues, or Workflows? | /2 |
| External APIs | Are third-party dependencies documented? | /2 |
| Deployment | Is there a safe deployment path? | /2 |
| Rollback | Can we return to the previous version if needed? | /2 |

## Readiness

| Score | Meaning |
| --- | --- |
| 17-20 | Good migration candidate |
| 13-16 | Possible, but fix gaps first |
| 8-12 | Migrate only a small low-risk slice |
| 0-7 | Do not migrate yet |

## Mandatory blockers

Do not migrate when:

- Current database is not understood
- Production backup does not exist
- Auth flow is unclear
- File uploads are not mapped
- Rollback path is missing
- Secrets are exposed in source code

## Migration recommendation

```text
Overall score:
Readiness level:
First safe migration step:
Do not migrate yet:
Main risk:
Rollback plan:
Next task:
```
