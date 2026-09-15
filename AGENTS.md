# Rahfi's Portfolio

A personal portfolio, blog, and AI assistant at `rahfi.pro`.

@README.md
@PRD.md
@../docs/memory/memory.rules.md

## Rules Come From the Vault, Not From Here

`../docs/rules/` and `../docs/memory/` are the human-authored control plane, and they win on
conflict with anything inferred from this code. Read the memory for decisions already made rather
than re-deriving them.

Never read the whole vault to answer a question about this code. Read this file, then `PRD.md`
for intent, then `README.md`, then the specific rule you need.

The rules this project deviates from are named in `PRD.md` and `README.md`, each with its reason.
A deviation recorded there is a decision, not a gap to close.

## Before You Change Anything Here

Each of these has already cost time in this repository, and each fails silently.

**Never run `npm run build` while `npm run dev` is running against this checkout.** Both write to
`.next/`, and the production build rewrites it underneath the dev server, corrupting its cache.
The symptom is a 500 on `_app.js` together with `ENOENT` rename errors in
`.next/cache/webpack/`, which points at webpack rather than at the cause. Verify with
`npx tsc --noEmit` and `npm run lint`, which touch nothing. Check first:

```bash
# The port shows as owned by Code because VS Code forwards it; match the command line.
Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object { $_.CommandLine -match 'next' }
```

**A percentage height resolves against nothing when the parent is auto-sized.** This is why the
analytics chart rendered at zero and read as an empty widget: its bars sat in a flex column that
`items-end` never stretched. Any chart needs a definite height somewhere above it.

**`auto-rows-fr` is `minmax(0, 1fr)`, so a grid row's minimum is zero** and a row is allowed to be
shorter than its content. Combined with cells that span two rows - which contribute half their
height to each - it silently collapsed the signals grid. The bento uses an explicit minimum.

**Every bento span must be `lg:`-prefixed.** An unprefixed `col-span-2` inside a one-column grid
makes the browser add a column, turning the mobile layout two-wide with half of it empty. The
tiling must also cover its rows exactly: auto-placement is sparse, so a skipped slot is never
backfilled and has no element to draw its border.

**Font weights come from a font's metadata, not its filename.** Copperplate CC keeps Goudy's
naming, where *Heavy* is the upright regular at `usWeightClass` 400 and Bold is 700.

**No font file belongs in `public/`.** Everything there is served at the site root, and one of
these licences forbids the site offering the font as a download. They live in `src/fonts/`.

## Where Things Live

- **`src/data/resume.tsx` is the content source** for work, education, projects, achievements, and
  certifications. It holds React elements in its `icon` fields, so it is not currently
  serialisable. Moving it to Supabase is designed but deferred; see the appendix of the plan.
- **`src/data/nav-items.ts` is the single source for navigation.** `DATA.navbar` still exists in
  the resume data but nothing reads it.
- **`src/lib/fonts.ts` owns every font.** They are not defined in `app/layout.tsx`, because a
  layout may only export a default component and Next's own route fields; any other named export
  fails the generated type check.
- **`src/lib/group-work.ts`** collapses the flat work list into one entry per company. It was
  written out three times across two pages before, and the copies had begun to disagree.
- **`src/app/components/widgets/widget.tsx`** is the frame every signals cell sits in. Use it
  rather than a cell drawing its own label and padding.

## Two Things Not to Do

- **Do not add a card.** There is no `Card` component; it was deleted rather than left for
  something to reach for. Lists are divided by one hairline between rows, and grids share each
  edge between two cells.
- **Do not reintroduce a colour.** The palette is black, white, and the greys between. Status
  reads from a label, never from a hue.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
