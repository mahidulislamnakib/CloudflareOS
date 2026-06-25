# Debug Without Panic

Errors are normal. Do not delete files randomly. Do not rewrite the whole project.

Use this simple flow first.

## First rule

Read the error message slowly.

Most errors tell you one of these things:

- A file is missing
- A binding is missing
- A secret is missing
- A database table is missing
- A command was run in the wrong folder
- A deploy setting is wrong

## Beginner debug flow

1. Copy the exact error.
2. Write what you were trying to do.
3. Check which command failed.
4. Check which file the error mentions.
5. Check `wrangler.toml` if the issue is related to Cloudflare.
6. Check secrets and bindings.
7. Fix only one thing.
8. Test again.

## Do not do this

- Do not delete `node_modules` first unless needed.
- Do not rewrite the project.
- Do not change many files at the same time.
- Do not paste secrets into AI chat.
- Do not run destructive database commands in production.

## Debug answer format for AI agents

When an AI agent helps, it must answer like this:

```text
Problem:
Cause:
File to check:
Safe fix:
Command to test:
How to prevent this next time:
```

## Common Cloudflare problems

| Problem | First place to check |
| --- | --- |
| D1 database not found | `wrangler.toml` and Cloudflare dashboard |
| Binding not available | Binding name in code and `wrangler.toml` |
| Secret missing | `wrangler secret list` |
| R2 upload failed | Bucket binding and permission logic |
| Deploy failed | Build command and Wrangler output |
| Local works but production fails | Environment-specific bindings and secrets |
