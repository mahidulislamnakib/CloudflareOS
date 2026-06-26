# Cloudflare Browser Rendering

Cloudflare Browser Rendering lets Workers use a browser engine for tasks such as rendering HTML, generating screenshots, and creating PDFs.

Use it when your project needs visual output that normal HTTP requests cannot produce.

---

## Simple explanation

Browser Rendering turns a Worker into a service that can open a page or HTML template and create a visual result.

```text
Worker request
  ↓
Browser session
  ↓
Render page or HTML
  ↓
Create screenshot or PDF
  ↓
Return or store output
```

---

## What problem it solves

Browser Rendering is useful when an application needs a real browser for visual output.

It can help with:

- PDF generation
- screenshot generation
- social preview image generation
- HTML reports
- invoices
- visual page checks
- JavaScript-rendered page output

---

## When to use Browser Rendering

Use Browser Rendering when:

- you need a screenshot or PDF
- you need to render HTML into a file
- fonts and layout matter
- JavaScript must run before output is created
- you need a browser-based report or preview workflow

Good examples:

- invoice PDF generator
- social card generator
- report export service
- screenshot service for internal QA
- visual preview of a generated page

---

## When not to use Browser Rendering

Do not use Browser Rendering when:

- a normal Worker response is enough
- an API already provides the required data
- you only need a small text transformation
- you need storage only
- you need relational data queries

Use Workers for normal APIs, R2 for files, D1 for records, and Queues for background work.

---

## Beginner example

```text
User requests invoice PDF
  ↓
Worker reads order from D1
  ↓
Worker prepares HTML
  ↓
Browser Rendering creates PDF
  ↓
PDF stored in R2
  ↓
User receives download link
```

---

## Production notes

For production projects:

- keep browser tasks short
- send slow jobs to Queues
- store outputs in R2
- store job metadata in D1
- protect endpoints that start rendering
- use approved HTML templates
- define timeouts and error handling
- monitor failures and output volume

---

## Security notes

Do:

- protect rendering endpoints
- validate HTML and template data
- restrict who can create private documents
- store generated files securely
- use Worker secrets for private configuration

Do not:

- expose internal documents publicly
- include secrets in templates
- allow untrusted users to submit uncontrolled templates
- treat generated output as automatically safe

---

## Cost awareness

Browser work is heavier than a normal Worker request.

Cost can be affected by:

- rendering volume
- session duration
- page complexity
- PDF or screenshot size
- generated file storage

Use rate limits and Queues for high-volume jobs.

---

## Common mistakes

- using Browser Rendering for simple APIs
- generating files synchronously for every request
- storing screenshots or PDFs in D1
- skipping timeouts
- exposing generated private files
- using overly complex templates

---

## Related Cloudflare services

| Service | Relationship |
| --- | --- |
| Workers | Starts Browser Rendering tasks |
| Queues | Runs background rendering jobs |
| Workflows | Coordinates multi-step document flows |
| R2 | Stores screenshots, PDFs, and generated files |
| D1 | Stores document metadata and job state |
| Pages | Hosts frontend pages and preview interfaces |
| Access | Protects internal rendering tools |
| Wrangler | Deploys Worker code and bindings |

---

## Good starter use cases

- Invoice PDF generator
- Social preview card generator
- Report export tool
- Internal screenshot service
- HTML-to-PDF workflow

---

## Official sources

- Cloudflare Browser Rendering documentation
- Browser Rendering Workers documentation
- Browser Rendering limits documentation

---

## Freshness

Last checked: 2026-06-26
Risk level: medium

Always verify current APIs, limits, and pricing in official Cloudflare documentation before production use.
