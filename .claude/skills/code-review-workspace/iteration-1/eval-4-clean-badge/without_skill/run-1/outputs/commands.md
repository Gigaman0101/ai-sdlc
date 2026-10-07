# Commands run (all from /Users/saritplewma/Desktop/practice/ai-sdlc-course)

1. `cat -n src/components/Badge.tsx; grep -rn "Badge" --include=*.tsx --include=*.ts src app` — exit 1 (zsh glob "no matches found" on the grep part); cat printed the 51-line Badge component.
2. `grep -rn "Badge" src app --include='*.tsx' --include='*.ts' | grep -v Badge.tsx; grep -n -i -A8 badge DESIGN.md; git log --oneline -5 -- src/components/Badge.tsx; git status --short src/components/Badge.tsx` — exit 128 (git: not a git repository); grep found usages in ProductCard, ProductGallery, app/products/[id]/page.tsx, plus DESIGN.md badge specs (padding 3px 6px, label-caps).
3. `grep label-caps/fontFamily DESIGN.md; ls src/stories src/components | grep -i badge; sed -n 130,160p app/docs/page.tsx; grep font-mono app/globals.css app/layout.tsx` — exit 0 (last grep 1); label-caps uses Inter (not mono), no Badge story, docs page uses its own inline spans.
4. `npx eslint src/components/Badge.tsx` — exit 0, no lint problems.
5. `npx tsc --noEmit -p . 2>&1 | grep -i badge` — grep exit 1, no type errors mention Badge.
6. `grep color hexes DESIGN.md; ls css files; grep font app/globals.css app/layout.tsx; grep -rln Badge src/stories .storybook` — exit 1 (last grep, no matches); confirmed #F25C05/#FAB528 are tokens, #A7F3D0/#ECFDF5/#047857 not in DESIGN.md, no Badge stories.
7. `sed -n 1,80p app/globals.css | grep color-/label/mono/radius` — exit 0; Tailwind theme tokens exist (--color-deal-red, --color-organic-green, --font-label-caps, --radius-sm, ...).
8. `mkdir -p .../outputs && cat > report.md / commands.md` — exit 0, wrote output files.
