# Debug Playbook: Missing Binding

## Problem

Your Worker code tries to use a Cloudflare service, but the service is not available.

Example messages may mention that a database, bucket, KV namespace, queue, or binding is undefined or missing.

## Simple meaning

Your code is asking for a tool, but Cloudflare was not told to connect that tool.

## Common causes

- Binding name in code does not match `wrangler.toml`.
- Binding exists locally but not in production.
- The service was not created in Cloudflare.
- The project is using the wrong environment.

## Files to check

- `wrangler.toml`
- Worker entry file, usually `src/index.ts` or `worker/index.ts`
- Type definitions, often `worker-configuration.d.ts` or `env.d.ts`

## Safe fix

1. Find the binding name used in code.
2. Find the binding name in `wrangler.toml`.
3. Make the names exactly the same.
4. Confirm the Cloudflare resource exists.
5. Test locally.
6. Deploy only after local test passes.

## Example

If code uses:

```ts
env.DB.prepare("SELECT 1")
```

Then `wrangler.toml` must include a D1 binding named `DB`.

## Commands to check

```powershell
npx wrangler d1 list
npx wrangler kv namespace list
npx wrangler r2 bucket list
npx wrangler secret list
```

## Prevention

Keep binding names simple and consistent:

- `DB` for D1
- `ASSETS` or `MEDIA_BUCKET` for R2
- `CACHE` for KV
- `JOBS` for Queues

Document all bindings in the project README.
