# Code Review: DealBanner component

**ขอบเขต:** `src/__review_fixtures__/DealBanner.tsx`
**ผลรวม:** ❌ **Blocked**: ยังไม่ควร commit เพราะ ESLint มี error 3 ตัว (rules-of-hooks, jsx-key) และมีบั๊กระดับ Critical เรื่อง hook ที่เรียกแบบมีเงื่อนไขกับ `setInterval` ที่ไม่ถูกเคลียร์

## Lint gate
| เครื่องมือ | ผล | errors | warnings |
|---|---|---|---|
| ESLint | ❌ ไม่ผ่าน | 3 | 3 |
| tsc --noEmit | ✅ ผ่าน (ไม่มี error ในไฟล์นี้ และทั้งโปรเจกต์ก็ไม่มี) | 0 | – |

ไม่มีปัญหาไหนที่ ESLint บอกว่าแก้ได้อัตโนมัติด้วย `--fix` ทุกข้อต้องแก้เอง

- **`src/__review_fixtures__/DealBanner.tsx:14`**: `react-hooks/rules-of-hooks` (error): เรียก `useState` ในฟังก์ชัน `deal_banner` ซึ่งชื่อขึ้นต้นด้วยตัวเล็ก React เลยไม่ถือว่าเป็น component **วิธีแก้:** เปลี่ยนชื่อเป็น `DealBanner`
- **`src/__review_fixtures__/DealBanner.tsx:18`**: `react-hooks/rules-of-hooks` (error): สาเหตุเดียวกันกับ `useEffect` **ข้อควรระวัง:** พอเปลี่ยนชื่อแล้ว error นี้จะยังอยู่ แต่ข้อความจะเปลี่ยนเป็น "called conditionally" เพราะ hook อยู่ใน `if` (ดู Critical ข้อแรก)
- **`src/__review_fixtures__/DealBanner.tsx:26`**: `react/jsx-key` (error): `<div>` ใน `deals.map` ไม่มี `key` **วิธีแก้:** `<div key={deal.id} ...>`
- **`src/__review_fixtures__/DealBanner.tsx:15`**: `@typescript-eslint/no-unused-vars` (warning): ประกาศ `unusedTitle` ไว้แต่ไม่ได้ใช้ **วิธีแก้:** ลบทิ้ง หรือเอาไป render เป็นหัวข้อ
- **`src/__review_fixtures__/DealBanner.tsx:27`**: `@next/next/no-img-element` (warning): ใช้ `<img>` แทน `next/image` ซึ่งขัดกับ convention ใน `AGENTS.md` ด้วย **วิธีแก้:** `import Image from "next/image"` แล้วใช้ `<Image src alt width height />`
- **`src/__review_fixtures__/DealBanner.tsx:27`**: `jsx-a11y/alt-text` (warning): `<img>` ไม่มี `alt` **วิธีแก้:** ใส่ `alt={deal.name}`

## Findings จากการ review

### 🔴 Critical

- **`src/__review_fixtures__/DealBanner.tsx:17-21`: เรียก `useEffect` ภายใน `if (showTimer)`**
  ปัญหา: hook ถูกเรียกแบบมีเงื่อนไข ซึ่งผิด Rules of Hooks (lint จับได้ที่บรรทัด 18 แต่ด้วยเหตุผลเรื่องชื่อฟังก์ชัน ซึ่งไม่ใช่สาเหตุหลัก)
  ผลกระทบ: ถ้า parent สลับ `showTimer` ระหว่างที่ component ยัง mount อยู่ จำนวน hook จะไม่เท่ากันในแต่ละ render แล้ว React จะ throw "Rendered more hooks than during the previous render" ทำให้ทั้งส่วนนั้นของหน้าพัง
  วิธีแก้:
  ```tsx
  useEffect(() => {
    if (!showTimer) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [showTimer]);
  ```

- **`src/__review_fixtures__/DealBanner.tsx:19`: `setInterval` ไม่มี cleanup**
  ปัญหา: effect ไม่ได้ return ฟังก์ชันที่เรียก `clearInterval`
  ผลกระทบ: เมื่อ component unmount ไปแล้ว interval ยังทำงานต่อและเรียก `setNow` ทุกวินาทีไปเรื่อย ๆ ทำให้หน่วยความจำรั่ว ส่วนใน dev ที่เปิด Strict Mode effect จะรันสองครั้ง เลยได้ interval ซ้อนกัน 2 ตัว
  วิธีแก้: ใช้ snippet ด้านบน ซึ่งตรงกับแพทเทิร์นที่ `app/page.tsx:331-342` ใช้อยู่แล้ว

### 🟡 Warning

- **`src/__review_fixtures__/DealBanner.tsx:13`: ชื่อ component เป็น `deal_banner` (snake_case)**
  ปัญหา: ผิด convention ใน `AGENTS.md` ที่กำหนดให้ component ใช้ `PascalCase` และเป็นสาเหตุของ lint error ที่บรรทัด 14 และ 18
  วิธีแก้: `export default function DealBanner({ deals, showTimer }: DealBannerProps)`

- **`src/__review_fixtures__/DealBanner.tsx:14,30`: `useState(Date.now())` จะทำให้เกิด hydration mismatch**
  ปัญหา: client component ยังถูก SSR ก่อน ค่า `now` บน server กับตอน hydrate จึงต่างกัน ข้อความ "…s left" ที่บรรทัด 30 เลยไม่ตรงกัน
  ผลกระทบ: React เตือน hydration error ใน console และอาจ re-render ทั้ง subtree ใหม่
  วิธีแก้: ให้ค่าเริ่มต้นเป็น `useState<number | null>(null)` แล้วตั้งค่าใน effect ฝั่ง client และแสดง placeholder ระหว่างที่ยังเป็น `null`

- **`src/__review_fixtures__/DealBanner.tsx:30`: เวลาที่เหลือติดลบและอาจเป็น `NaN`**
  ปัญหา: ไม่มีการ clamp ค่า และไม่ได้กันกรณีที่ `expires_at` parse ไม่ได้
  ผลกระทบ: deal ที่หมดอายุแล้วจะแสดงเป็น "-120s left" และถ้า `expires_at` เป็นค่าว่างหรือ `undefined` จะแสดง "NaNs left" นอกจากนี้ถ้า `showTimer={false}` ตัวเลขจะค้างอยู่ที่เวลา mount แต่ยังแสดงข้อความ "s left"
  วิธีแก้: `Math.max(0, ...)` ไม่แสดงบรรทัดนี้ถ้าผลเป็น `NaN` และซ่อนบรรทัดนี้เมื่อ `showTimer` เป็น `false`

- **`src/__review_fixtures__/DealBanner.tsx:5-11`: interface `Deal` ไม่ตรงกับข้อมูลจริง (ควรตรวจสอบ)**
  ปัญหา: `Deal` ใช้ชื่อฟิลด์แบบ snake_case (`image_url`, `expires_at`) แต่ `app/api/deals/top-saver/route.ts:43-54` ส่งออกมาเป็น camelCase (`imageUrl`) และไม่มี `expires_at` ในแต่ละ deal เลย มี `expiresAt` แค่ที่ระดับบนสุด อีกเรื่องคือ `image_url` ใน DB เป็น nullable (`src/lib/seed.ts:75`) แต่ interface ประกาศเป็น `string`
  ผลกระทบ: ถ้าเอาไปต่อกับ API ที่มีอยู่ รูปจะไม่ขึ้น และจะแสดง "NaNs left" ทุกการ์ด ตอนนี้ยังไม่มีไฟล์ไหน import component นี้ ผมเลยยืนยันไม่ได้ว่าจะส่งข้อมูลจากที่ไหนเข้ามา
  วิธีแก้: ใช้ type แบบ `TopSaverDeal` ใน `app/page.tsx:25-36` แล้วรับ `expiresAt` เป็น prop แยก หรือแก้เป็น `image_url: string | null` แล้วจัดการกรณี null

- **`src/__review_fixtures__/DealBanner.tsx:31`: ใช้ `<a href="/deals">` แทน `next/link` และไม่มีหน้า `/deals` อยู่จริง**
  ปัญหา: ลิงก์ภายในควรใช้ `next/link` ตาม `AGENTS.md` ส่วน `app/` ไม่มี `deals/page.tsx`
  ผลกระทบ: กดแล้วหน้าโหลดใหม่ทั้งหน้าและไปเจอ 404 นอกจากนี้ลิงก์อยู่ใน `map` เลยซ้ำกันในทุกการ์ด
  วิธีแก้: `<Link href="/search">See all deals</Link>` (ตรงกับลิงก์ "All Offers" ใน `app/page.tsx:709`) วางไว้นอก loop

### 🔵 Suggestion

- **`src/__review_fixtures__/DealBanner.tsx:30`: แสดงเวลาเป็นวินาทีล้วน** เช่น "30337s left" ซึ่งอ่านยาก แนะนำให้ format เป็น `HH:MM:SS` แบบที่ API และ `app/page.tsx` ใช้อยู่
- **`src/__review_fixtures__/DealBanner.tsx:24-26`: สไตล์และ Design Tokens** `border` ไม่ได้กำหนดสี และยังไม่มีสีหรือขนาดตัวอักษรที่อ้าง token จาก `DESIGN.md` ควรเทียบกับ `ProductCard.tsx`
- **ไม่มี Story หรือ test** ควรเพิ่ม `DealBanner.stories.tsx` ที่ครอบคลุม `showTimer` true/false, deal ที่หมดอายุแล้ว และ `deals` ว่าง

## สรุปสิ่งที่ต้องทำ
1. ย้ายเงื่อนไข `showTimer` เข้าไปใน `useEffect` และใส่ `clearInterval` ตอน cleanup
2. เปลี่ยนชื่อเป็น `DealBanner`
3. ใส่ `key={deal.id}` ที่บรรทัด 26
4. แก้ hydration mismatch ด้วยการให้ `now` เริ่มเป็น `null`
5. clamp เวลาที่เหลือไม่ให้ติดลบ และกันกรณี `NaN`
6. แก้ interface `Deal` ให้ตรงกับแหล่งข้อมูลที่จะใช้ และให้ `image_url` เป็น nullable
7. เปลี่ยน `<img>` เป็น `next/image` พร้อม `alt` และ `<a>` เป็น `next/link` ที่ชี้ไปหน้าที่มีอยู่จริง
8. ลบ `unusedTitle`
9. (แนะนำ) format เวลาเป็น `HH:MM:SS`, ใช้ Design Tokens และเพิ่ม Story

หลังแก้แล้วให้รัน `npx eslint src/__review_fixtures__/DealBanner.tsx`, `npm run lint` และ `npx vitest run` อีกครั้งก่อน commit

**คำถาม:** component นี้จะรับข้อมูลจาก `/api/deals/top-saver` หรือจาก DB row โดยตรง? คำตอบจะเป็นตัวกำหนดว่าควรแก้ interface `Deal` ไปทางไหน

ต้องการให้ผมแก้ข้อไหนบ้าง? ตอนนี้ยังไม่ได้แก้ไฟล์ใดเลย
