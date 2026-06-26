# Cloudflare Turnstile

Cloudflare Turnstile helps protect public forms and endpoints from automated abuse without using traditional CAPTCHA challenges.

Use Turnstile when a visitor submits a form, starts a signup flow, requests a quote, reports content, or triggers any action that bots may abuse.

---

## Simple explanation

Turnstile adds a verification step between a visitor and your backend.

```text
Visitor opens form
  ↓
Turnstile creates a token
  ↓
Visitor submits form
  ↓
Server verifies token
  ↓
Process request only when verification succeeds
```

---

## What problem it solves

Turnstile helps reduce automated abuse such as:

- spam form submissions
- fake signups
- bot traffic
- repeated quote requests
- automated credential attacks
- abusive public API requests

---

## When to use Turnstile

Use Turnstile on public, high-risk actions such as:

- contact forms
- signup and login flows
- password reset requests
- job applications
- report or complaint forms
- checkout or booking forms
- public upload requests
- lead generation forms

---

## When not to use Turnstile

Turnstile is not a replacement for:

- authentication
- authorization
- rate limiting
- input validation
- fraud detection
- secure session management

Use it as one layer in your security design.

---

## Beginner example

A public contact form:

```text
Frontend form
  ↓
Turnstile widget/token
  ↓
Worker API endpoint
  ↓
Verify token server-side
  ↓
Validate form fields
  ↓
Store or send message
```

---

## Production notes

For production projects:

- verify tokens on the server, never only in the browser
- keep the secret key in Worker secrets
- validate all form fields after verification
- add rate limits for expensive actions
- log verification failures safely
- test expired, duplicate, and missing token cases
- use clear error messages for real users

---

## Security notes

Do:

- verify tokens server-side
- keep the secret key private
- combine Turnstile with validation and rate limiting
- protect sensitive workflows with authentication too
- use HTTPS and secure request handling

Do not:

- expose the secret key in frontend code
- trust a client-side success state alone
- use Turnstile as your only security control
- skip validation after successful verification

---

## Cost awareness

Turnstile is designed to protect public endpoints, but your downstream workload can still create cost.

A verified request may still trigger Workers, D1, R2, email providers, AI APIs, or external services. Keep validation, limits, and queue-based processing where appropriate.

---

## Common mistakes

- verifying only in the frontend
- exposing the secret key
- forgetting server-side token verification
- treating Turnstile as authentication
- skipping rate limits
- allowing unlimited expensive form actions
- not handling token verification errors

---

## Related Cloudflare services

| Service | Relationship |
| --- | --- |
| Workers | Verifies tokens and processes protected requests |
| Pages | Hosts protected frontend forms |
| Rate Limiting | Adds protection against repeated requests |
| Queues | Handles slow follow-up work after verified submissions |
| D1 | Stores verified submissions or audit records |
| R2 | Stores files from protected upload flows |
| Access | Protects internal/admin applications |

---

## Good starter templates

- [`templates/turnstile-form-starter`](../templates/turnstile-form-starter/README.md)
- [`templates/simple-workers-api`](../templates/simple-workers-api/README.md)

---

## Official sources

- Cloudflare Turnstile documentation
- Turnstile server-side validation documentation
- Cloudflare Turnstile configuration documentation

---

## Freshness

Last checked: 2026-06-26
Risk level: medium

Always verify current Turnstile setup, verification rules, limits, and supported integrations in the official Cloudflare documentation before production launch.
