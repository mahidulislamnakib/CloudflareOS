# Local Setup Checklist

Use this when you start a Cloudflare project on your computer.

## Before you start

You need:

- A computer
- VS Code or another editor
- Node.js installed
- A Cloudflare account
- Git installed
- Basic terminal/PowerShell knowledge

## Step 1 — Open the project folder

In Windows PowerShell:

```powershell
cd path\to\your-project
```

Check that you are in the right folder:

```powershell
dir
```

You should see files like `package.json`, `wrangler.toml`, or `README.md`.

## Step 2 — Install packages

```powershell
npm install
```

If the project uses pnpm:

```powershell
pnpm install
```

## Step 3 — Check Wrangler

```powershell
npx wrangler --version
```

If this works, your computer can run Cloudflare commands.

## Step 4 — Login to Cloudflare

```powershell
npx wrangler login
```

A browser window should open. Login with your Cloudflare account.

## Step 5 — Check the config file

Open:

```text
wrangler.toml
```

Check these things:

- Project name
- Main Worker file
- D1 binding
- R2 binding
- KV binding if used
- Compatibility date

## Step 6 — Create required Cloudflare resources

Only create what the project needs.

Example commands:

```powershell
npx wrangler d1 create my-project-db
npx wrangler r2 bucket create my-project-media
npx wrangler kv namespace create CACHE
```

After creating resources, copy the IDs into `wrangler.toml`.

## Step 7 — Add secrets safely

Never write secrets inside GitHub files.

Use:

```powershell
npx wrangler secret put SECRET_NAME
```

Check secrets:

```powershell
npx wrangler secret list
```

## Step 8 — Run database migration

Local test first:

```powershell
npx wrangler d1 migrations apply DB --local
```

Remote production only when ready:

```powershell
npx wrangler d1 migrations apply DB --remote
```

## Step 9 — Start local development

```powershell
npx wrangler dev
```

Open the local URL shown in the terminal.

## Step 10 — Deploy

Only deploy after local test works.

```powershell
npx wrangler deploy
```

## Beginner rule

If something fails, do not change many files. Copy the exact error and use `debug/README.md`.
