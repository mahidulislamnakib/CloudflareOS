# Cloudflare Pages

Cloudflare Pages is Cloudflare's platform for deploying frontend websites and full-stack web apps.

Use Pages when you want to deploy static sites, frontend apps, documentation sites, landing pages, or framework-based web applications with a simple Git-based workflow.

---

## Simple explanation

Pages takes your website code from GitHub, builds it, and deploys it on Cloudflare.

It is often the easiest way to publish a frontend project without managing a server.

---

## What problem it solves

Pages solves the problem of deploying websites quickly and reliably.

It is useful when you need:

- frontend hosting
- static sites
- documentation sites
- marketing pages
- React/Vue/Svelte apps
- framework deployments
- preview deployments for branches and PRs
- custom domains with Cloudflare performance

---

## When to use Pages

Use Pages when:

- your project is mostly frontend
- you want Git-based deployment
- you need preview deployments
- you are building docs, landing pages, portfolios, blogs, or frontend apps
- your backend/API can live in Workers or Pages Functions

Good examples:

- product landing page
- documentation site
- portfolio website
- course website frontend
- travel agency frontend
- frontend for a CMS or admin dashboard
- static marketing site with forms

---

## When not to use Pages

Pages may not be the best fit when:

- your project is mostly backend/API logic
- you need custom request handling for the whole app
- you want a Worker-first architecture
- your deployment needs are better matched to Workers

Use Workers when backend logic is the main product.

Use Pages when frontend deployment is the main product.

---

## Beginner example

A simple landing page flow:

```text
GitHub repo
  ↓
Cloudflare Pages build
  ↓
Deployed website
  ↓
Custom domain
```

A full-stack flow:

```text
Frontend page
  ↓
Pages / app route
  ↓
Worker/API route
  ↓
D1/R2/KV if needed
```

---

## Production notes

For production projects:

- set build commands clearly
- document environment variables
- separate preview and production settings
- use custom domains carefully
- check redirects and headers
- protect admin routes when needed
- use Workers for heavier backend logic
- keep deployment logs readable
- add rollback notes

---

## Security notes

Do:

- avoid committing secrets
- use environment variables safely
- protect admin or internal routes
- validate form/API input server-side
- configure headers for security when needed
- keep preview deployments in mind

Do not:

- expose private environment values to frontend bundles
- treat frontend validation as security
- leave admin tools publicly accessible
- hardcode API keys in client code

---

## Cost awareness

Pages cost can be affected by:

- build volume
- deployment frequency
- bandwidth and traffic
- use of connected Workers/Functions
- connected services like D1, R2, KV, and Queues

For simple static sites, Pages is usually a very low-complexity starting point.

---

## Common mistakes

- using Pages when the app is really backend-heavy
- exposing secrets to client-side code
- forgetting preview vs production environment differences
- missing redirect rules
- missing security headers
- not documenting build commands
- mixing frontend and backend responsibilities unclearly

---

## Related Cloudflare services

| Service | Relationship |
| --- | --- |
| Workers | Backend/API logic and advanced routing |
| D1 | Structured app data |
| R2 | File and media storage |
| KV | Small config/cache |
| Turnstile | Form protection |
| Access | Protects admin/internal pages |
| Wrangler | Used for some local/deploy workflows |

---

## Good starter templates

- [`templates/simple-workers-api`](../templates/simple-workers-api/README.md)
- [`templates/turnstile-form-starter`](../templates/turnstile-form-starter/README.md)

---

## Official sources

- Cloudflare Pages documentation
- Cloudflare Pages build configuration documentation
- Cloudflare Pages Functions documentation

---

## Freshness

Last checked: 2026-06-27
Risk level: medium

Cloudflare Pages and framework support can change. Always verify current build settings, framework guidance, limits, and pricing in the official Cloudflare documentation before production launch.
