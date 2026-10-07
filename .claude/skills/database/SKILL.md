---
name: database
description: Big-picture map of the Farmart (ai-sdlc-course) SQLite database — Mermaid ER diagram of every table, the logical relationships between them, and which API routes read which table. Use whenever the user asks about the database/schema/tables/columns/ERD, wants to add or change a table or column, adds a feature that touches data, writes a query or API route, or needs to know how categories/brands/products/deals relate. Also use as the checklist for keeping the diagram in sync after a schema change.
---

# Farmart database overview

- **Engine:** SQLite 3 via `better-sqlite3`, `journal_mode = WAL`
- **File:** `data/farmart.db` (created automatically — see the `seed-data` skill)
- **Connection:** `getDb()` singleton in [src/lib/db.ts](../../../src/lib/db.ts)
- **Schema source of truth:** `CREATE TABLE IF NOT EXISTS` statements in [src/lib/seed.ts](../../../src/lib/seed.ts)
- **Full data dictionary / DDL:** [DATABASE.md](../../../DATABASE.md) · interactive ERD: [mermaid.html](../../../mermaid.html)

## ER diagram

```mermaid
---
title: Farmart Grocery Store Database ER Diagram
---
erDiagram
    direction LR

    CATEGORIES ||--o{ PRODUCTS : "contains (category_slug -> slug)"
    BRANDS ||--o{ PRODUCTS : "supplies (brand -> name)"
    PRODUCTS ||--o| TOP_SAVER_DEALS : "features (product_id -> id)"

    CATEGORIES {
        text id PK "e.g. cat-1"
        text name "Display name"
        text slug UK "URL slug"
        text icon "SVG icon key"
        integer item_count
        integer display_order "Navbar order"
    }

    BRANDS {
        text id PK "e.g. brand-1"
        text name "Joined from PRODUCTS.brand"
        text logo_url
        text tag
        text title
        integer product_count
    }

    PRODUCTS {
        text id PK "1, 2, ..."
        text slug UK
        text name
        text brand FK "BRANDS.name"
        text category "Display category name"
        text category_slug FK "CATEGORIES.slug"
        real price
        real old_price
        text unit
        integer discount_percent
        integer is_organic "0/1"
        real rating
        integer review_count
        text stock_status "in_stock / out_of_stock"
        integer stock_count
        text sku
        text barcode
        text short_description
        text full_description "JSON string[]"
        text highlights "JSON string[]"
        text nutrition_facts "JSON {name,amount,dailyValue}[]"
        text origin_info "JSON object"
        text image_url
        integer is_best_seller "0/1"
        integer is_just_landing "0/1"
        integer is_top_saver "0/1"
        integer stock_sold
        integer stock_total
        text created_at
    }

    TOP_SAVER_DEALS {
        text id PK "e.g. deal-1"
        text product_id FK "PRODUCTS.id"
        text name
        real price
        real old_price
        integer discount_percent
        text unit
        integer stock_total
        integer stock_sold
        text image_url
        text expires_at "ISO-8601 countdown"
    }
```

## Things the diagram can't show

- **FKs are logical, not enforced.** `seed.ts` declares no `FOREIGN KEY` / `REFERENCES`
  constraints; the relationships above are joins by convention. `products.brand` joins on
  `brands.name` (not `brands.id`).
- **JSON columns** (`full_description`, `highlights`, `nutrition_facts`, `origin_info`) are
  stored as TEXT — `JSON.parse` them in route handlers before returning.
- **Booleans** are `INTEGER` 0/1.
- `products.category` duplicates `categories.name` (denormalised for display).

## Table → API route map

| Table | Read by |
| :--- | :--- |
| `categories` | `app/api/categories/route.ts`, `app/api/categories/[slug]/route.ts` |
| `brands` | `app/api/brands/route.ts` |
| `products` | `app/api/products/route.ts`, `products/[id]`, `products/[id]/related`, `products/best-sellers`, `products/just-landing` |
| `top_saver_deals` | `app/api/deals/top-saver/route.ts` |

Verify before relying on this map: `grep -rn "FROM <table>" app/api`.

## Keeping this in sync (required on every feature that touches data)

When a feature adds/removes/renames a table, column, index, or relationship — or adds a route
that reads a table — update **all** of these in the same change:

1. `src/lib/seed.ts` — `CREATE TABLE` + seed rows (existing dev dbs won't pick up new columns
   automatically; see the `seed-data` skill for re-seeding).
2. **This skill** — the `erDiagram` block, the caveats, and the table → route map.
3. `DATABASE.md` — ER diagram, data dictionary, DDL, and seed counts.
4. `mermaid.html` — the `erDiagram` definitions inside it.
5. `app/api/openapi.json` / `src/data/openapi.json` if response shapes change.

Quick drift check — the column lists in the diagram should match the live db:

```bash
sqlite3 data/farmart.db ".schema"
```
