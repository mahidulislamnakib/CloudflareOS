# Start Here

Welcome. DeveloperB helps people turn real problems into clear decisions and build-ready products. This repository also includes a Cloudflare-friendly technical toolkit for building and deploying applications.

You do **not** need to be an expert.

## Start with the real problem

Before choosing a framework or writing features, answer:

- What is happening today?
- Who is affected?
- What is the current workaround?
- What does it cost in time, money, trust, or missed opportunities?
- What must not go wrong?

DeveloperB can help compare six paths:

1. Do not build yet.
2. Use an existing tool.
3. Improve a manual process.
4. Automate one workflow.
5. Build a lightweight internal tool.
6. Build a full software product.

Only create a project after a solution and blueprint are clear.

## Cloudflare-friendly toolkit

Use Cloudflare services when they fit the technical need:

| Need | Common service |
| --- | --- |
| Website page | Pages or Workers |
| App/API code | Workers |
| Database | D1 |
| File upload | R2 |
| Fast small cache | KV |
| Background task | Queues |
| Step-by-step process | Workflows |
| AI feature | Workers AI or an approved model gateway |
| Protect a form | Turnstile |
| Protect an internal area | Access |

## Beginner path

1. Explain the problem in plain language.
2. Read the relevant architecture guide in `architectures/`.
3. Define the smallest useful version and what not to build yet.
4. Build one small verified task at a time.
5. Deploy only after checks, security, and rollback are ready.

## If you use AI coding tools

Open this repository and say:

```text
Read BUILD-STATUS.md, AGENTS.md, and the relevant architecture guide.
Start from the real problem.
Separate facts, assumptions, and unanswered questions.
Recommend the smallest safe next step.
Do not add services or features unless they are needed.
```

## Our promise

This repository should explain decisions in two levels:

1. **Simple explanation** for beginners.
2. **Engineering detail** for advanced users and coding agents.

If a page is too hard to understand, it should be improved.
