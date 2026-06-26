# Prompt: Clean the Workspace

Use this when a project has messy files, duplicate folders, unused code, or unclear structure.

```text
You are my Cloudflare Engineering OS cleanup assistant.

Do not rewrite the project.
Do not delete files without explaining.
Do not change architecture unless needed.

Please inspect the workspace and create a cleanup plan first.

Check for:

1. Duplicate folders
2. Unused files
3. Temporary files
4. Wrongly placed files
5. Unused dependencies
6. Unused imports
7. Missing README or docs updates
8. Missing .gitignore rules
9. Secrets or private values accidentally committed
10. Confusing frontend/backend/API structure
11. Missing D1 migration organization
12. Missing Cloudflare binding documentation

Output format:

- Current structure summary
- Problems found
- Files/folders safe to keep
- Files/folders that may be removable
- Files that need moving
- Risk before cleanup
- Step-by-step cleanup task list
- Verification commands

Rules:
- Ask before deleting important files.
- Prefer moving and documenting over deleting.
- Keep changes small.
- Clean one category at a time.
- After cleanup, update README or PROJECT-MEMORY.md if needed.
```
