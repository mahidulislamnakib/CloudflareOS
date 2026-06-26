# Internationalization & Localization Architecture

A Cloudflare-first reference for multi-language apps, localized content, locale routing, translations, regional formatting, and language-safe caching.

## Goal

Build products that can serve users in more than one language without duplicating the entire application or leaking the wrong locale through cache, search, or content APIs.

Use this architecture for:

- bilingual websites
- regional SaaS products
- news and content portals
- education platforms
- marketplaces
- travel platforms
- public service websites

## Core distinction

```text
Internationalization (i18n)
= application support for multiple languages and regions

Localization (l10n)
= translated, region-specific content and formatting
```

## Starting stack

| Need | Service |
| --- | --- |
| Localized frontend | Pages or Workers |
| Locale-aware API | Workers |
| Translation/content records | D1 |
| Localized media | R2 |
| Small locale config/cache | KV |
| Translation jobs | Queues |
| Internal translation tools | Access |
| Content analytics | Analytics Engine |

Start with Workers, D1, and a clear locale strategy. Add translation queues only when content volume requires asynchronous work.

## Locale strategy

Use stable locale identifiers.

```text
en
bn
bn-BD
en-US
en-GB
```

Avoid inventing custom locale strings such as `english`, `bangla`, or `bd` inside URLs and database records.

## URL patterns

Choose one clear public URL model.

```text
/example
/en/example
/bn/example
```

For multi-language public sites, locale-prefixed routes are usually easiest to understand and cache safely.

Do not mix several URL patterns for the same content unless there is a deliberate redirect and canonical strategy.

## Content model

Keep language-neutral records separate from translations.

```text
articles
- id
- canonical_slug
- status
- author_id
- created_at

article_translations
- id
- article_id
- locale
- slug
- title
- excerpt
- body
- seo_title
- seo_description
- status
- published_at
```

This allows one article to have many translations while keeping editorial ownership clear.

## Suggested D1 tables

```text
locales
translation_keys
translation_values
content_translations
translation_jobs
translation_reviews
localized_menus
localized_settings
audit_logs
```

Use structured translation records for user-interface text and content translation records for editable posts, pages, courses, listings, or resources.

## Fallback rules

Define fallback behavior before launch.

```text
Requested locale unavailable
  ↓
Use default locale
  ↓
Show clear language switch option
```

Do not silently show a partially translated page with missing labels, broken navigation, or mixed language content.

## Language selection flow

```text
Visitor arrives
  ↓
Read locale from URL first
  ↓
If absent, use saved preference or browser preference
  ↓
Redirect only when safe
  ↓
Persist explicit user choice
```

An explicit user choice should override browser language detection.

## Localized API pattern

Every content API should receive or resolve locale deliberately.

```text
/api/articles?locale=bn
/api/courses/:slug?locale=en
```

For private user data, locale changes presentation only. It should not weaken authorization checks.

## Cache strategy

Locale must be part of the cache key or route boundary.

```text
/en/articles/example
/bn/articles/example
```

Good cache targets:

- published localized pages
- locale-specific menus
- public translation dictionaries
- static localized settings

Do not cache carelessly:

- translation drafts
- editor previews
- user-specific preferences
- private dashboards
- unreviewed translations

## Localized media

Store translated media metadata in D1 and files in R2.

```text
R2:
content/{content_id}/media/{file_id}.webp

D1 media_translations:
id
media_id
locale
alt_text
caption
```

Translate alt text, captions, downloadable document labels, and social metadata when they are part of the public experience.

## Editorial workflow

```text
Original content created
  ↓
Translation requested
  ↓
Translator creates draft
  ↓
Reviewer approves translation
  ↓
Localized version published
```

Keep translation status separate from original content status.

Suggested translation statuses:

```text
draft
in_review
approved
published
outdated
```

## Background jobs

Use Queues for:

- notify translator about new content
- create translation task
- flag translations after source content changes
- rebuild localized search document
- send review reminder
- refresh locale-specific cache

Use Workflows for multi-step translation approval or scheduled content synchronization.

## Search and SEO

Localized search should search the correct language index or translation records.

Important rules:

- do not return draft translations publicly
- use locale-aware canonical URLs
- generate language-specific titles and descriptions
- provide alternate-language links when applicable
- avoid duplicate content across language URLs

## Formatting rules

Keep locale-sensitive formatting in the presentation layer.

Examples:

```text
date format
number format
currency display
timezone display
pluralization
```

Store canonical timestamps and numeric values in the database. Format them for each locale at render time.

## Security rules

- Translation tools require role checks.
- Draft translations are private.
- Locale does not bypass tenant or ownership boundaries.
- Translation imports are validated.
- Public language-switch parameters are normalized.
- Admin translation changes are audit-logged.

## Production checklist

- [ ] Locale identifiers are standardized
- [ ] One public URL pattern is chosen
- [ ] Translation records are separate from source records
- [ ] Default-locale fallback is defined
- [ ] Explicit language choice can be saved
- [ ] Locale is part of public cache boundaries
- [ ] Draft translations are private
- [ ] Localized SEO metadata exists
- [ ] Localized search excludes unpublished translations
- [ ] Date, currency, and number formatting are locale-aware
- [ ] Translation actions are audit-logged

## Common mistakes

- storing all translations in one JSON field without editorial control
- caching one language response for every user
- mixing locale identifiers inconsistently
- exposing translation drafts through public APIs
- using browser language as a permanent forced choice
- translating only visible page text and forgetting metadata
- mixing translated content status with original content status

## Related docs

- [`architectures/cms.md`](./cms.md)
- [`architectures/search-discovery.md`](./search-discovery.md)
- [`architectures/api-platform.md`](./api-platform.md)
- [`architectures/observability-operations.md`](./observability-operations.md)
- [`catalog/workers.md`](../catalog/workers.md)
- [`catalog/d1.md`](../catalog/d1.md)
- [`catalog/r2.md`](../catalog/r2.md)
- [`catalog/kv.md`](../catalog/kv.md)
- [`catalog/queues.md`](../catalog/queues.md)
- [`catalog/access.md`](../catalog/access.md)
