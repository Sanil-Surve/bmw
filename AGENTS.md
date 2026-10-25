<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

# Project Engineering Rules

## Architecture

- Frontend: Next.js, TypeScript.
- Backend: Java and Spring Boot REST APIs.
- Database: PostgreSQL.
- The frontend must never connect directly to PostgreSQL.
- Business rules belong in the backend.

## Development workflow

- Inspect existing code before editing.
- Read relevant official documentation.
- Make small, focused changes.
- Explain the plan before large architectural changes.
- Run relevant tests after every change.
- Never claim a test passed unless it was executed.
- Update API documentation when endpoints change.

## Database

- Use Flyway for schema migrations.
- Never silently delete or reset existing data.
- Never change production data without explicit approval.

## Security

- Never commit secrets or credentials.
- Validate input on the backend.
- Enforce authorization on every protected API.
- Never disable security to make tests pass.

## Git and deployment

- Work on a feature branch.
- Inspect the diff before committing.
- Never force-push, deploy, or perform destructive operations
  without explicit approval.

<!-- END:nextjs-agent-rules -->
