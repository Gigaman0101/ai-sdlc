---
name: code-review
description: Review code in the ai-sdlc-course (Farmart) project for bugs, security issues and project-convention violations, using ESLint and the TypeScript compiler as an objective first gate, then a manual read for what lint cannot catch. Report-only — never edits files. Use whenever the user asks to "review", "check", "audit" or "ตรวจ/รีวิว" code, a file, a folder, a component, an API route or "what I just changed", asks whether code is correct or ready to commit/PR, or asks for lint results with explanation — even if they don't say "code review".
---

# Code review with lint gate (ai-sdlc-course)

The goal is a review the user can trust and act on: every finding points at a real line,
says why it matters, and says how to fix it. Lint and the type checker give objective,
reproducible evidence, so run them first; then read the code for the things tools cannot
see (logic, security, project conventions).

This skill **reports only**. Do not edit, create or delete project files, and do not run
`eslint --fix` or anything else that writes to the tree. The project may have no git
history to undo with, and the user wants to decide what to change. At the end, offer to
fix — don't do it unprompted.

## 1. Decide the scope

1. If the user named files or folders, review exactly those.
2. Otherwise, if the directory is a git repo (`git rev-parse --is-inside-work-tree`), review
   changed files: `git diff --name-only HEAD` plus untracked files from
   `git ls-files --others --exclude-standard`.
3. Otherwise (no paths, no git), stop and ask the user which files or folders to review.
   Don't guess and don't fall back to the whole project — a whole-project review is slow and
   buries the findings the user actually cares about.

Keep only source files for the lint gate (`.ts`, `.tsx`, `.js`, `.mjs`). Note `DESIGN.md`
if it is in scope. Skip generated output (`coverage/`, `.next/`, `storybook-static/`,
`node_modules/`).

## 2. Run the lint gate

Run these from the project root and keep the raw results — they are the evidence for the
"Lint" section of the report.

```bash
# ESLint on the scoped files only (no --fix, no --cache: both write files)
npx eslint <files...>

# Type check — tsc checks the whole project; keep only errors in scoped files
npx tsc --noEmit 2>&1 | grep -E "^(<file1>|<file2>)" || true

# Only if DESIGN.md is in scope
npx @google/design.md lint DESIGN.md
```

Notes:
- ESLint here uses `eslint.config.mjs` (`next/core-web-vitals`, `next/typescript`,
  `storybook`). Exit code 1 means at least one **error**; warnings alone exit 0 but still
  belong in the report.
- If a tool itself fails to run (missing dependency, config error), say so in the report
  instead of silently skipping it.
- Mark which lint problems are auto-fixable (ESLint prints `potentially fixable with the
  --fix option`) so the user knows `npx eslint --fix <path>` would handle them.

## 3. Read the code

Read every scoped file in full, not only the lines lint flagged. Open whatever it imports
or calls when you need it to judge correctness (for example `src/lib/db.ts`, a component a
page renders, or the test file next to a route).

This project uses Next.js 16, which has breaking changes from older versions. Before
calling a Next.js API usage wrong, check the relevant guide in `node_modules/next/dist/docs/`
— a finding based on outdated Next.js knowledge is worse than no finding.

## 4. Look for what lint cannot catch

Use this as a checklist, not a script. Skip items that don't apply to the files in scope.

**Correctness**
- Logic errors, off-by-one, wrong conditions, unhandled `null`/`undefined`, `NaN` from
  `parseInt`, wrong async handling (missing `await`, unhandled rejection).
- React: hooks rules, stale closures in effects, missing/unstable `key`, server vs client
  boundary (`"use client"` needed for state/handlers; not needed otherwise).

**Security**
- SQL built with string concatenation or template literals around user input. The project
  uses `better-sqlite3`; values must go through placeholders:
  `db.prepare("... WHERE name LIKE ?").all(\`%${q}%\`)`. Dynamic `ORDER BY` or column names
  must come from an allow-list, never straight from the request.
- Unvalidated query/body params reaching the DB, `dangerouslySetInnerHTML` with user data,
  secrets in code.

**API route conventions** (`app/api/**/route.ts`)
- Validate params and return 400 with the project's error shape
  `{ error, message, statusCode }`, as `app/api/products/route.ts` does.
- Wrap DB work in `try/catch` and return a 500 in the same shape.
- New routes or table changes must also update `src/lib/seed.ts`, the `database` skill,
  `DATABASE.md` and `mermaid.html` (rule in `AGENTS.md`). Flag it if they are missing.

**Project conventions** (`AGENTS.md`)
- Naming: components and story files `PascalCase`, helpers/hooks/variables `camelCase`,
  types/interfaces `PascalCase`.
- Styling: Tailwind v4 utility classes; colors and sizes should match `DESIGN.md` tokens.
- Use `next/link` for internal navigation and `next/image` for images.
- New components usually need a `*.stories.tsx`; new routes/helpers usually need a
  `*.test.ts`. Flag missing tests as a suggestion, not a blocker.

## 5. Verify before reporting

For each manual finding, re-read the exact line and confirm it is real. Drop anything you
cannot point to. If you are unsure, keep it but say so ("ควรตรวจสอบ" / "needs
confirmation") rather than stating it as fact. Do not repeat a lint finding in the manual
section — reference it instead.

## 6. Report

Write the report in the user's language (Thai if they wrote in Thai), keeping code, rule
names, commands and file paths verbatim. Use clickable `path:line` references. Use this
structure:

```markdown
# Code Review: <scope in a few words>

**ขอบเขต:** <files reviewed>
**ผลรวม:** <Ready / Needs changes / Blocked> — <one-sentence reason>

## Lint gate
| เครื่องมือ | ผล | errors | warnings |
|---|---|---|---|
| ESLint | ✅ ผ่าน / ❌ ไม่ผ่าน | n | n |
| tsc --noEmit | ... | n | – |
| design.md lint | (only if run) | | |

<For each lint problem: `path:line` — rule — message — auto-fixable? — how to fix>

## Findings จากการ review
### 🔴 Critical — <bugs, security, data loss: must fix>
### 🟡 Warning — <likely problems, convention breaks>
### 🔵 Suggestion — <tests, readability, small improvements>

Each finding:
- **`path:line` — <short title>**
  ปัญหา: <what is wrong>
  ผลกระทบ: <concrete scenario: input → wrong result>
  วิธีแก้: <specific fix, short code snippet if it helps>

## สรุปสิ่งที่ต้องทำ
1. <ordered, most important first>
```

Rules for the verdict:
- **Blocked**: any ESLint error, any `tsc` error, or any Critical finding.
- **Needs changes**: only warnings or Warning-level findings.
- **Ready**: lint clean and only Suggestions (or nothing).

Leave out empty severity sections. If there are no findings at all, say so plainly — an
honest "nothing found" is a useful result.

End by offering to fix the issues (for example "ต้องการให้แก้ข้อไหนบ้าง?"), without
making any change.
