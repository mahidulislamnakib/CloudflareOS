# Cloudflare KV

Cloudflare KV is a global key-value store for small data that needs fast reads across Cloudflare's network.

Use KV for lightweight config, feature flags, small cache values, and simple lookup data.

---

## Simple explanation

KV stores data as simple key-value pairs.

You give it a key, and it gives you back a value.

Example:

```text
site:maintenance-mode → false
feature:new-dashboard → true
cache:homepage → cached JSON
```

---

## What problem it solves

KV solves the problem of storing small values that need to be read quickly from many locations.

It is useful when you need:

- feature flags
- site settings
- lightweight cache
- small public config
- maintenance mode flags
- simple lookup tables
- temporary values with TTL
- cached API responses

---

## When to use KV

Use KV when your app needs simple key-value reads.

Good examples:

- homepage cache
- feature flag config
- public site settings
- redirect maps
- maintenance mode
- small country/currency config
- temporary verification values
- cached external API response

---

## When not to use KV

KV may not be the best fit when:

- you need SQL queries
- you need relational data
- you need strong immediate consistency
- you need complex filtering or sorting
- you need to store large files
- you need live coordinated state

Use D1 for relational data.

Use R2 for files.

Use Durable Objects for coordinated live state.

---

## Beginner example

A CMS might use KV for:

```text
config:site-name
config:homepage-layout
feature:enable-newsletter
cache:homepage
```

Basic flow:

```text
Worker route
  ↓
Read KV config/cache
  ↓
Use value in response
```

---

## Production notes

For production projects:

- use clear key prefixes
- keep values small
- set TTL for cache data
- document all config keys
- use D1 for queryable records
- avoid storing sensitive user data
- protect write/update endpoints
- design around eventual consistency

---

## Security notes

Do:

- use Worker secrets for secrets
- protect admin write routes
- validate values before storing
- namespace keys clearly
- avoid sensitive personal data
- add TTL for temporary values

Do not:

- store API keys in KV
- use KV as a relational database
- store large files in KV
- trust public users to write config
- rely on instant global consistency for critical logic

---

## Cost awareness

KV cost can be affected by:

- read volume
- write volume
- stored data size
- number of keys
- unnecessary repeated writes
- caching strategy

Use KV when the value is small and frequently read. Avoid constant writes if another service fits better.

---

## Common mistakes

- using KV instead of D1 for relational data
- storing secrets in KV
- creating random key names without a convention
- expecting instant consistency everywhere
- storing large JSON blobs without limits
- forgetting TTL for cache values
- allowing public write access
- using KV for counters that require accuracy

---

## Related Cloudflare services

| Service | Relationship |
| --- | --- |
| Workers | Reads and writes KV values |
| D1 | Stores relational/queryable data |
| R2 | Stores files and large objects |
| Durable Objects | Handles coordinated state and accurate counters |
| Queues | Refreshes or processes data asynchronously |
| Pages | Can use backend routes that access KV |
| Wrangler | Creates namespaces and configures bindings |

---

## Good starter templates

- [`templates/kv-config-cache-starter`](../templates/kv-config-cache-starter/README.md)
- [`templates/simple-workers-api`](../templates/simple-workers-api/README.md)

---

## Official sources

- Cloudflare KV documentation
- Cloudflare KV Workers bindings documentation
- Cloudflare KV limits documentation

---

## Freshness

Last checked: 2026-06-27
Risk level: medium

KV behavior, limits, consistency model, and pricing can change. Always verify production guidance against the official Cloudflare documentation before launch.
