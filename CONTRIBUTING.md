# Contributing

Thank you for helping improve Cloudflare Engineering OS.

This project is beginner-first and production-aware. Contributions should make Cloudflare easier to understand, safer to use, and more practical for real projects.

## Core rule

> Simple explanation first. Engineering detail second.

Do not start with jargon if plain English can explain the idea.

## Before adding a guide

Ask:

- Would this help a beginner take the next step?
- Would this prevent a common mistake?
- Would this save a solo developer time?
- Is the Cloudflare recommendation justified?
- Is the guide safe for production?

## Required structure for guides

Most guides should include:

1. Simple goal
2. When to use it
3. When not to use it
4. Cloudflare tools needed
5. Step-by-step beginner path
6. Common mistakes
7. How to test
8. How to deploy or verify
9. Advanced notes if needed

## Writing style

Use:

- Plain English
- Short sections
- Tables for choices
- Diagrams when useful
- Small working steps
- Clear warnings for dangerous actions

Avoid:

- Long theory before action
- Too many tools in version 1
- Copying official documentation
- Recommending experimental features as default
- Hiding uncertainty
- Using secrets or real API keys in examples

## Cloudflare guidance rule

Every recommendation should explain why.

Example:

```text
Use R2 for uploads because files belong in object storage.
Store only the file key and metadata in D1.
Do not store large files directly in D1.
```

## AI-agent safety rule

Guides and prompts should prevent AI agents from:

- Overbuilding
- Adding unnecessary services
- Breaking existing structure
- Exposing secrets
- Running destructive database commands
- Deploying without local verification

## Project playbook rule

Every project playbook should start with a small version 1.

Do not start with:

- Full SaaS billing
- Multi-tenant complexity
- Advanced AI automation
- Full mobile app
- Heavy analytics
- Complex workflows

Add those as version 2 or version 3.

## Source policy

Cloudflare facts that can change must be checked against official Cloudflare sources before becoming production guidance.

If a feature is beta, preview, experimental, or newly released, say so clearly.
