# Debug Playbook: Deployment Failed

## Problem

`wrangler deploy` fails and the project does not go live.

## Simple meaning

Cloudflare could not publish your Worker or app because something is wrong in the project, build, config, account, or bindings.

## Common causes

- You are not logged in to Wrangler.
- `wrangler.toml` has a mistake.
- Build command failed before deploy.
- Required binding is missing.
- Required secret is missing.
- The main Worker file path is wrong.
- You are deploying from the wrong folder.

## Files to check

- `wrangler.toml`
- `package.json`
- Worker entry file
- Build output in terminal

## Safe fix

1. Copy the full deploy error.
2. Check that you are in the project folder.
3. Check Wrangler login.
4. Check `wrangler.toml`.
5. Run the build command locally.
6. Fix one issue at a time.
7. Deploy again.

## Commands

```powershell
npx wrangler whoami
npx wrangler --version
npm run build
npx wrangler deploy
```

If the project uses pnpm:

```powershell
pnpm build
npx wrangler deploy
```

## Prevention

- Test locally before deploy.
- Keep `wrangler.toml` simple.
- Document all bindings.
- Do not add unused Cloudflare services.
- Keep a rollback plan before production deployment.
