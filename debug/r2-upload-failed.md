# Debug Playbook: R2 Upload Failed

## Problem

Your app cannot upload a file to R2.

## Simple meaning

The app is trying to save a file, but the R2 bucket connection or upload logic is not working.

## Common causes

- R2 bucket does not exist.
- R2 binding name is wrong.
- Worker code uses the wrong binding.
- File size or file type validation rejects the upload.
- Upload route is not protected correctly.

## Files to check

- `wrangler.toml`
- Upload API route
- R2 helper/client file
- Admin upload form

## Safe fix

1. Check if the R2 bucket exists.
2. Check the binding name in `wrangler.toml`.
3. Check the binding name in code.
4. Test with a small image first.
5. Add clear validation error messages.

## Commands

```powershell
npx wrangler r2 bucket list
```

If needed:

```powershell
npx wrangler r2 bucket create my-project-media
```

## Prevention

- Store only the R2 object key in D1.
- Store the actual file in R2.
- Validate file type and size before upload.
- Use clear bucket binding names like `MEDIA_BUCKET`.
