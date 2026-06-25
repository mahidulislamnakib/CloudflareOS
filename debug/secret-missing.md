# Debug Playbook: Secret Missing

## Problem

Your app needs a private value, but it is missing during local development or deployment.

## Simple meaning

Your code expects a secret, but Cloudflare does not have it for this project or environment.

## Common causes

- Secret was never added.
- Secret was added to local `.dev.vars` but not Cloudflare.
- Secret name in code does not match the secret name in Cloudflare.
- You deployed to a different environment.

## Files to check

- Worker/API code
- `.dev.vars` for local development
- `wrangler.toml`

## Safe fix

1. Find the secret name used in code.
2. Add it locally if needed.
3. Add it to Cloudflare using Wrangler.
4. Restart local dev or redeploy.

## Commands

List remote secrets:

```powershell
npx wrangler secret list
```

Add a secret:

```powershell
npx wrangler secret put SECRET_NAME
```

## Local development

For local only, create `.dev.vars`:

```text
SECRET_NAME="your-local-secret"
```

Do not commit `.dev.vars` to GitHub.

## Prevention

- Keep a safe `.env.example` or `secrets.example.md` without real values.
- Use the same secret name everywhere.
- Never paste real secrets into AI chats or GitHub issues.
