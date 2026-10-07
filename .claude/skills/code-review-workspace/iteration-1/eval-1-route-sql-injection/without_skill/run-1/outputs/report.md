## Review: `src/__review_fixtures__/deals-search/route.ts`

**สรุป: ยังย้ายไป `app/api/deals/search/route.ts` ไม่ได้ครับ** ตัวที่ต้องแก้ก่อนคือ SQL injection (ทั้งใน `q` และ `sort`) ซึ่งผมลองรันกับ SQLite in-memory แล้ว ใช้ดึงข้อมูลจากตารางอื่นได้จริง นอกจากนี้ไฟล์ยังไม่ผ่าน `npm run lint` ด้วย

---

### 🔴 Blocker

**1. SQL injection ผ่าน `q` (บรรทัด 14)**
`'%${q}%'` เอาค่าที่ผู้ใช้ส่งมาต่อเข้าไปใน SQL ตรง ๆ ผมลองบน DB in-memory ที่ schema เหมือน `top_saver_deals` แล้วได้ผลดังนี้
- `q=zz' UNION SELECT v,v,0,0,0,0 FROM secrets --` → ได้ค่า `TOP-SECRET` จากตารางอื่นกลับมาใน response ถ้าเป็น DB จริงก็จะอ่านได้ทุกตาราง รวมถึง `sqlite_master`
- `q=O'Neil` ซึ่งเป็นคำค้นปกติที่มี apostrophe → `syntax error` และเพราะไม่มี try/catch จึงกลายเป็น 500 ที่ไม่มีรูปแบบ

**2. SQL injection ผ่าน `sort` (บรรทัด 14, `ORDER BY ${sort}`)**
ค่า `sort` ใช้ placeholder `?` ไม่ได้ เพราะเป็นชื่อคอลัมน์ ไม่ใช่ค่า ตอนนี้ใส่ subquery เข้าไปได้ เช่น `sort=(SELECT v FROM secrets)` ซึ่งรันผ่านโดยไม่ error และเปิดช่องให้ทำ boolean/time-based blind injection ได้ ต้องใช้ whitelist แบบเดียวกับ `app/api/products/route.ts` (บรรทัด 16–26, 83–94)

**3. `minDiscount` ไม่ได้ตรวจค่า (บรรทัด 9)**
`parseInt('abc')` ได้ `NaN` ซึ่งไปเป็น SQL `>= NaN` แล้วเจอ `no such column: NaN` → 500 ตอนนี้ยังฉีด SQL ผ่านตัวนี้ไม่ได้เพราะผ่าน `parseInt` มาก่อน แต่ควรใช้ parameter และ validate ค่าแล้วตอบ 400 ไปเลย

### 🟠 ควรแก้ก่อน merge

**4. Lint ไม่ผ่าน**: `npx eslint` เจอ `12:15 error Unexpected any (@typescript-eslint/no-explicit-any)` ควรประกาศ `interface DealRow` แบบเดียวกับ `app/api/deals/top-saver/route.ts`

**5. ไม่มี try/catch**: route อื่นในโปรเจกต์ตอบ error เป็น `{ error, message, statusCode }` พร้อม status 500 แต่ไฟล์นี้ปล่อย exception ออกไปตรง ๆ

**6. หารด้วยศูนย์ (บรรทัด 21)**: ถ้า `stock_total = 0` จะได้ `remaining / 0` = `NaN` ผลคือ `label` เป็น `'normal'` ทั้งที่ไม่มีของเหลือแล้ว ควรเช็ค `stock_total <= 0` แยกไว้ และอาจ clamp `remaining` ไม่ให้ติดลบด้วย ในกรณีที่ `stock_sold > stock_total`

**7. รูปแบบ response ไม่ตรงกับ API อื่น**: `SELECT *` + `...row` ส่งชื่อคอลัมน์แบบ snake_case (`old_price`, `discount_percent`, `stock_total`) ออกไป แต่ `/api/deals/top-saver` map เป็น camelCase (`oldPrice`, `discountPercent`, `stockTotal`) ฝั่ง frontend จะต้องรองรับสองแบบ ควรเลือกคอลัมน์ให้ชัดและ map เหมือนกัน การใช้ `SELECT *` ยังทำให้คอลัมน์ที่เพิ่มในอนาคตหลุดออกไปใน API โดยอัตโนมัติด้วย

### 🟡 เล็กน้อย / ข้อเสนอแนะ

- ไม่มี `LIMIT` ถ้า `q` ว่างจะคืนทุกแถว ตอนนี้ตารางยังเล็กอยู่ แต่ควรมี limit/pagination แบบเดียวกับ `/api/products`
- `parseInt` ไม่ได้ระบุ radix ควรใช้ `parseInt(x, 10)`
- ควร `trim()` ค่า `q` เหมือน products route
- ใน LIKE ตัว `%` และ `_` ที่ผู้ใช้พิมพ์มาจะทำงานเป็น wildcard ถ้าต้องการให้ค้นตามตัวอักษรจริงต้อง escape และใส่ `ESCAPE '\'` (ไม่ใช่ช่องโหว่ เป็นเรื่องผลลัพธ์การค้นหา)

---

### ตัวอย่างแนวทางแก้ (ส่วนที่เป็น query)

```ts
const SORTS: Record<string, string> = {
  price: 'price ASC',
  price_desc: 'price DESC',
  discount: 'discount_percent DESC',
  name: 'name ASC',
};
const sort = searchParams.get('sort') || 'price';
const orderBy = SORTS[sort];
if (!orderBy) return badRequest(`Invalid sort. Valid: ${Object.keys(SORTS).join(', ')}`);

const minDiscount = Number.parseInt(searchParams.get('minDiscount') ?? '0', 10);
if (Number.isNaN(minDiscount) || minDiscount < 0 || minDiscount > 100) {
  return badRequest('minDiscount must be an integer 0-100');
}

const rows = db.prepare(`
  SELECT id, product_id, name, price, old_price, discount_percent, unit,
         stock_total, stock_sold, image_url, expires_at
  FROM top_saver_deals
  WHERE name LIKE ? AND discount_percent >= ?
  ORDER BY ${orderBy}
`).all(`%${q}%`, minDiscount) as DealRow[];
```
(`orderBy` มาจาก whitelist เท่านั้น ส่วนค่าที่ผู้ใช้ส่งมาทุกตัวผ่าน `?`)

### สิ่งที่ต้องทำเพิ่มเมื่อย้ายไป `app/api/deals/search/route.ts`

- **Test**: เพิ่ม test ใน `app/api/` (เช่นใน `api.test.ts` หรือไฟล์ `route.unit.test.ts` แยก) อย่างน้อยให้ครอบคลุม: ค้นหาปกติ, `q` ที่มี `'`, `sort` ที่ไม่อยู่ใน whitelist → 400, `minDiscount=abc` → 400 และ `stock_total=0`
- **OpenAPI**: เพิ่ม path `/api/deals/search` ใน `src/data/openapi.json` (ตอนนี้มีแค่ `/api/deals/top-saver`)
- **DB docs**: ตาม `AGENTS.md` route ใหม่ที่อ่านตาราง ต้องอัปเดต mapping ตาราง → route ใน skill `database` ในคอมมิตเดียวกัน แต่ไม่ต้องแก้ schema, `DATABASE.md` หรือ `mermaid.html` เพราะไม่ได้เปลี่ยนตาราง
- ก่อนคอมมิตให้รัน `npm run lint`, `npx vitest run` (หรือ `npm test`) และ `npx @google/design.md lint DESIGN.md`

### คำถาม
1. ค่า `sort` ที่ frontend จะส่งมามีอะไรบ้าง (เช่น `price`, `discount`, `-price`) ต้องรู้ก่อนถึงจะกำหนด whitelist ได้
2. ต้องการ response แบบ camelCase เหมือน `/api/deals/top-saver` ใช่ไหมครับ หรือมี client ที่ใช้ snake_case อยู่แล้ว
3. ควรกรองดีลที่หมดอายุแล้ว (`expires_at < now`) หรือดีลที่สินค้าหมดออกจากผลค้นหาด้วยไหมครับ
