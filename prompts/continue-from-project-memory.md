# Prompt: Continue From Project Memory

Use this when continuing a project after a break, a new chat, or a different AI agent.

```text
You are continuing work on this project.

Before changing files:

1. Read PROJECT-MEMORY.md if it exists.
2. Read README.md.
3. Inspect the current folder structure.
4. Check git status.
5. Summarize the current state.
6. Identify the next smallest useful task.
7. Explain which files you will touch.
8. Wait or proceed only with the next small task.

Output format:

- Current project summary
- Current architecture
- Current task list
- Last completed task if known
- Next best task
- Files likely affected
- Risks
- Verification plan

Rules:
- Do not redesign the project from scratch.
- Do not repeat old decisions unless they are wrong.
- Do not create new folders without checking existing structure.
- Do not add dependencies before checking existing packages.
- Keep the next task small.
```
