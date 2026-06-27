# Secure R2 File Worker Starter

A runnable Cloudflare Worker + R2 starter for controlled file uploads and downloads.

It demonstrates a deliberately small security model:

- admin-token protected upload, metadata, download, and delete routes
- explicit `public` or `private` object visibility stored as R2 custom metadata
- public files available only through a dedicated read route
- private files never served through public routes
- upload size and object-key validation
- safe download behavior for untrusted files

This starter is suitable for early prototypes, internal tools, and as a reference for building a real upload system. It is **not** a complete multi-user file manager.

## Cloudflare services used

| Service | Why it is used |
| --- | --- |
| Workers | Runs the upload and download API |
| R2 | Stores file bytes and safe object metadata |

## Folder structure

```text
secure-r2-file-worker/
├── README.md
├── package.json
├── tsconfig.json
├── wrangler.jsonc.example
├── .dev.vars.example
├── .gitignore
└── src/
    └── index.ts
```

## API routes

### Public routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Basic health response |
| `GET` | `/files/:key` | Download a file explicitly uploaded as `public` |

The public route sends files as downloads by default. Only a small allowlist of image types can be requested inline with `?inline=1`.

### Admin routes

All admin routes require:

```text
Authorization: Bearer YOUR_ADMIN_API_TOKEN
```

| Method | Route | Purpose |
| --- | --- | --- |
| `PUT` | `/api/admin/files/:key?visibility=private` | Upload or replace a file |
| `HEAD` | `/api/admin/files/:key` | Read safe metadata without downloading bytes |
| `GET` | `/api/admin/files/:key` | Download a private or public file |
| `DELETE` | `/api/admin/files/:key` | Delete a file |

## Upload rules in this starter

- The request must have a `Content-Length` header.
- Files are limited to 10 MiB by default.
- Object keys must use safe characters and cannot contain `..` or begin with `/`.
- Visibility must be either `private` or `public`.
- The default visibility is `private`.
- Untrusted files are downloaded instead of rendered inline by default.

Change these rules only after reviewing your product, abuse risk, storage cost, and privacy requirements.

## Required binding

Copy `wrangler.jsonc.example` to `wrangler.jsonc`, then set your R2 bucket name:

```text
REPLACE_WITH_R2_BUCKET_NAME
```

The Worker expects this binding:

```text
FILES
```

## Required secret

Set a long random admin token. Do not place it in source code or `wrangler.jsonc`.

```bash
npx wrangler secret put ADMIN_API_TOKEN
```

For local development, copy `.dev.vars.example` to `.dev.vars` and set a local value.

## Local setup

```bash
npm install
cp wrangler.jsonc.example wrangler.jsonc
cp .dev.vars.example .dev.vars
npm run dev
```

Create the R2 bucket in your Cloudflare account before production deployment and update `wrangler.jsonc` with its name.

## Deploy

```bash
npm run typecheck
npx wrangler secret put ADMIN_API_TOKEN
npm run deploy
```

Use a preview or non-production bucket before connecting this Worker to real private uploads.

## Smoke test

With the local Worker running:

```bash
printf 'hello from CloudflareOS' > hello.txt

curl -X PUT http://127.0.0.1:8787/api/admin/files/docs/hello.txt \
  -H "Authorization: Bearer replace-this-for-local-dev" \
  -H "Content-Type: text/plain" \
  -H "Content-Length: 23" \
  --data-binary @hello.txt

curl -I http://127.0.0.1:8787/api/admin/files/docs/hello.txt \
  -H "Authorization: Bearer replace-this-for-local-dev"

curl http://127.0.0.1:8787/api/admin/files/docs/hello.txt \
  -H "Authorization: Bearer replace-this-for-local-dev" \
  --output downloaded-hello.txt
```

To make a file public:

```bash
curl -X PUT "http://127.0.0.1:8787/api/admin/files/public/hello.txt?visibility=public" \
  -H "Authorization: Bearer replace-this-for-local-dev" \
  -H "Content-Type: text/plain" \
  -H "Content-Length: 23" \
  --data-binary @hello.txt

curl http://127.0.0.1:8787/files/public/hello.txt --output public-hello.txt
```

## Production upgrades

Add these only when the product needs them:

- real user authentication and role-based authorization
- D1 metadata records for ownership, parent records, reporting, and searchable file lists
- presigned upload flows or direct-client upload architecture after validating your risk model
- file type inspection, malware scanning, image transformations, or processing workflows
- tenant quotas, rate limits, expiration, and cleanup jobs
- audited private document access and time-limited download links
- upload progress and resumable upload support for large files
- strict per-purpose rules: profile image, invoice, verification document, delivery file, export, and temporary upload

## Common mistakes

- treating an R2 object key as proof that a user may access a file
- serving all user uploads inline from the same application origin
- making every upload public by default
- accepting missing or unbounded upload size
- trusting browser-provided ownership, role, or tenant values
- using a single admin token as a long-term user permission system
- keeping failed, temporary, or abandoned uploads forever
- exposing object metadata or private file existence through unauthenticated routes

## Related guides

- [`../../catalog/r2.md`](../../catalog/r2.md)
- [`../../docs/d1-vs-kv-vs-r2.md`](../../docs/d1-vs-kv-vs-r2.md)
- [`../../playbooks/data-modeling-d1.md`](../../playbooks/data-modeling-d1.md)
- [`../../playbooks/api-design-contracts.md`](../../playbooks/api-design-contracts.md)
- [`../../architectures/security-threat-modeling.md`](../../architectures/security-threat-modeling.md)
- [`../../docs/production-readiness-checklist.md`](../../docs/production-readiness-checklist.md)
