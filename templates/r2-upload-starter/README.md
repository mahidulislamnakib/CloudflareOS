# R2 Upload Starter

A minimal Cloudflare Workers + R2 starter for safe file uploads.

---

## What this template does

This starter gives you a small upload API pattern with:

- R2 bucket binding
- file upload endpoint
- file metadata response
- simple file type checks
- simple file size checks
- safe object key generation
- example `wrangler.jsonc`
- local testing commands
- deployment notes

---

## Best for

Use this template for:

- article images
- profile photos
- document uploads
- portfolio files
- admin media libraries
- job attachments
- delivery files
- invoices or receipts

For production, add authentication, role checks, malware scanning if needed, stricter validation, and private/public access rules.

---

## Cloudflare services used

| Service | Purpose |
| --- | --- |
| Workers | Receives upload requests |
| R2 | Stores files |
| Wrangler | Local dev and deployment |

Optional later:

| Service | Add when |
| --- | --- |
| D1 | Store file metadata |
| Queues | Process uploads in background |
| Images | Optimize images |
| Access | Protect admin uploads |
| Turnstile | Protect public upload forms |

---

## Folder structure

```text
r2-upload-starter/
├── README.md
├── wrangler.jsonc.example
└── src/
    └── index.ts
```

---

## Required binding

```jsonc
{
  "r2_buckets": [
    {
      "binding": "BUCKET",
      "bucket_name": "my-app-uploads"
    }
  ]
}
```

---

## Setup

Create an R2 bucket:

```bash
npx wrangler r2 bucket create my-app-uploads
```

Run locally:

```bash
npx wrangler dev
```

Deploy:

```bash
npx wrangler deploy
```

---

## Test

Upload a file:

```bash
curl -X POST http://localhost:8787/upload \
  -F "file=@example.png"
```

Expected response:

```json
{
  "ok": true,
  "key": "uploads/example-id.png"
}
```

---

## Common mistakes

- storing files directly in D1
- trusting the original filename
- skipping file size limits
- skipping file type checks
- making private files public by mistake
- using one folder for every upload type
- not storing metadata when the app needs search/filtering
- not planning cleanup for unused files

---

## Production notes

Before production:

- add authentication for private uploads
- add role checks for admin uploads
- store metadata in D1 if files need to be managed
- validate file type and size strictly
- generate safe object keys
- separate public and private upload paths
- add lifecycle/cleanup rules if needed
- avoid exposing raw sensitive documents publicly

---

## Related resources

- [`templates/README.md`](../README.md)
- [`templates/simple-workers-api`](../simple-workers-api/README.md)
- [`playbooks/news-portal.md`](../../playbooks/news-portal.md)
- [`catalog/README.md`](../../catalog/README.md)
