# Debug Playbook: D1 Table Missing

## Problem

Your app tries to read or write data, but D1 says a table does not exist.

## Simple meaning

Your database does not have the table your code is using.

## Common causes

- Migration was not created.
- Migration exists but was not applied.
- Migration was applied locally but not remotely.
- Code uses the wrong table name.
- The Worker is connected to the wrong D1 database.

## Files to check

- `db/migrations/`
- `wrangler.toml`
- Worker/API files that query D1

## Safe fix

1. Check the table name in your code.
2. Check the migration file.
3. Apply migrations locally.
4. Test locally.
5. Apply migrations remotely only when ready.

## Commands

```powershell
npx wrangler d1 migrations list DB
npx wrangler d1 migrations apply DB --local
npx wrangler d1 execute DB --local --command "SELECT name FROM sqlite_master WHERE type='table';"
```

For remote database:

```powershell
npx wrangler d1 migrations apply DB --remote
npx wrangler d1 execute DB --remote --command "SELECT name FROM sqlite_master WHERE type='table';"
```

## Prevention

- Always create migration files for database changes.
- Do not manually change production database without recording the change.
- Keep local and remote migration state clear.
