# Product Charter

## Name

**Cloudflare Engineering OS**

## Purpose

Help newcomers and AI coding agents build reliable Cloudflare-native applications from first idea through production operation.

## The problem

Cloudflare has a powerful product ecosystem, but teams still need answers that are spread across many documents:

- Which product is right for this feature?
- Which products work together safely?
- What should be asynchronous?
- Which configuration is needed before deployment?
- What breaks in production?
- How can a project stay current as Cloudflare changes?

This project answers those engineering questions without copying official documentation.

## What we build

- Decision guidance for Cloudflare services
- Production architecture patterns
- AI-agent instructions and prompts
- Debugging and deployment playbooks
- Safe templates and checklists
- Examples that show product composition
- Reviewable update automation

## What we do not build

- A replacement for official Cloudflare documentation
- A dependency-heavy one-size-fits-all starter kit
- Unreviewed automated edits to trusted engineering guidance
- Advice that treats preview/experimental products as automatically production-ready

## Quality standard

Every product or architecture page must answer:

1. What is it?
2. When should I use it?
3. When should I avoid it?
4. What configuration or bindings are required?
5. What production failures are common?
6. How do I debug and deploy it?
7. What does it cost or what consumption drives cost?
8. Which related Cloudflare products affect the decision?

## Source policy

Cloudflare facts that can change must be based on official Cloudflare documentation, changelogs, and official release sources. Sources are recorded with a checked date. Any automated update becomes a pull request for human review.
