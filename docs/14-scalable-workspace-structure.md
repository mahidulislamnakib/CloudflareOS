# Scalable Workspace Structure

A clean project structure helps humans and AI agents understand what belongs where.

Messy folders create confusion, duplicate code, and token waste.

## Simple rule

> Put each responsibility in a predictable place.

If frontend, backend/API, database, and infrastructure need separate folders, create them clearly from day one.

## Recommended small project structure

Use this for simple apps:

```text
project-name/
├── app/                    # Frontend pages and UI
├── worker/                 # Cloudflare Worker API/backend
├── components/             # Reusable UI components
├── lib/                    # Shared frontend helpers
├── db/
│   └── migrations/         # D1 migrations
├── public/                 # Public static assets
├── docs/                   # Project documentation
├── scripts/                # Safe helper scripts
├── wrangler.toml           # Cloudflare config
├── package.json
└── README.md
```

## Recommended scalable monorepo structure

Use this when the project may grow:

```text
project-name/
├── apps/
│   ├── web/                # Frontend app
│   ├── worker/             # Cloudflare Worker API
│   └── admin/              # Optional separate admin app
├── packages/
│   ├── ui/                 # Shared components
│   ├── config/             # Shared config
│   ├── db/                 # Schema, migrations, query helpers
│   └── shared/             # Shared types and utilities
├── docs/                   # Product and technical docs
├── scripts/                # Setup/check/deploy helpers
├── templates/              # Reusable templates
├── .github/workflows/      # CI/CD
├── wrangler.toml
├── package.json
└── README.md
```

## Folder decision guide

| Need | Put it here |
| --- | --- |
| Public website pages | `app/` or `apps/web/` |
| Admin pages | `app/admin/` or `apps/admin/` |
| Worker/API code | `worker/` or `apps/worker/` |
| Reusable UI | `components/` or `packages/ui/` |
| Shared types/helpers | `lib/` or `packages/shared/` |
| D1 migrations | `db/migrations/` or `packages/db/migrations/` |
| Cloudflare config | `wrangler.toml` |
| GitHub workflows | `.github/workflows/` |
| Local scripts | `scripts/` |
| Project notes | `docs/` |

## Naming rules

Use clear names:

- `web` for frontend
- `worker` for Cloudflare Worker backend/API
- `admin` for admin UI
- `db` for database files
- `ui` for shared components
- `shared` for shared types/helpers
- `scripts` for safe commands

Avoid vague names:

- `new`
- `test2`
- `final`
- `old`
- `copy`
- `misc`
- `temp`

## AI agent instruction

Before creating files, the agent must say where each file belongs and why.

If the project grows beyond a small app, prefer the scalable monorepo structure instead of creating random folders later.
