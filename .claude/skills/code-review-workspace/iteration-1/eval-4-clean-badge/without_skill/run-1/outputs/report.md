ตรวจ `src/components/Badge.tsx` แล้วครับ ไม่มีบั๊กที่ทำให้พัง: ESLint ผ่าน, `tsc --noEmit` ไม่มี error ในไฟล์นี้ และทุกที่ที่เรียกใช้ (`ProductCard`, `ProductGallery`, `app/products/[id]/page.tsx`) ส่ง variant ที่มีอยู่จริง แต่ตัวคอมโพเนนต์ไม่ตรงกับ DESIGN.md อยู่หลายจุด แม้คอมเมนต์ในไฟล์จะเขียนว่า "Strictly mapped from DESIGN.md"

### ไม่ตรงกับ DESIGN.md (ควรแก้)
1. **Padding ผิด (บรรทัด 34):** `px-2 py-1` ได้ 8px/4px แต่ spec ของ `badge-discount` และ `badge-organic` คือ `3px 6px` ควรแก้เป็น `px-[6px] py-[3px]` ตอนนี้ badge ทุกตัวจึงใหญ่กว่าที่ออกแบบไว้
2. **ฟอนต์ผิด (บรรทัด 34):** ใช้ `font-mono` แต่ `typography.label-caps` กำหนดเป็น `'Inter', system-ui, sans-serif` ใน `app/globals.css` มี token `--font-label-caps` อยู่แล้ว ควรใช้ `font-label-caps` หรือตัดออกให้ใช้ฟอนต์ body
3. **สีขอบของ `stock` ไม่ตรงกับคอมเมนต์ (บรรทัด 24 กับ 39):** คอมเมนต์บอก border `#10B981` (fresh-emerald) แต่โค้ดใช้ `#A7F3D0` และคอมเมนต์บอกว่ามี "fresh emerald pip" แต่ไม่มี pip ถูกเรนเดอร์ ต้องเลือกว่าจะยึดแบบไหน แล้วแก้อีกฝั่งให้ตรงกัน

### คุณภาพโค้ด / ดูแลระยะยาว
4. **Hardcode hex แทนการใช้ design token (บรรทัด 37–42):** `globals.css` มี `--color-deal-red`, `--color-organic-green`, `--color-primary`, `--color-accent-orange`, `--color-hairline`, `--color-hairline-light` และ `--radius-sm` อยู่แล้ว ควรใช้ `bg-deal-red`, `bg-organic-green`, `bg-primary`, `bg-accent-orange`, `rounded-sm`, `text-on-accent` เป็นต้น ถ้าวันหลังเปลี่ยน token สีของ badge จะได้เปลี่ยนตามเอง
5. **มีช่องว่างเกินรอบ children (บรรทัด 48):** `<span> { children} </span>` ทำให้ใน DOM มีช่องว่างหน้าและหลังข้อความ (textContent เป็น `" -20% "`) ตอนนี้ยังไม่เห็นผลบนจอเพราะ span เป็น flex item แต่จะมีผลกับการ copy, snapshot และ test ที่เทียบข้อความตรงตัว ควรแก้เป็น `<span>{children}</span>`
6. **`"use client"` ไม่จำเป็น (บรรทัด 1):** คอมโพเนนต์นี้ไม่มี state, hook หรือ event handler ถ้าเอาออกจะเรนเดอร์ฝั่ง server ได้ แต่มีข้อควรระวัง: ถ้าส่ง event handler (เช่น `onClick`) ผ่าน `...props` จาก Server Component จะต้องคงไว้ ตอนนี้ยังไม่มีที่ไหนใช้แบบนั้น
7. **`variant="stock"` และ `"neutral"` มีขอบ 1px:** ทำให้ badge สองแบบนี้สูงกว่าแบบอื่น 2px ถ้าวางเรียงกันจะเห็นว่าไม่เท่ากัน แก้ได้โดยใส่ `border border-transparent` ใน base style
8. **ไอคอนไม่มีการซ่อนจาก screen reader:** ถ้า `icon` เป็นแค่ของตกแต่ง ควรครอบด้วย `<span aria-hidden="true">`

### การทดสอบ
9. **ไม่มี Story หรือ test ของ Badge:** ไม่มีไฟล์ `Badge.stories.tsx` ใน `src/stories/` หรือข้างคอมโพเนนต์ ซึ่ง AGENTS.md ให้มี Interaction Stories ไว้ ควรเพิ่ม story ให้ครบทั้ง 6 variant และกรณีที่มี `icon`

### คำถามที่อยากให้ยืนยัน
- ตัวเลข padding `3px 6px` ใน DESIGN.md คือค่าที่ต้องการจริงใช่ไหม หรือ `px-2 py-1` ที่ใช้อยู่เป็นค่าที่ตั้งใจเปลี่ยนแล้วแต่ยังไม่ได้แก้ DESIGN.md
- ขอบของ `stock` ควรเป็น `#10B981` ตามคอมเมนต์ หรือ `#A7F3D0` ตามโค้ด และต้องการ pip สีเขียวด้วยไหม
- variant `featured`, `orange`, `stock`, `neutral` ยังไม่มีที่ไหนเรียกใช้และไม่มีใน DESIGN.md (`components:` มีแค่ `badge-discount` กับ `badge-organic`) ควรเพิ่มลง DESIGN.md หรือตัดออก

ผมยังไม่ได้แก้ไฟล์ใด ถ้าต้องการให้แก้บอกได้ครับ ข้อ 1, 2, 4 และ 5 แก้รวมกันในคอมมิตเดียวได้
