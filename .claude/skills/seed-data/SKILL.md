---
name: seed-data
description: Onboard a fresh clone of ai-sdlc-course and get the local SQLite dev database seeded and ready. Use whenever the user asks to "seed data", "reset the database", "start development" / "onboard" on this project, sees empty product/category/brand lists in the app or in tests, or gets SQLite errors like "no such table". Explains that seeding is automatic (no npm script), how to force a clean re-seed, and how to add new seed data safely.
---

# Seeding the local database (Farmart / ai-sdlc-course)

This project has **no `npm run seed` script**. Seeding is a side effect of importing
`@/lib/db`, and it is idempotent — safe to trigger over and over.

## How it works

- [src/lib/db.ts](../../../src/lib/db.ts) exports `getDb()`. The first time anything calls it,
  it opens (or creates) `data/farmart.db` with `better-sqlite3`, sets `journal_mode = WAL`,
  and immediately calls `seedDatabase(db)`.
- [src/lib/seed.ts](../../../src/lib/seed.ts) runs `CREATE TABLE IF NOT EXISTS` for four tables —
  `categories`, `brands`, `products`, `top_saver_deals` — then, **for each table separately**,
  checks `SELECT COUNT(*)`. Only if that table is empty does it insert its hardcoded seed rows.
- Every `app/api/**/route.ts` handler calls `getDb()` at request time, so simply **starting the
  dev server and hitting any API route** (or running the test suite, which imports the routes
  directly) triggers seeding.

So onboarding a fresh clone is just:

```bash
npm install
npm run dev        # or: npm test
```

On first request/test run, `data/farmart.db` is created and populated automatically. No extra
command is needed.

## Verifying it worked

```bash
curl -s http://localhost:3000/api/categories | head -c 300
```

Or run the backend test suite, which exercises every route against the real seeded db:

```bash
npm test
```

If categories/brands/products come back as empty arrays, `data/farmart.db` exists but its
tables were seeded empty — see "Forcing a clean re-seed" below.

## Forcing a clean re-seed

Because seeding is gated per-table on `COUNT(*) === 0`, editing the hardcoded arrays in
`seed.ts` does **nothing** to a database that already has rows in that table. To pick up
changes to seed data, or to fix a corrupted/partial dev db, delete the SQLite files and let
it rebuild on next access:

```bash
rm -f data/farmart.db data/farmart.db-shm data/farmart.db-wal
npm run dev   # or npm test — first getDb() call recreates and reseeds everything
```

Also restart the dev server afterward if it was already running — `getDb()` caches a
singleton on `global` (see `db.ts`) for hot-reload reuse, so a running process won't notice
the files were deleted until it restarts.

## What gets seeded (reference)

| Table              | Rows (as of this skill) | Notable fields |
|--------------------|--------------------------|----------------|
| `categories`       | 8  | `slug` (e.g. `fruits-vegetables`, `raw-meats`), `item_count`, `display_order` |
| `brands`           | 4  | `name` (e.g. `Farmart Organic Direct`, `Meat Brand`), `product_count` |
| `products`         | 15 | `slug`, `brand`, `category_slug`, `price`, `is_organic`, `rating`, `is_best_seller`, `is_just_landing`, `is_top_saver` |
| `top_saver_deals`  | 4  | `product_id`, `price`, `old_price`, `expires_at` |

Known product `id`s used across existing tests: `1` = organic Hass avocado (`Farmart Organic
Direct`, organic, $6.49), `3` = British beef mince (`Meat Brand`, not organic, $59.00).

## Adding or changing seed data

1. Edit the relevant array in `seed.ts` (`categories`, `brands`, `products`, or `deals`).
2. Keep IDs (`cat-N`, `brand-N`, product `id`) unique and stable — they're referenced by
   `slug`/`id` in API routes and in existing tests (`app/api/api.test.ts`,
   `app/api/products/route.integration.test.ts`).
3. Delete the local db files (see above) and restart so the new rows actually get inserted.
4. If you change a product's filterable fields (`brand`, `is_organic`, `price`, `category_slug`,
   `rating`), double check `app/api/products/route.integration.test.ts` — it makes assertions
   against real seeded data (e.g. sort ordering, brand counts) and may need updating.

## Gotchas

- `data/` is **not** in `.gitignore` — the committed/local `farmart.db*` files can drift from
  `seed.ts` after manual DB edits. When in doubt, delete and re-seed rather than trusting the
  file on disk.
- Seeding only ever *inserts*; it never updates existing rows or drops tables. There's no
  migration story here — schema changes to `CREATE TABLE` in `seed.ts` only apply to a table
  that doesn't exist yet, so a schema change also requires deleting the db files.
- Tests use the exact same `getDb()`/seed path as the real app (see
  `app/api/api.test.ts` and `app/api/products/route.integration.test.ts`) — there is no
  separate test database or fixture loader.
- The whole `data/` directory can go missing between sessions (not just the `.db*` files),
  e.g. after a workspace/container reset — `better-sqlite3` will recreate the directory and
  the db from scratch on the next `getDb()` call, so treat a missing `data/` folder the same
  as a missing db file: just re-run `npm test` or `npm run dev`, no manual `mkdir` needed.
- `npm test` maps to `vitest run --project unit` (see `package.json` / `vitest.config.mts`),
  which only runs `src/**/*.test.ts` and `app/**/*.test.ts` — this is the fast way to trigger
  seeding and verify it. Plain `npx vitest run` (no `--project` flag) also runs the `storybook`
  project (Playwright/Chromium browser tests), which is slower and unnecessary just to seed
  or verify the database.
