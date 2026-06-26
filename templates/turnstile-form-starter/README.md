# Turnstile Protected Form Starter

A minimal Cloudflare Workers + Turnstile starter for protecting public forms from spam and automated abuse.

---

## What this template does

This starter gives you a small protected form API pattern with:

- public form submission endpoint
- Turnstile token verification
- basic input validation
- safe JSON responses
- example `wrangler.jsonc`
- local testing notes
- deployment notes

---

## Best for

Use this template for:

- contact forms
- lead forms
- newsletter signup forms
- report/incident forms
- job application forms
- quote request forms
- public feedback forms

---

## Cloudflare services used

| Service | Purpose |
| --- | --- |
| Workers | Receives form submissions |
| Turnstile | Verifies the user is not automated abuse |
| Wrangler | Local dev and deployment |

Optional later:

| Service | Add when |
| --- | --- |
| D1 | Store submissions |
| Queues | Process submissions asynchronously |
| Email Workers | Send notifications |
| KV | Store form config |
| Access | Protect admin review area |

---

## Folder structure

```text
turnstile-form-starter/
├── README.md
├── wrangler.jsonc.example
├── .env.example
└── src/
    └── index.ts
```

---

## Required secret

Set your Turnstile secret key as a Worker secret:

```bash
npx wrangler secret put TURNSTILE_SECRET_KEY
```

Never commit the real secret key to the repository.

---

## Setup

1. Create a Turnstile widget in Cloudflare.
2. Add the site key to your frontend.
3. Add the secret key to your Worker secrets.
4. Deploy the Worker form endpoint.

Run locally:

```bash
npx wrangler dev
```

Deploy:

```bash
npx wrangler deploy
```

---

## Request shape

Your frontend should send:

```json
{
  "name": "Example User",
  "email": "user@example.com",
  "message": "Hello",
  "turnstileToken": "TOKEN_FROM_WIDGET"
}
```

---

## Common mistakes

- verifying Turnstile only on the frontend
- committing the secret key
- accepting form submissions without server validation
- storing too much personal data
- skipping rate limits on public forms
- not separating test and production widgets
- not documenting consent/privacy rules

---

## Production notes

Before production:

- validate all fields
- add rate limiting if the endpoint is public
- store submissions in D1 if review is needed
- use Queues for notifications or CRM handoff
- avoid collecting unnecessary personal data
- update the privacy policy
- add spam review workflow if needed

---

## Related resources

- [`templates/README.md`](../README.md)
- [`templates/simple-workers-api`](../simple-workers-api/README.md)
- [`playbooks/news-portal.md`](../../playbooks/news-portal.md)
- [`catalog/README.md`](../../catalog/README.md)
