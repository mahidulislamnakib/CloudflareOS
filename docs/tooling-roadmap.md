# DeveloperB Tooling Roadmap

DeveloperB begins as a small Cloudflare Worker and static workspace. This document records the tools that are approved for the repository, why they exist, and when they should be introduced.

The rule is simple: add a tool only when it removes a real risk or enables an accepted product capability. Do not add infrastructure merely because it is popular.

## Installed now: quality and safety baseline

| Tool | Purpose | How it is used |
| --- | --- | --- |
| [Zod](https://github.com/colinhacks/zod) | Runtime validation for untrusted API input | `src/project-coach.ts` strictly validates the AI coach request shape and message length. |
| [Biome](https://github.com/biomejs/biome) | Formatter and linter | `npm run lint`, `npm run format`, and `npm run check`. |
| [Workers Vitest integration](https://github.com/cloudflare/workers-sdk/tree/main/packages/vitest-pool-workers) | Tests routes inside a Workers-compatible runtime | `npm run test` runs `test/workspace-app.test.ts`. |
| [CodeQL](https://github.com/github/codeql-action) | Static security analysis | `.github/workflows/codeql.yml` runs on pull requests, pushes to `main`, and weekly. |
| [Gitleaks](https://github.com/gitleaks/gitleaks-action) | Detects committed secrets in full Git history | `.github/workflows/security.yml` scans pushes, pull requests, and weekly. |
| [Zizmor](https://github.com/zizmorcore/zizmor) | Audits GitHub Actions permissions and workflow risks | `.github/workflows/security.yml` reports findings to GitHub code scanning. |
| Dependabot | Maintains npm packages and GitHub Actions | `.github/dependabot.yml` creates a small number of weekly update PRs. |

### Local commands

```powershell
npm install
npm run check
npm run dev
```

`npm run check` must pass before a pull request is merged. It performs TypeScript checking, Biome formatting/linting checks, and Worker-runtime tests.

## Add with B-002: D1 rehearsal and persistent control plane

| Tool | Why it becomes useful | Guardrail |
| --- | --- | --- |
| [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm) and Drizzle Kit | Typed Cloudflare D1 schema, migration generation, and query helpers | Do not add it until a dedicated preview D1 database, migration rehearsal, synthetic fixtures, and tenant-isolation checks exist. |
| [Hono](https://github.com/honojs/hono) | Route grouping and reusable middleware as the API grows beyond the current three endpoints | Keep the direct Worker handler while the route surface stays small. Migrate only when a real route/module boundary improves clarity. |

## Add with B-004: discovery workspace and trustworthy AI

| Tool | Why it becomes useful | Guardrail |
| --- | --- | --- |
| [Cloudflare Agents](https://github.com/cloudflare/agents) | Persistent discovery sessions, user/project state, live updates, tools, approvals, and durable workflows | One agent per approved workspace or discovery session. Keep tenant and permission checks server-controlled. |
| `@cloudflare/ai-chat` | Persistent chat history and resumable response streaming | Add only after identity and membership are protected. |
| [Promptfoo](https://github.com/promptfoo/promptfoo) | Prompt evaluation and adversarial testing for the DeveloperB Guide | Build a private test set first. Verify required sections, uncertainty, refusal to request secrets, and the "what not to build yet" rule. Do not send real customer data to an evaluation tool. |
| [Playwright](https://github.com/microsoft/playwright) | Browser-level acceptance testing for discovery, blueprint acceptance, mobile layouts, keyboard access, loading/error states, and protected preview flows | Add when a protected preview has stable user journeys to test. |

## Add with Builder: controlled execution and verified evidence

| Tool | Why it becomes useful | Guardrail |
| --- | --- | --- |
| [Cloudflare Sandbox SDK](https://github.com/cloudflare/sandbox-sdk) | Runs generated code and build checks in isolated containers | Never expose raw shell access. Use explicit execution budgets, an allowlist of commands, tenant-separated sandboxes, audit logs, and approval before any external deployment. |
| [Cloudflare MCP servers](https://github.com/cloudflare/mcp-server-cloudflare) | Lets an approved agent inspect Cloudflare documentation, bindings, builds, observability, and logs | Start read-only. Scope API tokens to the minimum Cloudflare permissions. |
| [GitHub MCP Server](https://github.com/github/github-mcp-server) | Lets an approved agent read project repositories, issues, pull requests, and workflow evidence | Start read-only. Require user approval before opening issues, creating PRs, changing files, or merging. |
| [Octokit](https://github.com/octokit/rest.js) | DeveloperB's future first-party GitHub integration | Use a GitHub App with narrowly scoped, installation-level permissions instead of personal access tokens. |

## Useful documentation and knowledge tools

| Tool | Intended role |
| --- | --- |
| [Mermaid](https://github.com/mermaid-js/mermaid) | Generate architecture, workflow, ownership, and deployment diagrams from accepted blueprints. |
| [Starlight](https://github.com/withastro/starlight) | Publish a separate, static documentation site if the knowledge base grows beyond repository Markdown. |
| [markdownlint](https://github.com/DavidAnson/markdownlint) and [cspell](https://github.com/streetsidesoftware/cspell) | Optional documentation quality checks if editorial volume makes the current basic Markdown checks insufficient. |

## Explicitly not approved yet

Do not add custom authentication, vector search/RAG, Redis, Next.js, React, a large UI kit, payment tooling, generic autonomous agent frameworks, or production sandbox execution before an accepted requirement demonstrates the need.

## Security operating rules

1. Never commit `.dev.vars`, `.env`, API tokens, account IDs, database credentials, or client data.
2. Treat a secret-scan finding as a rotation incident, not merely a deletion task.
3. Review CodeQL and Zizmor findings before merging.
4. Keep workflow permissions minimal and disable persisted checkout credentials.
5. Do not enable a write-capable MCP tool or sandboxed command path without an approval step, audit evidence, and a rollback plan.
