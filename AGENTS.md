# Repository Guidelines

## Project Structure & Module Organization
- `App.tsx` and `index.tsx` are the main React/TypeScript entry points.
- `components/` holds reusable UI components.
- `api/` contains serverless or API-related modules (if present).
- `public/` contains static assets served as-is.
- `metadata.json` stores app metadata.
- Tooling/config: `vite.config.ts`, `tsconfig.json`, `package.json`.
- Secrets/config: `.env.local` (do not commit secrets).

## Build, Test, and Development Commands
Use npm scripts from `package.json`:
- `npm run dev` starts the Vite dev server with hot reload.
- `npm run build` creates a production build in `dist/`.
- `npm run preview` serves the production build locally for verification.

## Coding Style & Naming Conventions
- Language: TypeScript + React (ESM).
- Indentation: 2 spaces (match existing files).
- Naming: `PascalCase` for React components, `camelCase` for variables/functions, `kebab-case` for asset file names when practical.
- No formatter or linter is configured; keep changes consistent with nearby code.

## Testing Guidelines
- No testing framework is configured in this repository.
- If you add tests, prefer colocating them near source files and use `*.test.ts` or `*.test.tsx`.
- Document any new test command in `package.json`.

## Commit & Pull Request Guidelines
- No Git history is available in this folder, so commit conventions are undefined.
- Recommended: use Conventional Commits (e.g., `feat: add hero animation`, `fix: handle empty API response`).
- PRs should include a clear summary, linked issue (if any), and screenshots for UI changes.

## Security & Configuration Tips
- Set `GEMINI_API_KEY` in `.env.local` for local runs.
- Never commit `.env.local` or API keys; use environment variables instead.
