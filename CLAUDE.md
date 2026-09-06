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
shorter than its content. Combined with cells that span two rows, which contribute half their
height to each, it silently collapsed the signals grid. The bento uses an explicit minimum.

**Every bento span must be `lg:`-prefixed.** An unprefixed `col-span-2` inside a one-column grid
makes the browser add a column, turning the mobile layout two-wide with half of it empty. The
tiling must also cover its rows exactly: auto-placement is sparse, so a skipped slot is never
backfilled and has no element to draw its border.

**Font weights come from a font's metadata, not its filename.** Copperplate CC keeps Goudy's
naming, where *Heavy* is the upright regular at `usWeightClass` 400 and Bold is 700.

**No font file belongs in this repository at all.** Every face is served by Google Fonts, which
is what keeps a bundled font's licence obligations from applying here.

## Where Things Live

- **`src/lib/content.ts` is the content source for everything Sanity holds.** Projects and
  certificates fall back to `src/data/resume.tsx` when Sanity is unset, unreachable, or empty, so
  do not "fix" a page that looks right locally by pointing it back at the resume data; check
  whether the fallback fired. Photographs and quotations have no fallback on purpose.
- **There is no image in this project and no storage bucket.** Google Cloud Storage is gone, and
  so are `src/lib/gcs.ts`, `src/lib/media.ts`, and every route under `/api/media`. An image is a
  Sanity asset. Do not commit one, and do not add an upload endpoint: the studio already is one.
- **`src/data/resume.tsx` now owns only the skills lists, the summary, and the social links.**
  Work, education, leadership, achievements, projects and certificates are Sanity documents; what
  is left in that file is the fallback the query layer returns when Sanity is empty.
- **`src/lib/group-roles.ts` collapses the flat role list into one entry per company.** It was
  written out three times across two pages before, and the copies had begun to disagree about
  what "Present" meant. Use it rather than grouping again.
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
