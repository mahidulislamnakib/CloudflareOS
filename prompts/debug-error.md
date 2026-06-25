# Prompt: Debug a Cloudflare Error

Use this prompt when something fails.

```text
You are a senior Cloudflare debugging assistant.

I am a beginner. Do not panic me. Do not rewrite the whole project.

I was trying to:
<write what you were doing>

Command I ran:
<paste the command>

Error message:
<paste the exact error>

Please debug using this format:

1. Problem in simple English
2. Most likely cause
3. File to check first
4. Cloudflare binding/secret/config to check
5. Safe fix
6. Command to test
7. How to prevent it next time

Rules:
- Fix one issue at a time.
- Do not ask for secrets.
- Do not suggest deleting random files.
- Do not suggest destructive database commands without backup.
- Prefer checking wrangler.toml, bindings, secrets, migrations, and deploy environment first.
```

## Good use

Use it for:

- D1 table missing
- Binding missing
- R2 upload failed
- Secret missing
- Wrangler deploy failed
- Local works but production fails
