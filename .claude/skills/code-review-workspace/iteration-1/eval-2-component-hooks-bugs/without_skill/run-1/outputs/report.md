ยังไม่ควร commit ครับ `npm run lint` ไม่ผ่าน ไฟล์นี้มี error 3 ตัวกับ warning 3 ตัว และมีบั๊กตอนรันอีกหลายจุดที่ lint จับไม่ได้ ส่วน `tsc --noEmit` ผ่าน

## ต้องแก้ก่อน commit

1. **เรียก Hook แบบมีเงื่อนไข (บรรทัด 17–21)** มี `useEffect` อยู่ใน `if (showTimer)` ถ้า `showTimer` เปลี่ยนค่าหลัง mount จำนวน hook จะไม่เท่าเดิม แล้ว React จะ throw ว่า "Rendered more/fewer hooks than during the previous render" (ESLint: `react-hooks/rules-of-hooks`) วิธีแก้คือเรียก `useEffect` ทุกครั้ง แล้วไปเช็กเงื่อนไขข้างใน
   ```tsx
   useEffect(() => {
     if (!showTimer) return;
     const id = setInterval(() => setNow(Date.now()), 1000);
     return () => clearInterval(id);
   }, [showTimer]);
   ```
2. **ไม่ได้ `clearInterval` (บรรทัด 19)** ทำให้ interval ยังทำงานต่อหลัง unmount และ `setNow` ยังถูกเรียกบน component ที่ unmount ไปแล้ว ซึ่งเป็น memory leak ใน dev ที่เปิด StrictMode effect รันสองรอบ เลยมี interval ซ้อนกันเป็นสองตัว ตัวอย่างโค้ดในข้อ 1 แก้ไว้แล้ว
3. **ชื่อ component เป็น `deal_banner` (บรรทัด 13)** React ถือว่าเป็น component ได้ก็ต่อเมื่อชื่อขึ้นต้นด้วยตัวใหญ่ ESLint เลยไม่ยอมรับว่า hook บรรทัด 14 และ 18 อยู่ใน component (เป็นต้นเหตุของ error 2 ตัว) และยังผิด convention PascalCase ใน AGENTS.md ด้วย ควรเปลี่ยนเป็น `export default function DealBanner(...)`
4. **ไม่มี `key` ใน `deals.map` (บรรทัด 26)** (ESLint: `react/jsx-key`) ใส่ `key={deal.id}`
5. **Type `Deal` ไม่ตรงกับข้อมูลจริง** `GET /api/deals/top-saver` (`app/api/deals/top-saver/route.ts`) ส่งกลับมาเป็น camelCase (`imageUrl`, `oldPrice` และอื่น ๆ) แต่ละ deal ไม่มี `expires_at` มีแค่ `expiresAt` ระดับบนตัวเดียว และ `image_url` ใน DB เป็น nullable ได้ (`TEXT` ไม่มี `NOT NULL`) ถ้าเอา response ของ API มาใส่ component นี้ `deal.image_url` จะเป็น `undefined` และตัวนับเวลาจะขึ้น `NaNs left` ต้องเลือกให้ชัดว่า component นี้รับข้อมูลรูปแบบไหน แล้วแก้ type ให้ตรง

## ควรแก้

6. **ตัวนับเวลาติดลบและอาจขึ้น NaN (บรรทัด 30)** ถ้าหมดเวลาแล้วจะแสดง `-120s left` ควรครอบด้วย `Math.max(0, …)` แล้วแสดงข้อความ "หมดเวลา" แทน ถ้า `expires_at` parse ไม่ได้ก็จะได้ `NaN`
7. **Hydration mismatch** ไฟล์นี้เป็น `"use client"` ก็จริง แต่ยังถูก SSR อยู่ `useState(Date.now())` บน server กับ client ได้ค่าไม่ตรงกัน ตัวเลขวินาทีเลยต่างกันและขึ้น hydration warning ทางแก้คือเริ่ม `now` เป็น `null` แล้วค่อย set ใน effect หรือคำนวณเวลาเฉพาะฝั่ง client
8. **ถ้า `showTimer = false` ก็ยังแสดง "Xs left"** แต่เป็นค่าที่หยุดอยู่ตั้งแต่ตอน mount ผู้ใช้จะเห็นเวลาไม่ขยับ ถ้าไม่เปิด timer ก็ควรซ่อนบรรทัดนี้ไปเลย
9. **`<img>` ไม่มี `alt` และไม่ได้ใช้ `next/image` (บรรทัด 27)** (ESLint warning 2 ตัว) อย่างน้อยให้ใส่ `alt={deal.name}` และถ้า `image_url` เป็น null ต้องมีรูป fallback
10. **ตัวแปร `unusedTitle` ไม่ได้ใช้ (บรรทัด 15)** ลบออก หรือถ้าตั้งใจให้เป็นหัวข้อก็ render ออกมา
11. **ราคาไม่ได้ format (บรรทัด 29)** ราคา 6.2 จะออกมาเป็น `$6.2` ไม่ใช่ `$6.20` แต่ `ProductCard` ใช้ `price.toFixed(2)` อยู่แล้ว ควรใช้ให้เหมือนกัน
12. **ลิงก์ "See all deals" ถูกทำซ้ำในทุกการ์ด (บรรทัด 31)** น่าจะควรมีแค่ครั้งเดียวนอก `map` และใช้ `next/link` แทน `<a>` สำหรับ route ภายในแอป

## เรื่องโครงสร้างและกระบวนการ

- `app/page.tsx` บรรทัด 314–342 มี logic ดึง Top Saver และนับถอยหลัง (มี `clearInterval` ถูกต้อง) อยู่แล้ว component นี้ทำซ้ำของเดิมแต่คุณภาพต่ำกว่า และแสดงเป็นวินาทีล้วน ไม่ใช่ h:m:s แบบ UI ที่มีอยู่ ถ้าจะแยกเป็น component ควรย้าย logic ออกมาจาก `page.tsx` แล้วใช้ร่วมกัน
- ไฟล์อยู่ใน `src/__review_fixtures__/` ยังไม่มีใคร import ไม่ได้ export ผ่าน `src/components/index.ts` และไม่มี story หรือ test ถ้าจะใช้จริง ตาม AGENTS.md ควรย้ายไป `src/components/DealBanner.tsx` และเพิ่ม `DealBanner.stories.tsx`
- Styling ใช้ class ทั่ว ๆ ไป (`border`, `rounded-lg`) ยังไม่ได้ใช้ design token แบบ component อื่นในโปรเจกต์

## ผลการตรวจ

| คำสั่ง | ผล |
|---|---|
| `npx eslint src/__review_fixtures__/DealBanner.tsx` | ไม่ผ่าน: error 3 ตัว (rules-of-hooks ×2, jsx-key), warning 3 ตัว (no-unused-vars, no-img-element, alt-text) |
| `npx tsc --noEmit -p .` | ผ่าน ไม่มี type error |
| `npx vitest run` และ `npx @google/design.md lint DESIGN.md` | ไม่ได้รัน เพราะไฟล์นี้ไม่มี test หรือ story และ lint ไม่ผ่านตั้งแต่ขั้นแรก ซึ่งบล็อกการ commit อยู่แล้ว |

หมายเหตุ: โฟลเดอร์โปรเจกต์นี้ไม่ใช่ git repository (`git status` ขึ้น `fatal: not a git repository`) เลยตรวจ diff หรือสถานะ staged ไม่ได้ รีวิวนี้ดูจากเนื้อหาไฟล์ทั้งไฟล์

## คำถาม

- ไฟล์นี้ตั้งใจให้เป็น component ที่จะใช้จริง (ย้ายไป `src/components/`) หรือเป็นแค่ fixture สำหรับฝึกรีวิว ถ้าเป็น fixture ก็ไม่ควร commit เข้า `src/` เพราะ `npm run lint` จะไม่ผ่านทั้งโปรเจกต์ ต้อง ignore ใน `eslint.config.mjs` หรือย้ายออกไปนอก `src/`
- `deals` จะมาจาก `/api/deals/top-saver` หรือแหล่งอื่น คำตอบนี้กำหนดว่า type `Deal` ต้องหน้าตาเป็นแบบไหน

ถ้าต้องการ ผมแก้ข้อ 1–5 และ 9–10 ให้ได้เลย แล้วรัน lint ซ้ำให้ผ่านก่อน commit
