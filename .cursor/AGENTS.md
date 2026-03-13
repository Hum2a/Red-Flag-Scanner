# Red Flag Scanner — Agent Instructions

## Project Overview

Red Flag Scanner is a satirical web app that analyzes photos or Instagram profiles and generates "red flags" using AI. It uses React + Vite + Tailwind on the frontend and Node.js on the backend.

## Architecture

- **Frontend**: `src/` — React components, pages, hooks. Served by Vite.
- **Backend**: `server/` — Express/Fastify API, routes, services, database.
- **Plan**: See `PROJECT_PLAN.md` for the full implementation roadmap.

## Standards

Always follow the rules in `.cursor/rules/`:

- **general-standards.mdc** — Applies to all files (alwaysApply).
- **react-patterns.mdc** — When editing `.tsx` files.
- **tailwind-styling.mdc** — When styling components.
- **typescript-standards.mdc** — When editing `.ts` files.
- **node-backend.mdc** — When editing `server/` code.
- **api-conventions.mdc** — When defining or modifying API routes.

## Conventions

1. **Paths**: Use `@/` alias for `src/` in frontend imports.
2. **API base**: Frontend calls `VITE_API_BASE_URL` for backend requests.
3. **Env vars**: Never commit secrets; use `.env` and `.env.example`.
4. **DB**: Store scanned accounts in `scanned_accounts`; identifier is username or "photo".
5. **AI**: Use structured JSON output for red flags (array of strings).

## When Making Changes

- Add new components in `src/components/` with clear, single-responsibility names.
- Add API routes in `server/src/routes/` and wire them in the main app.
- Keep services (AI, Instagram, DB) in `server/src/services/`.
- Run `npm run lint` before committing.
