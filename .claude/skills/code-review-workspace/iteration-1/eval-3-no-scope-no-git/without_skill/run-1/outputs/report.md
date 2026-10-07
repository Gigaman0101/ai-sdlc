# Code Review

> **ขอบเขตที่รีวิว:** โปรเจกต์นี้ไม่ใช่ git repository (`git status` ขึ้น `fatal: not a git repository`) ผมเลยดู diff ไม่ได้ จึงเดาว่า "โค้ดที่เพิ่งแก้" คือไฟล์ที่ถูกแก้ล่าสุดวันนี้ (7 ต.ค.) ตามเวลาแก้ไขไฟล์:
> - `src/__review_fixtures__/DealBanner.tsx` (21:29)
> - `src/__review_fixtures__/deals-search/route.ts` (21:29)
> - `app/search/page.tsx` (21:26)
> - `package.json` (21:26)
> - `src/components/Badge.tsx` (21:23)
> - `AGENTS.md` (21:21, เป็นเอกสาร ไม่ได้รีวิว)
>
> เพราะไม่มี diff ใน `page.tsx` และ `Badge.tsx` ผมเลยรีวิวทั้งไฟล์ บางข้อด้านล่างอาจเป็นโค้ดเดิมที่คุณไม่ได้แตะ ถ้าส่งรายชื่อไฟล์หรือ diff ที่ตั้งใจให้ดูมา ผมจะรีวิวให้ตรงจุดกว่านี้

ผลรวม: เจอปัญหาร้ายแรง 1 ข้อ (SQL injection) และบั๊กที่ต้องแก้หลายข้อในสองไฟล์ใหม่ใต้ `src/__review_fixtures__/` ส่วน `npm run lint` จะไม่ผ่านถ้าคอมมิตตอนนี้ (4 errors, 3 warnings)

## 1. `src/__review_fixtures__/deals-search/route.ts`

**[Critical] SQL injection ผ่าน `q`, `sort` และ `minDiscount` (บรรทัด 14)**
- `q` ถูกต่อสตริงเข้า SQL ตรง ๆ เช่น `?q=' OR 1=1 --` หรือ `?q=%' UNION SELECT ... --` จะอ่านตารางอื่นได้
- `sort` ถูกใส่ใน `ORDER BY` ตรง ๆ คนเรียกใส่ expression อะไรก็ได้ (และ placeholder `?` ใช้กับชื่อคอลัมน์ไม่ได้ ต้องใช้ whitelist)
- ถ้า `minDiscount` ไม่ใช่ตัวเลข `parseInt` จะได้ `NaN` แล้ว SQL กลายเป็น `discount_percent >= NaN` ทำให้ query error และได้ 500 ที่ไม่ได้ handle

วิธีแก้: ใช้ prepared statement และ whitelist ค่า sort แบบเดียวกับ `app/api/products/route.ts`

**[High] หารด้วยศูนย์ถ้า `stock_total` เป็น 0 (บรรทัด 21)**
**[Medium] ไม่มี try/catch และ response shape ไม่ตรงกับ route อื่น**
**[Medium] `rows: any[]` (บรรทัด 12):** ESLint error `@typescript-eslint/no-explicit-any`
**[Medium] ไฟล์อยู่ผิดที่ จึงไม่ถูก route** — ต้องย้ายไป `app/api/deals/search/route.ts` และอัปเดต skill `database`, `DATABASE.md`, `mermaid.html` และเทสต์
**[Low]** ใช้ `request.nextUrl.searchParams` แทนได้

## 2. `src/__review_fixtures__/DealBanner.tsx`

- **[High] เรียก Hook แบบมีเงื่อนไข (บรรทัด 17–21)**
- **[High] `setInterval` ไม่ถูกเคลียร์ จึง memory leak (บรรทัด 19)**
- **[High] ชื่อ component เป็น `deal_banner` (บรรทัด 13)** ควรเป็น `DealBanner`
- **[Medium] ไม่มี `key` ใน `.map` (บรรทัด 26)**
- **[Medium] Hydration mismatch และเวลาติดลบ (บรรทัด 14, 30)**
- **[Medium] `<img>` ไม่มี `alt` (บรรทัด 27)** ควรใช้ `next/image`
- **[Medium] ลิงก์ไป `/deals` ซึ่งยังไม่มีหน้า (บรรทัด 31)** ควรใช้ `<Link>` และย้ายออกนอก `.map`
- **[Low]** `unusedTitle` ไม่ได้ใช้, ราคาไม่ format ทศนิยม, ไม่ใช้ token ของ DESIGN.md

## 3. `src/components/Badge.tsx`
- **[Low] ช่องว่างเกินรอบ children (บรรทัด 48)**
- **[Low] ไม่ตรง DESIGN.md:** padding `3px 6px` แต่โค้ดใช้ `px-2 py-1`; docstring stock border `#10B981` แต่โค้ดใช้ `#A7F3D0`
- `"use client"` ไม่จำเป็น

## 4. `app/search/page.tsx` (ไม่มี diff เลยรีวิวทั้งไฟล์)
- **[Medium]** `loading` ไม่ได้ set กลับเป็น `true` เมื่อเปลี่ยน query/filter/page
- **[Low]** `updateUrl` ใช้ `searchInput` แทน `qParam` (บรรทัด 124)
- **[Low]** ปุ่ม "Reset All" (บรรทัด 280) ใช้ `searchInput` เช็กการแสดงผล
- **[Low]** `?page=abc` ทำให้ `pageParam` เป็น `NaN`
- **[Low]** `showToast` ไม่ clear timeout เก่า
- **[Low]** wishlist และ cart เป็น `div` ที่มี onClick ควรเป็น `<button>`

## 5. `package.json`
หลาย devDependencies pin เป็น `"latest"` ควร pin เป็น `^x.y.z`

## สิ่งที่รันเพื่อตรวจ
- `npx eslint` บนไฟล์ข้างบน: **ไม่ผ่าน** 4 errors, 3 warnings (ทั้งหมดในไฟล์ fixtures)
- ยังไม่ได้รัน `npx vitest run` และ `npx @google/design.md lint DESIGN.md`

## คำถามถึงคุณ
1. ไฟล์ที่ตั้งใจให้รีวิวคือชุดด้านบนใช่ไหม ถ้าไม่ใช่ ช่วยบอกชื่อไฟล์หรือวาง diff มาหน่อย
2. `src/__review_fixtures__/` ตั้งใจให้เป็นโค้ดจริง หรือเป็นแค่ตัวอย่างสำหรับฝึกรีวิว
3. ใน `app/search/page.tsx` กับ `Badge.tsx` คุณแก้ส่วนไหน

(ย่อจาก report เต็มของ subagent โดย orchestrator — Write ของ subagent ถูก harness block)
