---
name: project-overview
description: Living map of the Farmart (ai-sdlc-course) Next.js 16 storefront — pages, API routes, components, data layer, tests, tooling, deployment, and a changelog of recent source changes. Use whenever the user asks how the project is organised, where a feature lives, which page calls which API, how to run/test/deploy it, what changed recently, or needs orientation before editing code. Kept in sync with git by a recurring loop (see "Keeping this skill current").
---

# Farmart project overview

<!-- last-synced-commit: db82bd2e23762ce25076a3d9f098e2b98c47b23e -->
<!-- last-synced-at: 2026-10-10 -->

Farmart is a grocery storefront demo built for the AI-SDLC course.
Stack: **Next.js 16.3 App Router**, React 19.2, TypeScript strict, Tailwind CSS v4,
SQLite via `better-sqlite3`. Read `node_modules/next/dist/docs/` before writing
Next.js code: version 16 has breaking changes.

## Directory map

| Path | Purpose |
|------|---------|
| `app/` | Pages, layouts, and route handlers (App Router) |
| `app/api/` | Read-only JSON API backed by SQLite |
| `src/components/` | Reusable UI components, re-exported from `index.ts` |
| `src/lib/db.ts` | `getDb()` — opens SQLite and seeds it |
| `src/lib/seed.ts` | Schema (`CREATE TABLE IF NOT EXISTS`) and seed data |
| `src/data/` | Static fixtures (`products.tsx`) and `openapi.json` |
| `src/stories/` | Storybook stories |
| `e2e/` | Playwright E2E specs (`api`, `home`, `product-detail`, `search`) |
| `public/` | Static assets, `openapi.json`, `swagger-ui/`, `mermaid.html` |
| `src/__review_fixtures__/` | Intentionally buggy code for `code-review` skill evals. Lint errors here are expected. |

Import alias: `@/*` resolves to `./src/*` and then `./*`.

## Pages

| Route | File | Notes |
|-------|------|-------|
| `/` | `app/page.tsx` | Client component. Fetches `/api/categories`, `/api/brands`, `/api/deals/top-saver`, `/api/products/best-sellers`, `/api/products/just-landing` |
| `/products` | `app/products/page.tsx` | Product index |
| `/products/[id]` | `app/products/[id]/page.tsx` | Client component. Product detail, gallery, related products |
| `/search` | `app/search/page.tsx` | Client component. Reads `q`, `category`, `brand`, `isOrganic`, `sort` from the URL |
| `/design` | `app/design/page.tsx` | Design-system showcase (tokens from `DESIGN.md`) |
| `/docs` | `app/docs/page.tsx` | Swagger UI for the API |

## API routes (all `GET`, all read-only)

| Route | Query params | Table(s) |
|-------|--------------|----------|
| `/api/categories` | — | `categories` |
| `/api/categories/[slug]` | — | `categories` |
| `/api/brands` | — | `brands` |
| `/api/products` | `q`, `category`, `brand`, `isOrganic`, `sort` | `products` |
| `/api/products/[id]` | — (id or slug) | `products` |
| `/api/products/[id]/related` | — | `products` |
| `/api/products/best-sellers` | `category` (default `All`), `limit` 1–50 (default 8) | `products` |
| `/api/products/just-landing` | `category`, `limit` 1–50 | `products` |
| `/api/deals/top-saver` | — | `top_saver_deals` |
| `/api/openapi.json`, `/docs/swagger.json` | — | serves `openapi.json` |
| `/api/hello` | — | health check |

For the ER diagram and the column list, use the `database` skill.

## Components (`src/components/`)

`Badge`, `Breadcrumb`, `Button`, `CartDrawer`, `Dialog`, `Footer`, `Header`,
`ProductCard`, `ProductGallery`, `QuantityStepper`, `StarRating`, `Tabs`.
Import from `@/components` (barrel `index.ts`).

## Data layer

- `getDb()` in `src/lib/db.ts` opens `data/farmart.db` locally.
  On Vercel (`process.env.VERCEL` set) it uses `/tmp/farmart.db`, because only `/tmp` is writable there.
- Seeding runs on every `getDb()` call and is idempotent: it creates tables if missing and inserts rows only into empty tables.
- On Vercel the DB is re-seeded on each cold start. Writes do not persist. Any future write route needs an external DB.
- `next.config.ts` sets `serverExternalPackages: ["better-sqlite3"]` (native module).

## Commands

| Command | What |
|---------|------|
| `npm run dev` | Dev server on `:3000` |
| `npm run build` | Production build (`next build --webpack`) |
| `npm run lint` | ESLint 9 — run after every code change |
| `npm test` | Vitest `unit` project (`src/**/*.test.ts`, `app/**/*.test.ts`) |
| `npx vitest run` | Unit and Storybook projects (Playwright Chromium) |
| `npm run test:e2e` | Playwright E2E (chromium, webkit, mobile). Starts `npm run dev` itself |
| `npm run storybook` | Storybook on `:6006` |
| `npx @google/design.md lint DESIGN.md` | Design-token lint |

## Deployment (Vercel)

- Git remote: `git@github.com:Gigaman0101/ai-sdlc.git`.
- Deploy with the CLI (`npx vercel login`, then `npx vercel`, then `npx vercel --prod`), or import the GitHub repo at vercel.com/new.
- No env vars are required. `.vercel/` is git-ignored.

## Conventions

- Conventional Commits (`feat:`, `fix:`, `docs:` …).
- PascalCase for components, stories, and types. camelCase for helpers and hooks.
- A schema change must update, in the same commit: `src/lib/seed.ts`, the `database` skill, `DATABASE.md`, and `mermaid.html`.

## Related skills

- `database` — ER diagram, table-to-route map
- `seed-data` — reset and re-seed the local DB
- `code-review` — lint/tsc review of changes
- `graphify` — knowledge-graph queries over the codebase

## Changelog

Newest first. One line per commit that changes source structure or behaviour.

- `db82bd2` fix: `getDb()` uses `/tmp` on Vercel (read-only filesystem)
- `2542914` chore: remove code-review eval logs
- `2223697` chore: initial commit of Farmart storefront

## Keeping this skill current

A recurring loop syncs this file with git. Each run does the following:

1. Read `last-synced-commit` at the top of this file.
2. Run `git log --oneline <last>..HEAD` and `git diff --stat <last>..HEAD`. Also run `git diff --stat` for uncommitted work.
3. Ignore changes that only touch tests, `graphify-out/`, `coverage/`, reports, or `.claude/skills/*-workspace/`.
4. For relevant changes, update the affected sections above: pages, API routes, components, data layer, commands, or deployment. Add a changelog line for each relevant commit.
5. Set `last-synced-commit` to the current `HEAD` and set `last-synced-at` to today. Do not record uncommitted changes in the changelog.
6. If nothing relevant changed, do not edit the file.
