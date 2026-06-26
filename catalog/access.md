# Cloudflare Access

Cloudflare Access protects internal applications, admin panels, staging sites, dashboards, and private APIs with identity-based access rules.

Use Access when a resource should be available only to approved users, groups, devices, or service identities.

---

## Simple explanation

Cloudflare Access sits in front of an app and asks: **who is this user, and are they allowed in?**

```text
User opens protected app
  ↓
Cloudflare Access checks identity and policy
  ↓
Allowed user reaches the app
```

---

## What problem it solves

Access helps remove the need to expose internal tools directly to the public internet.

It is useful for:

- admin dashboards
- staging environments
- internal CMS panels
- private APIs
- employee tools
- client portals
- SSH/RDP or self-hosted internal services
- partner-only applications

---

## When to use Access

Use Access when users must prove identity before reaching a resource.

Good examples:

- protect `/admin`
- protect a preview website
- restrict a client dashboard to one company
- allow only team members into internal tools
- protect internal APIs used by staff systems
- secure a temporary demo for a client

---

## When not to use Access

Access is not a replacement for:

- application-level roles and permissions
- secure database authorization
- input validation
- rate limiting
- public signup/login flows

Use Access as the outer security layer. Your application should still check roles and permissions for sensitive actions.

---

## Beginner example

Protecting an admin panel:

```text
Admin visits admin.example.com
  ↓
Access checks login identity
  ↓
Only approved emails/groups can continue
  ↓
Application checks admin role for sensitive actions
```

---

## Production notes

For production projects:

- list every protected hostname and route
- use groups instead of many individual emails when possible
- separate staging and production policies
- keep application-level role checks
- document emergency access steps
- review policies when team members change
- test denied access as well as approved access
- avoid broad allow rules

---

## Security notes

Do:

- use identity-based policies
- apply least-privilege access
- protect admin and staging environments
- keep role checks inside the application
- review access logs and policy changes
- remove former staff and unused identities promptly

Do not:

- rely on a hidden URL as protection
- make an allow-all policy for convenience
- expose private tools without authentication
- treat Access as a replacement for in-app authorization
- share accounts between team members

---

## Cost awareness

Access policy design can affect operational complexity more than app code.

Keep your setup simple at first: one app, clear allowed identities, and documented rules. Add advanced policies only when the project needs them.

---

## Common mistakes

- protecting only the homepage but not admin routes
- allowing too many users by broad domain rules
- forgetting staging sites are public too
- assuming Access replaces application permissions
- not documenting who owns each policy
- leaving old employee access active
- using one shared login for a whole team

---

## Related Cloudflare services

| Service | Relationship |
| --- | --- |
| Zero Trust | Access is part of the Cloudflare Zero Trust platform |
| Workers | Can enforce application-side authorization and service flows |
| Pages | Protects internal Pages deployments or preview sites |
| Tunnel | Connects private/self-hosted services to Access |
| Turnstile | Protects public forms; it does not replace identity access |
| WAF | Adds request protection for public applications |
| Access Service Tokens | Supports machine-to-machine access patterns |

---

## Good starter use cases

- Protect an admin dashboard
- Protect a staging domain
- Restrict a client portal by email or group
- Secure an internal API before exposing it to staff tools

---

## Official sources

- Cloudflare Access documentation
- Cloudflare Zero Trust application policy documentation
- Cloudflare Access service token documentation

---

## Freshness

Last checked: 2026-06-26
Risk level: medium

Identity providers, policy options, and Zero Trust configuration can change. Always verify current Access setup guidance in the official Cloudflare documentation before production use.
