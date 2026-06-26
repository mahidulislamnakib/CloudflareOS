# AI Token and Decision Economy

We are building in the AI-agentic era.

Wrong decisions do not only waste developer time. They also waste AI tokens, context window, tool calls, and build attempts.

Cloudflare Engineering OS should help users decide what to build before asking an AI agent to generate large amounts of code.

## Simple rule

> Decide first. Generate second.

Before an AI agent writes files, it should understand the system need, choose the smallest useful version, and identify what should not be built yet.

## Why this matters

AI coding agents can move fast, but they can also:

- Generate unnecessary files
- Add the wrong stack
- Overbuild version 1
- Add unused dependencies
- Create confusing architecture
- Rewrite working code
- Consume tokens explaining and fixing avoidable mistakes
- Lose context in long sessions

A good decision before coding saves time, money, and tokens.

## System-needs intake flow

When a user says:

> I need a system for my business.

The AI agent should not immediately code.

It should first produce:

1. Simple understanding of the need
2. Version 1 scope
3. What not to build first
4. Required modules
5. Required Cloudflare services
6. Required professional product areas
7. Database tables
8. Admin needs
9. Upload/media needs
10. External API needs
11. Security and privacy needs
12. Deployment and rollback needs
13. Token-safe build order

## Token-safe build order

Build in small steps:

1. Architecture decision
2. Folder structure
3. Database schema
4. One working API
5. One working page
6. One admin flow
7. Upload or external API only if needed
8. Security basics
9. Local test
10. Deployment
11. Improvements

Do not generate everything at once.

## AI context-saving rules

Agents should:

- Read only relevant files first
- Summarize current project state before changes
- Make one small feature at a time
- Avoid repeating long explanations after context is established
- Keep a short project memory file when useful
- Avoid creating large boilerplate unless requested
- Avoid changing unrelated files
- Report changed files clearly

## Decision before dependency

Before adding a package, ask:

- Can native platform features do this?
- Does Cloudflare already provide this capability?
- Is the package compatible with Workers runtime?
- Will the package increase bundle size?
- Will this create more debugging work later?

## Decision before service

Before adding a Cloudflare service, ask:

- What exact requirement needs this service?
- Can version 1 work without it?
- What binding/configuration is required?
- What failure mode does it introduce?
- What will it cost at scale?

## Decision before external API

Before adding an external API, ask:

- Is this required in version 1?
- What private values are needed?
- What data leaves the app?
- What happens if the API fails?
- How do we test without wasting calls?
- Can we mock it during development?

## Token waste warning signs

Stop and rethink when:

- The agent keeps rewriting the same files
- The project adds services without a clear reason
- The explanation becomes longer than the actual task
- The agent asks for many unrelated decisions
- Debugging jumps between many possible causes
- The context contains stale plans that no longer match the code
- A simple app now has enterprise architecture

## Required output for project requests

For any new system request, answer with:

```text
System type:
Version 1 goal:
Must-have modules:
Do not build yet:
Cloudflare services:
Professional product checklist:
Database tables:
External APIs:
Upload/media needs:
Security needs:
Build order:
Token-saving advice:
Next prompt:
```

## AI agent instruction

Do not start coding immediately after a broad request.

First produce a small, token-safe implementation plan. Confirm the smallest useful version. Then build one slice at a time.
