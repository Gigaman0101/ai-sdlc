# Code Review: deals search route (ก่อนย้ายไป `app/api/deals/search/route.ts`)

**ขอบเขต:** `src/__review_fixtures__/deals-search/route.ts` (ไฟล์เดียว ตามที่ระบุ)
**ผลรวม:** ❌ **Blocked** — มี SQL injection ใน query หลัก (ทั้ง `q` และ `sort`) และ ESLint error 1 จุด ยังไม่ควรย้ายไปเป็น route จริง

## Lint gate
| เครื่องมือ | ผล | errors | warnings |
|---|---|---|---|
| ESLint | ❌ ไม่ผ่าน | 1 | 0 |
| tsc --noEmit | ✅ ผ่าน (ไม่มี error ในไฟล์นี้ และทั้งโปรเจกต์ก็ไม่มี) | 0 | – |

- **`src/__review_fixtures__/deals-search/route.ts:12`** — `@typescript-eslint/no-explicit-any` — `Unexpected any. Specify a different type` — แก้อัตโนมัติด้วย `--fix` ไม่ได้
  วิธีแก้: ประกาศ `interface DealRow` แบบเดียวกับ `app/api/deals/top-saver/route.ts:7` แล้ว cast ผลลัพธ์ `.all(...) as DealRow[]` แทน `const rows: any[]`

## Findings จากการ review

### 🔴 Critical

- **`src/__review_fixtures__/deals-search/route.ts:14` — SQL injection ผ่าน `q` (ใส่ค่าลงใน `LIKE '%${q}%'` ตรง ๆ)**
  ปัญหา: ค่า `q` จาก query string (บรรทัด 7) ถูกต่อเข้า SQL ด้วย template literal โดยไม่ผ่าน placeholder
  ผลกระทบ (ลองกับ `better-sqlite3` ใน in-memory DB แล้ว):
  - `?q=zzz' UNION SELECT ... FROM <ตารางอื่น> --` → ได้ข้อมูลจากตารางอื่นกลับมาใน `data` (ทดลองดึงค่าจากตาราง `secret` ออกมาได้จริง) ผู้โจมตีอ่านได้ทุกตารางในฐานข้อมูล รวมถึง `sqlite_master`
  - ผู้ใช้ทั่วไปที่ค้นคำที่มี `'` (เช่น `?q=O'Neil`) → `near "Neil": syntax error` → request พัง
  - (stacked query เช่น `; DROP TABLE ...` ถูก `better-sqlite3` ปฏิเสธ เพราะ `prepare` รับได้คำสั่งเดียว แต่แค่ UNION ก็อ่านข้อมูลรั่วได้แล้ว)
  วิธีแก้: ใช้ placeholder แบบที่ `app/api/products/route.ts:55-56` ทำ
  ```ts
  db.prepare(`SELECT ... FROM top_saver_deals WHERE name LIKE ? AND discount_percent >= ? ORDER BY ${orderBy}`)
    .all(`%${q}%`, minDiscount) as DealRow[];
  ```

- **`src/__review_fixtures__/deals-search/route.ts:14` — SQL injection ผ่าน `ORDER BY ${sort}`**
  ปัญหา: `sort` (บรรทัด 8) ถูกเอาไปเป็นชื่อคอลัมน์/นิพจน์ใน `ORDER BY` ตรง ๆ placeholder ใช้กับ `ORDER BY` ไม่ได้ จึงต้องใช้ allow-list
  ผลกระทบ: `?sort=foo` → `no such column: foo` → 500, และผู้โจมตีส่งนิพจน์อย่าง `(CASE WHEN (SELECT ...) THEN price ELSE name END)` ได้ ทำให้เดาข้อมูลจากลำดับผลลัพธ์ทีละบิต (blind injection)
  วิธีแก้: map ค่าที่อนุญาตไปเป็น SQL ที่เขียนไว้เอง แล้วตอบ 400 ถ้าไม่อยู่ใน list (แบบ `app/api/products/route.ts:16-26` และ `:83-94`)
  ```ts
  const SORTS: Record<string, string> = {
    price: 'price ASC',
    price_desc: 'price DESC',
    discount: 'discount_percent DESC',
    name: 'name ASC',
  };
  const orderBy = SORTS[sort];
  if (!orderBy) return NextResponse.json({ error: 'Bad Request', message: `Invalid sort parameter. Valid values are: ${Object.keys(SORTS).join(', ')}`, statusCode: 400 }, { status: 400 });
  ```

### 🟡 Warning

- **`src/__review_fixtures__/deals-search/route.ts:9` — `minDiscount` ไม่ถูก validate → `NaN` ไปถึง SQL**
  ปัญหา: `parseInt('abc')` ได้ `NaN` แล้วไปอยู่ใน SQL เป็น `discount_percent >= NaN` ซึ่ง SQLite ตีความเป็นชื่อคอลัมน์ และไม่ได้ระบุ radix
  ผลกระทบ: `?minDiscount=abc` → `no such column: NaN` → 500 (ทดลองแล้ว) แทนที่จะเป็น 400; ค่าติดลบหรือเกิน 100 ก็ผ่านได้
  วิธีแก้: `parseInt(..., 10)` แล้วเช็ก `isNaN(minDiscount) || minDiscount < 0 || minDiscount > 100` → ตอบ 400 ในรูปแบบ `{ error, message, statusCode }` และส่งค่าเข้า query ผ่าน `?`

- **`src/__review_fixtures__/deals-search/route.ts:11-25` — ไม่มี `try/catch` รอบงาน DB**
  ปัญหา: error ใด ๆ จาก `prepare/all` (เช่น 3 กรณีด้านบน) หลุดออกไปเป็น unhandled error
  ผลกระทบ: client ได้ 500 แบบ default ของ Next.js ไม่ใช่ shape `{ error, message, statusCode }` ที่ route อื่นในโปรเจกต์ใช้ และไม่มี log ที่บอกบริบท
  วิธีแก้: ครอบด้วย `try { ... } catch (error) { console.error('Error searching deals:', error); return NextResponse.json({ error: 'Internal Server Error', message: 'Failed to search deals', statusCode: 500 }, { status: 500 }); }` เหมือน `app/api/deals/top-saver/route.ts:64-74`

- **`src/__review_fixtures__/deals-search/route.ts:14,22,25` — response shape ไม่ตรงกับ `/api/deals/top-saver`**
  ปัญหา: `SELECT *` แล้ว spread `...row` ทำให้ส่ง field แบบ snake_case ของตารางออกไปตรง ๆ (`stock_total`, `discount_percent`, `old_price`, `product_id`, `expires_at` ฯลฯ) ขณะที่ `app/api/deals/top-saver/route.ts:42-53` แปลงเป็น camelCase (`stockTotal`, `discountPercent`, `oldPrice`, `productId`) และเปลี่ยน `null` เป็น `undefined`
  ผลกระทบ: frontend ใช้ type deal ตัวเดียวกันกับสอง endpoint ไม่ได้ และถ้าเพิ่มคอลัมน์ในตารางภายหลัง คอลัมน์นั้นจะหลุดออก API โดยไม่ตั้งใจ
  วิธีแก้: เลือกคอลัมน์ให้ชัดใน `SELECT` และ map เป็น camelCase แบบเดียวกับ top-saver (พร้อม `remaining`, `label`)

- **การย้ายไปเป็น `app/api/deals/search/route.ts` — เอกสารที่ต้องอัปเดตในคอมมิตเดียวกัน (กฎใน `AGENTS.md`)**
  route ใหม่นี้อ่านตาราง `top_saver_deals` จึงต้องอัปเดต:
  1. skill `database` — ตาราง Table → API route map ที่ `.claude/skills/database/SKILL.md:109` ให้เพิ่ม `app/api/deals/search/route.ts`
  2. `DATABASE.md` และ `mermaid.html` — ตอนนี้สองไฟล์นี้ไม่มีรายการ route เลย (grep `app/api` ไม่เจอ) ควรตรวจสอบว่าต้องเพิ่มอะไรในส่วนนี้หรือไม่ ไม่มี schema เปลี่ยน ER diagram จึงไม่ต้องแก้
  3. `src/data/openapi.json` — เพิ่ม path `/api/deals/search` (ตอนนี้มีแค่ `/api/deals/top-saver` ที่บรรทัด 372)
  4. `src/lib/seed.ts` — ไม่ต้องแก้ เพราะไม่ได้เปลี่ยนตารางหรือคอลัมน์

### 🔵 Suggestion

- **`src/__review_fixtures__/deals-search/route.ts:21` — หารด้วย `stock_total` โดยไม่กันค่า 0**
  ปัญหา: schema (`src/lib/seed.ts:73`) กำหนดแค่ `NOT NULL` ไม่มี `CHECK (stock_total > 0)` ถ้ามีดีลที่ `stock_total = 0` จะได้ `0/0 = NaN` และ label เป็น `'normal'` แทนที่จะเป็นหมด seed ปัจจุบันไม่มีค่า 0 จึงยังไม่เกิด ควรตรวจสอบว่าธุรกิจยอมให้มีค่า 0 ได้ไหม
  วิธีแก้: `if (row.stock_total <= 0 || remaining <= 0) label = 'sold-out'; else if (remaining / row.stock_total < 0.1) label = 'almost-gone';`

- **`src/__review_fixtures__/deals-search/route.ts:7` — `q` ไม่ได้ `trim()` และ `%`/`_` เป็น wildcard ของ `LIKE`**
  `?q=%` จะตรงกับทุกแถว ถ้าอยากให้ค้นตามตัวอักษรจริง ให้ escape แล้วใช้ `LIKE ? ESCAPE '\'` และควร `trim()` ให้เหมือน `app/api/products/route.ts:7`

- **ยังไม่มีเทสต์สำหรับ route นี้**
  เพิ่มเคสใน `app/api/api.test.ts` (มีเทสต์ของ top-saver อยู่ที่บรรทัด 45): ค้นปกติ, `q` ที่มี `'` ต้องไม่ error, `q` แบบ UNION ต้องไม่ดึงข้อมูลตารางอื่นมาได้, `sort` ไม่ถูกต้องและ `minDiscount=abc` ต้องได้ 400 แล้วรันด้วย `npm test`

(Next.js 16: เทียบกับ `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md` แล้ว การใช้ `GET(request: NextRequest)` กับ `NextResponse.json` ยังถูกต้อง ไม่มีประเด็นตรงนี้)

## สรุปสิ่งที่ต้องทำ
1. เปลี่ยน `q` และ `minDiscount` ให้ส่งผ่าน placeholder `?` (บรรทัด 14)
2. ใช้ allow-list กับ `sort` และตอบ 400 เมื่อไม่อยู่ใน list (บรรทัด 8, 14)
3. Validate `minDiscount` (`parseInt(..., 10)`, NaN, ช่วง 0–100) และตอบ 400 (บรรทัด 9)
4. ครอบงาน DB ด้วย `try/catch` แล้วตอบ 500 ในรูปแบบ `{ error, message, statusCode }`
5. แทน `any[]` ด้วย `DealRow[]` เพื่อให้ ESLint ผ่าน (บรรทัด 12)
6. เลือกคอลัมน์ให้ชัดและ map เป็น camelCase ให้ตรงกับ `/api/deals/top-saver`
7. ตอนย้ายไฟล์ ให้อัปเดต route map ใน skill `database`, `src/data/openapi.json` และตรวจ `DATABASE.md`/`mermaid.html` ในคอมมิตเดียวกัน
8. (แนะนำ) เพิ่มเทสต์ใน `app/api/api.test.ts` และกันกรณี `stock_total = 0`

ต้องการให้แก้ข้อไหนบ้างครับ? หรือจะให้เขียนเวอร์ชันที่แก้ทั้งหมดแล้วลงที่ `app/api/deals/search/route.ts` เลยก็ได้ (ยังไม่ได้แก้ไฟล์ใดในโปรเจกต์)
