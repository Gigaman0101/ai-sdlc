# Code Review: Badge component

**ขอบเขต:** `src/components/Badge.tsx`
**ผลรวม:** Needs changes — lint และ type check ผ่านหมด ไม่มีบั๊กหรือปัญหาความปลอดภัย แต่สไตล์บางจุดไม่ตรงกับ token ใน `DESIGN.md` (ฟอนต์, padding)

## Lint gate
| เครื่องมือ | ผล | errors | warnings |
|---|---|---|---|
| ESLint (`npx eslint src/components/Badge.tsx`) | ✅ ผ่าน | 0 | 0 |
| tsc --noEmit | ✅ ผ่าน (ทั้งโปรเจกต์ไม่มี error) | 0 | – |

ไม่มีปัญหาจาก lint (ไม่ได้รัน `design.md lint` เพราะ `DESIGN.md` ไม่อยู่ในขอบเขต)

## Findings จากการ review

### 🟡 Warning

- **`src/components/Badge.tsx:34` — ใช้ `font-mono` แทนฟอนต์ `label-caps` (Inter)**
  ปัญหา: `DESIGN.md` กำหนด `typography.label-caps` เป็น `'Inter', system-ui, sans-serif` และ `app/globals.css:39` มี `--font-label-caps` ให้แล้ว แต่ Badge ใช้ `font-mono` ซึ่งโปรเจกต์ไม่ได้ override จึงได้ฟอนต์ monospace ของระบบ (ui-monospace / SF Mono / Menlo)
  ผลกระทบ: badge ทุกตัว (`-24%`, `100% ORGANIC` ใน `ProductCard`, `ProductGallery`, หน้า product) แสดงเป็นฟอนต์ monospace ไม่ตรงกับ design system และหน้าตาต่างกันไปตาม OS
  วิธีแก้: เปลี่ยน `font-mono` เป็น `font-label-caps` (และจะใช้ `text-label-caps tracking-label-caps` แทน `text-[10px] tracking-[1px]` ก็ได้ เพราะ token มีใน `@theme` แล้ว)

- **`src/components/Badge.tsx:34` — padding ไม่ตรงกับ spec `3px 6px`**
  ปัญหา: `DESIGN.md` (`badge-discount`, `badge-organic`) และ doc comment ของไฟล์เอง (บรรทัด 22–23) ระบุ padding `3px 6px` แต่โค้ดใช้ `px-2 py-1` = `4px 8px`
  ผลกระทบ: badge ใหญ่กว่า spec ทั้งแนวตั้งและแนวนอน กินที่บนการ์ดสินค้ามากกว่าที่ออกแบบไว้
  วิธีแก้: `px-[6px] py-[3px]`

- **`src/components/Badge.tsx:39` — สไตล์ variant `stock` ไม่ตรงกับ doc comment (ควรตรวจสอบ)**
  ปัญหา: comment บรรทัด 24 บอกว่า border เป็น `#10B981` (`fresh-emerald`) "with fresh emerald pip" แต่โค้ดใช้ `border-[#A7F3D0]` และไม่มีการแสดง pip เลย นอกจากนี้ `#ECFDF5`, `#047857`, `#A7F3D0` ไม่ได้อยู่ใน color token ของ `DESIGN.md`
  ผลกระทบ: ตอนนี้ยังไม่มีที่ไหนใช้ `variant="stock"` จึงยังไม่กระทบหน้าจอ แต่คนที่อ่าน comment จะเข้าใจผิดว่าได้ border สีเขียวเข้มพร้อม pip
  วิธีแก้: ตัดสินใจว่าอันไหนถูก แล้วแก้อีกฝั่งให้ตรง เช่นถ้า comment ถูกก็ใช้ `border-fresh-emerald` และเพิ่ม pip (`<span className="w-1.5 h-1.5 rounded-full bg-fresh-emerald" />`) ถ้าโค้ดถูกก็แก้ comment

### 🔵 Suggestion

- **`src/components/Badge.tsx:48` — มีช่องว่างเกินรอบ `children`**
  ปัญหา: `<span> { children} </span>` ทำให้ JSX ใส่ text node `" "` หน้าและหลัง children
  ผลกระทบ: หน้าจอแทบไม่เห็นความต่างเพราะ inner span เป็น flex item (ช่องว่างหัว/ท้ายบรรทัดถูกตัด) แต่ `textContent` จะเป็น `" -24% "` ซึ่งมีผลกับการ copy, screen reader และ test ที่เทียบข้อความแบบ exact
  วิธีแก้: `<span>{children}</span>`

- **`src/components/Badge.tsx:37-42` — ใช้ hex ตรง ๆ แทน color token**
  ปัญหา: `app/globals.css` มี `--color-deal-red`, `--color-organic-green`, `--color-primary`, `--color-accent-orange`, `--color-hairline`, `--color-hairline-light` อยู่แล้ว แต่ Badge ใช้ `bg-[#DC2626]` ฯลฯ
  ผลกระทบ: ค่าสีตรงกันในตอนนี้ แต่ถ้าวันหนึ่งเปลี่ยน token ใน `DESIGN.md`/`globals.css` Badge จะไม่เปลี่ยนตาม
  วิธีแก้: เช่น `bg-deal-red text-on-accent`, `bg-organic-green text-on-accent`, `bg-primary text-on-primary`, `bg-accent-orange text-on-accent`, `bg-hairline-light border-hairline`

- **`src/components/Badge.tsx:1` — `"use client"` ไม่จำเป็น**
  ปัญหา: Badge ไม่มี state, hook หรือ event handler ของตัวเอง
  ผลกระทบ: ตอนนี้ไม่มีผล เพราะไฟล์ที่ import ทั้งหมด (`ProductCard`, `ProductGallery`, `app/products/[id]/page.tsx`) เป็น client component อยู่แล้ว แต่ถ้า Server Component นำ Badge ไปใช้ จะต้องส่ง JS ของ Badge ไปที่ client โดยไม่จำเป็น
  วิธีแก้: ลบ `"use client"` ออก (คอมโพเนนต์จะยังทำงานได้ทั้งใน server และ client)

- **ยังไม่มี `Badge.stories.tsx`**
  ปัญหา: ตาม `AGENTS.md` คอมโพเนนต์ควรมี story แต่ใน `src/stories/` และ `src/components/` ยังไม่มี story ของ Badge
  วิธีแก้: เพิ่ม story ที่แสดงทั้ง 6 variant และกรณีที่มี `icon` ไว้ใช้ตรวจหน้าตาเทียบกับ `DESIGN.md`

## สรุปสิ่งที่ต้องทำ
1. เปลี่ยน `font-mono` เป็น `font-label-caps` (`Badge.tsx:34`)
2. แก้ padding เป็น `px-[6px] py-[3px]` (`Badge.tsx:34`)
3. ทำให้ variant `stock` กับ comment ตรงกัน (`Badge.tsx:24`, `Badge.tsx:39`)
4. (แนะนำ) ลบช่องว่างรอบ `children`, เปลี่ยน hex เป็น token utility, ลบ `"use client"`, เพิ่ม `Badge.stories.tsx`

ต้องการให้แก้ข้อไหนบ้าง?
