# แนวทางการพัฒนาโปรเจกต์ (Repository Guidelines)

ยินดีต้อนรับสู่โปรเจกต์ **ai-sdlc-course** เอกสารนี้สรุปโครงสร้างของโปรเจกต์, ขั้นตอนการพัฒนาและการทดสอบ, มาตรฐานการเขียนโค้ด ตลอดจนข้อกำหนดในการมีส่วนร่วม (Contribution)

## โครงสร้างโปรเจกต์และการจัดระเบียบโมดูล (Project Structure & Module Organization)

- `app/`: หน้า (Pages), เลย์เอาต์ (Layouts) และ Route Handlers ของ Next.js 16 App Router (เช่น `app/products/[id]/page.tsx`)
- `src/components/`: คอมโพเนนต์ UI แบบแยกส่วนที่นำกลับมาใช้ซ้ำได้ (เช่น `ProductGallery.tsx`, `Breadcrumb.tsx`)
- `src/data/`: ข้อมูลจำลอง (Mock data fixtures) และแค็ตตาล็อกข้อมูลแบบคงที่
- `src/stories/`: Component stories สำหรับ Storybook และการจัดการสถานะ UI
- `public/`: Static assets เช่น รูปภาพและไอคอน
- `.storybook/`: การกำหนดค่า Storybook และการตั้งค่า Test Runner

## คำสั่งสำหรับการบิลด์, ทดสอบ และการพัฒนา (Build, Test, and Development Commands)

- `npm run dev`: เริ่มต้น Development Server ของ Next.js ที่ `http://localhost:3000`
- `npm run build`: คอมไพล์และบิลด์แอปพลิเคชัน Next.js สำหรับ Production
- `npm run start`: รันเซิร์ฟเวอร์ Production ภายในเครื่อง (Local)
- `npm run lint`: รัน ESLint 9 โดยใช้ `eslint.config.mjs` เพื่อตรวจสอบคุณภาพโค้ด
- `npm run storybook`: เปิด Storybook Component Explorer ที่พอร์ต 6006
- `npm run build-storybook`: บิลด์ไฟล์เอกสาร Storybook ในรูปแบบ Static
- `npx vitest run`: รันชุดทดสอบทั้งหมด (ทั้ง `unit` project สำหรับ backend/API และ `storybook` project สำหรับ Stories) ผ่าน Vitest และ Playwright Chromium แบบ Headless
- `npm test`: รันเฉพาะ `unit` project (`vitest run --project unit`) คือชุดทดสอบ backend/API ใน `src/**/*.test.ts` และ `app/**/*.test.ts` — เร็วกว่าและเพียงพอสำหรับตรวจสอบ seed data/route logic โดยไม่ต้องรัน Storybook/Playwright
- `npx playwright test` (`npm run test:e2e`): รัน Playwright E2E regression suite ใน `e2e/` กับทุก project (chromium, webkit, Mobile Chrome, Mobile Safari; Firefox เปิดด้วย `PW_FIREFOX=1`) — `playwright.config.ts` สตาร์ท `npm run dev` ให้อัตโนมัติ
- `npx playwright show-report` (`npm run test:e2e:report`): เปิด HTML report แสดง pass/fail แยกตาม project

## รูปแบบการเขียนโค้ดและข้อตกลงการตั้งชื่อ (Coding Style & Naming Conventions)

- **ภาษาและการจัดรูปแบบ**: ใช้ TypeScript พร้อมเปิดโหมด `strict` เว้นวรรค 2 ช่อง (2-space indentation) และ Import โมดูลให้เป็นระเบียบ
- **ข้อตกลงการตั้งชื่อ**:
  - คอมโพเนนต์ React และไฟล์ Story: ใช้ `PascalCase` (เช่น `ProductGallery.tsx`, `ProductGallery.stories.tsx`)
  - ฟังก์ชันตัวช่วย (Helpers), Hooks และตัวแปร: ใช้ `camelCase` (เช่น `formatPrice`, `useProduct`)
  - Types และ Interfaces: ใช้ `PascalCase` (เช่น `ProductItem`, `GalleryProps`)
- **การจัดสไตล์**: ใช้ Utility Classes ของ Tailwind CSS v4

## แนวทางการทดสอบ (Testing Guidelines)

- **เฟรมเวิร์กทดสอบ**: Vitest ทำงานร่วมกับ `@storybook/addon-vitest` และ Playwright Headless Chromium
- **การทดสอบ Story**: วางไฟล์ Interaction Stories ไว้ใน `src/stories/` หรือควบคู่กับคอมโพเนนต์โดยใช้ชื่อ `*.stories.tsx` หรือ `*.test.tsx`
- ตรวจสอบให้แน่ใจว่าการทดสอบทั้งหมดผ่านด้วย `npx vitest run`, ตรวจสอบ Design Tokens ด้วย `npx @google/design.md lint DESIGN.md` และ Lint ผ่านด้วย `npm run lint` ก่อนทำการคอมมิต

## ข้อกำหนดการคอมมิตและ Pull Request (Commit & Pull Request Guidelines)

- **ข้อความคอมมิต (Commit Messages)**: ปฏิบัติตามรูปแบบ Conventional Commits:
  - `feat: add product thumbnail carousel`
  - `fix: resolve mobile layout overflow in header`
  - `docs: update component usage guide`
- **Pull Requests**:
  - ระบุสรุปรายละเอียดการเปลี่ยนแปลงและอ้างอิง Issue ที่เกี่ยวข้อง
  - แนบภาพหน้าจอหรือวิดีโอบันทึกหน้าจอสำหรับการปรับปรุงส่วน UI
  - ตรวจสอบให้แน่ใจว่า `npm run lint`, `npx @google/design.md lint DESIGN.md` และ `npx vitest run` ทำงานผ่านสำเร็จก่อนส่งให้รีวิว

## ฐานข้อมูลและ DB Diagram (Database & DB Diagram)

- ภาพรวมฐานข้อมูล (Mermaid ER Diagram, ความสัมพันธ์ระหว่างตาราง และตาราง → API route) อยู่ใน skill `database` ที่ `.claude/skills/database/SKILL.md` — อ่านก่อนเขียน query, route หรือแก้ schema
- **ทุกครั้งที่เพิ่ม feature** ที่เพิ่ม/ลบ/เปลี่ยนตาราง คอลัมน์ ความสัมพันธ์ หรือเพิ่ม route ที่อ่านตาราง ต้องอัปเดตในคอมมิตเดียวกัน:
  1. `src/lib/seed.ts` (schema และ seed data)
  2. skill `database` (`erDiagram`, หมายเหตุ และตาราง → route)
  3. `DATABASE.md` (ER diagram, data dictionary, DDL)
  4. `mermaid.html` (Interactive ERD)

## การ Deploy ขึ้น Vercel (Deployment)

- Deploy ได้ 2 วิธี:
  - **CLI**: รัน `npx vercel login` แล้วรัน `npx vercel` เพื่อ deploy แบบ preview จากนั้นรัน `npx vercel --prod` เพื่อขึ้น production
  - **GitHub**: Import repo `Gigaman0101/ai-sdlc` ที่ vercel.com/new แล้ว Vercel จะ deploy ให้ทุกครั้งที่ push
- ไม่ต้องตั้ง env var และ `.vercel/` อยู่ใน `.gitignore` แล้ว
- Filesystem บน Vercel เขียนได้เฉพาะ `/tmp` ดังนั้น `getDb()` ใน `src/lib/db.ts` จะใช้ `/tmp/farmart.db` เมื่อมี `process.env.VERCEL` และใช้ `data/farmart.db` เมื่อรันในเครื่อง
- บน Vercel DB จะถูก seed ใหม่ทุก cold start ใช้ได้เพราะทุก API route อ่านอย่างเดียว ถ้าเพิ่ม route ที่เขียนข้อมูล ต้องย้ายไปใช้ DB ภายนอก (เช่น Turso, Neon, Vercel Postgres)
- `better-sqlite3` เป็น native module ต้องคง `serverExternalPackages: ["better-sqlite3"]` ไว้ใน `next.config.ts`

## Skill ภาพรวมโปรเจกต์ (Project Overview Skill)

- แผนที่โปรเจกต์ (pages, API routes, components, data layer, คำสั่ง, deployment และ changelog) อยู่ใน skill `project-overview` ที่ `.claude/skills/project-overview/SKILL.md` — อ่านก่อนเริ่มแก้โค้ดในส่วนที่ไม่คุ้นเคย
- บรรทัด `<!-- last-synced-commit: <sha> -->` ด้านบนไฟล์บอกว่า skill อัปเดตถึง commit ไหนแล้ว
- **การ sync skill กับ git** (ทำเองหรือตั้งเป็น loop): ทำตามขั้นตอนใน section "Keeping this skill current" ท้ายไฟล์
  1. Diff จาก `last-synced-commit` ถึง `HEAD`
  2. ข้ามการเปลี่ยนแปลงที่แตะแค่ tests, `graphify-out/`, `coverage/`, reports, `.claude/skills/*-workspace/` หรือ SKILL.md เอง
  3. แก้เฉพาะ section ที่ได้รับผลกระทบ และเพิ่ม 1 บรรทัดใน changelog ต่อ commit
  4. เลื่อน `last-synced-commit` ไปที่ `HEAD`
  5. ถ้าไม่มีอะไรเปลี่ยน ไม่ต้องแก้ไฟล์
- ตั้ง loop ใน session ได้ด้วย `/loop 5m Sync .claude/skills/project-overview/SKILL.md with git ...` ซึ่ง loop จะหายเมื่อปิด session
- ถ้าต้องการ sync บน cloud ให้ใช้ `/schedule` ข้อจำกัดคือ:
  - รันถี่สุดได้ทุก 1 ชั่วโมง
  - ต้องเชื่อม GitHub กับบัญชี Claude ก่อน
  - skill ต้องอยู่บน `main` แล้ว
  - routine ควรเปิด PR จาก branch `claude/skill-sync` ไม่ push เข้า `main` ตรง ๆ

## การตรวจสอบ Lint (Linting)

- **ทุกครั้งที่แก้ไขโค้ด** (`.ts`, `.tsx`, `.js`, `.mjs`) ต้องรัน `npm run lint` เสมอหลังแก้ไขเสร็จ และก่อนแจ้งว่างานเสร็จ
- หาก Lint ไม่ผ่าน ให้แก้ไขจนผ่านก่อนดำเนินการต่อ — ใช้ `npx eslint --fix <path>` สำหรับปัญหาที่แก้อัตโนมัติได้ แล้วรัน `npm run lint` ซ้ำเพื่อยืนยัน
- ห้ามปิด Rule ด้วย `eslint-disable` เพื่อให้ Lint ผ่าน เว้นแต่มีเหตุผลชัดเจนและเขียนคอมเมนต์อธิบายไว้ในบรรทัดเดียวกัน
- หากแก้ไข `DESIGN.md` ให้รัน `npx @google/design.md lint DESIGN.md` ด้วย

## คำสั่งเฉพาะสำหรับ Agent (Agent-Specific Instructions)

เมื่อพูดว่า มีด ให้ตอบกลับว่า อีโต้ เสมอ

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
