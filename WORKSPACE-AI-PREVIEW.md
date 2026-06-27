# Project Coach Preview

## Purpose

The CloudflareOS Project Coach gives developers a short, task-oriented answer to a project question. It is designed for the developer preview, not for unrestricted public use.

## Before enabling

1. Limit preview access to the intended developers.
2. Add a Cloudflare rate-limit rule for `POST /api/ai/*`.
3. Set the Worker variable `AI_PREVIEW_ENABLED` to `true` only in that preview environment.
4. Monitor Workers AI usage in the Cloudflare dashboard.

## Request contract

```json
{
  "message": "I need a private upload flow for a small team. What is the smallest safe Cloudflare-first version?"
}
```

The endpoint accepts one field only. It limits messages to 600 characters and does not store questions or answers.

## Checks

```bash
curl -X POST https://cf.openpathfy.com/api/ai/coach \
  -H "content-type: application/json" \
  --data '{"message":"Suggest one small first task for a simple Cloudflare Worker API."}'
```

Expected states:

- Before enablement: a JSON `AI_PREVIEW_DISABLED` response.
- Invalid JSON or wrong shape: a validation error.
- After protected-preview enablement: a concise task-oriented answer.

## Cost boundary

The preview uses `@cf/meta/llama-3.2-1b-instruct`, a small text-generation model. Workers AI has a daily free allocation, but it is limited rather than unlimited. Turn off `AI_PREVIEW_ENABLED` immediately if usage is unexpected.

## Current task

- UI-002: Ready for preview verification.
- Required checks: theme at `/`, disabled AI response, invalid request response, one enabled request, desktop/mobile workspace inspection.
- Next safe task after verification: local-only project planning wizard.
